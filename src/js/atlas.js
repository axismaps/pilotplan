
import getSearchMethods from './atlasSearch';
import getHighlightMethods from './atlasHighlight';


const privateProps = new WeakMap();

const utils = {
  getLayerStyle({ layer, year }) {
    if (!('filter' in layer)) return layer;
    layer.filter = layer.filter.map((f) => {
      if (f[0] === 'all') {
        return f.map((dd, i) => {
          if (i === 0) return dd;
          const copyFilter = [...dd];
          if (copyFilter[1] === 'FirstYear' || copyFilter[1] === 'LastYear') {
            copyFilter[2] = year;
          }
          return copyFilter;
        });
      }
      return f;
    });
    return layer;
  },
};

const privateMethods = {
  createMBMap(init) {
    const props = privateProps.get(this);

    const {
      onLoad,
    } = props;

    mapboxgl.accessToken = 'pk.eyJ1IjoiYXhpc21hcHMiLCJhIjoieUlmVFRmRSJ9.CpIxovz1TUWe_ecNLFuHNg';

    props.mbMap = new mapboxgl.Map({
      container: 'map',
      style: './data/style.json',
    })
      .on('load', () => {
        init();
        onLoad();
      });
    // .on('mouseover', 'building-Work', (e) => {
    // console.log('LAYER', e.features[0].properties.LastYear);
    // });
    props.canvas = props.mbMap.getCanvasContainer();
  },
  updateYear() {
    const {
      year,
      mbMap,
    } = privateProps.get(this);
    const {
      getLayerStyle,
    } = utils;

    const styleCopy = JSON.parse(JSON.stringify(mbMap.getStyle()));
    styleCopy.layers = styleCopy.layers.map(layer => getLayerStyle({ layer, year }));
    mbMap.setStyle(styleCopy);
  },
  setLayers() {
    const props = privateProps.get(this);
    const { mbMap } = props;

    const layers = mbMap
      .getStyle().layers
      .map(d => mbMap.getLayer(d.id));

    const sourceLayers = new Set(layers
      .filter(d => d.sourceLayer !== undefined).map(d => d.sourceLayer));

    props.layers = layers;
    props.sourceLayers = [...sourceLayers];
  },

  addRaster() {
    const {
      mbMap,
    } = privateProps.get(this);

    mbMap.addSource(
      'overlaytest',
      {
        type: 'raster',
        url: 'mapbox://axismaps.pilot15584775',
      },
    );

    // mbMap.addLayer({
    //   id: 'overlay-layer',
    //   type: 'raster',
    //   source: 'overlaytest',
    // });

    // console.log('raster', mbMap.getLayer('overlay-layer'));
  },
};

Object.assign(
  privateMethods,
  getSearchMethods({ privateMethods, privateProps }),
  getHighlightMethods({ privateMethods, privateProps }),
);


class Atlas {
  constructor(config) {
    const {
      createMBMap,
    } = privateMethods;

    privateProps.set(this, {
      areaSearchActive: null,
      mapContainer: d3.select('#map'),
      highlightedFeature: null,
      currentLayers: null,
      currentOverlay: null,
    });

    this.config(config);

    createMBMap.call(this, this.init.bind(this));
  }
  init() {
    const {
      setLayers,
      setClickSearch,
      initAreaMethods,
      initAreaSearchListener,
      addRaster,
    } = privateMethods;
    setLayers.call(this);
    setClickSearch.call(this);
    initAreaMethods.call(this);
    initAreaSearchListener.call(this);
    addRaster.call(this);

    this.updateCurrentLayers();
    this.updateAreaSearch();
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
  updateYear() {
    const {
      updateYear,
    } = privateMethods;
    updateYear.call(this);
  }
  getMap() {
    const { mbMap } = privateProps.get(this);
    return mbMap;
  }
  getLayers() {
    const { layers } = privateProps.get(this);
    return layers;
  }
  getRenderedLayers() {
    const { mbMap } = privateProps.get(this);
    return mbMap.getStyle().layers
      .map(d => d.id)
      .filter(d => mbMap.queryRenderedFeatures({ layers: [d] }).length > 0);
  }
  updateCurrentLayers() {
    const {
      mbMap,
      currentLayers,
    } = privateProps.get(this);
    const { layers } = mbMap.getStyle();

    layers.forEach((layer) => {
      // console.log(allCurrentFeatureIds);
      const visible = mbMap.getLayoutProperty(layer.id, 'visibility') === 'visible';
      const currentLayer = currentLayers
        .find(d => d.id === layer['source-layer']);

      const toggled = currentLayer === undefined ? true : currentLayer.status;

      if (visible && !toggled) {
        mbMap.setLayoutProperty(layer.id, 'visibility', 'none');
      } else if (!visible && toggled) {
        mbMap.setLayoutProperty(layer.id, 'visibility', 'visible');
      }
    });
  }
  textSearch(val) {
    const {
      mbMap,
      // sourceLayers,
      year,
    } = privateProps.get(this);

    // const results = sourceLayers.reduce((accumulator, sourceLayer) => {
    //   const result = mbMap.querySourceFeatures('composite', {
    //     sourceLayer,
    //     filter: [
    //       'all',
    //       ['<=', 'FirstYear', year],
    //       ['>=', 'LastYear', year],
    //       // ['match', 'Name', val],
    //     ],
    //   });
    //   return [...accumulator, ...result];
    // }, []);
    const results = mbMap.queryRenderedFeatures({
      filter: [
        'all',
        ['<=', 'FirstYear', year],
        ['>=', 'LastYear', year],
      ],
    });

    const filtered = results
      .filter(d => d.properties.Name.toLowerCase().includes(val.toLowerCase()));
    return filtered;
  }
  updateAreaSearch() {
    const {
      areaSearchActive,
      mbMap,
      mapContainer,
    } = privateProps.get(this);
    const {
      initClickSearchListener,
      disableClickSearchListener,
    } = privateMethods;
    mapContainer.classed('map--area-search', areaSearchActive);
    if (areaSearchActive) {
      disableClickSearchListener.call(this);
      mbMap.dragPan.disable();
    } else {
      initClickSearchListener.call(this);
      mbMap.dragPan.enable();
    }
  }

  updateHighlightedFeature() {
    const {
      clearHighlightedFeature,
      drawHighlightedFeature,
    } = privateMethods;

    clearHighlightedFeature.call(this);
    drawHighlightedFeature.call(this);
  }
  updateOverlay() {
    const props = privateProps.get(this);
    const {
      currentOverlay,
      mbMap,
    } = props;


    if (mbMap.getSource('overlay') !== undefined) {
      mbMap.removeLayer('overlay-layer');
      mbMap.removeSource('overlay');
    }


    if (currentOverlay === null) return;

    const sourceUrl = `mapbox://axismaps.pilot${currentOverlay.SS_ID}`;

    mbMap.addSource(
      'overlay',
      {
        type: 'raster',
        url: sourceUrl,
      },
    );

    mbMap.addLayer({
      id: 'overlay-layer',
      type: 'raster',
      source: 'overlay',
    });

    console.log('raster', mbMap.getSource('overlay'));
  }
}

export default Atlas;

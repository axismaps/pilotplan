import getBBox from '@turf/bbox';
import getSearchMethods from './atlasSearch';
import { colors } from './config';

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
  setClickSearch() {
    const props = privateProps.get(this);
    const { onClickSearch } = props;
    props.clickSearch = (e) => {
      const { year } = props;
      console.log('click', e);
      const bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
      const features = props.mbMap.queryRenderedFeatures(bbox, {
        filter: [
          'all',
          ['<=', 'FirstYear', year],
          ['>=', 'LastYear', year],
          // ['match', 'Name', val],
        ],
      });
      onClickSearch(features);
    };
  },
  initClickSearchListener() {
    const {
      mbMap,
      clickSearch,
    } = privateProps.get(this);

    mbMap.on('click', clickSearch);
  },
  disableClickSearchListener() {
    const {
      mbMap,
      clickSearch,
    } = privateProps.get(this);

    mbMap.off('click', clickSearch);
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
};

Object.assign(privateMethods, getSearchMethods({ privateMethods, privateProps }));

class Atlas {
  constructor(config) {
    const {
      createMBMap,
    } = privateMethods;

    privateProps.set(this, {
      areaSearchActive: null,
      mapContainer: d3.select('#map'),
      highlightedFeature: null,
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
    } = privateMethods;
    setLayers.call(this);
    setClickSearch.call(this);
    initAreaMethods.call(this);
    initAreaSearchListener.call(this);
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
  updateLayers() {
    const {
      mbMap,
      currentLayers,
    } = privateProps.get(this);
    const { layers } = mbMap.getStyle();

    layers.forEach((layer) => {
      const visible = mbMap.getLayoutProperty(layer.id, 'visibility') === 'visible';
      const toggled = currentLayers.includes(layer.id);
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
      highlightedFeature,
      mbMap,
    } = privateProps.get(this);

    const polyLayers = [
      'highlighted-feature-fill',
      'highlighted-feature-outline-top',
      'highlighted-feature-outline-bottom',
    ];

    const lineLayers = [
      'highlighted-feature-outline-top',
      'highlighted-feature-outline-bottom',
    ];

    const existingHighlighted = mbMap.getSource('highlighted');
    console.log(existingHighlighted);
    const existingPoly = mbMap.getLayer('highlighted-feature-fill');
    const existingOutline = mbMap.getLayer('highlighted-feature-outline-top');

    if (existingHighlighted !== undefined) {
      if (existingPoly !== undefined) {
        polyLayers.forEach((layer) => {
          mbMap.removeLayer(layer);
        });
      } else if (existingOutline !== undefined) {
        lineLayers.forEach((layer) => {
          mbMap.removeLayer(layer);
        });
      }
    }

    if (highlightedFeature === null) return;
    const featureJSON = highlightedFeature.toJSON();
    const bbox = getBBox(featureJSON);

    console.log('featureJSON', featureJSON);


    if (existingHighlighted === undefined) {
      mbMap.addSource('highlighted', {
        type: 'geojson',
        data: featureJSON,
      });
    } else {
      existingHighlighted.setData(featureJSON);
    }

    const fillLayer = {
      id: 'highlighted-feature-fill',
      type: 'fill',
      source: 'highlighted',
      layout: {},
      paint: {
        // 'fill-outline-color': 'blue',
        'fill-color': colors.highlightColor,
        'fill-opacity': 0.2,
      },
    };
    const outlineLayerTop = {
      id: 'highlighted-feature-outline-top',
      type: 'line',
      source: 'highlighted',
      layout: {},
      paint: {
        'line-width': 2,
        'line-color': '#1a1a1a',
      },
    };

    const outlineLayerBottom = {
      id: 'highlighted-feature-outline-bottom',
      type: 'line',
      source: 'highlighted',
      layout: {},
      paint: {
        'line-width': 8,
        'line-color': colors.highlightColor,
        'line-opacity': 0.5,
      },
    };
    if (featureJSON.geometry.type === 'Polygon') {
      mbMap.addLayer(fillLayer);
    }
    mbMap.addLayer(outlineLayerBottom);
    mbMap.addLayer(outlineLayerTop);

    mbMap.fitBounds(bbox, { padding: 100 });
  }
}

export default Atlas;

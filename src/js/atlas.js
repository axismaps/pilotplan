
// import getSearchMethods from './atlasSearch';
import { selections } from './config';
import rasterMethods from './rasterMethods';
import clickSearchMethods from './atlasClickSearchMethods';
import getAreaSearchMethods from './atlasAreaSearchMethods';
import highlightMethods from './atlasHighlightMethods';
import generalMethods from './atlasMethods';

const privateProps = new WeakMap();


const privateMethods = {
  createMBMap(initApp) {
    const props = privateProps.get(this);

    const {
      year,
      viewshedsGeo,
    } = props;

    const {
      getCurrentStyle,
      getMap,
    } = generalMethods;

    d3.json('./data/style.json')
      .then((style) => {
        const mbMap = getMap({
          initApp,
          viewshedsGeo,
          style: getCurrentStyle({ style, year }),
        });

        const canvas = mbMap.getCanvasContainer();

        Object.assign(props, { mbMap, canvas });
      });
  },
  updateYear() {
    const {
      year,
      mbMap,
    } = privateProps.get(this);

    const {
      getCurrentStyleFromMap,
    } = generalMethods;

    const styleCopy = getCurrentStyleFromMap({
      year,
      mbMap,
    });

    mbMap.setStyle(styleCopy);
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
  },
  setClickSearch() {
    const props = privateProps.get(this);
    const {
      onClickSearch,
      mbMap,
    } = props;
    const { getClickSearch } = clickSearchMethods;

    props.clickSearch = getClickSearch({
      onClickSearch,
      getYear: () => props.year,
      mbMap,
    });
  },
  setAreaSearch() {
    const props = privateProps.get(this);
    const {
      canvas,
      mbMap,
      onAreaSearch,
    } = props;

    const areaSearchMethods = getAreaSearchMethods({
      getAreaSearchActive: () => props.areaSearchActive,
      canvas,
      mbMap,
      onAreaSearch,
      getYear: () => props.year,
    });

    const {
      onMouseDown,
    } = areaSearchMethods;

    canvas.addEventListener('mousedown', onMouseDown, true);
  },
};

class Atlas {
  constructor(config) {
    const {
      mapContainer,
    } = selections;
    const {
      createMBMap,
    } = privateMethods;

    privateProps.set(this, {
      mapContainer,
      areaSearchActive: null,

      highlightedFeature: null,
      currentLayers: null,
      currentOverlay: null,
      viewshedsGeo: null,
    });

    this.config(config);

    createMBMap.call(this, this.init.bind(this));
  }
  init() {
    const {
      setClickSearch,
      setAreaSearch,
      addRaster,
    } = privateMethods;
    const {
      onLoad,
    } = privateProps.get(this);

    onLoad();
    setClickSearch.call(this);
    setAreaSearch.call(this);
    addRaster.call(this);

    this.updateCurrentLayers();
    this.updateAreaSearch();
    this.updateYear();
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
  textSearch(value) {
    const {
      mbMap,
      rasterData,
      year,
    } = privateProps.get(this);

    const { getSourceLayers } = generalMethods;

    const { getFlattenedRasterData } = rasterMethods;

    const flattenedRasterData = getFlattenedRasterData({ rasterData });

    const sourceLayers = getSourceLayers(mbMap);

    const queriedFeatures = sourceLayers.reduce((accumulator, sourceLayer) => {
      const results = mbMap.querySourceFeatures('composite', {
        sourceLayer,
        filter: [
          'all',
          ['<=', 'FirstYear', year],
          ['>=', 'LastYear', year],
          // ['match', 'Name', val],
        ],
      });

      const resultsWithSource = results.map((d) => {
        const record = Object.assign({}, d, { sourceLayer });
        return record;
      });
      return [...accumulator, ...resultsWithSource];
    }, []);

    // const renderedFeatures = mbMap.queryRenderedFeatures({
    //   filter: [
    //     'all',
    //     ['<=', 'FirstYear', year],
    //     ['>=', 'LastYear', year],
    //   ],
    // });

    const rasterResults = flattenedRasterData
      .filter(d => d.Title.toLowerCase().includes(value.toLowerCase()));

    const nonRasterResults = queriedFeatures
      .filter(d => !Object.prototype.hasOwnProperty.call(d.properties, 'SS_ID') &&
      Object.prototype.hasOwnProperty.call(d.properties, 'Name'))
      .filter(d => d.properties.Name.toLowerCase().includes(value.toLowerCase()));

    return {
      raster: rasterResults,
      nonRaster: nonRasterResults,
    };
  }
  updateAreaSearch() {
    const {
      areaSearchActive,
      mbMap,
      mapContainer,
      clickSearch,
    } = privateProps.get(this);
    const {
      initClickSearchListener,
      disableClickSearchListener,
      toggleMapAreaSearchMode,
    } = clickSearchMethods;

    toggleMapAreaSearchMode({
      mapContainer,
      areaSearchActive,
    });

    if (areaSearchActive) {
      disableClickSearchListener({
        mbMap,
        clickSearch,
      });
      mbMap.dragPan.disable();
    } else {
      initClickSearchListener({
        mbMap,
        clickSearch,
      });
      mbMap.dragPan.enable();
    }
  }

  updateHighlightedFeature() {
    const {
      clearHighlightedFeature,
      drawHighlightedFeature,
    } = highlightMethods;

    const {
      mbMap,
      highlightedFeature,
      year,
    } = privateProps.get(this);

    clearHighlightedFeature(mbMap);
    drawHighlightedFeature({
      highlightedFeature,
      mbMap,
      year,
    });
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

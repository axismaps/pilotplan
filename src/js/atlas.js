
// import getSearchMethods from './atlasSearch';

import { selections } from './config';
import dataMethods from './atlasDataMethods';
import rasterMethods from './rasterMethods';
import clickSearchMethods from './atlasClickSearchMethods';
import getAreaSearchMethods from './atlasAreaSearchMethods';
import generalMethods from './atlasMethods';
import getPublicUpdateMethods from './atlasPublicUpdateMethods';
import initControls from './atlasControlMethods';
import DataProbe from './dataProbe';
import setLoadingCallbacks from './atlasLoadingCallbacks';


const privateProps = new WeakMap();


const privateMethods = {
  createMBMap({ initApp }) {
    const props = privateProps.get(this);

    const {
      year,
      viewshedsGeo,
      onViewClick,
      onMove,
      dataProbe,
      onLayerSourceData,
      onFeatureSourceData,
      onReturnToSearch,
      translations,
    } = props;

    const {
      getCurrentStyle,
      getMap,
    } = generalMethods;

    d3.json('./data/style.json')
      .then((style) => {
        const mbMap = getMap({
          dataProbe,
          onMove,
          initApp,
          viewshedsGeo,
          onLayerSourceData,
          onFeatureSourceData,
          onReturnToSearch,
          setCancelClickSearch: () => {
            props.cancelClickSearch = true;
          },
          onViewClick,
          translations,
          getRasterData: () => props.rasterData,
          getCurrentView: () => props.currentView,
          getLanguage: () => props.language,
          style: getCurrentStyle({ style, year }),
        });

        const canvas = mbMap.getCanvasContainer();

        Object.assign(props, { mbMap, canvas });
      });
  },
  addControlsToMap() {
    const {
      mbMap,
    } = privateProps.get(this);
    // const nav = new mapboxgl.NavigationControl({
    //   showCompass: false,
    // });
    // mbMap.addControl(nav, 'bottom-left');
    initControls({
      mbMap,
    });
  },
  updateYear() {
    const props = privateProps.get(this);
    const {
      year,
      mbMap,
      aerialOverlayOn,
    } = props;

    const {
      getCurrentStyleFromMap,
    } = generalMethods;

    const styleCopy = getCurrentStyleFromMap({
      year,
      mbMap,
    });

    mbMap.setStyle(styleCopy);

    const isCurrentYear = year === new Date().getFullYear();

    if (isCurrentYear && !aerialOverlayOn) {
      props.aerialOverlayOn = true;
      mbMap.setLayoutProperty('mapbox-satellite', 'visibility', 'visible');
    } else if (!isCurrentYear && aerialOverlayOn) {
      props.aerialOverlayOn = false;
      mbMap.setLayoutProperty('mapbox-satellite', 'visibility', 'none');
    }
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
      outerContainer,
    } = props;
    const { setClickSearch } = clickSearchMethods;
    const { getFlattenedRasterData } = rasterMethods;

    setClickSearch({
      outerContainer,
      onClickSearch,
      getCancelClickSearch: () => props.cancelClickSearch,
      removeCancelClickSearch: () => {
        props.cancelClickSearch = false;
      },
      getYear: () => props.year,
      mbMap,
      getFlattenedRasterData: () => getFlattenedRasterData({ rasterData: props.rasterData }),
      setClickSearchProp: (clickSearch) => {
        props.clickSearch = clickSearch;
      },
    });
  },
  setAreaSearch() {
    const props = privateProps.get(this);
    const {
      canvas,
      mbMap,
      onAreaSearch,
    } = props;

    const { getFlattenedRasterData } = rasterMethods;

    const areaSearchMethods = getAreaSearchMethods({
      getAreaSearchActive: () => props.areaSearchActive,
      canvas,
      mbMap,
      onAreaSearch,
      getYear: () => props.year,
      getFlattenedRasterData: () => getFlattenedRasterData({ rasterData: props.rasterData }),
    });

    const {
      onMouseDown,
    } = areaSearchMethods;

    canvas.addEventListener('mousedown', onMouseDown, true);
  },
  saveLayerOpacities() {
    const props = privateProps.get(this);
    const {
      mbMap,
    } = props;
    const { getLayerOpacities } = generalMethods;
    const layerOpacities = getLayerOpacities({ mbMap });
    props.layerOpacities = layerOpacities;
    // console.log('opacities', layerOpacities);
  },
};

class Atlas {
  constructor(config) {
    const {
      mapContainer,
      outerContainer,
    } = selections;
    const {
      createMBMap,
    } = privateMethods;

    privateProps.set(this, {
      outerContainer,
      mapContainer,
      areaSearchActive: null,
      currentView: null,
      highlightedFeature: null,
      highlightedLayer: null,
      currentLayers: null,
      currentOverlay: null,
      viewshedsGeo: null,
      onMove: null,
      cancelClickSearch: false,
      initialBounds: null,
      searchLocation: null,
      dataProbe: new DataProbe({
        container: outerContainer,
      }),
      aerialOverlayOn: false,
      highlightLayerLoading: false,
      highlightLoadingTimer: null,
      highlightFeatureLoading: false,
      highlightedFeatureJSON: null,
      previousZoom: null,
    });

    this.config(config);
    setLoadingCallbacks({ props: privateProps.get(this) });
    createMBMap.call(this, { initApp: this.init.bind(this) });
  }
  init() {
    const {
      addControlsToMap,
      setClickSearch,
      setAreaSearch,
      addRaster,
      saveLayerOpacities,
    } = privateMethods;
    const {
      onLoad,
      mbMap,
      initialLocation,
    } = privateProps.get(this);
    console.log('loaded');
    onLoad();
    saveLayerOpacities.call(this);
    addControlsToMap.call(this);
    setClickSearch.call(this);
    setAreaSearch.call(this);
    addRaster.call(this);

    this.updateCurrentLayers();
    this.updateAreaSearch();
    this.updateYear();
    this.updateOverlay();

    mbMap.resize();

    if (initialLocation !== null) {
      const config = Object.keys(initialLocation)
        .reduce((accumulator, field) => {
          if (initialLocation[field] !== null && initialLocation[field] !== undefined) {
            /* eslint-disable no-param-reassign */
            accumulator[field] = initialLocation[field];
            /* eslint-enable no-param-reassign */
          }
          return accumulator;
        }, {});
      mbMap.jumpTo(config);
    }
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
  getStyle() {
    const { mbMap } = privateProps.get(this);
    return mbMap.getStyle();
  }

  textSearch(value) {
    const {
      mbMap,
      rasterData,
      year,
    } = privateProps.get(this);

    const { getSourceLayers } = generalMethods;

    const { getFlattenedRasterData } = rasterMethods;

    const { getNonRasterResults } = dataMethods;

    const flattenedRasterData = getFlattenedRasterData({ rasterData });

    const sourceLayers = getSourceLayers(mbMap);

    const queriedFeatures = sourceLayers.reduce((accumulator, sourceLayer) => {
      const results = mbMap.querySourceFeatures('composite', {
        sourceLayer,
        filter: [
          'all',
          ['<=', 'FirstYear', year],
          ['>=', 'LastYear', year],
        ],
      });

      const resultsWithSource = results.map((d) => {
        const record = Object.assign({}, d.toJSON(), { sourceLayer });
        return record;
      });
      return [...accumulator, ...resultsWithSource];
    }, []);

    const rasterResults = flattenedRasterData
      .filter(d => d.Title.toLowerCase().includes(value.toLowerCase()));

    const nonRasterResults = getNonRasterResults(queriedFeatures)
      .filter(d => d.properties.Name.toLowerCase().includes(value.toLowerCase()));

    return {
      raster: rasterResults,
      nonRaster: nonRasterResults,
    };
  }
  getMapExportLink() {
    const { mbMap } = privateProps.get(this);
    return mbMap.getCanvas().toDataURL('image/png');
  }
  getContext() {
    const { mbMap } = privateProps.get(this);
    return mbMap.getCanvas().getContext('webgl');
  }
  getCanvas() {
    const { mbMap } = privateProps.get(this);
    return mbMap.getCanvas();
  }
  setSearchLocation() {
    const props = privateProps.get(this);
    const { mbMap } = props;
    const {
      getCurrentLocation,
    } = generalMethods;
    props.searchLocation = getCurrentLocation({ mbMap });
  }
}

Object.assign(Atlas.prototype, getPublicUpdateMethods({ privateProps }));

export default Atlas;

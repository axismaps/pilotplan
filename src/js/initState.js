/**
 * Module initializes application state
 * Application state represents properties shared between components
 * @module initState
 */
import State from './state/state';
import rasterMethods from './rasterMethods';

const initState = function initState() {
  const { urlParams } = this.components;

  const startOverlay = urlParams.get('overlay');
  const center = urlParams.get('center');
  const zoom = urlParams.get('zoom');
  const bearing = urlParams.get('bearing');
  const initialLocation = center === null && zoom === null && bearing === null ?
    null :
    {
      center,
      zoom,
      bearing,
    };


  const startView = initialLocation === null ? 'intro' : 'map';
  const state = new State({
    year: parseInt(urlParams.get('year'), 10),
    sidebarOpen: false,
    footerOpen: startView === 'map',
    allRasterOpen: false,
    registerOpen: false,
    sidebarView: 'legend',
    footerView: 'views',
    view: startView,
    mapLoaded: false,
    componentsInitialized: false,
    textSearch: null,
    clickSearch: null,
    areaSearchActive: false,
    areaSearch: null,
    currentLayers: null,
    currentOverlay: startOverlay,
    currentView: null,
    currentLocation: initialLocation,
    currentRasterProbe: null,
    highlightedFeature: null,
    highlightedLayer: null,
    mouseEventsDisabled: false,
    transitionsDisabled: false,
    mobile: null,
    language: urlParams.get('language'),
    screenSize: [window.innerWidth, window.innerHeight],
    overlayOpacity: 1,
  });

  state.getAvailableLayers = function getAvailableLayers(data) {
    const year = this.get('year');

    const { layers } = data;

    const newLayers = layers.map((group) => {
      const newGroup = Object.assign({}, group);
      newGroup.layers = group.layers.filter(d =>
        d.startYear <= year &&
        d.endYear >= year)
        .map((layer) => {
          const newLayer = Object.assign({}, layer);
          newLayer.features = layer.features.filter(d =>
            d.startYear <= year &&
            d.endYear >= year &&
            d.style !== undefined);
          return newLayer;
        })
        .filter(layer => layer.features.length > 0);
      return newGroup;
    })
      .filter(group => group.layers.length > 0);
    return newLayers;
  };

  state.getAvailableRasters = function getAvailableRasters(data) {
    const year = this.get('year');
    const availableRasters = new Map();

    data.rasters.forEach((val, key) => {
      availableRasters.set(key, data.rasters.get(key)
        .filter(d => d.FirstYear <= year &&
          d.LastYear >= year));
    });

    return availableRasters;
  };

  state.getAllAvailableLayers = function getAllAvailableLayers(data) {
    const availableViews = this.getAvailableRasters(data)
      .get('views');
    const viewsLayer = {
      sourceLayer: 'ViewConesPoint',
      status: true,
    };
    const availableLayers = this.getAvailableLayers(data)
      .reduce((accumulator, group) => [...accumulator, ...group.layers], [])
      .map(layer => ({
        sourceLayer: layer.sourceLayer,
        status: true,
      }));
    if (availableViews.length > 0) {
      return [
        viewsLayer,
        ...availableLayers,
      ];
    }
    return availableLayers;
  };

  state.getLayersToClear = function getLayersToClear(fields) {
    return fields.reduce((accumulator, field) => {
      if (state.get(field) !== null) {
        /* eslint-disable no-param-reassign */
        accumulator[field] = null;
        /* eslint-enable no-param-reassign */
      }
      return accumulator;
    }, {});
  };

  state.getAutoFooterView = function getAutoFooterView(data) {
    const {
      getRasterDataByCategory,
    } = rasterMethods;
    const rasterData = this.getAvailableRasters(data);
    const rasterDataByCategory = getRasterDataByCategory({ rasterData });

    if (rasterDataByCategory.length === 0) {
      return 'views';
    } else if (rasterData.get(this.get('footerView')).length === 0) {
      return rasterDataByCategory[0].key;
    }
    return state.get('footerView');
  };

  state.getOrientation = function getOrientation() {
    const width = this.get('screenSize')[0];

    if (width > 700) {
      return 'desktop';
    } else if (width >= 415 && width <= 700) {
      return 'mobileLandscape';
    }
    return 'mobile';
  };

  state.set('mobile', state.getOrientation() === 'mobile');

  state.set('currentLayers', state.getAllAvailableLayers(this.data));

  state.set(
    'footerView',
    state.getAutoFooterView(this.data),
  );

  this.components.state = state;
};

export default initState;

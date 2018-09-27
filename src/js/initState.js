import State from './state/state';
import rasterMethods from './rasterMethods';

const getState = function getState({ urlParams }) {
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
  // const startBounds = urlParams.get('bounds');

  // const startView = 'map';
  const startView = initialLocation === null ? 'intro' : 'map';
  const state = new State({
    // year: 1960,
    year: parseInt(urlParams.get('year'), 10),
    // sidebarOpen: startView === 'map',
    sidebarOpen: false,
    footerOpen: startView === 'map',
    allRasterOpen: false,
    sidebarView: 'legend', // searching, results
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
    // currentBounds: startBounds,
    currentLocation: initialLocation,
    currentRasterProbe: null,
    highlightedFeature: null,
    mouseEventsDisabled: false,
    transitionsDisabled: false,
    language: urlParams.get('language'),
    // language: 'pr',
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
  // console.log('views', data.rasters.views);

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
      // close footer??
    } else if (rasterData.get(this.get('footerView')).length === 0) {
      return rasterDataByCategory[0].key;
    }
    return state.get('footerView');
  };

  return state;
};

export default getState;

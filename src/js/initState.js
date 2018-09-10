import State from './state/state';

const getState = function getState() {
  // const startView = 'eras';
  const startView = 'map';
  const state = new State({
    year: 1957,
    sidebarOpen: startView === 'map',
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
    currentOverlay: null,
    currentView: null,
    currentRasterProbe: null,
    highlightedFeature: null,
    mouseEventsDisabled: false,
    transitionsDisabled: false,
    language: 'en',
    screenSize: [window.innerWidth, window.innerHeight],
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
            d.id !== undefined);
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
    return this.getAvailableLayers(data)
      .reduce((accumulator, group) => [...accumulator, ...group.layers], [])
      .map(layer => ({
        id: layer.id,
        status: true,
      }));
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

  return state;
};

export default getState;

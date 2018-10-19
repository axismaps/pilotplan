import Atlas from './atlas';

const initAtlas = function initAtlas() {
  const { state } = this.components;

  this.components.atlas = new Atlas({
    extentsData: this.data.extents,
    overlayOpacity: state.get('overlayOpacity'),
    initialLocation: state.get('currentLocation'),
    viewshedsGeo: this.data.viewshedsGeo,
    highlightedFeature: state.get('highlightedFeature'),
    highlightedLayer: state.get('highlightedLayer'),
    availableLayers: this.components.state.getAvailableLayers(this.data),
    currentLayers: state.get('currentLayers'),
    currentOverlay: state.get('currentOverlay'),
    currentView: state.get('currentView'),
    rasterData: state.getAvailableRasters(this.data),
    year: state.get('year'),
    layerNames: this.data.layerNames,
    // onLoad: this.onAtlasLoad.bind(this),
    onLoad: () => {
      if (state.get('view') === 'map') {
        // initialize components on load only if starting on map view
        // otherwise, wait to initialize until toggling map view for first time
        // this.components.layout
        //   .config({
        //     exportLink: this.components.atlas.getMapExportLink(),
        //   })
        //   .initExportButton();
        this.initComponents();
        this.listenForResize();
      }
      state.update({ mapLoaded: true });
    },
    onClickSearch(features) {
      state.update({ clickSearch: features });
    },
    onAreaSearch(features) {
      state.update({ areaSearchActive: false, areaSearch: features });
    },
    onViewClick(newView) {
      state.update({
        currentView: newView,
        currentRasterProbe: newView,
      });
    },
    onMove(currentLocation) {
      state.update({
        currentLocation,
      });
      // state.update({
      // currentBounds: newBounds,
      // });
    },
    toggleOverlayFade(toggle) {
      const overlayOn = state.get('currentOverlay') !== null;
      if (overlayOn) {
        if (toggle) {
          state.update({ overlayOpacity: 0.1 });
        } else {
          state.update({ overlayOpacity: 1 });
        }
      }
    },
    translations: this.data.translations,
    language: state.get('language'),
  });
  // console.log('data?', data);
};

export default initAtlas;

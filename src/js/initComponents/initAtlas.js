/**
 * Module initializes atlas component
 * @module initAtlas
 */

import Atlas from '../atlas/atlas';

const initAtlas = function initAtlas() {
  const { state } = this.components;

  this.components.atlas = new Atlas({
    extentsData: this.data.extents,
    mobile: state.get('mobile'),
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
    /**
     * Some components need to be initialized only after map (vector tiles) have loaded
     * @private
     */
    onLoad: () => {
      if (state.get('view') === 'map') {
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
    toggleMouseEventsDisabled(toggle) {
      state.update({ mouseEventsDisabled: toggle });
    },
    translations: this.data.translations,
    language: state.get('language'),
  });
};

export default initAtlas;

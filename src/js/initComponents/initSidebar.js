// import onRasterClick from './onRasterClick';
import Sidebar from '../sidebar/sidebar';
import rasterMethods from '../rasterMethods';

const initSidebar = function initSidebar() {
  const { state } = this.components;
  const { onRasterClick } = rasterMethods;

  this.components.sidebar = new Sidebar({
    mobile: state.get('mobile'),
    highlightedFeature: state.get('highlightedFeature'),
    highlightedLayer: state.get('highlightedLayer'),
    sidebarOpen: state.get('sidebarOpen'),
    layerStyles: this.components.atlas.getStyle().layers,
    availableLayers: state.getAvailableLayers(this.data),
    legendSwatches: this.data.legendSwatches,
    viewLayersOn: state.getAvailableRasters(this.data).get('views').length > 0,
    cachedMetadata: this.cachedMetadata,
    translations: this.data.translations,
    language: state.get('language'),
    view: state.get('sidebarView'),
    onSearchReturn() {
      if (!state.get('mobile')) {
        state.update({ highlightedFeature: null });
      }
    },
    onLayerClick(layer) {
      const currentLayers = state.get('currentLayers');
      const layerIndex = currentLayers.map(d => d.sourceLayer)
        .indexOf(layer.sourceLayer);
      const newLayers = [
        ...currentLayers.slice(0, layerIndex),
        { sourceLayer: layer.sourceLayer, status: !currentLayers[layerIndex].status },
        ...currentLayers.slice(layerIndex + 1),
      ];
      const stateToUpdate = { currentLayers: newLayers };

      state.update(stateToUpdate);
    },
    onRasterClick(rasterData) {
      onRasterClick({ rasterData, state });
    },
    onTextInput(val) {
      state.update({ textSearch: val });
    },
    onLayerHighlightClick(newLayer) {
      const currentHighlightedLayer = state.get('highlightedLayer');
      const stateToUpdate = {};
      const highlight = currentHighlightedLayer === null ||
      currentHighlightedLayer.dataLayer !== newLayer.dataLayer;
      if (highlight) {
        Object.assign(stateToUpdate, { highlightedLayer: newLayer });
      } else {
        Object.assign(stateToUpdate, { highlightedLayer: null });
      }
      if (state.get('mobile') && highlight) {
        Object.assign(stateToUpdate, { sidebarOpen: false });
      }
      state.update(stateToUpdate);
    },
    onFeatureClick(feature) {
      const oldFeature = state.get('highlightedFeature');

      const highlight = oldFeature === null ||
        feature.id !== oldFeature.id;
      const stateToUpdate = {};
      if (highlight) {
        Object.assign(stateToUpdate, { highlightedFeature: feature });
      } else {
        Object.assign(stateToUpdate, { highlightedFeature: null });
      }

      if (state.get('mobile') && highlight) {
        Object.assign(stateToUpdate, { sidebarOpen: false });
      }
      state.update(stateToUpdate);
      // if (oldFeature === null) {
      //   newFeature = feature;
      // } else {
      //   newFeature = oldFeature.id === feature.id ? null : feature;
      // }

      // state.update({ highlightedFeature: newFeature });
    },
  });
};

export default initSidebar;

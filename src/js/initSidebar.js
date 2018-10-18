import onRasterClick from './onRasterClick';
import Sidebar from './sidebar';

const initSidebar = function initSidebar() {
  const { state } = this.components;
  const sidebar = new Sidebar({
    highlightedFeature: state.get('highlightedFeature'),
    highlightedLayer: state.get('highlightedLayer'),
    sidebarOpen: state.get('sidebarOpen'),
    layerStyles: this.components.atlas.getStyle().layers,
    availableLayers: state.getAvailableLayers(this.data),
    viewLayersOn: state.getAvailableRasters(this.data).get('views').length > 0,
    cachedMetadata: this.cachedMetadata,
    translations: this.data.translations,
    language: state.get('language'),
    view: state.get('sidebarView'),
    onSearchReturn() {
      state.update({ highlightedFeature: null });
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
      state.update({ currentLayers: newLayers });
    },
    onRasterClick(rasterData) {
      onRasterClick({ rasterData, state });
    },
    onTextInput(val) {
      state.update({ textSearch: val });
    },
    onLayerHighlightClick(newLayer) {
      const currentHighlightedLayer = state.get('highlightedLayer');

      if (currentHighlightedLayer === null) {
        state.update({ highlightedLayer: newLayer });
      } else {
        state.update({
          highlightedLayer: currentHighlightedLayer.dataLayer === newLayer.dataLayer ?
            null : newLayer,
        });
      }
    },
    onFeatureClick(feature) {
      const oldFeature = state.get('highlightedFeature');
      // test if 'feature' is entire layer (has 'dataLayer') or array of features
      let newFeature;
      // if no old feature
      if (oldFeature === null) {
        newFeature = feature;
        // if new feature is entire layer
      } else if (Object.prototype.hasOwnProperty.call(feature, 'dataLayer')) {
        newFeature = oldFeature.dataLayer === feature.dataLayer ? null : feature;
        // if new feature is array of features (not entire layer)
        // and old layer is also array of features
      } else {
        newFeature = oldFeature.id === feature.id ? null : feature;
      }

      state.update({ highlightedFeature: newFeature });
    },
  });
  return sidebar;
};

export default initSidebar;

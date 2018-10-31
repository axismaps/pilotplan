import RasterProbe from '../rasterProbe/rasterProbe';

const initRasterProbe = function initRasterProbe() {
  const { state } = this.components;
  this.components.rasterProbe = new RasterProbe({
    cachedMetadata: this.cachedMetadata,
    currentView: state.get('currentView'),
    currentOverlay: state.get('currentOverlay'),
    overlayOpacity: state.get('overlayOpacity'),
    mobile: state.get('mobile'),
    onCloseClick() {
      const currentRasterProbe = state.get('currentRasterProbe');
      const { type } = currentRasterProbe;

      if (type === 'view') {
        state.update({
          currentView: null,
          currentRasterProbe: null,
        });
      } else if (type === 'overlay') {
        state.update({
          currentRasterProbe: null,
        });
      }
    },
    onOverlayCloseClick() {
      state.update({
        currentOverlay: null,
        currentRasterProbe: null,
      });
    },
    onSliderDrag(newOpacity) {
      state.update({
        overlayOpacity: newOpacity,
      });
    },
  });
};

export default initRasterProbe;

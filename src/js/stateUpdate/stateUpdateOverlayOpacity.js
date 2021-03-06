/**
 * Callback for overlayOpacity field
 * "overlayOpacity" float represents opacity of map overlay
 * @module
 * @memberof stateUpdate
 */
const getUpdateOverlayOpacity = ({ components }) => {
  const updateOverlayOpacity = function updateOverlayOpacity() {
    const { overlayOpacity } = this.props();
    const {
      rasterProbe,
      atlas,
    } = components;

    rasterProbe
      .config({
        overlayOpacity,
      })
      .updateSlider();
    atlas
      .config({
        overlayOpacity,
      })
      .updateOverlayOpacity();
  };
  return updateOverlayOpacity;
};

export default getUpdateOverlayOpacity;

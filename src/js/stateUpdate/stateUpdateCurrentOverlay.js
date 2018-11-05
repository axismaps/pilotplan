/**
 * Callback for currentOverlay field
 * "currentOverlay" object represents data for overlay toggled on map
 * @module
 * @memberof stateUpdate
 */
const getUpdateCurrentOverlay = ({ components }) => {
  const updateCurrentOverlay = function updateCurrentOverlay() {
    const {
      currentOverlay,
      overlayOpacity,
    } = this.props();

    const {
      atlas,
      layout,
      urlParams,
    } = components;

    layout
      .config({
        overlayOn: currentOverlay !== null,
      })
      .updateOverlay();

    atlas
      .config({
        currentOverlay,
      })
      .updateOverlay();

    urlParams
      .config({
        overlay: currentOverlay !== null ? currentOverlay.SS_ID : null,
      })
      .update();
    if (overlayOpacity !== 1 && currentOverlay !== null) {
      this.update({ overlayOpacity: 1 });
    }
  };
  return updateCurrentOverlay;
};

export default getUpdateCurrentOverlay;

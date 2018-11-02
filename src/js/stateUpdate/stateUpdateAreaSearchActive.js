/**
 * Callback for areaSearchActive field
 * "areaSearchActive" boolean field indicates if area search button has been clicked
 * but search has not yet been performed
 * @module
 * @memberof stateUpdate
 */

const getUpdateAreaSearchActive = ({ components }) => {
  const updateAreaSearchActive = function updateAreaSearchActive() {
    const {
      areaSearchActive,
    } = this.props();
    const {
      layout,
      atlas,
    } = components;

    layout
      .config({
        areaSearchActive,
      })
      .updateAreaSearch();

    layout.removeHintProbe();

    atlas
      .config({
        areaSearchActive,
      })
      .updateAreaSearch();
  };

  return updateAreaSearchActive;
};

export default getUpdateAreaSearchActive;

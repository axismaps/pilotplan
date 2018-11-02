/**
 * Callback for currentLayers field
 * "currentLayers" array field contains list of layers with on/off states
 * (checked or unchecked, visible or invisible)
 * @module
 * @memberof stateUpdate
 */
const getUpdateCurrentLayers = ({ components }) => {
  const updateCurrentLayers = function updateCurrentLayers() {
    const {
      currentLayers,
    } = this.props();
    console.log('current layers', currentLayers);
    const {
      atlas,
      sidebar,
    } = components;
    atlas
      .config({
        currentLayers,
      })
      .updateCurrentLayers();

    sidebar
      .config({
        currentLayers,
      })
      .updateCurrentLayers();
  };
  return updateCurrentLayers;
};

export default getUpdateCurrentLayers;

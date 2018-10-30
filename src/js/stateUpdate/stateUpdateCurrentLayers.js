const getUpdateCurrentLayers = ({ components }) => {
  const updateCurrentLayers = function updateCurrentLayers() {
    const {
      currentLayers,
    } = this.props();
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

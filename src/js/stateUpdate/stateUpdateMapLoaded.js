const getUpdateMapLoaded = ({ components }) => {
  const updateMapLoaded = function updateMapLoaded() {
    const { mapLoaded } = this.props();
    const { views, layout } = components;
    views.config({ mapLoaded });
    layout.config({ mapLoaded }).updateMapLoaded();
  };
  return updateMapLoaded;
};

export default getUpdateMapLoaded;

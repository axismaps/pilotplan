const getUpdateHighlightedLayer = ({
  components,
}) => {
  const updateHighlightedLayer = function updateHighlightedLayer() {
    const {
      atlas,
      sidebar,
    } = components;
    const { highlightedLayer } = this.props();
    sidebar.config({ highlightedLayer }).updateHighlightedLayer();
    atlas.config({ highlightedLayer }).updateHighlightedLayer();
  };
  return updateHighlightedLayer;
};

export default getUpdateHighlightedLayer;

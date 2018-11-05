/**
 * Callback for highlightedFeature field
 * "highlightedFeature" object represents data for search feature highlighted on map / sidebar
 * @module
 * @memberof stateUpdate
 */
const getUpdateHighlightedFeature = ({ components }) => {
  const updateHighlightedFeature = function updateHighlightedFeature() {
    const {
      highlightedFeature,
      mobile,
    } = this.props();

    const {
      atlas,
      sidebar,
      layout,
    } = components;

    atlas
      .config({
        highlightedFeature,
      })
      .updateHighlightedFeature();

    sidebar
      .config({
        highlightedFeature,
      })
      .updateHighlightedFeature();

    if (mobile) {
      layout
        .config({
          highlightedFeature,
        })
        .updateHighlightedFeature();
    }
  };
  return updateHighlightedFeature;
};

export default getUpdateHighlightedFeature;

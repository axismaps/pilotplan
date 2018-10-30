const getUpdateFooterView = ({ components, data }) => {
  const updateFooterView = function updateFooterView() {
    const {
      footerView,
    } = this.props();
    const {
      footer,
      atlas,
    } = components;

    footer
      .config({
        footerView,
        rasterData: this.getAvailableRasters(data),
      })
      .updateRasterData();

    atlas
      .config({
        rasterData: this.getAvailableRasters(data),
      });
  };
  return updateFooterView;
};

export default getUpdateFooterView;

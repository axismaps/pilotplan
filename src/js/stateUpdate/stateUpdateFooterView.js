/**
 * Callback for footerView field
 * "footerView" string represents currently toggled footer raster category
 * This probably doesn't need to be its own state field. Could be local state in Footer module
 * @module
 * @memberof stateUpdate
 */

const getUpdateFooterView = ({ components }) => {
  const updateFooterView = function updateFooterView() {
    const {
      footerView,
    } = this.props();
    const {
      footer,
    } = components;

    footer
      .config({
        footerView,
      })
      .updateRasterData();
  };
  return updateFooterView;
};

export default getUpdateFooterView;

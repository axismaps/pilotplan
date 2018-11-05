/**
 * Callback for footerOpen field
 * "footerOpen" boolean represents open / close status of footer
 * @module
 * @memberof stateUpdate
 */
const getUpdateFooterOpen = ({ components }) => {
  const updateFooterOpen = function updateFooterOpen() {
    const {
      footerOpen,
    } = this.props();
    const {
      layout,
    } = components;

    layout
      .config({
        footerOpen,
      })
      .updateFooter();
  };

  return updateFooterOpen;
};

export default getUpdateFooterOpen;

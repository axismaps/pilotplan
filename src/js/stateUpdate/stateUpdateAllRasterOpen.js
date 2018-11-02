/**
 * Callback for allRasterOpen field
 * "allRasterOpen "boolean field determines whether "show all" raster screen is on or not
 * @module
 * @memberof stateUpdate
 */
const getUpdateAllRasterOpen = ({
  components,
}) => {
  const updateAllRasterOpen = function updateAllRasterOpen() {
    const {
      allRasterOpen,
    } = this.props();
    const {
      layout,
      footer,
    } = components;

    layout
      .config({
        allRasterOpen,
      })
      .updateAllRaster();

    footer
      .config({
        allRasterOpen,
      })
      .updateAllRaster();
  };
  return updateAllRasterOpen;
};

export default getUpdateAllRasterOpen;

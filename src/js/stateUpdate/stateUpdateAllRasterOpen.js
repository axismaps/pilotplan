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

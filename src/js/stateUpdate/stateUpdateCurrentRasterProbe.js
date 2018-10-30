const getUpdateCurrentRasterProbe = ({ components }) => {
  const updateCurrentRasterProbe = function updateCurrentRasterProbe() {
    const {
      currentRasterProbe,
    } = this.props();

    const {
      layout,
      rasterProbe,
    } = components;


    layout
      .config({
        rasterProbeOpen: currentRasterProbe !== null,
      })
      .updateRasterProbe();

    rasterProbe
      .config({
        currentRasterProbe,
      })
      .update();
  };
  return updateCurrentRasterProbe;
};

export default getUpdateCurrentRasterProbe;

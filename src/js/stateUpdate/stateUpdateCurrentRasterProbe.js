/**
 * Callback for currentRasterProbe field
 * "currentRasterProbe" object represents data for raster in raster probe
 * @module
 * @memberof stateUpdate
 */
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

import rasterMethods from './rasterMethods';

const localMethods = {
  updateImageFromMetadata({
    metadata,
    rasterProbeImageContainer,
  }) {
    const {
      getWidthLimitedDim,
      setBackgroundFromMetadata,
    } = rasterMethods;

    const maxWidth = rasterProbeImageContainer
      .node()
      .getBoundingClientRect()
      .width;

    const {
      width,
      height,
    } = metadata;

    const scaledDim = getWidthLimitedDim({
      width,
      height,
      maxWidth,
    });

    setBackgroundFromMetadata({
      selection: rasterProbeImageContainer,
      maxWidth,
      metadata,
    });

    rasterProbeImageContainer
      .styles({
        width: `${scaledDim.width}px`,
        height: `${scaledDim.height}px`,
      });
  },
  clearImage({
    rasterProbeImageContainer,
  }) {
    rasterProbeImageContainer
      .style('background-image', 'none');
  },
  toggleOverlayControls({
    rasterProbeControlsContainer,
    currentRasterProbe,
  }) {
    if (currentRasterProbe === null) return;

    rasterProbeControlsContainer
      .classed('raster-probe__overlay-controls--hidden', currentRasterProbe.type === 'view');
  },
};

const rasterProbeMethods = {
  updateTitle({
    rasterProbeTitleContainer,
    currentRasterProbe,
  }) {
    rasterProbeTitleContainer
      .text(currentRasterProbe.Title);
  },
  updateImage({
    currentRasterProbe,
    cachedMetadata,
    rasterProbeImageContainer,
  }) {
    const {
      updateImageFromMetadata,
      clearImage,
    } = localMethods;

    const {
      getMetadata,
    } = rasterMethods;

    clearImage({ rasterProbeImageContainer });

    if (cachedMetadata.has(currentRasterProbe.SS_ID)) {
      const metadata = cachedMetadata.get(currentRasterProbe.SS_ID);
      updateImageFromMetadata({
        metadata,
        rasterProbeImageContainer,
      });
    } else {
      getMetadata(currentRasterProbe, (metadata) => {
        updateImageFromMetadata({
          metadata,
          rasterProbeImageContainer,
        });
      });
    }
  },
  setCloseButtonListener({
    rasterProbeCloseButton,
    onCloseClick,
  }) {
    rasterProbeCloseButton
      .on('click', onCloseClick);
  },
  updateOverlayControls({
    rasterProbeCloseOverlayButton,
    rasterProbeControlsContainer,
    currentRasterProbe,
  }) {
    const {
      toggleOverlayControls,
    } = localMethods;

    toggleOverlayControls({
      rasterProbeControlsContainer,
      currentRasterProbe,
    });
  },
};

export default rasterProbeMethods;

import rasterMethods from './rasterMethods';

const helperMethods = {
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
    } = helperMethods;

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
};

export default rasterProbeMethods;

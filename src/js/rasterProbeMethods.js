import rasterMethods from './rasterMethods';

const helperMethods = {
  updateImageFromMetadata({
    currentRasterProbe,
    cachedMetadata,
    rasterProbeImageContainer,
  }) {
    const {
      getWidthLimitedDim,
      setBackgroundFromMetadata,
    } = rasterMethods;

    const metadata = cachedMetadata.get(currentRasterProbe.SS_ID);

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
  updateImageFromAPI() {

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
      updateImageFromAPI,
    } = helperMethods;

    if (cachedMetadata.has(currentRasterProbe.SS_ID)) {
      updateImageFromMetadata({
        currentRasterProbe,
        cachedMetadata,
        rasterProbeImageContainer,
      });
    } else {
      updateImageFromAPI({
        currentRasterProbe,
        rasterProbeImageContainer,
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

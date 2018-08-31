import rasterMethods from './rasterMethods';

const localMethods = {
  clearImage({
    rasterProbeImageContainer,
  }) {
    rasterProbeImageContainer
      .style('background-image', 'none');
  },
  setImageClickListener({
    rasterProbeImageContainer,
    onImageClick,
  }) {
    rasterProbeImageContainer
      .on('click', onImageClick);
  },
  toggleOverlayControls({
    rasterProbeControlsContainer,
    currentRasterProbe,
  }) {
    if (currentRasterProbe === null) return;

    rasterProbeControlsContainer
      .classed('raster-probe__overlay-controls--hidden', currentRasterProbe.type === 'view');
  },
  setOverlayCloseButtonListener({
    onOverlayCloseClick,
    rasterProbeCloseOverlayButton,
  }) {
    rasterProbeCloseOverlayButton
      .on('click', onOverlayCloseClick);
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
    onImageClick,
  }) {
    const {
      clearImage,
      setImageClickListener,
    } = localMethods;

    const {
      setBackgroundToContainerWidth,
    } = rasterMethods;

    clearImage({ rasterProbeImageContainer });
    setImageClickListener({
      rasterProbeImageContainer,
      onImageClick,
    });

    setBackgroundToContainerWidth({
      selection: rasterProbeImageContainer,
      cachedMetadata,
      currentRasterProbe,
      resizeContainer: true,
    });
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
    onOverlayCloseClick,
    rasterProbeControlsContainer,
    currentRasterProbe,
  }) {
    const {
      toggleOverlayControls,
      setOverlayCloseButtonListener,
    } = localMethods;

    toggleOverlayControls({
      rasterProbeControlsContainer,
      currentRasterProbe,
    });

    setOverlayCloseButtonListener({
      onOverlayCloseClick,
      rasterProbeCloseOverlayButton,
    });
  },
};

export default rasterProbeMethods;

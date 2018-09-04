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
      resizeProbe: true,
      maxHeight: 300,
    });
  },
  setCloseButtonListener({
    rasterProbeCloseButton,
    onCloseClick,
  }) {
    rasterProbeCloseButton
      .on('click', onCloseClick);
  },
  updateCredits({
    rasterProbeCreditsContainer,
    currentRasterProbe,
  }) {
    let creditsHTML = '';
    const hasValue = value => value !== '' && value !== undefined && value !== null;
    if (hasValue(currentRasterProbe.Creator)) {
      creditsHTML += `
        <div class="raster-probe__credits-row">${currentRasterProbe.Creator}</div>
      `;
    }
    if (hasValue(currentRasterProbe.Date) || hasValue(currentRasterProbe.CreditLine)) {
      creditsHTML += `
        <div class="raster-probe__credits-row">
        ${hasValue(currentRasterProbe.Date) ? currentRasterProbe.Date : ''} 
        ${hasValue(currentRasterProbe.CreditLine) ? `[${currentRasterProbe.CreditLine}]` : ''}</div>
      `;
    }
    rasterProbeCreditsContainer
      .html(creditsHTML);
  },
  resizeProbe({
    rasterProbeContainer,
    rasterProbeInnerContainer,
    rasterProbeImageContainer,
  }) {
    const formatPadding = padding => parseInt(padding.replace('px', ''), 10);
    const imageWidth = rasterProbeImageContainer.node().getBoundingClientRect().width;
    const newWidth =
      imageWidth +
      formatPadding(rasterProbeInnerContainer.style('padding-left')) +
      formatPadding(rasterProbeInnerContainer.style('padding-right'));
    rasterProbeContainer
      .style('width', `${newWidth}px`);
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

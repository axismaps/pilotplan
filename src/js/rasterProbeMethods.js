import rasterMethods from './rasterMethods';
import TimelineSlider from './timelineSlider';

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
      maxHeight: 400,
      maxWidth: 410,
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
    selection,
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
    selection
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
  drawSlider({
    onSliderDrag,
    overlayOpacity,
    rasterProbeSliderContainer,
  }) {
    console.log('draw raster slider');
    rasterProbeSliderContainer.select('svg').remove();
    // setTimeout(() => {
    const { width } = rasterProbeSliderContainer
      .node()
      .getBoundingClientRect();
    const slider = new TimelineSlider({
      container: rasterProbeSliderContainer,
      currentValue: overlayOpacity,
      tooltip: false,
      axisOn: false,
      backgroundTrackAttrs: {
        rx: 8,
        ry: 8,
      },
      activeTrackAttrs: {
        rx: 8,
        ry: 8,
      },
      handleAttrs: {
        rx: 7,
        ry: 7,
      },
      trackHeight: 8,
      handleHeight: 14,
      handleWidth: 14,
      padding: { left: 0, right: 2 },
      valueRange: [0, 1],
      stepSections: [{
        increment: 1,
        years: [0, 1],
      }],
      onDragEnd: onSliderDrag,
      size: {
        width,
        height: 14,
      },
      handleDetail: false,
    });
    return slider;
    // });
  },
};

export default rasterProbeMethods;

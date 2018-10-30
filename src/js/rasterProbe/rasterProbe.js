import { selections } from '../config';
import rasterProbeMethods from './rasterProbeMethods';
import lightboxMethods from './rasterProbeLightboxMethods';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const {
      rasterProbeCloseButton,
      onCloseClick,
    } = privateProps.get(this);

    const {
      setCloseButtonListener,
    } = rasterProbeMethods;

    setCloseButtonListener({
      rasterProbeCloseButton,
      onCloseClick,
    });
  },
  drawProbe() {
    const props = privateProps.get(this);
    const {
      currentRasterProbe,
      rasterProbeTitleContainer,
      cachedMetadata,
      cachedSharedShelfURLs,
      rasterProbeImageContainer,
      rasterProbeControlsContainer,
      rasterProbeCloseOverlayButton,
      rasterProbeCreditsContainer,
      rasterProbeContainer,
      rasterProbeSliderContainer,
      rasterProbeInnerContainer,
      onOverlayCloseClick,
      lightboxOuterContainer,
      lightboxContentContainer,
      lightboxImageContainer,
      lightboxMetadataContainer,
      lightboxCreditsContainer,
      lightboxSharedShelfButton,
      lightboxCloseButton,
      onSliderDrag,
      overlayOpacity,
      mobile,
    } = props;

    const {
      updateTitle,
      updateImage,
      updateCredits,
      updateOverlayControls,
      resizeProbe,
      drawSlider,
    } = rasterProbeMethods;

    const {
      initLightbox,
      closeLightbox,
    } = lightboxMethods;

    if (currentRasterProbe === null) {
      closeLightbox({ lightboxOuterContainer });
      return;
    }

    updateTitle({
      rasterProbeTitleContainer,
      currentRasterProbe,
    });


    updateImage({
      currentRasterProbe,
      cachedMetadata,
      rasterProbeImageContainer,
      mobile,
      rasterProbeInnerContainer,
      onImageClick: () => {
        initLightbox({
          currentRasterProbe,
          lightboxOuterContainer,
          lightboxContentContainer,
          lightboxImageContainer,
          lightboxMetadataContainer,
          lightboxCreditsContainer,
          lightboxSharedShelfButton,
          lightboxCloseButton,
          cachedMetadata,
          mobile,
          cachedSharedShelfURLs,
        });
      },
    });

    resizeProbe({
      rasterProbeContainer,
      rasterProbeInnerContainer,
      rasterProbeImageContainer,
    });

    updateCredits({
      selection: rasterProbeCreditsContainer,
      currentRasterProbe,
    });

    updateOverlayControls({
      rasterProbeCloseOverlayButton,
      rasterProbeControlsContainer,
      currentRasterProbe,
      onOverlayCloseClick,
    });

    if (currentRasterProbe.type === 'view') return;

    props.slider = drawSlider({
      onSliderDrag,
      overlayOpacity,
      rasterProbeSliderContainer,
    });
  },
};

class RasterProbe {
  constructor(config) {
    const {
      rasterProbeTitleContainer,
      rasterProbeImageContainer,
      rasterProbeOverlayControlContainer,
      rasterProbeCloseButton,
      rasterProbeControlsContainer,
      rasterProbeCloseOverlayButton,
      rasterProbeCreditsContainer,
      rasterProbeContainer,
      rasterProbeSliderContainer,
      rasterProbeInnerContainer,
      lightboxOuterContainer,
      lightboxContentContainer,
      lightboxImageContainer,
      lightboxMetadataContainer,
      lightboxCreditsContainer,
      lightboxSharedShelfButton,
      lightboxCloseButton,
    } = selections;

    privateProps.set(this, {
      rasterProbeTitleContainer,
      rasterProbeImageContainer,
      rasterProbeOverlayControlContainer,
      rasterProbeCloseButton,
      rasterProbeControlsContainer,
      rasterProbeCloseOverlayButton,
      rasterProbeCreditsContainer,
      rasterProbeContainer,
      rasterProbeInnerContainer,
      rasterProbeSliderContainer,
      lightboxOuterContainer,
      lightboxContentContainer,
      lightboxImageContainer,
      lightboxMetadataContainer,
      lightboxCreditsContainer,
      lightboxSharedShelfButton,
      lightboxCloseButton,
      currentRasterProbe: null,
      onCloseClick: null,
      onOverlayCloseClick: null,
      cachedMetadata: null,
      cachedSharedShelfURLs: new Map(),
    });

    const {
      init,
    } = privateMethods;

    this.config(config);

    init.call(this);
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
  update() {
    const {
      drawProbe,
    } = privateMethods;
    drawProbe.call(this);
  }
  updateSlider() {
    const props = privateProps.get(this);
    const {
      slider,
      overlayOpacity,
    } = props;
    if (slider === undefined || slider === null) return;
    slider
      .config({ currentValue: overlayOpacity })
      .update();
  }
}

export default RasterProbe;

import { selections } from './config';
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
    } = privateProps.get(this);

    const {
      updateTitle,
      updateImage,
      updateCredits,
      updateOverlayControls,
      resizeProbe,
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
}

export default RasterProbe;

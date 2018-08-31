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
      rasterProbeImageContainer,
      rasterProbeControlsContainer,
      rasterProbeCloseOverlayButton,
      onOverlayCloseClick,
      lightboxOuterContainer,
      lightboxContentContainer,
      lightboxImageContainer,
      lightboxMetadataContainer,
    } = privateProps.get(this);


    if (currentRasterProbe === null) return;

    const {
      updateTitle,
      updateImage,
      updateOverlayControls,

    } = rasterProbeMethods;

    const {
      initLightbox,
    } = lightboxMethods;

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
          cachedMetadata,
        });
      },
    });
    updateOverlayControls({
      rasterProbeCloseOverlayButton,
      rasterProbeControlsContainer,
      currentRasterProbe,
      onOverlayCloseClick,
    });
  },
};

class RasterProbe {
  constructor(config) {
    const {
      rasterProbeContainer,
      rasterProbeTitleContainer,
      rasterProbeImageContainer,
      rasterProbeOverlayControlContainer,
      rasterProbeCloseButton,
      rasterProbeControlsContainer,
      rasterProbeCloseOverlayButton,
      lightboxOuterContainer,
      lightboxContentContainer,
      lightboxImageContainer,
      lightboxMetadataContainer,
    } = selections;

    privateProps.set(this, {
      rasterProbeContainer,
      rasterProbeTitleContainer,
      rasterProbeImageContainer,
      rasterProbeOverlayControlContainer,
      rasterProbeCloseButton,
      rasterProbeControlsContainer,
      rasterProbeCloseOverlayButton,
      lightboxOuterContainer,
      lightboxContentContainer,
      lightboxImageContainer,
      lightboxMetadataContainer,
      currentRasterProbe: null,
      onCloseClick: null,
      onOverlayCloseClick: null,
      cachedMetadata: null,
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

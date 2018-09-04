import rasterMethods from './rasterMethods';
import rasterProbeMethods from './rasterProbeMethods';

const localMethods = {
  openLightbox({
    lightboxOuterContainer,
  }) {
    lightboxOuterContainer
      .classed('lightbox__outer--on', true);
  },
  closeLightbox({
    lightboxOuterContainer,
  }) {
    lightboxOuterContainer
      .classed('lightbox__outer--on', false);
  },
  setCloseListener({
    lightboxOuterContainer,
    lightboxContentContainer,
  }) {
    const {
      closeLightbox,
    } = localMethods;
    lightboxOuterContainer
      .on('click', () => {
        closeLightbox({ lightboxOuterContainer });
      });
    lightboxContentContainer
      .on('click', () => {
        d3.event.stopPropagation();
      });
  },
  drawLightboxImage({
    lightboxImageContainer,
    currentRasterProbe,
    cachedMetadata,
  }) {
    const {
      setBackgroundToContainerWidth,
    } = rasterMethods;

    setBackgroundToContainerWidth({
      selection: lightboxImageContainer,
      currentRasterProbe,
      cachedMetadata,
      resizeContainer: true,
    });
  },
  initSharedShelfButton({
    lightboxSharedShelfButton,
    currentRasterProbe,
  }) {
    console.log('currentraster', currentRasterProbe);
  },
};

const lightboxMethods = {
  initLightbox({
    lightboxContentContainer,
    lightboxOuterContainer,
    lightboxImageContainer,
    lightboxMetadataContainer,
    lightboxCreditsContainer,
    currentRasterProbe,
    cachedMetadata,
    lightboxSharedShelfButton,
  }) {
    const {
      openLightbox,
      setCloseListener,
      drawLightboxImage,
      initSharedShelfButton,
    } = localMethods;

    const {
      updateCredits,
    } = rasterProbeMethods;

    openLightbox({ lightboxOuterContainer });

    setCloseListener({
      lightboxOuterContainer,
      lightboxContentContainer,
    });

    drawLightboxImage({
      lightboxImageContainer,
      lightboxMetadataContainer,
      currentRasterProbe,
      cachedMetadata,
    });

    updateCredits({
      selection: lightboxCreditsContainer,
      currentRasterProbe,
    });

    initSharedShelfButton({
      lightboxSharedShelfButton,
      currentRasterProbe,
    });
  },
};

export default lightboxMethods;

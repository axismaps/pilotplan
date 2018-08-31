import rasterMethods from './rasterMethods';

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
};

const lightboxMethods = {
  initLightbox({
    lightboxContentContainer,
    lightboxOuterContainer,
    lightboxImageContainer,
    lightboxMetadataContainer,
    currentRasterProbe,
    cachedMetadata,
  }) {
    const {
      openLightbox,
      setCloseListener,
      drawLightboxImage,
    } = localMethods;

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
  },
};

export default lightboxMethods;

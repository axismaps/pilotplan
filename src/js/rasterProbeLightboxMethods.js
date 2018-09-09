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
      maxWidth: 1054,
    });
  },
  initSharedShelfButton({
    lightboxSharedShelfButton,
    cachedSharedShelfURLs,
    currentRasterProbe,
  }) {
    const {
      addSharedShelfLinkToSelection,
    } = rasterMethods;

    addSharedShelfLinkToSelection({
      currentRasterProbe,
      cachedSharedShelfURLs,
      selection: lightboxSharedShelfButton,
    });
    // `https://www.sscommons.org/openlibrary/secure/metadata/${data.id}?_method=FpHtml`
    // https://www.sscommons.org/openlibrary/ExternalIV.jsp?objectId=
    // https://www.sscommons.org/openlibrary/secure/ViewImages?id=4jEkdDEkKjE2QkY6fz96QXxHMXohdFRxfSc%3D&userId=gDFB
    // https://www.sscommons.org/openlibrary/ExternalIV.jsp?objectId=4jEkdDEkKjE2QkY6fz96QXxHMXohdFRxfSU%3D
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
    cachedSharedShelfURLs,
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
      cachedSharedShelfURLs,
    });
  },
  closeLightbox({ lightboxOuterContainer }) {
    const { closeLightbox } = localMethods;
    closeLightbox({ lightboxOuterContainer });
  },
};

export default lightboxMethods;

/**
 * Module comprises pure functions related to raster lightbox
 * @module rasterProbeLightboxMethods
 * @memberof rasterProbe
 */

import rasterMethods from '../rasterProbe/rasterMethods';
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
    lightboxCloseButton,
  }) {
    const {
      closeLightbox,
    } = localMethods;
    lightboxOuterContainer
      .on('click', () => {
        closeLightbox({ lightboxOuterContainer });
      });

    lightboxCloseButton
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
    mobile,
  }) {
    const {
      setBackgroundToContainerWidth,
    } = rasterMethods;

    setBackgroundToContainerWidth({
      selection: lightboxImageContainer,
      currentRasterProbe,
      cachedMetadata,
      resizeContainer: true,
      maxWidth: mobile ? window.innerWidth : 1054,
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
    lightboxCloseButton,
    mobile,
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
      lightboxCloseButton,
    });

    drawLightboxImage({
      lightboxImageContainer,
      lightboxMetadataContainer,
      currentRasterProbe,
      cachedMetadata,
      mobile,
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

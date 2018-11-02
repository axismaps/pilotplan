const getPrivateMethods = ({ privateProps }) => ({
  initAreaButton() {
    const {
      areaSearchButton,
      onAreaButtonClick,
    } = privateProps.get(this);

    areaSearchButton.on('click', onAreaButtonClick);
  },
  initOverlayButton() {
    const {
      overlayButtonContainer,
      onOverlayButtonClick,
    } = privateProps.get(this);

    overlayButtonContainer
      .on('click', onOverlayButtonClick);
  },
  initErasButton() {
    const {
      erasButtonContainer,
      onErasButtonClick,
    } = privateProps.get(this);
    erasButtonContainer
      .on('click', onErasButtonClick);
  },
  initBackToIntroButton() {
    const {
      erasBackButton,
      onBackButtonClick,
    } = privateProps.get(this);

    erasBackButton
      .on('click', onBackButtonClick);
  },
  updateFooter({ outerContainer, footerOpen }) {
    outerContainer.classed('footer-open', footerOpen);
  },
  setErasButtonText() {
    const {
      currentEra,
      erasButtonText,
      language,
      translations,
    } = privateProps.get(this);

    erasButtonText
      .text(`${translations['back-to-text'][language]} ${currentEra[language]}`);
  },
  initMenuTransitions() {
    const {
      sidebarContainer,
      footerContainer,
      transitionSpeed,
    } = privateProps.get(this);

    sidebarContainer
      .style('transition', `width ${transitionSpeed}ms`);

    footerContainer
      .style('transition', `height ${transitionSpeed}ms width ${transitionSpeed}ms`);
  },
  initSidebarToggleButton() {
    const {
      sidebarToggleButton,
      sidebarToggleButtonMobile,
      onSidebarToggleClick,
    } = privateProps.get(this);

    sidebarToggleButton
      .on('click', onSidebarToggleClick);

    sidebarToggleButtonMobile
      .on('touchstart', onSidebarToggleClick);
  },
  initCloseSidebarButton() {
    const {
      sidebarCloseButtonMobile,
      onSidebarToggleClick,
    } = privateProps.get(this);

    sidebarCloseButtonMobile
      .on('click', onSidebarToggleClick);
  },
  initRegisterButton() {
    const {
      headerRegisterButton,
      toggleRegisterScreen,
    } = privateProps.get(this);
    headerRegisterButton
      .on('click', () => {
        toggleRegisterScreen(true);
      });
  },
  initRegisterScreen() {
    const {
      registerOuterContainer,
      toggleRegisterScreen,
      registerInnerContainer,
      registerCancelButton,
    } = privateProps.get(this);
    registerOuterContainer
      .on('click', () => {
        toggleRegisterScreen(false);
      });

    registerCancelButton
      .on('click', () => {
        toggleRegisterScreen(false);
      });

    registerInnerContainer
      .on('click', () => {
        d3.event.stopPropagation();
      });
  },
  initSocialMediaButtons() {
    const {
      headerFacebookButton,
      headerTwitterButton,
      headerDownloadButton,
      getCanvas,
      language,
      translations,
      year,
    } = privateProps.get(this);

    headerDownloadButton
      .on('click', function exportMap() {
        const {
          width,
          height,
        } = getCanvas().getBoundingClientRect();

        const canvas = document.createElement('canvas');
        canvas.height = height;
        canvas.width = width;
        const titleHeight = 50;

        const context = canvas.getContext('2d');
        context.drawImage(getCanvas(), 0, 0, width, height);
        context.fillStyle = 'rgba( 230, 230, 230, 0.8 )';
        context.fillRect(0, 0, width, titleHeight);
        context.fillStyle = '#666';
        context.fillRect(0, titleHeight - 1, width, 1);
        context.font = "100 30px 'Helvetica Neue', Helvetica, Arial, sans-serif";
        context.fillText(translations.h1[language], 20, 35);

        context.font = "bold 20px 'Helvetica Neue', Helvetica, Arial, sans-serif";
        context.fillText(year, width - 100, 35);

        const url = canvas.toDataURL('image/png');
        d3.select(this).attr('href', url);
      });

    headerTwitterButton
      .attr(
        'href',
        `https://twitter.com/intent/tweet?text=pilotPlan&url=${encodeURIComponent(window.location.href)}`,
      );

    headerFacebookButton
      .attr(
        'href',
        `https://www.facebook.com/sharer/sharer.php?&u=${encodeURIComponent(window.location.href)}`,
      );
  },
  initMobileDataProbe() {
    const {
      dataProbeMobileCloseButton,
      onMobileProbeClose,
    } = privateProps.get(this);
    dataProbeMobileCloseButton
      .on('click', onMobileProbeClose);
  },
  setHintProbeLanguage() {
    const {
      hintProbeText,
      translations,
      language,
    } = privateProps.get(this);
    hintProbeText
      .text(translations['probe-hint-text'][language]);
  },
  setAreaProbeLanguage() {
    const {
      areaSearchText,
      language,
      translations,
    } = privateProps.get(this);

    areaSearchText
      .text(translations['probe-area-text'][language]);
  },
  setRegisterButtonLanguage() {
    const {
      headerRegisterButtonText,
      language,
      translations,
    } = privateProps.get(this);
    headerRegisterButtonText
      .text(translations.Register[language]);
  },
  setErasBackButtonText() {
    const {
      erasBackButtonText,
      language,
      translations,
    } = privateProps.get(this);
    erasBackButtonText
      .text(`${translations['back-to-text'][language]} ${translations.start[language]}`);
  },
});

export default getPrivateMethods;

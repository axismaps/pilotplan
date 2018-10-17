import { selections } from './config';
import getPublicMethods from './layoutPublicMethods';

const privateProps = new WeakMap();
const privateMethods = {
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
      onSidebarToggleClick,
    } = privateProps.get(this);

    sidebarToggleButton
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
      // language,
      // translations,
    } = privateProps.get(this);
    headerRegisterButtonText
      .text('Register'); // placeholder until translations csv updated
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
};

class Layout {
  constructor(config) {
    const {
      outerContainer,
      areaSearchButton,
      probeButtonsContainer,
      hintProbeContainer,
      hintProbeText,
      overlayButtonContainer,
      erasButtonContainer,
      erasButtonText,
      erasBackButton,
      erasBackButtonText,
      sidebarContainer,
      footerContainer,
      sidebarToggleButton,
      sidebarToggleHelpContainer,
      headerRegisterButton,
      headerRegisterButtonText,
      headerFacebookButton,
      headerTwitterButton,
      headerDownloadButton,
      registerOuterContainer,
      registerInnerContainer,
      registerCancelButton,
      areaSearchText,
      loadingScreenContainer,
    } = selections;

    privateProps.set(this, {
      sidebarOpen: null,
      footerOpen: null,
      areaSearching: null,
      onAreaButtonClick: null,
      areaSearchActive: null,
      onOverlayButtonClick: null,
      onErasButtonClick: null,
      onBackButtonClick: null,
      onSidebarToggleClick: null,
      rasterProbeOpen: null,
      currentEra: null,
      previousEra: null,
      overlayOn: null,
      language: null,
      toggleRegisterScreen: null,
      outerContainer,
      areaSearchButton,
      probeButtonsContainer,
      overlayButtonContainer,
      erasButtonContainer,
      erasButtonText,
      erasBackButton,
      erasBackButtonText,
      sidebarContainer,
      footerContainer,
      sidebarToggleButton,
      sidebarToggleHelpContainer,
      hintProbeContainer,
      hintProbeText,
      headerRegisterButton,
      headerRegisterButtonText,
      headerFacebookButton,
      headerTwitterButton,
      headerDownloadButton,
      registerOuterContainer,
      registerInnerContainer,
      registerCancelButton,
      areaSearchText,
      loadingScreenContainer,
      transitionSpeed: 500,
      mouseEventsDisabled: false,
      transitionsDisabled: false,
      sidebarOpened: false,
      hintProbeOn: true,
      rotated: false,
      registerOpen: false,
      zoomedOut: false,
      translations: null,
    });
    const {
      initAreaButton,
      initOverlayButton,
      initErasButton,
      initBackToIntroButton,
      setErasButtonText,
      // initMenuTransitions,
      initSidebarToggleButton,
      initRegisterButton,
      initRegisterScreen,
      initSocialMediaButtons,
    } = privateMethods;

    this.config(config);

    initAreaButton.call(this);
    initOverlayButton.call(this);
    initErasButton.call(this);
    initBackToIntroButton.call(this);
    initSidebarToggleButton.call(this);
    setErasButtonText.call(this);
    initRegisterButton.call(this);
    initRegisterScreen.call(this);
    initSocialMediaButtons.call(this);

    this.updateSidebar();
    this.updateFooter();
    this.updateAllRaster();
    this.updateOverlay();
    // this.updateView();
    this.updateRasterProbe();
    this.updateLocation();
    this.updateRegisterScreen();
    this.updateLanguage();

    // initMenuTransitions.call(this);
  }
}

Object.assign(
  Layout.prototype,
  getPublicMethods({ privateProps, privateMethods }),
);

export default Layout;

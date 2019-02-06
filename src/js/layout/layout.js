/**
 * Module for general layout updates
 * Includes opening / closing menus, showing / hiding probes, etc.
 * @module layout
 */
import { selections } from '../config/config';
import getPublicMethods from './layoutPublicMethods';
import getPrivateMethods from './layoutPrivateMethods';

const privateProps = new WeakMap();
const privateMethods = {};

Object.assign(
  privateMethods,
  getPrivateMethods({ privateProps, privateMethods }),
);

class Layout {
  constructor(config) {
    const {
      outerContainer,
      areaSearchButton,
      probeButtonsContainer,
      hintProbeContainer,
      hintProbeContainerMobile,
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
      registerSubmitButton,
      areaSearchText,
      loadingScreenContainer,
      sidebarCloseButtonMobile,
      sidebarToggleButtonMobile,
      dataProbeMobileContainer,
      dataProbeMobileTitle,
      dataProbeMobileContent,
      dataProbeMobileCloseButton,
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
      hintProbeContainerMobile,
      hintProbeText,
      headerRegisterButton,
      headerRegisterButtonText,
      headerFacebookButton,
      headerTwitterButton,
      headerDownloadButton,
      registerOuterContainer,
      registerInnerContainer,
      registerCancelButton,
      registerSubmitButton,
      areaSearchText,
      loadingScreenContainer,
      sidebarCloseButtonMobile,
      sidebarToggleButtonMobile,
      dataProbeMobileContainer,
      dataProbeMobileTitle,
      dataProbeMobileContent,
      dataProbeMobileCloseButton,
      transitionSpeed: 500,
      mouseEventsDisabled: false,
      transitionsDisabled: false,
      sidebarOpened: false,
      hintProbeOn: true,
      rotated: false,
      registerOpen: false,
      zoomedOut: false,
      translations: null,
      mapLoaded: false,
      mobile: false,
      highlightedFeature: false,
    });
    const {
      initAreaButton,
      initOverlayButton,
      initErasButton,
      initBackToIntroButton,
      setErasButtonText,
      initSidebarToggleButton,
      initRegisterButton,
      initRegisterScreen,
      initSocialMediaButtons,
      initCloseSidebarButton,
      initMobileDataProbe,
    } = privateMethods;

    this.config(config);

    const { mobile } = privateProps.get(this);

    initAreaButton.call(this);
    initOverlayButton.call(this);
    initErasButton.call(this);
    initBackToIntroButton.call(this);
    initSidebarToggleButton.call(this);
    setErasButtonText.call(this);
    initRegisterButton.call(this);
    initRegisterScreen.call(this);
    initSocialMediaButtons.call(this);
    initCloseSidebarButton.call(this);
    if (mobile) {
      initMobileDataProbe.call(this);
    }


    this.updateSidebar();
    this.updateFooter();
    this.updateAllRaster();
    this.updateOverlay();
    this.updateRasterProbe();
    this.updateLocation();
    this.updateRegisterScreen();
    this.updateLanguage();
    this.updateMapLoaded();
    this.updateMobile();
  }
}

Object.assign(
  Layout.prototype,
  getPublicMethods({ privateProps, privateMethods }),
);

export default Layout;

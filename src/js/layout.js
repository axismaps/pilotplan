import { selections } from './config';

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
    } = privateProps.get(this);

    erasButtonText
      .text(currentEra[language]);
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
      getExportLink,
      headerInfoButton,
    } = privateProps.get(this);

    headerDownloadButton
      .on('click', function exportMap() {
        const link = getExportLink();
        d3.select(this).attr('href', link);
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
};

class Layout {
  constructor(config) {
    const {
      outerContainer,
      areaSearchButton,
      probeButtonsContainer,
      hintProbeContainer,
      overlayButtonContainer,
      erasButtonContainer,
      erasButtonText,
      erasBackButton,
      sidebarContainer,
      footerContainer,
      sidebarToggleButton,
      sidebarToggleHelpContainer,
      headerRegisterButton,
      headerFacebookButton,
      headerTwitterButton,
      headerDownloadButton,
      headerInfoButton,
      registerOuterContainer,
      registerInnerContainer,
      registerCancelButton,
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
      sidebarContainer,
      footerContainer,
      sidebarToggleButton,
      sidebarToggleHelpContainer,
      hintProbeContainer,
      headerRegisterButton,
      headerFacebookButton,
      headerTwitterButton,
      headerDownloadButton,
      headerInfoButton,
      registerOuterContainer,
      registerInnerContainer,
      registerCancelButton,
      transitionSpeed: 500,
      mouseEventsDisabled: false,
      transitionsDisabled: false,
      sidebarOpened: false,
      hintProbeOn: true,
      rotated: false,
      registerOpen: false,
      zoomedOut: false,
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

    // initMenuTransitions.call(this);
  }
  config(config) {
    const props = privateProps.get(this);
    props.previousEra = props.currentEra;
    Object.assign(privateProps.get(this), config);
    return this;
  }
  updateRasterProbe() {
    const {
      outerContainer,
      rasterProbeOpen,
    } = privateProps.get(this);

    outerContainer.classed('raster-probe-on', rasterProbeOpen);
  }
  updateOverlay() {
    const {
      outerContainer,
      overlayOn,
    } = privateProps.get(this);

    outerContainer.classed('overlay-on', overlayOn);
  }
  updateSidebar() {
    const {
      outerContainer,
      sidebarOpen,
    } = privateProps.get(this);

    outerContainer.classed('sidebar-open', sidebarOpen);
  }
  updateLocation() {
    const {
      outerContainer,
      sidebarContainer,
      zoomedOut,
      rotated,
    } = privateProps.get(this);

    outerContainer.classed('rotated', rotated);
    sidebarContainer.classed('sidebar--zoom-hint', zoomedOut);
  }
  removeSidebarToggleLabel() {
    const props = privateProps.get(this);
    const {
      sidebarToggleHelpContainer,
      sidebarOpened,
    } = props;
    if (sidebarOpened) return;

    props.sidebarOpen = true;
    sidebarToggleHelpContainer.remove();
  }
  updateFooter() {
    const {
      outerContainer,
      footerOpen,
    } = privateProps.get(this);
    const { updateFooter } = privateMethods;

    updateFooter({ outerContainer, footerOpen });
  }
  updateAreaSearch() {
    const {
      probeButtonsContainer,
      areaSearchActive,
    } = privateProps.get(this);
    probeButtonsContainer.classed('probe-buttons-container--area-search', areaSearchActive);
  }
  updateAllRaster() {
    const {
      allRasterOpen,
      outerContainer,
    } = privateProps.get(this);

    outerContainer.classed('allraster-open', allRasterOpen);
  }
  updateEra() {
    const {
      currentEra,
      previousEra,
      language,
    } = privateProps.get(this);

    const { setErasButtonText } = privateMethods;

    if (previousEra[language] === currentEra[language]) return;

    setErasButtonText.call(this);
  }
  toggleMouseEvents() {
    const { outerContainer, mouseEventsDisabled } = privateProps.get(this);
    outerContainer.classed('mouse-disabled', mouseEventsDisabled);
  }
  toggleTransitions() {
    const { outerContainer, transitionsDisabled } = privateProps.get(this);
    outerContainer.classed('transitions-disabled', transitionsDisabled);
  }
  removeHintProbe() {
    const props = privateProps.get(this);
    const { hintProbeContainer, hintProbeOn } = props;
    if (!hintProbeOn) return;
    hintProbeContainer.remove();
    props.hintProbeOn = false;
  }
  updateRegisterScreen() {
    const {
      registerOpen,
      registerOuterContainer,
    } = privateProps.get(this);
    registerOuterContainer
      .classed('register__outer--on', registerOpen);
  }
  // initExportButton() {
  //   const {
  //     headerDownloadButton,
  //     exportLink,
  //   } = privateProps.get(this);

  // }
}

export default Layout;

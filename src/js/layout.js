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
    } = privateProps.get(this);
    erasButtonText
      .text(currentEra.name);
  },
};

class Layout {
  constructor(config) {
    const {
      outerContainer,
      areaSearchButton,
      probeButtonsContainer,
      overlayButtonContainer,
      erasButtonContainer,
      erasButtonText,
      erasBackButton,
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
      rasterProbeOpen: null,
      currentEra: null,
      previousEra: null,
      overlayOn: null,
      outerContainer,
      areaSearchButton,
      probeButtonsContainer,
      overlayButtonContainer,
      erasButtonContainer,
      erasButtonText,
      erasBackButton,
    });
    const {
      initAreaButton,
      initOverlayButton,
      initErasButton,
      initBackToIntroButton,
      setErasButtonText,
    } = privateMethods;

    this.config(config);

    initAreaButton.call(this);
    initOverlayButton.call(this);
    initErasButton.call(this);
    initBackToIntroButton.call(this);
    setErasButtonText.call(this);

    this.updateSidebar();
    this.updateFooter();
    this.updateAllRaster();
    this.updateOverlay();
    // this.updateView();
    this.updateRasterProbe();
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
    } = privateProps.get(this);

    const { setErasButtonText } = privateMethods;

    if (previousEra.name === currentEra.name) return;

    setErasButtonText.call(this);
  }
  toggleMouseEvents() {
    const { outerContainer, mouseEventsDisabled } = privateProps.get(this);
    outerContainer.classed('mouse-disabled', mouseEventsDisabled);
  }
}

export default Layout;

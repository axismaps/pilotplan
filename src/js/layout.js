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
  updateFooter({ outerContainer, footerOpen }) {
    outerContainer.classed('footer-open', footerOpen);
  },
};

class Layout {
  constructor(config) {
    const {
      outerContainer,
      areaSearchButton,
      probeButtonsContainer,
    } = selections;

    privateProps.set(this, {
      sidebarOpen: false,
      footerOpen: true,
      areaSearching: false,
      overlay: false,
      onAreaButtonClick: null,
      areaSearchActive: null,
      outerContainer,
      areaSearchButton,
      probeButtonsContainer,
    });
    const {
      initAreaButton,
    } = privateMethods;
    this.config(config);

    initAreaButton.call(this);
    this.updateSidebar();
    this.updateFooter();
    this.updateAllRaster();
    this.updateOverlay();
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
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
    console.log('layout area', privateProps.get(this).areaSearchActive);
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
}

export default Layout;

const privateProps = new WeakMap();
const privateMethods = {
  initAreaButton() {
    const {
      areaSearchButton,
      onAreaButtonClick,
    } = privateProps.get(this);

    areaSearchButton.on('click', onAreaButtonClick);
  },
};

class Layout {
  constructor(config) {
    privateProps.set(this, {
      sidebarOpen: false,
      areaSearching: false,
      container: d3.select('.outer-container'),
      areaSearchButton: d3.select('.area-button'),
      probeButtonsContainer: d3.select('.probe-buttons-container'),
      onAreaButtonClick: null,
      areaSearchActive: null,
    });
    const {
      initAreaButton,
    } = privateMethods;
    this.config(config);

    initAreaButton.call(this);
    this.updateSidebar();
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
  updateSidebar() {
    const {
      container,
      sidebarOpen,
    } = privateProps.get(this);

    container.classed('sidebar-open', sidebarOpen);
  }
  updateAreaSearch() {
    console.log('layout area', privateProps.get(this).areaSearchActive);
    const {
      probeButtonsContainer,
      areaSearchActive,
    } = privateProps.get(this);
    probeButtonsContainer.classed('probe-buttons-container--area-search', areaSearchActive);
  }
}

export default Layout;

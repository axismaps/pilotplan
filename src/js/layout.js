const privateProps = new WeakMap();

class Layout {
  constructor(config) {
    privateProps.set(this, {
      sidebarOpen: false,
      container: d3.select('.outer-container'),
    });
    this.config(config);
    this.updateLayout();
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
  updateLayout() {
    const {
      container,
      sidebarOpen,
    } = privateProps.get(this);

    container.classed('sidebar-open', sidebarOpen);
  }
}

export default Layout;

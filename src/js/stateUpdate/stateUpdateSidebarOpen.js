/**
 * Callback for sidebarOpen field
 * "sidebarOpen" boolean represents open / close status of sidebar
 * @module
 * @memberof stateUpdate
 */
const getUpdateSidebarOpen = ({ components }) => {
  const updateSidebarOpen = function updateSidebarOpen() {
    const {
      sidebarOpen,
    } = this.props();
    const {
      layout,
      sidebar,
    } = components;

    layout
      .config({
        sidebarOpen,
      })
      .updateSidebar();

    if (sidebarOpen) {
      layout.removeSidebarToggleLabel();
    } else if (sidebar.getView() !== 'legend') {
      sidebar.clearSearch();
    }
  };

  return updateSidebarOpen;
};

export default getUpdateSidebarOpen;

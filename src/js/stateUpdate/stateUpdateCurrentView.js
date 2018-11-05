/**
 * Callback for currentView field
 * "currentView" object represents data for selected viewshed
 * @module
 * @memberof stateUpdate
 */

const getUpdateCurrentView = ({ components }) => {
  const updateCurrentView = function updateCurrentView() {
    const {
      currentView,
    } = this.props();

    const {
      atlas,
    } = components;

    atlas
      .config({
        currentView,
      })
      .updateView();
  };
  return updateCurrentView;
};

export default getUpdateCurrentView;

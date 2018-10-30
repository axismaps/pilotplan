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

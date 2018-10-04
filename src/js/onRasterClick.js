const onRasterClick = ({ rasterData, state }) => {
  const getId = d => (d === null ? null : d.SS_ID);
  const currentView = state.get('currentView');
  const currentOverlay = state.get('currentOverlay');
  if (rasterData.type === 'overlay') {
    if (getId(currentOverlay) === getId(rasterData)) {
      state.update({
        currentOverlay: null,
        currentRasterProbe: currentView === null ? null : currentView,
      });
    } else {
      state.update({
        currentOverlay: rasterData,
        currentRasterProbe: currentView === null ? rasterData : currentView,
      });
    }
  } else if (rasterData.type === 'view') {
    if (getId(currentView) === getId(rasterData)) {
      state.update({
        currentView: null,
        currentRasterProbe: null,
      });
    } else {
      state.update({
        currentView: rasterData,
        currentRasterProbe: rasterData,
      });
    }
  }
};

export default onRasterClick;

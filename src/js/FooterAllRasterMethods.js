const allRasterMethods = {
  setAllRasterBackgroundClick({
    allRasterInnerContainer,
    allRasterOuterContainer,
    onAllRasterCloseClick,
  }) {
    allRasterOuterContainer.on('click', onAllRasterCloseClick);
    allRasterInnerContainer.on('click', () => {
      d3.event.stopPropagation();
    });
  },
  drawCategories({
    rasterCategories,
    contentContainer,
  }) {

  },
  drawRows() {

  },
  drawImages({
    rasterData,

    onRasterClick,
  }) {

  },
};

export default allRasterMethods;

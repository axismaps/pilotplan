import dataMethods from './atlasDataMethods';

const atlasClickSearchMethods = {
  setClickSearch({
    onClickSearch,
    mbMap,
    setClickSearchProp,
    getCancelClickSearch,
    removeCancelClickSearch,
    getYear,
    getFlattenedRasterData,
  }) {
    const { getClickSearch } = atlasClickSearchMethods;


    const clickSearch = getClickSearch({
      onClickSearch,
      getCancelClickSearch,
      removeCancelClickSearch,
      getYear,
      getFlattenedRasterData,
      mbMap,
    });

    setClickSearchProp(clickSearch);
  },
  getClickSearch({
    onClickSearch,
    getYear,
    getFlattenedRasterData,
    getCancelClickSearch,
    removeCancelClickSearch,
    mbMap,
  }) {
    const {
      getRasterResults,
      getNonRasterResults,
    } = dataMethods;
    return (e) => {
      if (getCancelClickSearch()) {
        removeCancelClickSearch();
        return;
      }
      const year = getYear();
      const flattenedRasterData = getFlattenedRasterData();

      const bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
      const features = mbMap.queryRenderedFeatures(bbox, {
        filter: [
          'all',
          ['<=', 'FirstYear', year],
          ['>=', 'LastYear', year],
        ],
      });

      const rasterFeatures = getRasterResults(features)
        .map(d => flattenedRasterData.find(dd => dd.SS_ID === d.properties.SS_ID));


      const nonRasterFeatures = getNonRasterResults(features);

      onClickSearch({
        raster: rasterFeatures,
        nonRaster: nonRasterFeatures,
      });
    };
  },
  initClickSearchListener({
    mbMap,
    clickSearch,
  }) {
    mbMap.on('click', clickSearch);
  },
  disableClickSearchListener({
    mbMap,
    clickSearch,
  }) {
    mbMap.off('click', clickSearch);
  },
  toggleMapAreaSearchMode({
    mapContainer,
    areaSearchActive,
  }) {
    mapContainer.classed('map--area-search', areaSearchActive);
  },
};

export default atlasClickSearchMethods;

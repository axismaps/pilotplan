import dataMethods from './atlasDataMethods';

const atlasClickSearchMethods = {
  getClickSearch({
    onClickSearch,
    getYear,
    getFlattenedRasterData,
    mbMap,
  }) {
    const {
      getRasterResults,
      getNonRasterResults,
    } = dataMethods;
    return (e) => {
      const year = getYear();
      const flattenedRasterData = getFlattenedRasterData();
      console.log('raster', flattenedRasterData);
      const bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
      const features = mbMap.queryRenderedFeatures(bbox, {
        filter: [
          'all',
          ['<=', 'FirstYear', year],
          ['>=', 'LastYear', year],
        ],
      });

      console.log('duplicate', getRasterResults(features));
      const rasterFeatures = getRasterResults(features)
        .map(d => flattenedRasterData.find(dd => dd.SS_ID === d.properties.SS_ID));


      const nonRasterFeatures = getNonRasterResults(features);

      console.log('raster features', rasterFeatures);
      console.log('nonraster features', nonRasterFeatures);

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

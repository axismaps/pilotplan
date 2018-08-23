const atlasClickSearchMethods = {
  getClickSearch({
    onClickSearch,
    getYear,
    mbMap,
  }) {
    return (e) => {
      const year = getYear();
      const bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
      const features = mbMap.queryRenderedFeatures(bbox, {
        filter: [
          'all',
          ['<=', 'FirstYear', year],
          ['>=', 'LastYear', year],
        ],
      });
      onClickSearch(features);
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

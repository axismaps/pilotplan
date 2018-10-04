import dataMethods from './atlasDataMethods';

let pulsing = false;
let pulseTimer = null;

const atlasClickSearchMethods = {
  setClickSearch({
    onClickSearch,
    mbMap,
    setClickSearchProp,
    getCancelClickSearch,
    removeCancelClickSearch,
    getYear,
    getFlattenedRasterData,
    outerContainer,
  }) {
    const { getClickSearch } = atlasClickSearchMethods;


    const clickSearch = getClickSearch({
      outerContainer,
      onClickSearch,
      getCancelClickSearch,
      removeCancelClickSearch,
      getYear,
      getFlattenedRasterData,
      mbMap,
    });

    setClickSearchProp(clickSearch);
  },
  addPulse({ e, outerContainer }) {
    const { removePulse } = atlasClickSearchMethods;
    const { x, y } = e.point;
    const size = 60;
    if (pulseTimer !== null) {
      clearTimeout(pulseTimer);
      removePulse();
    }

    pulsing = true;
    outerContainer
      .append('img')
      .attrs({
        class: 'atlas__pulse',
        src: `img/pulse.gif?a=${Math.random()}`,
      })
      .styles({
        position: 'absolute',
        'pointer-events': 'none',
        left: `${x - (size / 2)}px`,
        top: `${y - (size / 2)}px`,
      });
    pulseTimer = setTimeout(() => {
      pulseTimer = null;
      removePulse();
    }, 450);
  },
  removePulse() {
    if (!pulsing) return;
    d3.selectAll('.atlas__pulse').remove();
    pulsing = false;
  },
  getClickSearch({
    outerContainer,
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
    const {
      addPulse,
    } = atlasClickSearchMethods;
    return (e) => {
      if (getCancelClickSearch()) {
        removeCancelClickSearch();
        return;
      }
      addPulse({ e, outerContainer });
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
      // console.log('nonraster', nonRasterFeatures);

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

/**
 * Module comprises pubic methods for the atlas module (Atlas class prototype)
 * @module atlasPublicMethods
 * @memberof atlas
 */

import dataMethods from './atlasDataMethods';
import rasterMethods from '../rasterProbe/rasterMethods';
import generalMethods from './atlasMethods';

const getPublicMethods = ({ privateProps }) => ({
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  },
  getStyle() {
    const { mbMap } = privateProps.get(this);
    return mbMap.getStyle();
  },

  textSearch(value) {
    const {
      mbMap,
      rasterData,
      year,
    } = privateProps.get(this);

    const { getSourceLayers } = generalMethods;

    const { getFlattenedRasterData } = rasterMethods;

    const { getNonRasterResults } = dataMethods;

    const flattenedRasterData = getFlattenedRasterData({ rasterData });

    const sourceLayers = getSourceLayers(mbMap);

    const queriedFeatures = sourceLayers.reduce((accumulator, sourceLayer) => {
      const results = mbMap.querySourceFeatures('composite', {
        sourceLayer,
        filter: [
          'all',
          ['<=', 'FirstYear', year],
          ['>=', 'LastYear', year],
        ],
      });

      const resultsWithSource = results.map((d) => {
        const record = Object.assign({}, d.toJSON(), { sourceLayer });
        return record;
      });
      return [...accumulator, ...resultsWithSource];
    }, []);

    const rasterResults = flattenedRasterData
      .filter(d => d.Title.toLowerCase().includes(value.toLowerCase()));

    const nonRasterResults = getNonRasterResults(queriedFeatures)
      .filter(d => d.properties.Name.toLowerCase().includes(value.toLowerCase()));

    return {
      raster: rasterResults,
      nonRaster: nonRasterResults,
    };
  },
  getMapExportLink() {
    const { mbMap } = privateProps.get(this);
    return mbMap.getCanvas().toDataURL('image/png');
  },
  getContext() {
    const { mbMap } = privateProps.get(this);
    return mbMap.getCanvas().getContext('webgl');
  },
  getCanvas() {
    const { mbMap } = privateProps.get(this);
    return mbMap.getCanvas();
  },
  setSearchLocation() {
    const props = privateProps.get(this);
    const { mbMap } = props;
    const {
      getCurrentLocation,
    } = generalMethods;
    props.searchLocation = getCurrentLocation({ mbMap });
  },
});

export default getPublicMethods;

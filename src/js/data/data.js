/**
 * Module comprises functions related to data manipulation
 * @module data
 */

import { eras } from '../config/config';

/**
 * Parses all initial async data
 * @param {Object} rawData
 * @return {Object} clean, processed data
 * @memberof data
 */
export const cleanData = (rawData) => {
  const [
    rawLayers,
    rawViewsheds,
    rawAerials,
    rawMaps,
    rawPlans,
    rawExtents,
    rawYears,
    rawTranslations,
    rawLegendSwatches,
  ] = rawData;

  const layerGroups = [
    'Views',
    'Landscape',
    'Urbanism',
  ];

  const layers = layerGroups
    .map((group) => {
      const groupRecord = {
        group,
        layers: Object.keys(rawLayers)
          .filter(groupKey => rawLayers[groupKey].group === group)
          .map((groupKey) => {
            const layerRecord = Object.assign({}, rawLayers[groupKey]);
            layerRecord.sourceLayer = groupKey;
            layerRecord.features = Object.keys(layerRecord.features)
              .map((featureKey) => {
                const featureRecord = Object.assign({}, layerRecord.features[featureKey]);
                featureRecord.dataLayer = featureKey;

                return featureRecord;
              });
            return layerRecord;
          }),
      };
      return groupRecord;
    });

  const views = rawViewsheds.features.map((d) => {
    const record = Object.assign({}, d.properties);
    record.type = 'view';
    return record;
  });

  const processOverlay = data => data.map((d) => {
    const record = Object.assign({}, d);
    record.type = 'overlay';
    return record;
  });

  const translations = rawTranslations
    .reduce((accumulator, d) => {
      const { en, pr } = d;
      /* eslint-disable no-param-reassign */
      accumulator[`${d.id}`] = { en, pr };
      /* eslint-enable no-param-reassign */
      return accumulator;
    }, {});


  const erasWithTranslations = eras.map(d => Object.assign({}, d, translations[d.id]));

  const rasters = new Map();

  rasters.set('views', views);
  rasters.set('maps', processOverlay(rawMaps));
  rasters.set('plans', processOverlay(rawPlans));
  rasters.set('aerials', processOverlay(rawAerials));

  const data = {
    layers,
    viewshedsGeo: rawViewsheds,
    rasters,
    translations,
    eras: erasWithTranslations,
    extents: rawExtents,
    years: rawYears,
    legendSwatches: rawLegendSwatches,
  };

  return data;
};

/**
 * Returns unique, non-empty non-raster search results from all non-rasters
 * @param {Array} nonRasters non-raster search results
 * @return {Array} unique, non-empty results
 * @memberof data
 */
export const formatNonRasterResults = nonRasters =>
  [...new Set(nonRasters.map(d => d.sourceLayer))]
    .map(sourceLayer => ({
      sourceLayer,
      features: nonRasters
        .filter(d => d.sourceLayer === sourceLayer)
        .filter(d => d.properties.Name !== ''),
    }))
    .filter(d => d.features.length > 0);

/**
 * Returns unique, non-empty raster search results from all rasters
 * @param {Array} rasters raster search results
 * @return {Array} unique, non-empty results
 * @memberof data
 */
export const formatRasterResults = rasters =>
  [...new Set(rasters.map(d => d.category))]
    .map(category => ({
      category,
      features: rasters
        .filter(d => d.category === category),
    }))
    .filter(d => d.features.length > 0);

/**
 * Returns raster search results from raw results
 * @memberof data
 * @param {Array} features results from vector tile query
 * @return {Array} raster result features
 */
export const getRasterResults = features =>
  features.filter(d => Object.prototype.hasOwnProperty.call(d.properties, 'SS_ID') &&
  d.source !== 'viewshed');

/**
 * Returns non-raster search results from raw results
 * @memberof data
 * @param {Array} features results from vector tile query
 * @return {Array} non-raster search results
 */
export const getNonRasterResults = features =>
  features.filter(d =>
    !Object.prototype.hasOwnProperty.call(d.properties, 'SS_ID') &&
    Object.prototype.hasOwnProperty.call(d.properties, 'Name') &&
    (d.geometry.type.includes('String') ||
      d.geometry.type.includes('Polygon')) &&
    d.source !== 'highlighted');

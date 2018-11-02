/**
 * Module comprises functions related to atlas search results data manipulation
 * @module atlasDataMethods
 * @memberof atlas
 */

const atlasDataMethods = {
  getRasterResults: features =>
    features.filter(d => Object.prototype.hasOwnProperty.call(d.properties, 'SS_ID') &&
    d.source !== 'viewshed'),
  getNonRasterResults: features =>
    features.filter(d =>
      !Object.prototype.hasOwnProperty.call(d.properties, 'SS_ID') &&
      Object.prototype.hasOwnProperty.call(d.properties, 'Name') &&
      (d.geometry.type.includes('String') ||
        d.geometry.type.includes('Polygon')) &&
      d.source !== 'highlighted'),
};

export default atlasDataMethods;

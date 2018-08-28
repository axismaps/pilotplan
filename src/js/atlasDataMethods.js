const atlasDataMethods = {
  getRasterResults: features =>
    features.filter(d => Object.prototype.hasOwnProperty.call(d.properties, 'SS_ID') &&
    d.source !== 'viewshed'),
  getNonRasterResults: features =>
    features.filter(d =>
      !Object.prototype.hasOwnProperty.call(d.properties, 'SS_ID') &&
      Object.prototype.hasOwnProperty.call(d.properties, 'Name') &&
      d.source !== 'highlighted'),
};

export default atlasDataMethods;

import cleanData from './dataClean';

const loadData = (callback) => {
  Promise.all([
    d3.json('data/config.json'),
    d3.csv('data/raster.csv'),
    d3.json('data/ViewConesPoly.json'),
  ]).then((rawData) => {
    const data = cleanData(rawData);
    callback(data);
  });
};

export default loadData;

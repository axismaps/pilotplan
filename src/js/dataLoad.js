import cleanData from './dataClean';

const loadData = (callback) => {
  Promise.all([
    d3.json('data/config.json'),
    d3.json('data/ViewConesPoly.json'),
    d3.json('data/AerialExtents.json'),
    d3.json('data/MapExtents.json'),
    d3.json('data/PlanExtents.json'),
    d3.csv('data/translations.csv'),
  ]).then((rawData) => {
    const data = cleanData(rawData);
    callback(data);
  });
};

export default loadData;

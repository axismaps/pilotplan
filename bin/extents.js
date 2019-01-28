const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const turf = require('@turf/helpers');
const getBBox = require('@turf/bbox').default;

const config = {};
let uniqueYears = [];
let loaded = 0;
let total = 0;

function getYears(features) {
  let years = _.union(
    features.map(f => f.properties.FirstYear),
    features.map(f => f.properties.LastYear),
  );
  years = years.filter(y => y !== 8888);
  return years.sort();
}

function getFeaturesByYear(features, year) {
  return features.filter(f => f.properties.FirstYear <= year && f.properties.LastYear >= year);
}

function getExtents(features) {
  const collection = turf.featureCollection(features);
  return getBBox(collection);
}

function processFeatures(features, name, layer) {
  const years = getYears(features);
  const extents = {};
  years.forEach((y) => {
    extents[y] = getExtents(getFeaturesByYear(features, y));
  });
  if (!config[layer]) config[layer] = {};
  config[layer][name] = extents;
  uniqueYears = _.union(uniqueYears, years).sort();
}

function writeStatic(f) {
  fs.readFile(path.join(__dirname, '../data/geojson/geography', f), (err2, data) => {
    const layer = f.replace(/\.json$/, '');
    const { features } = JSON.parse(data);
    const subs = _.groupBy(features, feat => feat.properties.SubType);
    _.each(subs, (fArray, name) => {
      processFeatures(fArray, name, layer);
    });

    loaded += 1;
    if (loaded === total) {
      fs.writeFile(path.join(__dirname, '../src/data/extents.json'), JSON.stringify(config, null, 2), () => {
        console.log('EXTENTS FILE WRITTEN');
        fs.writeFile(path.join(__dirname, '../src/data/years.json'), JSON.stringify(uniqueYears, null, 2), () => {
          console.log('YEARS FILE WRITTEN');
        });
      });
    }
  });
}

fs.readdir(path.join(__dirname, '../data/geojson/geography'), (err, files) => {
  total = files.length;
  files.forEach(writeStatic);
});

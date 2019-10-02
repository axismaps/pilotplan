const fs = require('fs');
const getBBox = require('@turf/bbox').default;
const _ = require('underscore');

const processFile = (fileName) => {
  const path = 'data/geojson/visual/';
  fs.readFile(`${path}${fileName}`, (err, dataRaw) => {
    if (err) throw err;
    const data = JSON.parse(dataRaw);

    const cleanData = data.features.map((feature) => {
      let record = Object.assign({}, feature.properties);
      record = _.pick(record, [
        'Creator',
        'SS_ID',
        'Notes',
        'SSC_ID',
        'FirstYear',
        'LastYear',
        'Title',
        'CreditLine',
        'Repository',
      ]);
      record.bounds = getBBox(feature);
      return record;
    });

    fs.writeFile(`src/data/${fileName.replace('Poly', '')}`, JSON.stringify(cleanData), 'utf8', (err2) => {
      if (err2) throw err;
      console.log(`written file ${fileName.replace('Poly', '')}`);
    });
  });
};

processFile('AerialExtentsPoly.json');
processFile('MapExtentsPoly.json');
processFile('PlanExtentsPoly.json');

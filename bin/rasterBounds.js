const fs = require('fs');
const getBBox = require('@turf/bbox').default;

const processFile = (fileName) => {
  const path = 'data/geojson/visual/';
  fs.readFile(`${path}${fileName}`, (err, dataRaw) => {
    if (err) throw err;
    const data = JSON.parse(dataRaw);

    const cleanData = data.features.map((feature) => {
      const record = Object.assign({}, feature.properties);
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

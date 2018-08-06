const fs = require('fs');
const path = require('path');

const config = {};
let loaded = 0;

fs.readdir(path.join(__dirname, '../data/geojson'), (err, files) => {
  files.forEach((f) => {
    fs.readFile(path.join(__dirname, '../data/geojson', f), (err2, data) => {
      const name = f.replace(/\.json$/, '');
      const props = getProps(JSON.parse(data));

      const layer = {};
      layer.features = {};
      props.forEach((p) => {
        layer.startYear = layer.startYear ? Math.min(layer.startYear, p.FirstYear) : p.FirstYear;
        layer.endYear = layer.endYear ? Math.max(layer.endYear, p.LastYear) : p.LastYear;

        if (p.SubType) {
          const sub = p.SubType;
          if (!layer.features[sub]) layer.features[sub] = {};
          layer.features[sub].startYear = layer.features[sub].startYear ?
            Math.min(layer.features[sub].startYear, p.FirstYear) : p.FirstYear;
          layer.features[sub].endYear = layer.features[sub].endYear ?
            Math.min(layer.features[sub].startYear, p.LastYear) : p.LastYear;
        }
      });

      config[name] = layer;
      loaded += 1;
      if (loaded === files.length) console.log(config);
    });
  });
});

function getProps(json) {
  return json.features.map(f => f.properties);
}

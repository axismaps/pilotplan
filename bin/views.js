const fs = require('fs');
const path = require('path');
const _ = require('underscore');

fs.readFile(path.join(__dirname, '../data/geojson/visual/ViewConesPoly.json'), 'utf8', (err, data) => {
  const points = JSON.parse(data);
  const polys = JSON.parse(data);
  const csv = [];

  points.features = points.features.map((p) => {
    const feature = p;
    feature.geometry.type = 'Point';
    feature.geometry.coordinates = [
      parseFloat(p.properties.Longitude),
      parseFloat(p.properties.Latitude),
    ];
    feature.properties = _.pick(p.properties, ['SS_ID', 'FirstYear', 'LastYear']);
    return feature;
  });

  polys.features = polys.features.map((p) => {
    const feature = p;
    const props = _.omit(p.properties, ['StyleName', 'ScaleRank', 'Latitude', 'Longitude', 'Shape_Leng', 'Shape_Area']);
    csv.push(props);
    feature.properties = props;
    return feature;
  });

  fs.writeFileSync(path.join(__dirname, '../data/geojson/geography/ViewConesPoint.json'), JSON.stringify(points));
  fs.writeFileSync(path.join(__dirname, '../src/data/ViewConesPoly.json'), JSON.stringify(polys));
});

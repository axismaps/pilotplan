const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, '../data/geojson/geography'), (err, files) => {
  makeTile(files);
});

function makeTile(files) {
  const f = files.shift();
  const name = f.replace(/\..*/, '');

  if (name !== 'ParcelsPoly' && name !== 'BoundariesPoly') {
    const c = `tippecanoe -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le1 -x SHAPE_Area -Z 9 -aD -aG -ab -ai -f -o ${path.join(__dirname, `../data/tiles/${name}.mbtiles`)} ${path.join(__dirname, `../data/geojson/geography/${f}`)}`;

    const tpOut = exec(c, () => {
      if (files.length > 0) makeTile(files);
    });
    tpOut.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    tpOut.stderr.on('data', (data) => {
      console.log(data.toString());
    });
    tpOut.on('exit', (code) => {
      console.log(`child process exited with code ${code.toString()}`);
    });
  } else if (files.length > 0) {
    makeTile(files);
  }
}

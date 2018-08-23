const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, '../data/geojson/geography'), (err, files) => {
  files.forEach((f) => {
    const name = f.replace(/\..*/, '').toLowerCase();
    const c = `tippecanoe -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le1 -x SHAPE_Area -aD -aG -ab -ai -f -o ${path.join(__dirname, `../data/tiles/${name}.mbtiles`)} ${path.join(__dirname, `../data/geojson/geography/${f}`)}`;

    const tpOut = exec(c);
    tpOut.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    tpOut.stderr.on('data', (data) => {
      console.log(data.toString());
    });
    tpOut.on('exit', (code) => {
      console.log(`child process exited with code ${code.toString()}`);
    });

    const mbOut = exec(`mapbox upload axismaps.pilot-${name} ${path.join(__dirname, `../data/tiles/${name}.mbtiles`)}`);
    mbOut.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    mbOut.stderr.on('data', (data) => {
      console.log(data.toString());
    });
    mbOut.on('exit', (code) => {
      console.log(`child process exited with code ${code.toString()}`);
    });
  });
});

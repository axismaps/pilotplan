const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const mbxUploads = require('@mapbox/mapbox-sdk/services/uploads');

const uploadsClient = mbxUploads({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });

const getCredentials = file =>
  uploadsClient
    .createUploadCredentials()
    .send()
    .then((response) => {
      const cred = response.body;
      cred.file = file;
      return cred;
    });

const makeUpload = (credentials) => {
  const title = `pilot${credentials.file.replace(/.*\/(SSID)?/gi, '').replace(/\.mbtiles$/gi, '').toLowerCase()}`;
  uploadsClient
    .createUpload({
      mapId: `fdahdah.${title}`,
      url: credentials.url,
      tilesetName: `PilotPlan - SSID${title}`,
    })
    .send()
    .then((response) => {
      console.log(response.body);
    })
    .catch((err) => {
      console.log(err);
    });
};

const putFileOnS3 = (credentials) => {
  const s3 = new AWS.S3({
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    sessionToken: credentials.sessionToken,
    region: 'us-east-1',
  });

  return s3.putObject({
    Bucket: credentials.bucket,
    Key: credentials.key,
    Body: fs.createReadStream(credentials.file),
  }).promise()
    .then(() => makeUpload(credentials));
};

async function uploadTiffs(tiffs) {
  for (const t of tiffs) { // eslint-disable-line no-restricted-syntax
    if (t.match(/\.mbtiles$/)) {
      await getCredentials(t).then(putFileOnS3).catch((err) => { console.log(err); }); // eslint-disable-line no-await-in-loop, max-len
    }
  }
}

let tiffs = fs.readdirSync(path.join(__dirname, '../data/geotiff/converted'));
tiffs = tiffs.map(t => path.join(__dirname, '../data/geotiff/converted/', t));
uploadTiffs(tiffs);

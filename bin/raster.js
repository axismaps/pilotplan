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

const makeUpload = (credentials) => {
  const title = `pilot${credentials.file.replace(/.*\/(SSID)?/gi, '').replace(/\.tif$/gi, '').toLowerCase()}`;
  uploadsClient
    .createUpload({
      mapId: `axismaps.${title}`,
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

async function uploadTiffs(tiffs) {
  for (const t of tiffs) { // eslint-disable-line no-restricted-syntax
    await getCredentials(t).then(putFileOnS3).catch((err) => { console.log(err); }); // eslint-disable-line no-await-in-loop, max-len
  }
}

const dirs = fs.readdirSync(path.join(__dirname, '../data/geotiff/'));
dirs.forEach((d) => {
  if (!d.match(/^\./)) {
    let tiffs = fs.readdirSync(path.join(__dirname, '../data/geotiff/', d));
    tiffs = tiffs.map(t => path.join(__dirname, '../data/geotiff/', d, t));
    uploadTiffs(tiffs);
  }
});

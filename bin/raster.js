const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const mbxUploads = require('@mapbox/mapbox-sdk/services/uploads');

const uploadsClient = mbxUploads({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });

const file = path.join(__dirname, '../data/geotiff/plans/SSID15585657.tif');

const getCredentials = () =>
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
    .then(() => makeUpload(credentials))
    .then(v => console.log(v));
};

const makeUpload = (credentials) => {
  const title = `pilot${credentials.file.replace(/.*\/(SSID)?/gi, '').replace(/\.tif$/gi, '').toLowerCase()}`;
  uploadsClient
    .createUpload({
      mapId: `axismaps.${title}`,
      url: credentials.url,
    })
    .send()
    .then((response) => {
      console.log(response.body);
      return response.body;
    });
};

getCredentials().then(putFileOnS3);

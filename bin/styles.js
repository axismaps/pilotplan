const fs = require('fs');
const path = require('path');
const mbxStyles = require('@mapbox/mapbox-sdk/services/styles');

const stylesClient = mbxStyles({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });

stylesClient.getStyle({ styleId: process.env.MAPBOX_STYLE })
  .send()
  .then((response) => {
    const style = response.body;
    fs.writeFile(path.join(__dirname, '../src/data/style.json'), JSON.stringify(style, null, 2), () => {
      console.log('NEW STYLE WRITTEN');
    });
  });

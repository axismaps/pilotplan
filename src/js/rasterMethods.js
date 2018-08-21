const rasterMethods = {
  getScaledCircleDim({ width, height, maxDim }) {
    if (width > height) {
      return {
        height: maxDim,
        width: width * (maxDim / height),
      };
    }
    return {
      height: height * (maxDim / width),
      width: maxDim,
    };
  },
  getImageUrl({ scaledDim, metadata }) {
    const { width, height } = scaledDim;
    const { imageServer, imageUrl } = metadata;
    return `${imageServer.replace('http', 'https')}${imageUrl}&&wid=${width}&hei=${height}&rgnn=0,0,1,1&cvt=JPEG`;
  },
  getMetadata(data, callback) {
    const { SSC_ID } = data;

    d3.json(`https://www.sscommons.org/openlibrary/secure/imagefpx/${SSC_ID}/7731141/5`)
      .then((metadata) => {
        // console.log('metadata', metadata[0]);
        callback(metadata[0]);
      });
  },
  setRasterBackground({ selection, url }) {
    selection
      .styles({
        'background-image': `url("${url}")`,
        'background-size': 'cover',
      });
  },
  setBackgroundFromAPI({ metadata, maxDim, selection }) {
    const {
      getScaledCircleDim,
      getImageUrl,
      setRasterBackground,
    } = rasterMethods;

    const { width, height } = metadata;

    const scaledDim = getScaledCircleDim({
      width,
      height,
      maxDim,
    });

    const url = getImageUrl({
      scaledDim,
      metadata,
    });

    setRasterBackground({
      url,
      selection,
    });
  },
  setEachRasterBackground({
    images,
    cachedMetadata,
  }) {
    const {
      getMetadata,
      setBackgroundFromAPI,
    } = rasterMethods;
    let maxDim;
    images.each(function addData(d, i) {
      if (i === 0) {
        maxDim = this.getBoundingClientRect().width;
      }
      const selection = d3.select(this);
      if (cachedMetadata.has(d.SS_ID)) {
        const metadata = cachedMetadata.get(d.SS_ID);
        setBackgroundFromAPI({
          metadata,
          maxDim,
          selection,
        });
      } else {
        getMetadata(d, (metadata) => {
          cachedMetadata.set(d.SS_ID, metadata);
          setBackgroundFromAPI({
            metadata,
            maxDim,
            selection,
          });
        });
      }
    });
  },
  getRasterCategories({ rasterData }) {
    const rasterCategories = [];
    rasterData.forEach((val, key) => {
      rasterCategories.push(key);
    });
    return rasterCategories;
  },
  getRasterDataByCategory({ rasterData }) {
    const data = [];
    rasterData.forEach((values, key) => {
      if (values.length > 0) {
        data.push({
          values,
          key,
        });
      }
    });
    return data;
  },
  getFlattenedRasterData({ rasterData }) {
    const data = [];
    rasterData.forEach((values, key) => {
      values.forEach((value) => {
        const valueCopy = Object.assign({}, value);
        valueCopy.category = key;
        data.push(valueCopy);
      });
    });
    return data;
  },
};

export default rasterMethods;

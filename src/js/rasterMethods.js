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
  getScaledCircleDimFromMetadata({
    metadata,
    maxDim,
  }) {
    const { getScaledCircleDim } = rasterMethods;
    const { width, height } = metadata;
    return getScaledCircleDim({ width, height, maxDim });
  },
  getWidthLimitedDim({ width, height, maxWidth }) {
    return {
      width: maxWidth,
      height: height * (maxWidth / width),
    };
  },
  getWidthLImitedDimFromMetadata({ metadata, maxWidth }) {
    const { getWidthLimitedDim } = rasterMethods;
    const { width, height } = metadata;
    return getWidthLimitedDim({
      width,
      height,
      maxWidth,
    });
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
        callback(metadata[0]);
      })
      .catch((err) => {
        console.log(`Error: ${err.message}`);
      });
  },
  setRasterBackground({ selection, url }) {
    selection
      .styles({
        'background-image': `url("${url}")`,
        'background-size': 'cover',
      });
  },
  setBackgroundFromMetadata({
    metadata,
    scaledDim,
    selection,
    resizeContainer = false,
  }) {
    const {
      getImageUrl,
      setRasterBackground,
    } = rasterMethods;

    const url = getImageUrl({
      scaledDim,
      metadata,
    });

    setRasterBackground({
      url,
      selection,
    });

    if (resizeContainer) {
      selection
        .styles({
          width: `${scaledDim.width}px`,
          height: `${scaledDim.height}px`,
        });
    }
  },
  setBackgroundToContainerWidth({
    cachedMetadata,
    selection,
    currentRasterProbe,
    resizeContainer,
  }) {
    const {
      setBackgroundFromMetadata,
      getWidthLImitedDimFromMetadata,
    } = rasterMethods;
    const maxWidth = selection
      .node()
      .getBoundingClientRect()
      .width;

    const { getMetadata } = rasterMethods;
    if (cachedMetadata.has(currentRasterProbe.SS_ID)) {
      const metadata = cachedMetadata.get(currentRasterProbe.SS_ID);
      const scaledDim = getWidthLImitedDimFromMetadata({
        maxWidth,
        metadata,
      });
      setBackgroundFromMetadata({
        metadata,
        scaledDim,
        selection,
        resizeContainer,
      });
    } else {
      getMetadata(currentRasterProbe, (metadata) => {
        const scaledDim = getWidthLImitedDimFromMetadata({
          maxWidth,
          metadata,
        });
        setBackgroundFromMetadata({
          metadata,
          scaledDim,
          selection,
          resizeContainer,
        });
      });
    }
  },
  setEachRasterBackground({
    images,
    cachedMetadata,
  }) {
    const {
      getMetadata,
      setBackgroundFromMetadata,
      getScaledCircleDimFromMetadata,
    } = rasterMethods;
    let maxDim;

    // console.log('imagedata', images.data().filter(d => d.SSC_ID === ''));
    images.each(function addData(d, i) {
      if (i === 0) {
        maxDim = this.getBoundingClientRect().width;
      }

      const selection = d3.select(this);
      if (cachedMetadata.has(d.SS_ID)) {
        const metadata = cachedMetadata.get(d.SS_ID);

        const scaledDim = getScaledCircleDimFromMetadata({
          metadata,
          maxDim,
        });

        setBackgroundFromMetadata({
          metadata,
          scaledDim,
          selection,
        });
      } else {
        getMetadata(d, (metadata) => {
          const scaledDim = getScaledCircleDimFromMetadata({
            metadata,
            maxDim,
          });

          cachedMetadata.set(d.SS_ID, metadata);
          setBackgroundFromMetadata({
            metadata,
            scaledDim,
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

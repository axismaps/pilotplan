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
  getScaledDim({
    width,
    height,
    maxWidth,
    maxHeight,
  }) {
    const scaledHeight = height * (maxWidth / width);
    const heightLimited = maxHeight !== undefined && scaledHeight > maxHeight;
    return {
      width: heightLimited ? maxWidth * (maxHeight / scaledHeight) : maxWidth,
      height: heightLimited ? maxHeight : scaledHeight,
    };
  },
  getScaledDimFromMetadata({ metadata, maxWidth, maxHeight }) {
    const { getScaledDim } = rasterMethods;
    const { width, height } = metadata;
    return getScaledDim({
      width,
      height,
      maxWidth,
      maxHeight,
    });
  },
  getImageUrl({ scaledDim, metadata }) {
    const { width, height } = scaledDim;
    const { imageServer, imageUrl } = metadata;
    return `${imageServer.replace('http', 'https')}${imageUrl}&&wid=${width}&hei=${height}&rgnn=0,0,1,1&cvt=JPEG`;
  },
  getMetadata({ data }, callback) {
    const { SSC_ID } = data;
    d3.json(`https://www.sscommons.org/openlibrary/secure/imagefpx/${SSC_ID}/7731141/5`)
      .then((metadata) => {
        callback(metadata[0]);
      })
      .catch((err) => {
        console.log(`Error: ${err.message}`);
      });
  },
  getSharedShelfURL({ currentRasterProbe }, callback) {
    d3.html(`https://www.sscommons.org/openlibrary/secure/metadata/${currentRasterProbe.SSC_ID}?_method=FpHtml`)
      .then((data) => {
        let url;
        const nodes = d3.select(data).selectAll('.data');
        const length = nodes.size();

        nodes.each(function test(d, i) {
          if (i === length - 1) {
            const inner = d3.select(this).node().innerHTML;
            const t = '<wbr>';
            const slice1 = inner.slice(inner.indexOf(t) + t.length);
            const slice2 = slice1.slice(0, slice1.indexOf(t));
            url = `https://www.sscommons.org/openlibrary/ExternalIV.jsp?objectId=${slice2}`;
          }
        });
        callback(url);
      });
  },
  addSharedShelfLinkToSelection({
    currentRasterProbe,
    cachedSharedShelfURLs,
    selection,
  }) {
    const {
      getSharedShelfURL,
    } = rasterMethods;
    if (cachedSharedShelfURLs.has(currentRasterProbe.SS_ID)) {
      const url = cachedSharedShelfURLs.get(currentRasterProbe.SS_ID);
      selection.on('click', () => {
        window.open(url, '_blank');
      });
    } else {
      getSharedShelfURL({ currentRasterProbe }, (url) => {
        cachedSharedShelfURLs.set(currentRasterProbe.SS_ID, url);
        selection.on('click', () => {
          window.open(url, '_blank');
        });
      });
    }
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
    maxHeight,
    maxWidth,
  }) {
    const {
      setBackgroundFromMetadata,
      getScaledDimFromMetadata,
    } = rasterMethods;

    const { getMetadata } = rasterMethods;
    if (cachedMetadata.has(currentRasterProbe.SS_ID)) {
      const metadata = cachedMetadata.get(currentRasterProbe.SS_ID);
      const scaledDim = getScaledDimFromMetadata({
        maxWidth,
        metadata,
        maxHeight,
      });
      setBackgroundFromMetadata({
        metadata,
        scaledDim,
        selection,
        resizeContainer,
      });
    } else {
      getMetadata({ data: currentRasterProbe }, (metadata) => {
        const scaledDim = getScaledDimFromMetadata({
          maxWidth,
          metadata,
          maxHeight,
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
    maxDim,
    spinner = false,
  }) {
    const {
      getMetadata,
      setBackgroundFromMetadata,
      getScaledCircleDimFromMetadata,
    } = rasterMethods;

    images.each(function addData(d) {
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
        if (spinner) {
          selection
            .append('i')
            .attr('class', 'icon-spinner animate-spin');
        }

        getMetadata({ data: d }, (metadata) => {
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
          if (spinner) {
            selection.selectAll('.icon-spinner').remove();
          }
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
  getRasterFromSSID({ rasterData, SS_ID }) {
    const { getFlattenedRasterData } = rasterMethods;
    const flattenedRaster = getFlattenedRasterData({ rasterData });

    return flattenedRaster.find(d => d.SS_ID === SS_ID);
  },
  onRasterClick({ rasterData, state }) {
    const getId = d => (d === null ? null : d.SS_ID);
    const currentView = state.get('currentView');
    const currentOverlay = state.get('currentOverlay');
    if (rasterData.type === 'overlay') {
      if (getId(currentOverlay) === getId(rasterData)) {
        state.update({
          currentOverlay: null,
          currentRasterProbe: currentView === null ? null : currentView,
        });
      } else {
        state.update({
          currentOverlay: rasterData,
          currentRasterProbe: currentView === null ? rasterData : currentView,
        });
      }
    } else if (rasterData.type === 'view') {
      if (getId(currentView) === getId(rasterData)) {
        state.update({
          currentView: null,
          currentRasterProbe: null,
        });
      } else {
        state.update({
          currentView: rasterData,
          currentRasterProbe: rasterData,
        });
      }
    }
  },
};

export default rasterMethods;

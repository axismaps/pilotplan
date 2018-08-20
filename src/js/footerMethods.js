const footerMethods = {
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
    } = footerMethods;

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
    } = footerMethods;
    let maxDim;
    images.each(function addData(d, i) {
      if (i === 0) {
        maxDim = this.getBoundingClientRect().width;
      }
      const selection = d3.select(this);
      // console.log('cache', cachedMetadata.size);
      if (cachedMetadata.has(d.SS_ID)) {
        // console.log('use cached');
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
  drawRasters({
    rasterData,
    imagesContainer,
    onRasterClick,
    footerView,
    cachedMetadata,
  }) {
    const {
      setEachRasterBackground,
    } = footerMethods;

    // console.log(rasterData.get(footerView));
    const images = imagesContainer.selectAll('.footer__image')
      .data(rasterData.get(footerView), d => d.SS_ID);

    const newImages = images
      .enter()
      .append('div')
      .attr('class', 'footer__image')
      .on('click', onRasterClick);

    setEachRasterBackground({
      images: newImages,
      cachedMetadata,
    });

    images.exit().remove();

    return newImages.merge(images);
  },
  drawCategoryButtons({
    rasterCategories,
    categoriesContainer,
    onCategoryClick,
  }) {
    console.log('categories', rasterCategories);
    return categoriesContainer
      .selectAll('.footer__category')
      .data(rasterCategories)
      .enter()
      .append('div')
      .attr('class', 'footer__category')
      .html((d) => {
        const icons = {
          views: 'icon-camera',
          aerials: 'icon-flight',
          maps: 'icon-map-o',
          plans: 'icon-tsquare',
        };

        return `<i class="${icons[d]}"></i>`;
      })
      .on('click', onCategoryClick);
  },
};

export default footerMethods;

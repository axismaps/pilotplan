const footerMethods = {
  getScaledCircleDim({ width, height, maxDim }) {
    console.log('raw', width, height, maxDim);
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
  drawRasters({
    rasterData,
    imagesContainer,
    onRasterClick,
    footerView,
  }) {
    const {
      getMetadata,
      getScaledCircleDim,
      getImageUrl,
      setRasterBackground,
    } = footerMethods;
    // console.log(rasterData.get(footerView));
    const images = imagesContainer.selectAll('.footer__image')
      .data(rasterData.get(footerView), d => d.SS_ID);

    const newImages = images
      .enter()
      .append('div')
      .attr('class', 'footer__image')
      .on('click', onRasterClick);
    let maxDim;
    newImages.each(function addData(d, i) {
      if (i === 0) {
        maxDim = this.getBoundingClientRect().width;
      }
      getMetadata(d, (metadata) => {
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
          selection: d3.select(this),
        });
      });
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

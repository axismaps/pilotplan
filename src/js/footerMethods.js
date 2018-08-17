const footerMethods = {
  drawRasters({
    rasterData,
    imagesContainer,
    onRasterClick,
    footerView,
  }) {
    const images = imagesContainer.selectAll('.footer__image')
      .data(rasterData[footerView]);

    const newImages = images
      .enter()
      .append('div')
      .attr('class', 'footer__image')
      .on('click', onRasterClick);

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

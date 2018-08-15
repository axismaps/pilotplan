const footerMethods = {
  drawRasters({
    rasterData,
    imagesContainer,
    onRasterClick,
  }) {
    const images = imagesContainer.selectAll('.footer__image')
      .data(rasterData);

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
      .text('x')
      .on('click', onCategoryClick);
  },
};

export default footerMethods;

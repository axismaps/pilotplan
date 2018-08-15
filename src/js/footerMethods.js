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
};

export default footerMethods;

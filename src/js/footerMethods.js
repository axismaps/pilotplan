import rasterMethods from './rasterMethods';
import { footerCategoryIcons } from './config';

const footerMethods = {


  drawRasters({
    rasterData,
    imagesContainer,
    onRasterClick,
    footerView,
    cachedMetadata,
  }) {
    const {
      setEachRasterBackground,
    } = rasterMethods;

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
      maxDim: 130,
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
    return categoriesContainer
      .selectAll('.footer__category')
      .data(rasterCategories)
      .enter()
      .append('div')
      .attr('class', 'footer__category')
      .html(d => `<i class="${footerCategoryIcons[d]}"></i>`)
      .on('click', onCategoryClick);
  },
};

export default footerMethods;

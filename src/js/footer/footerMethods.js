import rasterMethods from '../rasterProbe/rasterMethods';
import getProbeConfig from '../dataProbe/dataProbeGetConfig';
import { footerCategoryIcons } from '../config';

const footerMethods = {


  drawRasters({
    rasterData,
    imagesContainer,
    onRasterClick,
    footerView,
    cachedMetadata,
    dataProbe,
  }) {
    const {
      setEachRasterBackground,
    } = rasterMethods;

    const images = imagesContainer.selectAll('.footer__image')
      .data(rasterData.get(footerView), d => d.SS_ID);

    const newImages = images
      .enter()
      .append('div')
      .attr('class', 'footer__image')
      .on('click', onRasterClick)
      .on('mouseover', function drawProbe(d) {
        const config = getProbeConfig({
          data: d,
          selection: d3.select(this),
          leader: true,
        });
        dataProbe
          .config(config)
          .draw();
      })
      .on('mouseout', () => {
        dataProbe.remove();
      });

    setEachRasterBackground({
      images: newImages,
      maxDim: 130,
      cachedMetadata,
      spinner: true,
    });

    images.exit().remove();

    return newImages.merge(images);
  },
  drawToggleRasters({
    rasterData,
    footerToggleRastersContainer,
    cachedMetadata,
  }) {
    const {
      getFlattenedRasterData,
      setEachRasterBackground,
    } = rasterMethods;
    const toggleRasterData = getFlattenedRasterData({ rasterData }).slice(0, 3);

    const images = footerToggleRastersContainer
      .selectAll('.footer__toggle-image')
      .data(toggleRasterData, d => d.SS_ID);

    const newImages = images
      .enter()
      .append('div')
      .attr('class', 'footer__toggle-image');

    images.exit().remove();

    setEachRasterBackground({
      images: newImages,
      maxDim: 20,
      cachedMetadata,
    });
  },
  drawCategoryButtons({
    rasterCategories,
    container,
    onClick,
  }) {
    return container
      .selectAll('.footer__category')
      .data(rasterCategories)
      .enter()
      .append('div')
      .attr('class', 'footer__category')
      .html(d => `<i class="${footerCategoryIcons[d]}"></i>`)
      .on('click', onClick);
  },
  drawMobileCategoryButtons({
    container,
    rasterCategories,
    onClick,
  }) {
    return container
      .selectAll('.footer__category')
      .data(rasterCategories)
      .enter()
      .append('div')
      .attr('class', 'mobileFooter__category')
      .html(d => `<i class="${footerCategoryIcons[d]}"></i>`)
      .on('click', onClick);
  },
};

export default footerMethods;

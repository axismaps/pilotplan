import rasterMethods from './rasterMethods';
import getProbeConfig from './footerDataProbeMethods';
import { footerCategoryIcons } from './config';

const {
  setEachRasterBackground,
  getRasterDataByCategory,
} = rasterMethods;

const allRasterMethods = {
  setAllRasterBackgroundClick({
    allRasterInnerContainer,
    allRasterOuterContainer,
    onAllRasterCloseClick,
  }) {
    allRasterOuterContainer.on('click', onAllRasterCloseClick);
    allRasterInnerContainer.on('click', () => {
      d3.event.stopPropagation();
    });
  },
  drawAllRasterCategories({
    rasterData,
    allRasterContentContainer,
  }) {
    const data = getRasterDataByCategory({ rasterData });

    const allRasterSections = allRasterContentContainer
      .selectAll('.allraster__section')
      .data(data, d => d.key);

    const newSections = allRasterSections
      .enter()
      .append('div')
      .attr('class', 'allraster__section');

    allRasterSections.exit().remove();

    return {
      newAllRasterSections: newSections,
      allRasterSections: newSections.merge(allRasterSections),
    };
  },
  drawAllRasterTitles({
    newAllRasterSections,
  }) {
    const titles = newAllRasterSections
      .append('div')
      .attr('class', 'allraster__title');

    titles.append('i')
      .attr('class', d => footerCategoryIcons[d.key]);

    titles
      .append('div')
      .attr('class', 'allraster__title-text')
      .text(d => d.key);
  },
  drawAllRasterImageBlocks({
    newAllRasterSections,
  }) {
    return newAllRasterSections
      .append('div')
      .attr('class', 'allraster__image-block');
  },
  drawAllRasterImages({
    allRasterSections,
    onRasterClick,
    cachedMetadata,
    onAllRasterCloseClick,
    dataProbe,
  }) {
    allRasterSections.each(function drawRasters(d) {
      const block = d3.select(this).select('.allraster__image-block');
      const images = block.selectAll('.footer__image')
        .data(d.values, dd => dd.SS_ID);

      const newImages = images
        .enter()
        .append('div')
        .attr('class', 'footer__image allraster__image')
        .on('click', (dd) => {
          onRasterClick(dd);
          onAllRasterCloseClick();
        })
        .on('mouseover', function drawProbe(dd) {
          // const config = getProbeConfig.call(this, dd);
          const config = getProbeConfig({
            selection: d3.select(this),
            data: dd,
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
        cachedMetadata,
        maxDim: 130,
        spinner: true,
      });

      images.exit().remove();
    });
  },
};

export default allRasterMethods;

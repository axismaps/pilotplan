import footerMethods from './footerMethods';

const { setEachRasterBackground } = footerMethods;

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
    const data = [];
    rasterData.forEach((values, key) => {
      if (values.length > 0) {
        data.push({
          values,
          key,
        });
      }
    });
    console.log('data', data);
    // allRasterContentContainer.selectAll('.allraster__section').remove();
    const allRasterSections = allRasterContentContainer
      .selectAll('.allraster__section')
      .data(data, d => d.key);

    const newSections = allRasterSections
      .enter()
      .append('div')
      .attr('class', 'allraster__section');

    allRasterSections.exit().remove();

    return newSections;
  },
  drawAllRasterTitles({
    allRasterSections,
  }) {
    allRasterSections
      .append('div')
      .attr('class', 'allraster__title')
      .text(d => d.key);
  },
  drawAllRasterImageBlocks({
    allRasterSections,
  }) {
    return allRasterSections
      .append('div')
      .attr('class', 'allraster__image-block');
  },
  drawAllRasterImages({
    allRasterImageBlocks,
    onRasterClick,
    cachedMetadata,
  }) {
    allRasterImageBlocks.each(function drawRasters(d) {
      const block = d3.select(this);
      const images = block.selectAll('.footer__image')
        .data(d.values);

      const newImages = images
        .enter()
        .append('div')
        .attr('class', 'footer__image allraster__image')
        .on('click', (dd) => {
          onRasterClick(dd);
        });

      setEachRasterBackground({
        images: newImages,
        cachedMetadata,
      });

      images.exit().remove();

      console.log(d);
    });
  },
};

export default allRasterMethods;

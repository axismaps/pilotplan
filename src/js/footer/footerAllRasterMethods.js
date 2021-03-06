/**
 * Module comprises pure functions for displaying the 'show all' raster screen
 * (raster thumbnail lightbox)
 * @module footerAllRasterMethods
 * @memberof footer
 */

import rasterMethods from '../rasterProbe/rasterMethods';
import getProbeConfig from '../dataProbe/dataProbeGetConfig';
import { footerCategoryIcons } from '../config/config';

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
  setAllRasterCloseButton({
    allRasterCloseButton,
    onAllRasterCloseClick,
  }) {
    allRasterCloseButton.on('click', onAllRasterCloseClick);
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

    const titleTextBlock = titles
      .append('div')
      .attr('class', 'allraster__title-text-block');

    titleTextBlock.append('i')
      .attr('class', d => footerCategoryIcons[d.key]);

    titleTextBlock
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
    mobile,
  }) {
    allRasterSections.each(function drawRasters(d) {
      const block = d3.select(this).select('.allraster__image-block');
      const images = block.selectAll('.footer__image')
        .data(d.values, dd => dd.SS_ID);

      const newImages = images
        .enter()
        .append('div')
        .attr('class', 'footer__image allraster__image')
        .classed('allraster__image--mobile', mobile)
        .on('click', (dd) => {
          onRasterClick(dd);
          onAllRasterCloseClick();
        })
        .on('mouseover', function drawProbe(dd) {
          if (mobile) return;
          const config = getProbeConfig({
            selection: d3.select(this),
            data: dd,
            leader: true,
          });
          dataProbe
            .config(config)
            .draw();
        })
        .on('mouseout', () => {
          if (mobile) return;
          dataProbe.remove();
        });

      setEachRasterBackground({
        images: newImages,
        cachedMetadata,
        maxDim: mobile ? 90 : 130,
        spinner: true,
      });

      images.exit().remove();
    });
  },
  scrollToCategory({
    category,
    getAllRasterSections,
    allRasterInnerContainer,
  }) {
    /* eslint-disable no-param-reassign */
    const sections = getAllRasterSections();

    allRasterInnerContainer
      .node()
      .scrollTop = 0;

    const positions = {};

    sections.each(function getPosition(d) {
      positions[d.key] = this.getBoundingClientRect();
    });

    allRasterInnerContainer
      .node()
      .scrollTop = positions[category].top - 20;
    /* eslint-enable no-param-reassign */
  },
};

export default allRasterMethods;

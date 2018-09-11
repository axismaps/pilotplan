import rasterMethods from './rasterMethods';
import { footerCategoryIcons } from './config';

const footerMethods = {


  drawRasters({
    rasterData,
    imagesContainer,
    onRasterClick,
    footerView,
    cachedMetadata,
    dataProbe,
    footerContainer,
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
      .on('click', onRasterClick)
      .on('mouseover', function drawProbe(d) {
        console.log(d3.event);
        const image = d3.select(this);
        const imagePos = image.node().getBoundingClientRect();
        const footerHeight = footerContainer.node().getBoundingClientRect().height;
        const imageLeft = imagePos.left;
        const imageWidth = imagePos.width;
        // const containerHeight = window.innerHeight;
        console.log('d', d);
        const html = `
          ${d.Title}
        `;

        dataProbe.config({
          pos: {
            left: imageLeft + (imageWidth / 2),
            bottom: footerHeight - 5,
          },
          html,
        })
          .draw();
      })
      .on('mouseout', () => {
        dataProbe.remove();
      });

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

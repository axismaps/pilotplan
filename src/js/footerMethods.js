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
        const image = d3.select(this);
        const imagePos = image.node().getBoundingClientRect();
        const footerHeight = footerContainer.node().getBoundingClientRect().height;
        const imageLeft = imagePos.left;
        const imageWidth = imagePos.width;
        console.log('imagepos', imagePos);
        let html = [
          d.Title !== '' ? d.Title : d.Creator,
          d.FirstYear === d.LastYear ? d.FirstYear : `${d.FirstYear} - ${d.LastYear}`,
        ].reduce((accumulator, value) => {
          if (value !== '' && value !== undefined) {
            const row = `
              <div class="data-probe__row">${value}</div>
            `;
            return accumulator + row;
          }
          return accumulator;
        }, '');

        html += '<div class="data-probe__row data-probe__click-row">Click to view on map</div>';
        const probeWidth = 200;
        dataProbe.config({
          pos: {
            left: imageLeft + ((imageWidth / 2) - (probeWidth / 2)),
            bottom: (window.innerHeight - imagePos.top) + 15,
            width: probeWidth,
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

import methods from './footerMethods';

const privateProps = new WeakMap();


const privateMethods = {
  initCategoryButtons() {
    const props = privateProps.get(this);
    const {
      rasterCategories,
      categoriesContainer,
      onCategoryClick,
    } = props;
    const { drawCategoryButtons } = methods;

    props.categoryButtons = drawCategoryButtons({
      rasterCategories,
      categoriesContainer,
      onCategoryClick,
    });
  },
};

class Footer {
  constructor(config) {
    privateProps.set(this, {
      categoriesContainer: d3.select('.footer__categories'),
      imagesContainer: d3.select('.footer__images'),
      showAllContainer: d3.select('.footer__show-all'),
      rasterData: null,
      rasterCategories: null,
      footerView: null,
    });

    const {
      initCategoryButtons,
    } = privateMethods;

    this.config(config);

    initCategoryButtons.call(this);
    this.updateFooterView();
    this.updateRasterData();
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
  updateRasterData() {
    const props = privateProps.get(this);
    const {
      rasterData,
      imagesContainer,
      onRasterClick,
    } = props;

    const {
      drawRasters,
    } = methods;
    // console.log('raster data', rasterData);
    props.rasters = drawRasters({
      rasterData,
      imagesContainer,
      onRasterClick,
    });

    return this;
  }
  updateFooterView() {
    const {
      categoryButtons,
      footerView,
    } = privateProps.get(this);

    categoryButtons
      .classed('footer__category--selected', d => d === footerView);

    return this;
  }
}

export default Footer;

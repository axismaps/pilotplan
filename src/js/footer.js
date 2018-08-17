import methods from './footerMethods';
import allRasterMethods from './FooterAllRasterMethods';

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
  initAllRasterButton() {
    const props = privateProps.get(this);
    const {
      showAllContainer,
      onAllRasterClick,
    } = props;
    showAllContainer.on('click', onAllRasterClick);
  },
  drawRasters() {
    const props = privateProps.get(this);
    const {
      rasterData,
      imagesContainer,
      onRasterClick,
      footerView,
      cachedMetadata,
    } = props;

    const {
      drawRasters,
    } = methods;

    props.rasters = drawRasters({
      rasterData,
      imagesContainer,
      onRasterClick,
      footerView,
      cachedMetadata,
    });
  },
  updateFooterView() {
    const {
      categoryButtons,
      footerView,
    } = privateProps.get(this);

    categoryButtons
      .classed('footer__category--selected', d => d === footerView);
  },
  setAllRasterBackgroundClick() {
    const {
      allRasterInnerContainer,
      allRasterOuterContainer,
      onAllRasterCloseClick,
    } = privateProps.get(this);

    const { setAllRasterBackgroundClick } = allRasterMethods;

    setAllRasterBackgroundClick({
      allRasterInnerContainer,
      allRasterOuterContainer,
      onAllRasterCloseClick,
    });
  },
};

class Footer {
  constructor(config) {
    privateProps.set(this, {
      categoriesContainer: d3.select('.footer__categories'),
      imagesContainer: d3.select('.footer__images'),
      showAllContainer: d3.select('.footer__show-all'),
      allRasterOuterContainer: d3.select('.allraster__outer'),
      allRasterInnerContainer: d3.select('.allraster__inner'),
      allRasterContentContainer: d3.select('.allraster__content'),
      onAllRasterCloseClick: null,
      rasterData: null,
      rasterCategories: null,
      footerView: null,
      cachedMetadata: null,
    });

    const {
      initCategoryButtons,
      initAllRasterButton,
      setAllRasterBackgroundClick,
    } = privateMethods;

    this.config(config);

    initCategoryButtons.call(this);
    initAllRasterButton.call(this);
    setAllRasterBackgroundClick.call(this);
    this.updateFooterView();
    this.updateRasterData();
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
  updateRasterData() {
    const {
      drawRasters,
    } = privateMethods;

    // clearCachedMetadata.call(this);
    drawRasters.call(this);
    return this;
  }
  updateFooterView() {
    const {
      updateFooterView,
      drawRasters,
    } = privateMethods;

    updateFooterView.call(this);
    drawRasters.call(this);
    return this;
  }
}

export default Footer;

import methods from './footerMethods';
import allRasterMethods from './footerAllRasterMethods';
import rasterMethods from './rasterMethods';
import { selections } from './config';

const privateProps = new WeakMap();


const privateMethods = {
  initCategoryButtons() {
    const props = privateProps.get(this);
    const {
      rasterData,
      categoriesContainer,
      onCategoryClick,
    } = props;
    const {
      drawCategoryButtons,
    } = methods;
    const {
      getRasterCategories,
    } = rasterMethods;

    props.categoryButtons = drawCategoryButtons({
      rasterCategories: getRasterCategories({ rasterData }),
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
      getRasterDataByCategory,
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
      rasterData,
    } = privateProps.get(this);

    categoryButtons
      .classed('footer__category--selected', d => d === footerView)
      .classed('footer__category--disabled', d => rasterData.get(d).length === 0);
  },
  drawAllRaster() {
    const props = privateProps.get(this);
    const {
      allRasterInnerContainer,
      allRasterOuterContainer,
      onAllRasterCloseClick,
      firstAllRasterLoad,
      allRasterContentContainer,
      rasterData,
      onRasterClick,
      cachedMetadata,
    } = props;

    const {
      setAllRasterBackgroundClick,
      drawAllRasterCategories,
      drawAllRasterTitles,
      drawAllRasterImageBlocks,
      drawAllRasterImages,
    } = allRasterMethods;

    if (firstAllRasterLoad) {
      setAllRasterBackgroundClick({
        allRasterInnerContainer,
        allRasterOuterContainer,
        onAllRasterCloseClick,
        firstAllRasterLoad,
      });
    }

    const allRasterSections = drawAllRasterCategories({
      rasterData,
      allRasterContentContainer,
    });

    drawAllRasterTitles({
      allRasterSections,
    });

    const allRasterImageBlocks = drawAllRasterImageBlocks({
      allRasterSections,
    });

    drawAllRasterImages({
      allRasterImageBlocks,
      onRasterClick,
      cachedMetadata,
      onAllRasterCloseClick,
    });

    props.firstAllRasterLoad = false;
  },
};

class Footer {
  constructor(config) {
    const {
      categoriesContainer,
      imagesContainer,
      showAllContainer,
      allRasterOuterContainer,
      allRasterInnerContainer,
      allRasterContentContainer,
    } = selections;

    privateProps.set(this, {
      categoriesContainer,
      imagesContainer,
      showAllContainer,
      allRasterOuterContainer,
      allRasterInnerContainer,
      allRasterContentContainer,
      allRasterOpen: false,
      onAllRasterCloseClick: null,
      rasterData: null,
      footerView: null,
      cachedMetadata: null,
      firstAllRasterLoad: true,
    });

    const {
      initCategoryButtons,
      initAllRasterButton,
      // setAllRasterBackgroundClick,
    } = privateMethods;

    this.config(config);

    initCategoryButtons.call(this);
    initAllRasterButton.call(this);
    // setAllRasterBackgroundClick.call(this);
    // this.updateFooterView();
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
      footerView,
    } = props;

    const {
      drawRasters,
      updateFooterView,
    } = privateMethods;

    const {
      getRasterDataByCategory,
    } = rasterMethods;

    const dataByCategory = getRasterDataByCategory({ rasterData });
    if (dataByCategory.length === 0) {
      console.log('NO RESULTS, CLOSE FOOTER');
      props.footerView = 'views';
    } else if (rasterData.get(footerView).length === 0) {
      props.footerView = dataByCategory[0].key;
    }


    updateFooterView.call(this);
    drawRasters.call(this);
    return this;
  }
  // updateFooterView() {
  //   const {
  //     updateFooterView,
  //     drawRasters,
  //   } = privateMethods;

  //   updateFooterView.call(this);
  //   drawRasters.call(this);
  //   return this;
  // }
  updateAllRaster() {
    const {
      allRasterOpen,
    } = privateProps.get(this);
    const {
      drawAllRaster,
    } = privateMethods;

    if (allRasterOpen) {
      drawAllRaster.call(this);
    }
  }
}

export default Footer;

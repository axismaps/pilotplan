import methods from './footerMethods';
import allRasterMethods from './footerAllRasterMethods';
import rasterMethods from './rasterMethods';
import DataProbe from './dataProbe';
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
  initToggleButton() {
    const {
      footerToggleButton,
      onToggleClick,
    } = privateProps.get(this);
    footerToggleButton
      .on('click', onToggleClick);
  },
  drawRasters() {
    const props = privateProps.get(this);
    const {
      rasterData,
      imagesContainer,
      onRasterClick,
      footerView,
      cachedMetadata,
      dataProbe,
      footerContainer,
    } = props;

    const {
      drawRasters,
    } = methods;
    // console.log('draw rasters', rasterData);

    props.rasters = drawRasters({
      dataProbe,
      rasterData,
      imagesContainer,
      onRasterClick,
      footerView,
      cachedMetadata,
      footerContainer,
    });
  },
  drawToggleRasters() {
    const {
      rasterData,
      footerToggleRastersContainer,
      cachedMetadata,
    } = privateProps.get(this);

    const { drawToggleRasters } = methods;

    drawToggleRasters({
      rasterData,
      footerToggleRastersContainer,
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
      dataProbe,
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

    const { allRasterSections, newAllRasterSections } = drawAllRasterCategories({
      rasterData,
      allRasterContentContainer,
    });


    drawAllRasterTitles({
      newAllRasterSections,
    });

    drawAllRasterImageBlocks({
      newAllRasterSections,
    });

    drawAllRasterImages({
      allRasterSections,
      onRasterClick,
      cachedMetadata,
      onAllRasterCloseClick,
      dataProbe,
    });

    props.firstAllRasterLoad = false;
  },
  updateToggleYear() {
    const {
      footerToggleYearContainer,
      year,
    } = privateProps.get(this);

    footerToggleYearContainer.text(`(${year})`);
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
      footerToggleButton,
      outerContainer,
      footerContainer,
      footerToggleRastersContainer,
      footerToggleYearContainer,
    } = selections;

    privateProps.set(this, {
      categoriesContainer,
      imagesContainer,
      showAllContainer,
      allRasterOuterContainer,
      allRasterInnerContainer,
      allRasterContentContainer,
      footerToggleButton,
      footerToggleRastersContainer,
      footerToggleYearContainer,
      outerContainer,
      footerContainer,
      dataProbe: new DataProbe({
        container: outerContainer,
      }),
      allRasterOpen: false,
      onAllRasterCloseClick: null,
      onToggleClick: null,
      rasterData: null,
      footerView: null,
      cachedMetadata: null,
      firstAllRasterLoad: true,
      year: null,
    });

    const {
      initCategoryButtons,
      initAllRasterButton,
      initToggleButton,
    } = privateMethods;

    this.config(config);

    initCategoryButtons.call(this);
    initAllRasterButton.call(this);
    initToggleButton.call(this);

    this.updateRasterData();
    // this.updateToggleRasters();
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
  // updateToggleRasters() {
  //   const {
  //     drawToggleRasters,
  //   } = privateMethods;
  //   drawToggleRasters.call(this);
  // }
  updateRasterData() {
    const {
      drawRasters,
      updateFooterView,
      // autoSetFooterView,
      drawToggleRasters,
      updateToggleYear,
    } = privateMethods;

    updateFooterView.call(this);
    drawToggleRasters.call(this);
    updateToggleYear.call(this);
    drawRasters.call(this);
    return this;
  }

  updateAllRaster() {
    const {
      allRasterOpen,
    } = privateProps.get(this);
    const {
      drawAllRaster,
    } = privateMethods;
    // console.log('all raster open?', allRasterOpen);
    if (allRasterOpen) {
      drawAllRaster.call(this);
    }
  }
}

export default Footer;

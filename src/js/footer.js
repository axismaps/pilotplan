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
      footerCategoriesMobile,
      onCategoryClick,
      mobile,
      onAllRasterClick,
      allRasterInnerContainer,
    } = props;
    const {
      drawCategoryButtons,
      drawMobileCategoryButtons,
    } = methods;
    const {
      getRasterCategories,
    } = rasterMethods;

    const {
      scrollToCategory,
    } = allRasterMethods;

    const drawMethod = mobile ? drawMobileCategoryButtons : drawCategoryButtons;

    let onClick;
    if (!mobile) {
      onClick = onCategoryClick;
    } else {
      onClick = (category) => {
        // scroll to
        onAllRasterClick({
          category,
        });
        scrollToCategory({
          category,
          allRasterInnerContainer,
          getAllRasterSections: () => props.allRasterSections,
        });
      };
    }

    props.categoryButtons = drawMethod({
      rasterCategories: getRasterCategories({ rasterData }),
      container: mobile ? footerCategoriesMobile : categoriesContainer,
      onClick,
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
      footerToggleButtonMobile,
      onToggleClick,
    } = privateProps.get(this);
    footerToggleButton
      .on('click', onToggleClick);

    footerToggleButtonMobile
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
    // console.log('footer view', footerView);
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
      allRasterCloseButton,
      rasterData,
      onRasterClick,
      cachedMetadata,
      dataProbe,
      mobile,
    } = props;

    const {
      setAllRasterBackgroundClick,
      drawAllRasterCategories,
      drawAllRasterTitles,
      drawAllRasterImageBlocks,
      drawAllRasterImages,
      setAllRasterCloseButton,
    } = allRasterMethods;

    if (firstAllRasterLoad) {
      setAllRasterBackgroundClick({
        allRasterInnerContainer,
        allRasterOuterContainer,
        onAllRasterCloseClick,
        firstAllRasterLoad,
      });

      setAllRasterCloseButton({
        allRasterCloseButton,
        onAllRasterCloseClick,
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
      mobile,
      allRasterSections,
      onRasterClick,
      cachedMetadata,
      onAllRasterCloseClick,
      dataProbe,
    });

    props.allRasterSections = allRasterSections;
    props.firstAllRasterLoad = false;
  },
  updateToggleYear() {
    const {
      footerToggleYearContainer,
      year,
    } = privateProps.get(this);

    footerToggleYearContainer.text(`(${year})`);
  },
  updateFooterDataStatus() {
    const props = privateProps.get(this);
    const {
      rasterData,
      footerContainer,
      footerToggleButton,
    } = props;

    const {
      getRasterDataByCategory,
    } = rasterMethods;
    const noRaster = getRasterDataByCategory({ rasterData }).length === 0;
    footerContainer
      .classed('footer--no-raster', noRaster);

    footerToggleButton
      .classed('footer__toggle-button--no-raster', noRaster);
  },
};

class Footer {
  constructor(config) {
    const {
      categoriesContainer,
      footerCategoriesMobile,
      imagesContainer,
      showAllContainer,
      allRasterOuterContainer,
      allRasterInnerContainer,
      allRasterContentContainer,
      allRasterCloseButton,
      footerToggleButton,
      footerToggleButtonMobile,
      outerContainer,
      footerContainer,
      footerToggleRastersContainer,
      footerToggleYearContainer,
      footerToggleText,
    } = selections;

    privateProps.set(this, {
      categoriesContainer,
      footerCategoriesMobile,
      imagesContainer,
      showAllContainer,
      allRasterOuterContainer,
      allRasterInnerContainer,
      allRasterContentContainer,
      allRasterCloseButton,
      footerToggleButton,
      footerToggleButtonMobile,
      footerToggleRastersContainer,
      footerToggleYearContainer,
      footerToggleText,
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
      language: null,
      translations: null,
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
    this.updateLanguage();
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
      updateFooterDataStatus,
      updateFooterView,
      // autoSetFooterView,
      drawToggleRasters,
      updateToggleYear,
    } = privateMethods;

    updateFooterDataStatus.call(this);
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
  updateLanguage() {
    const {
      // language,
      // translations,
      footerToggleText,
    } = privateProps.get(this);
    footerToggleText
      .text('Historical Overlays'); // placeholder until translation is added to csv
  }
}

export default Footer;

import searchMethods from './sidebarSearch';
import getSidebarMethods from './sidebarGetPrivateMethods';
import { selections } from '../config';

const privateProps = new WeakMap();

const privateMethods = getSidebarMethods(privateProps);

class Sidebar {
  constructor(config) {
    const {
      sidebarContainer,
      sidebarContentContainer,
      searchReturnContainer,
      textSearchReturnButton,
      textSearchReturnButtonMobile,
      searchInput,
      resultsContainer,
      rasterResultsContainer,
      nonRasterResultsContainer,
      sidebarViewshedLayerBlock,
      sidebarViewshedLayerRow,
      sidebarViewshedLayerIconContainer,
      sidebarToggleButtonText,
    } = selections;
    const {
      init,
      // listenForText,
    } = privateMethods;

    privateProps.set(this, {
      sidebarContainer,
      sidebarContentContainer,
      searchReturnContainer,
      textSearchReturnButton,
      textSearchReturnButtonMobile,
      searchInput,
      resultsContainer,
      rasterResultsContainer,
      nonRasterResultsContainer,
      sidebarViewshedLayerBlock,
      sidebarViewshedLayerRow,
      sidebarViewshedLayerIconContainer,
      sidebarToggleButtonText,
      cachedSwatches: new Map(),
      view: null,
      previousView: null,
      results: null,
      availableLayers: null,
      viewLayerOn: true,
      highlightedFeature: null,
      highlightedLayer: null,
    });

    this.config(config);

    privateProps.get(this).previousView = config.view;

    init.call(this);


    // this.updateCurrentLayers();
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
  updateAvailableLayers() {
    //
    const {
      setViewLayerVisibility,
      drawLayerGroups,
      drawLayers,
      drawFeatures,
    } = privateMethods;
    setViewLayerVisibility.call(this);
    drawLayerGroups.call(this);
    drawLayers.call(this);
    drawFeatures.call(this);
    // this.updateCurrentLayers();
  }
  updateCurrentLayers() {
    const {
      currentLayers,
      layers,
      sidebarViewshedLayerRow,
    } = privateProps.get(this);

    const updateCheck = ({ check, sourceLayer }) => {
      if (!currentLayers.map(d => d.sourceLayer).includes(sourceLayer)) return;
      check.property('checked', currentLayers.find(dd => dd.sourceLayer === sourceLayer).status);
    };

    // update viewshed row
    updateCheck({
      check: sidebarViewshedLayerRow.select('.sidebar__layer-checkbox'),
      sourceLayer: 'ViewConesPoint',
    });

    layers.each(function checkBox(d) {
      const row = d3.select(this);
      const check = row.select('.sidebar__layer-checkbox');
      updateCheck({ check, sourceLayer: d.sourceLayer });
    });
  }
  updateHighlightedFeature() {
    const {
      sidebarContentContainer,
      highlightedFeature,
      nonRasterResultsContainer,
    } = privateProps.get(this);


    const isHighlightedFeature = (d) => {
      if (highlightedFeature === null) {
        return false;
      }

      const isFullLayer = feature => Object.prototype.hasOwnProperty.call(feature, 'dataLayer');

      if (isFullLayer(d) && isFullLayer(highlightedFeature)) {
        return d.dataLayer === highlightedFeature.dataLayer;
      } else if (!isFullLayer(d) && !isFullLayer(highlightedFeature)) {
        return d.id === highlightedFeature.id;
      }
      // if types are not the same, is not highlighted feature
      return false;
    };

    sidebarContentContainer
      .selectAll('.sidebar__feature-button')
      .classed('sidebar__feature-button--highlighted', isHighlightedFeature);

    nonRasterResultsContainer
      .selectAll('.sidebar__results-button')
      .classed('sidebar__results-button--highlighted', isHighlightedFeature);
  }
  updateHighlightedLayer() {
    const {
      sidebarContentContainer,
      highlightedLayer,
    } = privateProps.get(this);
    console.log('sidebar update', highlightedLayer);
    const isHighlightedLayer = (d) => {
      if (highlightedLayer === null) {
        return false;
      }
      return d.dataLayer === highlightedLayer.dataLayer;
    };
    sidebarContentContainer
      .selectAll('.sidebar__feature-button')
      .classed('sidebar__feature-button--highlighted', isHighlightedLayer);
  }
  updateResults() {
    const props = privateProps.get(this);
    const {
      view,
      previousView,
      nonRasterResultsContainer,
      rasterResultsContainer,
      results,
      onFeatureClick,
      onRasterClick,
      cachedMetadata,
      // resultRowContainer,
      translations,
      language,
    } = props;
    const {
      setSidebarClass,
    } = privateMethods;

    const {
      drawRasterSearchResults,
      drawNonRasterSearchResults,
    } = searchMethods;


    if (previousView === 'legend' && view === 'legend') return;

    setSidebarClass.call(this);

    drawRasterSearchResults({
      language,
      translations,
      onRasterClick,
      container: rasterResultsContainer,
      results: results === null ? [] : results.raster,
      onFeatureClick,
      cachedMetadata,
    });

    drawNonRasterSearchResults({
      language,
      translations,
      container: nonRasterResultsContainer,
      results: results === null ? [] : results.nonRaster,
      onFeatureClick,
    });

    props.previousView = view;
  }
  getView() {
    return privateProps.get(this).view;
  }
  // updateView() {
  //   const { setSidebarClass } = privateMethods;
  //   console.log('update view');
  //   setSidebarClass.call(this);
  // }
  getSearchText() {
    const {
      searchInput,
    } = privateProps.get(this);

    return searchInput.node().value;
  }
  clearSearch() {
    const props = privateProps.get(this);

    const {
      onSearchReturn,
    } = props;

    const {
      setSidebarClass,
      setSidebarToLegend,
      clearTextInput,
    } = privateMethods;
    // console.log('clear search');
    setSidebarToLegend.call(this);
    clearTextInput.call(this);
    setSidebarClass.call(this);
    onSearchReturn();
  }
  updateLanguage() {
    const {
      clearContent,
      drawContent,
      clearResults,
      setToggleButtonText,
    } = privateMethods;

    clearContent.call(this);
    drawContent.call(this);
    clearResults.call(this);
    setToggleButtonText.call(this);
  }
}

export default Sidebar;

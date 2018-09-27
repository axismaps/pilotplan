import searchMethods from './sidebarSearch';
import getSidebarMethods from './sidebarGetPrivateMethods';
import { selections } from './config';

const privateProps = new WeakMap();

const privateMethods = getSidebarMethods(privateProps);

class Sidebar {
  constructor(config) {
    const {
      sidebarContainer,
      sidebarContentContainer,
      searchReturnContainer,
      textSearchReturnButton,
      searchInput,
      resultsContainer,
      rasterResultsContainer,
      nonRasterResultsContainer,
      sidebarViewshedLayerBlock,
      sidebarViewshedLayerRow,
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
      searchInput,
      resultsContainer,
      rasterResultsContainer,
      nonRasterResultsContainer,
      sidebarViewshedLayerBlock,
      sidebarViewshedLayerRow,
      cachedSwatches: new Map(),
      view: null,
      previousView: null,
      results: null,
      availableLayers: null,
      currentLayers: null,
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
      drawLayerGroups,
      drawLayers,
      drawFeatures,
    } = privateMethods;
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

      if (Object.prototype.hasOwnProperty.call(d, 'dataLayer')) {
        // comparison for selected entire layer
        return d.dataLayer === highlightedFeature.dataLayer;
      }
      // comparison for selected feature
      return d.id === highlightedFeature.id;
    };

    sidebarContentContainer
      .selectAll('.sidebar__feature-button')
      .classed('sidebar__feature-button--highlighted', isHighlightedFeature);

    nonRasterResultsContainer
      .selectAll('.sidebar__results-button')
      .classed('sidebar__results-button--highlighted', isHighlightedFeature);
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
      onRasterClick,
      container: rasterResultsContainer,
      results: results === null ? [] : results.raster,
      onFeatureClick,
      cachedMetadata,
    });

    drawNonRasterSearchResults({
      container: nonRasterResultsContainer,
      results: results === null ? [] : results.nonRaster,
      onFeatureClick,
    });

    props.previousView = view;
  }
  getView() {
    return privateProps.get(this).view;
  }
  updateView() {
    const { setSidebarClass } = privateMethods;
    setSidebarClass.call(this);
  }
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

    setSidebarToLegend.call(this);
    clearTextInput.call(this);
    setSidebarClass.call(this);
    onSearchReturn();
  }
}

export default Sidebar;

import searchMethods from './sidebarSearch';
import { selections } from './config';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const {
      drawLayerGroups,
      drawLayers,
      drawFeatures, // draw features
      listenForText,
      setSearchReturnListener,
    } = privateMethods;

    // drawLayerCategories.call(this);
    drawLayerGroups.call(this);
    drawLayers.call(this);
    drawFeatures.call(this);
    listenForText.call(this);
    setSearchReturnListener.call(this);
  },
  listenForText() {
    const {
      searchInput,
      onTextInput,
    } = privateProps.get(this);
    const {
      listenForText,
    } = searchMethods;

    listenForText({
      searchInput,
      onTextInput,
    });
  },
  setSearchReturnListener() {
    const props = privateProps.get(this);
    const {
      searchReturnContainer,
      textSearchReturnButton,
      searchInput,
      // onSearchReturn,
    } = props;

    const { setSearchReturnListener } = searchMethods;

    setSearchReturnListener({
      searchReturnContainer,
      textSearchReturnButton,
      searchInput,
      clearSearch: () => {
        this.clearSearch();
      },
    });
  },
  drawLayerGroups() {
    const props = privateProps.get(this);
    const {
      availableLayers,
      sidebarContentContainer,
    } = props;

    const groups = sidebarContentContainer
      .selectAll('.sidebar__layer-group-block')
      .data(availableLayers, d => d.group);

    const newGroups = groups
      .enter()
      .append('div')
      .attr('class', 'sidebar__layer-group-block');
    newGroups
      .append('div')
      .attr('class', 'sidebar__layer-group-title')
      .text(d => d.group);

    newGroups.append('div')
      .attr('class', 'sidebar__layer-block');

    groups.exit().remove();

    props.layerGroups = newGroups.merge(groups);
  },
  drawLayers() {
    const props = privateProps.get(this);
    const {
      sidebarContentContainer,
      layerGroups,
      language,
      onLayerClick,
    } = props;

    // const { addLayerRowContent } = privateMethods;

    layerGroups.each(function addLayers(d) {
      const layers = d3.select(this)
        .select('.sidebar__layer-block')
        .selectAll('.sidebar__layer-row')
        .data(d.layers, layer => layer.sourceLayer);

      const layersNew = layers.enter()
        .append('div')
        .attr('class', 'sidebar__layer-row');


      const titleRows = layersNew.append('div')
        .attr('class', 'sidebar__layer-title-row')
        // .html(layer => getLayerHTML({ language, layer }))
        .on('click', onLayerClick);

      titleRows.each(function addSwatch(dd) {
        let html = '<input class="sidebar__layer-checkbox" type="checkbox" value="builtdomain" checked="checked">';
        html += `<span class="sidebar__layer-name">${dd[language]}</span>`;
        d3.select(this).html(html);
      });

      layersNew
        .append('div')
        .attr('class', 'sidebar__feature-block');

      layers.exit().remove();
    });
    props.layers = sidebarContentContainer.selectAll('.sidebar__layer-row');
    props.checkBoxes = sidebarContentContainer.selectAll('.sidebar__layer-checkbox');
  },
  setSwatchStyles({ layerStyles, swatches }) {
    // const featureStyle = layerStyles.find(d => d.id === feature.style);
    // console.log(featureStyle);
    swatches
      .each(function setFeatureStyle(feature) {
        const swatch = d3.select(this).select('svg');
        const featureStyle = layerStyles.find(d => d.id === feature.style).paint;
        // console.log('style', feature.style);
        // console.log('feature style', featureStyle);
        const styleKey = {
          'line-color': 'fill',
          'fill-color': 'fill',
        };
        const style = Object.keys(styleKey).reduce((accumulator, field) => {
          if (Object.prototype.hasOwnProperty.call(featureStyle, field)) {
            const value = featureStyle[field];
            const color = Array.isArray(value) ? value.slice(-1)[0] : value;
            /* eslint-disable no-param-reassign */
            accumulator[styleKey[field]] = color;
            /* eslint-enable no-param-reassign */
          }
          return accumulator;
        }, {});
        // console.log('style', style);
        swatch.attrs(style);
      });
  },
  drawFeatures() {
    const props = privateProps.get(this);
    const {
      layers,
      language,
      sidebarContentContainer,
      onFeatureClick,
      cachedSwatches,
      layerStyles,
    } = props;

    const {
      setSwatchStyles,
    } = privateMethods;

    // console.log('map layerStyles', layerStyles);

    layers.each(function addFeature(d) {
      // console.log('layer', d);
      const features = d3.select(this)
        .select('.sidebar__feature-block')
        .selectAll('.sidebar__feature-row')
        .data(d.features, feature => feature.dataLayer);

      const newFeatureRows = features
        .enter()
        .append('div')
        .attr('class', 'sidebar__feature-row');

      newFeatureRows
        .append('div')
        .attr('class', 'sidebar__feature-button')
        .classed('sidebar__feature-button--inactive', feature => feature.style === undefined)
        .html(feature => `
          <i class="icon-binoculars sidebar__feature-icon"></i>
          <span class="sidebar__feature-name">${feature[language]}</span>
        `)
        .on('click', (feature) => {
          onFeatureClick(Object.assign({}, feature, { sourceLayer: d.sourceLayer }));
        });
      // console.log('icon', d.icon);
      if (cachedSwatches.has(d.icon)) {
        // console.log('loaded from cache');
        const html = cachedSwatches.get(d.icon);
        const swatches = newFeatureRows
          .append('div')
          .attr('class', 'sidebar__swatch')
          .html(html);

        setSwatchStyles({ swatches, layerStyles });
      } else {
        // console.log('load new');
        d3.xml(`img/legend/${d.icon}`)
          .then((icon) => {
            const html = new XMLSerializer().serializeToString(icon);
            if (!cachedSwatches.has(d.icon)) {
              // console.log('save new', d.icon);
              cachedSwatches.set(d.icon, html);
            }

            const swatches = newFeatureRows
              .append('div')
              .attr('class', 'sidebar__swatch')
              .html(html);

            setSwatchStyles({ swatches, layerStyles });
          });
      }


      features.exit().remove();
    });
    props.features = sidebarContentContainer.selectAll('.sidebar__feature-row');
  },
  setSidebarClass() {
    const {
      view,
      sidebarContainer,
    } = privateProps.get(this);
    //
    const classesForViews = new Map([
      ['legend', 'sidebar--legend'],
      ['textSearch', 'sidebar--text-search'],
      ['clickSearch', 'sidebar--click-search'],
    ]);
    classesForViews.forEach((val, key) => {
      sidebarContainer.classed(val, key === view);
    });
  },
  setSidebarToLegend() {
    const props = privateProps.get(this);
    props.view = 'legend';
  },
  clearTextInput() {
    const { searchInput } = privateProps.get(this);
    searchInput.node().value = '';
  },
};

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
    } = privateProps.get(this);

    layers.each(function checkBox(d) {
      const row = d3.select(this);
      const check = row.select('.sidebar__layer-checkbox');
      check.property('checked', currentLayers.find(dd => dd.sourceLayer === d.sourceLayer).status);
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

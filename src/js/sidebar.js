import searchMethods from './sidebarSearch';

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
    } = props;

    const { setSearchReturnListener } = searchMethods;

    setSearchReturnListener({
      searchReturnContainer,
      textSearchReturnButton,
      searchInput,
      callback: () => {
        props.view = 'legend';
        searchInput.node().value = '';
        this.updateResults();
      },
    });
  },
  drawLayerGroups() {
    const props = privateProps.get(this);
    const {
      availableLayers,
      contentContainer,
    } = props;

    const groups = contentContainer
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
      contentContainer,
      layerGroups,
      language,
      onLayerClick,
    } = props;

    layerGroups.each(function addLayers(d) {
      const layers = d3.select(this)
        .select('.sidebar__layer-block')
        .selectAll('.sidebar__layer-row')
        .data(d.layers, layer => layer.id);

      const layersNew = layers.enter()
        .append('div')
        .attr('class', 'sidebar__layer-row');

      layersNew.append('div')
        .attr('class', 'sidebar__layer-title-row')
        .html(layer => `
          <input class="sidebar__layer-checkbox" type="checkbox" value="builtdomain" checked="checked">
          <span class="sidebar__layer-name">${layer[language]}</span>
          `)
        .on('click', onLayerClick);

      layersNew
        .append('div')
        .attr('class', 'sidebar__feature-block');

      layers.exit().remove();
    });
    props.layers = contentContainer.selectAll('.sidebar__layer-row');
    props.checkBoxes = contentContainer.selectAll('.sidebar__layer-checkbox');
  },
  drawFeatures() {
    const props = privateProps.get(this);
    const {
      layers,
      language,
      contentContainer,
      onFeatureClick,
    } = props;

    layers.each(function addFeature(d) {
      const features = d3.select(this)
        .select('.sidebar__feature-block')
        .selectAll('.sidebar__feature-row')
        .data(d.features, feature => feature.id);

      const newFeatureRows = features
        .enter()
        .append('div')
        .attr('class', 'sidebar__feature-row');

      newFeatureRows
        .append('div')
        .attr('class', 'sidebar__feature-button')
        .classed('sidebar__feature-button--inactive', feature => feature.id === undefined)
        .html(feature => `
          <i class="icon-binoculars sidebar__feature-icon"></i>
          <span class="sidebar__feature-name">${feature[language]}</span>
        `)
        .on('click', (feature) => {
          // console.log(feature, d.id);

          onFeatureClick(Object.assign({}, feature, { sourceLayer: d.id }));
        });

      features.exit().remove();
    });
    props.features = contentContainer.selectAll('.sidebar__feature-row');
  },
  setView() {
    const {
      view,
      container,
    } = privateProps.get(this);
    // console.log('view', view);
    const classesForViews = new Map([
      ['legend', 'sidebar--legend'],
      ['textSearch', 'sidebar--text-search'],
      ['clickSearch', 'sidebar--click-search'],
    ]);
    classesForViews.forEach((val, key) => {
      container.classed(val, key === view);
    });
  },

};

class Sidebar {
  constructor(config) {
    const {
      init,
      // listenForText,
    } = privateMethods;

    privateProps.set(this, {
      container: d3.select('.sidebar'),
      contentContainer: d3.select('.sidebar__content'),
      resultsContainer: d3.select('.sidebar__results'),
      searchReturnContainer: d3.select('.sidebar__search-return'),
      textSearchReturnButton: d3.select('.sidebar__text-search-return-icon'),
      searchInput: d3.select('.sidebar__input'),
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
    // console.log('update available layers');
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
      check.property('checked', currentLayers.find(dd => dd.id === d.id).status);
    });
  }
  updateHighlightedFeature() {
    const {
      contentContainer,
      highlightedFeature,
    } = privateProps.get(this);

    console.log('update highlighted feature');

    contentContainer
      .selectAll('.sidebar__feature-button')
      .classed('sidebar__feature-button--highlighted', (d) => {
        if (highlightedFeature === null) {
          return false;
        }
        return d.id === highlightedFeature.id;
      });
  }
  updateResults() {
    const props = privateProps.get(this);
    const {
      view,
      previousView,
      resultsContainer,
      results,
      onFeatureClick,
      onRasterClick,
      // resultRowContainer,
    } = props;
    const {
      setView,
    } = privateMethods;

    const {
      clearResults,
      drawTextSearchResults,
      drawClickSearchResults,
      drawResultRowContainer,
    } = searchMethods;

    // console.log('update?', checkNeedsUpdate.call(this));
    if (previousView === 'legend' && view === 'legend') return;

    setView.call(this);
    // use enter/exit instead of this
    clearResults(props.resultRowContainer);

    const resultRowContainer = drawResultRowContainer({ resultsContainer });
    console.log('result', results);
    if (view === 'textSearch') {
      drawTextSearchResults({
        onRasterClick,
        resultRowContainer,
        results: results.raster,
        onFeatureClick,
      });

      drawClickSearchResults({
        resultRowContainer,
        results: results.nonRaster,
        onFeatureClick,
      });
    } else if (view === 'clickSearch' || view === 'areaSearch') {
      drawClickSearchResults({
        resultRowContainer,
        results,
        onFeatureClick,
      });
    }
    props.previousView = view;
    props.resultRowContainer = resultRowContainer;
  }
}

export default Sidebar;

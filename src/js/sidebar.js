import getSearchMethods from './sidebarSearch';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const {
      drawLayerGroups,
      drawLayerRows,
    } = privateMethods;

    drawLayerGroups.call(this);
    drawLayerRows.call(this);
  },
  drawLayerGroups() {
    const props = privateProps.get(this);
    const {
      availableLayers,
      contentContainer,
      language,
    } = props;

    // console.log('LAYERS', layers);

    // props.layersContainer = contentContainer.append('div')
    //   .attr('class', 'sidebar__layers');
    const groupsWithData = availableLayers
      .filter(d => d.features.length > 0);

    const layerGroups = contentContainer
      .selectAll('.sidebar__layer-group')
      .data(groupsWithData, d => d.id);

    const layerGroupsNew = layerGroups
      .enter()
      .append('div')
      .attr('class', 'sidebar__layer-group');

    layerGroupsNew
      .append('div')
      .attr('class', 'sidebar__layer-group-title')
      .text(d => d[language]);

    layerGroupsNew.append('div')
      .attr('class', 'sidebar__layers');

    layerGroups.exit().remove();

    props.layerGroups = layerGroupsNew.merge(layerGroups);
  },
  drawLayerRows() {
    const {
      layerGroups,
      onLayerClick,
      language,
    } = privateProps.get(this);
    // layerGroups.each(function addRows(d) {
    //   console.log('d', d);
    //   d3.select(this)
    //     .select()
    // });
    // console.log('draw layer rows');
    layerGroups.each(function addRows(d) {
      // console.log(d);
      const layers = d3.select(this)
        .select('.sidebar__layers')
        .selectAll('.sidebar__layer-row')
        .data(d.features, dd => dd.en);

      layers
        .enter()
        .append('div')
        .attr('class', 'sidebar__layer-row')
        .classed('sidebar__layer-row--inactive', dd => dd.id === undefined)
        .text(dd => dd[language])
        .on('click', (dd) => {
          onLayerClick(dd.id);
        });

      layers.exit().remove();
    });
  },
  setView() {
    const {
      view,
      container,
    } = privateProps.get(this);
    console.log('view', view);
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

Object.assign(
  privateMethods,
  getSearchMethods({ privateMethods, privateProps }),
);

class Sidebar {
  constructor(config) {
    const {
      init,
      listenForText,
    } = privateMethods;

    privateProps.set(this, {
      container: d3.select('.sidebar'),
      contentContainer: d3.select('.sidebar__content'),
      resultsContainer: d3.select('.sidebar__results'),
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
    listenForText.call(this);

    this.updateCurrentLayers();
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
  updateAvailableLayers() {
    // console.log('update available layers');
    const {
      drawLayerGroups,
      drawLayerRows,
    } = privateMethods;
    drawLayerGroups.call(this);
    drawLayerRows.call(this);
    this.updateCurrentLayers();
  }
  updateCurrentLayers() {
    const {
      contentContainer,
      currentLayers,
    } = privateProps.get(this);

    contentContainer
      .selectAll('.sidebar__layer-row')
      .classed('sidebar__layer-row--off', d => !currentLayers.includes(d.id));
  }
  updateResults() {
    const props = privateProps.get(this);
    const {
      view,
      previousView,
    } = props;
    const {
      setView,
      clearResults,
      drawTextSearchResults,
      drawClickSearchResults,
      drawResultRowContainer,
    } = privateMethods;

    // console.log('update?', checkNeedsUpdate.call(this));
    if (previousView === 'legend' && view === 'legend') return;

    setView.call(this);
    // use enter/exit instead of this
    clearResults.call(this);
    drawResultRowContainer.call(this);
    if (view === 'textSearch') {
      drawTextSearchResults.call(this);
    } else if (view === 'clickSearch') {
      drawClickSearchResults.call(this);
    }
    props.previousView = view;
  }
}

export default Sidebar;

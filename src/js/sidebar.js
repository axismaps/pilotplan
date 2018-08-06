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
      layers,
      contentContainer,
    } = props;

    // console.log('LAYERS', layers);

    // props.layersContainer = contentContainer.append('div')
    //   .attr('class', 'sidebar__layers');

    const layerGroups = contentContainer
      .selectAll('.sidebar__layer-group')
      .data(layers, d => d.name);

    const layerGroupsNew = layerGroups
      .enter()
      .append('div')
      .attr('class', 'sidebar__layer-group')
      .text(d => d.name);

    props.layerContainers = layerGroupsNew.append('div')
      .attr('class', 'sidebar__layers');

    layerGroups.exit().remove();

    props.layerGroups = layerGroups;
  },
  drawLayerRows() {
    const {
      layerContainers,
      onLayerClick,
      language,
    } = privateProps.get(this);
    // layerGroups.each(function addRows(d) {
    //   console.log('d', d);
    //   d3.select(this)
    //     .select()
    // });
    layerContainers.each(function addRows(d) {
      const layers = d3.select(this)
        .selectAll('.sidebar__layer-row')
        .data(d.features, dd => dd.name);

      layers
        .enter()
        .append('div')
        .attr('class', 'sidebar__layer-row')
        // .merge(layers)
        .text(dd => dd[language])
        .on('click', (dd) => {
          onLayerClick(dd.name);
        });

      layers.exit().remove();
    });
  },
  drawLayerContent() {
    const {
      layerRows,
      onLayerClick,
    } = privateProps.get(this);

    // recursive search to find clean layer name
    // const findFilter = (filters, field) => {
    //   const filter = filters.slice(1)
    //     .find(d => d[1] === field);
    //   if (filter !== undefined) {
    //     return filter[2];
    //   }
    //   const newFilters = filters.slice(1)
    //     .find(d => d[0] === 'all');
    //   if (newFilters !== undefined) {
    //     return findFilter(newFilters, field);
    //   }
    //   return undefined;
    // };

    // layerRows.append('div')
    //   .attr('class', 'sidebar__layer-text')
    //   .text((d) => {
    //     const styleName = findFilter(d.filter, 'StyleName');
    //     const subType = findFilter(d.filter, 'SubType');
    //     if (styleName === undefined && subType === undefined) {
    //       return d.id;
    //     } else if (subType === undefined) {
    //       return styleName;
    //     }

    //     return `${styleName}: ${subType}`;
    //   })
    //   .on('click', (d) => {
    //     console.log('layer', d);
    //     onLayerClick(d.id);
    //   });
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
  clearResults() {
    const {
      resultRowContainer,
    } = privateProps.get(this);

    if (resultRowContainer === undefined) return;
    resultRowContainer.remove();
  },
  drawResults() {
    const props = privateProps.get(this);
    const {
      resultsContainer,
      results,
      // view,
    } = props;

    const resultRowContainer = resultsContainer.append('div')
      .attr('class', 'sidebar__results-rows');

    resultRowContainer
      .selectAll('.sidebar__results-row')
      .data(results)
      .enter()
      .append('div')
      .attr('class', 'sidebar__results-row')
      .text(d => d.properties.Name);


    props.resultRowContainer = resultRowContainer;
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
    // console.log(this);
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
      .classed('sidebar__layer-row--off', d => !currentLayers.includes(d.name));
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
      drawResults,
    } = privateMethods;

    // console.log('update?', checkNeedsUpdate.call(this));
    if (previousView === 'legend' && view === 'legend') return;

    setView.call(this);
    // use enter/exit instead of this
    clearResults.call(this);
    if (view !== 'legend') {
      drawResults.call(this);
    }
    props.previousView = view;
  }
}

export default Sidebar;

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const {
      drawLayerRows,
      drawLayerContent,
    } = privateMethods;

    drawLayerRows.call(this);
    drawLayerContent.call(this);
  },
  drawLayerRows() {
    const props = privateProps.get(this);
    const {
      layers,
      contentContainer,
    } = props;

    props.layersContainer = contentContainer.append('div')
      .attr('class', 'sidebar__layers');

    props.layerRows = props.layersContainer
      .selectAll('.sidebar__layer-row')
      .data(layers.filter(d => 'filter' in d))
      .enter()
      .append('div')
      .attr('class', 'sidebar__layer-row');
  },
  drawLayerContent() {
    const {
      layerRows,
      onLayerClick,
    } = privateProps.get(this);

    // recursive search to find clean layer name
    const findFilter = (filters, field) => {
      const filter = filters.slice(1)
        .find(d => d[1] === field);
      if (filter !== undefined) {
        return filter[2];
      }
      const newFilters = filters.slice(1)
        .find(d => d[0] === 'all');
      if (newFilters !== undefined) {
        return findFilter(newFilters, field);
      }
      return undefined;
    };

    layerRows.append('div')
      .attr('class', 'sidebar__layer-text')
      .text((d) => {
        const styleName = findFilter(d.filter, 'StyleName');
        const subType = findFilter(d.filter, 'SubType');
        if (styleName === undefined && subType === undefined) {
          return d.id;
        } else if (subType === undefined) {
          return styleName;
        }

        return `${styleName}: ${subType}`;
      })
      .on('click', (d) => {
        console.log('layer', d);
        onLayerClick(d.id);
      });
  },
};

class Sidebar {
  constructor(config) {
    const { init } = privateMethods;

    privateProps.set(this, {
      contentContainer: d3.select('.sidebar__content'),
    });

    this.config(config);
    init.call(this);
    this.updateLayers();
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
  updateLayers() {
    const {
      currentLayers,
      layerRows,
    } = privateProps.get(this);
    layerRows.classed('sidebar__layer-row--off', d => !currentLayers.includes(d.id));
  }
}

export default Sidebar;

const privateProps = new WeakMap();

const utils = {
  getLayerStyle({ layer, year }) {
    if (!('filter' in layer)) return layer;
    layer.filter = layer.filter.map((f) => {
      if (f[0] === 'all') {
        return f.map((dd, i) => {
          if (i === 0) return dd;
          const copyFilter = [...dd];
          if (copyFilter[1] === 'FirstYear' || copyFilter[1] === 'LastYear') {
            copyFilter[2] = year;
          }
          return copyFilter;
        });
      }
      return f;
    });
    return layer;
  },
};

const privateMethods = {
  createMBMap(init) {
    const props = privateProps.get(this);

    const {
      onLoad,
    } = props;

    mapboxgl.accessToken = 'pk.eyJ1IjoiYXhpc21hcHMiLCJhIjoieUlmVFRmRSJ9.CpIxovz1TUWe_ecNLFuHNg';

    props.mbMap = new mapboxgl.Map({
      container: 'map',
      style: './data/style.json',
      // style: 'mapbox://styles/axismaps/cjj4qi4hm4imk2ss5oavv3jv4',
    })
      .on('load', () => {
        init();
        onLoad();
      })
      .on('click', (e) => {
        console.log('click', e);
      })
      .on('mouseover', 'building-Work', (e) => {
        console.log('LAYER', e);
      });
    // .on('render', () => {
    //   setTimeout(() => {
    //     console.log('render done', this.getRenderedLayers().length);
    //   });
    // });
  },
  updateYear() {
    const {
      year,
      mbMap,
    } = privateProps.get(this);
    const {
      getLayerStyle,
    } = utils;

    const styleCopy = JSON.parse(JSON.stringify(mbMap.getStyle()));
    styleCopy.layers = styleCopy.layers.map(layer => getLayerStyle({ layer, year }));
    mbMap.setStyle(styleCopy);
    // console.log('newlayers', mbMap.getStyle());
  },
  // updateYear() {
  //   const props = privateProps.get(this);
  //   const {
  //     mbMap,
  //     year,
  //   } = props;
  //   mbMap.getStyle()
  //     .layers
  //     .forEach((layer) => {
  //       const currentFilter = mbMap.getFilter(layer.id);
  //       const all = currentFilter.find(d => d[0] === 'all');
  //       if (all === undefined) return;
  //       all.forEach((d) => {
  //         if (d[1] === 'FirstYear' || d[1] === 'LastYear') {
  //           d[2] = year;
  //         }
  //       });
  //       console.log('changed filter', currentFilter);
  //     });
  //   console.log('new', mbMap.getStyle().layers);
  // },
};

class Atlas {
  constructor(config) {
    const {
      createMBMap,
    } = privateMethods;

    privateProps.set(this, {});

    this.config(config);

    createMBMap.call(this, () => {
      // const { mbMap } = privateProps.get(this);
      // console.log(mbMap.getStyle().layers.map(d => mbMap.getLayer(d.id)));
      // console.log('layer', mbMap.getLayer('field-Uncovered Area'));
      // console.log('features', mbMap.querySourceFeatures('composite', {
      //   sourceLayer: 'SectorsPoly',
      // }));
    });
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
  updateYear() {
    const { mbMap } = privateProps.get(this);
    const {
      updateYear,
    } = privateMethods;
    updateYear.call(this);
    // console.log(mbMap.getLayer(mbMap.getStyle().layers[23].id));
    // console.log('features', mbMap.querySourceFeatures('composite', {
    //   sourceLayer: 'BuildingsPoly',
    // }));
    // console.log('rendered', mbMap.queryRenderedFeatures({
    //   layers: ['building-Live'],
    // }));
  }
  getMap() {
    const { mbMap } = privateProps.get(this);
    return mbMap;
  }
  getLayers() {
    const { mbMap } = privateProps.get(this);
    return mbMap
      .getStyle().layers
      // .filter(d => 'filter' in d)
      .map(d => mbMap.getLayer(d.id));
  }
  getRenderedLayers() {
    const { mbMap } = privateProps.get(this);
    return mbMap.getStyle().layers
      .map(d => d.id)
      .filter(d => mbMap.queryRenderedFeatures({ layers: [d] }).length > 0);
  }
  updateLayers() {
    const {
      mbMap,
      currentLayers,
    } = privateProps.get(this);
    const { layers } = mbMap.getStyle();

    layers.forEach((layer) => {
      const visible = mbMap.getLayoutProperty(layer.id, 'visibility') === 'visible';
      const toggled = currentLayers.includes(layer.id);
      if (visible && !toggled) {
        mbMap.setLayoutProperty(layer.id, 'visibility', 'none');
      } else if (!visible && toggled) {
        mbMap.setLayoutProperty(layer.id, 'visibility', 'visible');
      }
    });
  }
}

export default Atlas;

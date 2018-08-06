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
  },
  setLayers() {
    const props = privateProps.get(this);
    const { mbMap } = props;

    const layers = mbMap
      .getStyle().layers
      .map(d => mbMap.getLayer(d.id));

    const sourceLayers = new Set(layers
      .filter(d => d.sourceLayer !== undefined).map(d => d.sourceLayer));

    props.layers = layers;
    props.sourceLayers = [...sourceLayers];
  },
};

class Atlas {
  constructor(config) {
    const {
      createMBMap,
    } = privateMethods;

    privateProps.set(this, {});

    this.config(config);

    createMBMap.call(this, this.init.bind(this));
  }
  init() {
    const {
      setLayers,
    } = privateMethods;
    setLayers.call(this);
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
  updateYear() {
    const {
      updateYear,
    } = privateMethods;
    updateYear.call(this);

    // console.log('rendered', mbMap.queryRenderedFeatures({
    //   layers: ['building-Live'],
    // }));
  }
  getMap() {
    const { mbMap } = privateProps.get(this);
    return mbMap;
  }
  getLayers() {
    const { layers } = privateProps.get(this);
    return layers;
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
  textSearch(val) {
    const {
      mbMap,
      sourceLayers,
      year,
    } = privateProps.get(this);

    const results = sourceLayers.reduce((accumulator, sourceLayer) => {
      const result = mbMap.querySourceFeatures('composite', {
        sourceLayer,
        filter: [
          'all',
          ['<=', 'FirstYear', year],
          ['>=', 'LastYear', year],
          // ['match', 'Name', val],
        ],
      });
      return [...accumulator, ...result];
    }, []);

    const filtered = results
      .filter(d => d.properties.Name.toLowerCase().includes(val.toLowerCase()));
    return filtered;
  }
}

export default Atlas;

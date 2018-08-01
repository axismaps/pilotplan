const privateProps = new WeakMap();

const privateMethods = {
  createMBMap() {
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
      .on('load', onLoad);
  },
  updateYear() {
    const {
      year,
      mbMap,
    } = privateProps.get(this);
    console.log('map', mbMap);
    const styleCopy = JSON.parse(JSON.stringify(mbMap.getStyle()));
    console.log('style', styleCopy);
    console.log('year', year);
    styleCopy.layers = styleCopy.layers.map((layer) => {
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
    });
    mbMap.setStyle(styleCopy);
    // const layers = mbMap.getStyle().layers;
  },
};

class Atlas {
  constructor(config) {
    const {
      createMBMap,
    } = privateMethods;

    privateProps.set(this, {});

    this.config(config);

    createMBMap.call(this);
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
  }
}

export default Atlas;

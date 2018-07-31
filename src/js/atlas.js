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
}

export default Atlas;

import rasterMethods from './rasterMethods';

const privateProps = new WeakMap();

const paramFields = [
  'language',
  'overlay',
  'center',
  'zoom',
  'bearing',
  'year',
];

const privateMethods = {
  init() {
    const props = privateProps.get(this);

    props.urlParams = new URLSearchParams(window.location.search);

    const {
      urlParams,
    } = props;

    paramFields.forEach((param) => {
      if (urlParams.has(param)) {
        props[param] = urlParams.get(param);
      }
    });
  },
};

class UrlParams {
  constructor(config) {
    const {
      init,
    } = privateMethods;

    privateProps.set(this, {
      language: 'en',
      center: null,
      zoom: null,
      bearing: null,
      overlay: null,
      rasterData: null,
      year: 1960,
    });

    this.config(config);

    init.call(this);
    this.update();
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
  get(field) {
    const props = privateProps.get(this);
    const { rasterData } = props;
    const { getRasterFromSSID } = rasterMethods;

    if (field === 'overlay' && props[field] !== null) {
      return getRasterFromSSID({
        rasterData,
        SS_ID: props[field],
      });
    } else if (field === 'center' && props[field] !== null) {
      const coords = props[field].split(',');
      return new mapboxgl.LngLat(coords[1], coords[0]);
    }
    return props[field];
  }
  update() {
    const props = privateProps.get(this);

    const { urlParams } = props;

    paramFields.forEach((param) => {
      if (props[param] !== null) {
        urlParams.set(param, props[param]);
      } else if (urlParams.has(param) && props[param] === null) {
        urlParams.delete(param);
      }
    });
    // window.history.replaceState({}, '', `?${urlParams.toString()}`);
    window.history.replaceState({}, '', `?${decodeURIComponent(urlParams.toString())}`);
  }
}

export default UrlParams;

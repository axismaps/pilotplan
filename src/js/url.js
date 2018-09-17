const privateProps = new WeakMap();

const paramFields = [
  'language',
  'overlay',
  'extents',
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
      extents: null,
      overlay: null,
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
    return props[field];
  }
  // getLanguage() {
  //   return privateProps.get(this).language;
  // }
  // getOverlay() {
  //   return privateProps.get(this).overlay;
  // }
  // getExtents() {
  //   const extentsString = privateProps.get(this).extents;
  //   return extentsString;
  // }
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
    window.history.replaceState({}, '', `?${urlParams.toString()}`);
  }
}

export default UrlParams;

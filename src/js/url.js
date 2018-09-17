const privateProps = new WeakMap();

const paramFields = [
  'language',
  'overlay',
  'extents',
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
    });

    this.config(config);

    init.call(this);
    this.update();
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
  getLanguage() {
    return privateProps.get(this).language;
  }
  getOverlay() {
    // actually look up overlay
    return privateProps.get(this).overlay;
  }
  getExtents() {
    const extentsString = privateProps.get(this).extents;
    return extentsString;
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
    window.history.replaceState({}, '', `?${urlParams.toString()}`);
  }
}

export default UrlParams;

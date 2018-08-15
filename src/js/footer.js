import methods from './footerMethods';

const privateProps = new WeakMap();


const privateMethods = {
  init() {
    const props = privateProps.get(this);
    const {
      rasterData,
      imagesContainer,
      onRasterClick,
    } = props;

    const {
      drawRasters,
    } = methods;

    props.rasters = drawRasters({
      rasterData,
      imagesContainer,
      onRasterClick,
    });
  },
};

class Footer {
  constructor(config) {
    privateProps.set(this, {
      categoriesContainer: d3.select('.footer__categories'),
      imagesContainer: d3.select('.footer__images'),
      showAllContainer: d3.select('.footer__show-all'),
      rasterData: null,
    });

    this.config(config);
    const { init } = privateMethods;
    init.call(this);
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
}

export default Footer;

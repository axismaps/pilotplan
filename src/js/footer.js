import methods from './footerMethods';

const privateProps = new WeakMap();


const privateMethods = {
  init() {

  },
};

class Footer {
  constructor(config) {
    privateProps.set(this, {
      categoriesContainer: d3.select('.footer__categories'),
      imagesContainer: d3.select('.footer__images'),
      showAllContainer: d3.select('.footer__show-all'),
      rasterData: null,
      rasterCategories: null,
    });

    this.config(config);
    // const { init } = privateMethods;
    // init.call(this);
    this.updateRasterData();
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
  updateRasterData() {
    const props = privateProps.get(this);
    const {
      rasterData,
      imagesContainer,
      onRasterClick,
    } = props;

    const {
      drawRasters,
    } = methods;
    // console.log('raster data', rasterData);
    props.rasters = drawRasters({
      rasterData,
      imagesContainer,
      onRasterClick,
    });
  }
}

export default Footer;

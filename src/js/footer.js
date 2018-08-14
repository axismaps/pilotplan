import pureMethods from './footerPureFunctions';

const privateProps = new WeakMap();


const privateMethods = {
  setCategoryListeners() {

  },
  drawImages() {

  },
};

class Footer {
  constructor(config) {
    privateProps.set(this, {
      categoriesContainer: d3.select('.footer__categories'),
      imagesContainer: d3.select('.footer__images'),
      showAllContainer: d3.select('.footer__show-all'),
    });

    this.config(config);

    const props = privateProps.get(this);


  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
}

export default Footer;

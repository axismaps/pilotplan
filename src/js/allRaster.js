const privateProps = new WeakMap();

const privateMethods = {
  setOuterClick() {
    const {
      outerContainer,
      innerContainer,
      onOuterClick,
    } = privateProps.get(this);
    outerContainer.on('click', onOuterClick);
    innerContainer.on('click', () => {
      d3.event.stopPropagation();
    });
  },
};

class AllRaster {
  constructor(config) {
    privateProps.set(this, {
      outerContainer: d3.select('.allraster__outer'),
      innerContainer: d3.select('.allraster__inner'),
      rasterData: null,
    });

    const {
      setOuterClick,
    } = privateMethods;

    this.config(config);

    setOuterClick.call(this);
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
}

export default AllRaster;

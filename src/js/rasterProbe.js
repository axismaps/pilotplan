const privateProps = new WeakMap();

const privateMethods = {

};

class RasterProbe {
  constructor(config) {
    privateProps.set(this, {
      currentRaster: null,
      rasterType: null,
    });

    this.config(config);
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
}

export default RasterProbe;

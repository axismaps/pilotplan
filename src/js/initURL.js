import UrlParams from './url';

const initURL = function initURL() {
  this.components.urlParams = new UrlParams({
    rasterData: this.data.rasters,
  });
};

export default initURL;

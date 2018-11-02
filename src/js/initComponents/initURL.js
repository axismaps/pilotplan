/**
 * Module initializes url component
 * @module initURL
 */
import UrlParams from '../url/url';

const initURL = function initURL() {
  this.components.urlParams = new UrlParams({
    rasterData: this.data.rasters,
  });
};

export default initURL;

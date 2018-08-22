import { selections } from './config';
import rasterProbeMethods from './rasterProbeMethods';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const {
      rasterProbeCloseButton,
      onCloseClick,
    } = privateProps.get(this);

    const {
      setCloseButtonListener,
    } = rasterProbeMethods;

    setCloseButtonListener({
      rasterProbeCloseButton,
      onCloseClick,
    });
  },
  drawProbe() {
    const {
      currentRasterProbe,
      rasterProbeTitleContainer,
      cachedMetadata,
      rasterProbeImageContainer,
    } = privateProps.get(this);

    if (currentRasterProbe === null) return;

    const {
      updateTitle,
      updateImage,

    } = rasterProbeMethods;

    updateTitle({
      rasterProbeTitleContainer,
      currentRasterProbe,
    });

    updateImage({
      currentRasterProbe,
      cachedMetadata,
      rasterProbeImageContainer,
    });
  },
};

class RasterProbe {
  constructor(config) {
    const {
      rasterProbeContainer,
      rasterProbeTitleContainer,
      rasterProbeImageContainer,
      rasterProbeOverlayControlContainer,
      rasterProbeCloseButton,
    } = selections;

    privateProps.set(this, {
      rasterProbeContainer,
      rasterProbeTitleContainer,
      rasterProbeImageContainer,
      rasterProbeOverlayControlContainer,
      rasterProbeCloseButton,
      currentRasterProbe: null,
      onCloseClick: null,
      cachedMetadata: null,
    });

    const {
      init,
    } = privateMethods;

    this.config(config);

    init.call(this);
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
  update() {
    const {
      drawProbe,
    } = privateMethods;
    drawProbe.call(this);
  }
}

export default RasterProbe;

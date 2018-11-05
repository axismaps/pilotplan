/**
 * Module controls classes and callbacks related to toggling map views
 * @module views
 */
import { selections } from '../config/config';

const privateProps = new WeakMap();

const privateMethods = {
  updateClass({
    outerContainer,
    view,
    views,
  }) {
    Object.keys(views)
      .forEach((key) => {
        outerContainer.classed(views[key].className, key === view);
      });
  },
};

class Views {
  constructor(config) {
    const {
      outerContainer,
    } = selections;
    privateProps.set(this, {
      outerContainer,
      view: 'map',
      views: {
        map: {
          className: 'outer-container--map',
          initialized: false,
        },
        intro: {
          className: 'outer-container--intro',
          initialized: false,
        },
        eras: {
          className: 'outer-container--eras',
          initialized: false,
        },
      },
    });
    this.config(config);
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
  updateView() {
    const props = privateProps.get(this);
    const {
      initialize,
      view,
      views,
      outerContainer,
      mapLoaded,
    } = props;

    const {
      updateClass,
    } = privateMethods;

    updateClass({
      outerContainer,
      view,
      views,
    });

    if (!views[view].initialized &&
      Object.prototype.hasOwnProperty.call(initialize, view) &&
      mapLoaded) {
      initialize[view]();
    }
    views[view].initialized = true;
  }
  mapViewInitialized() {
    return privateProps.get(this)
      .views
      .map
      .initialized;
  }
}

export default Views;

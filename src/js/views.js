import { selections } from './config';

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
    } = props;
    const {
      updateClass,
    } = privateMethods;
    console.log('update', view);
    updateClass({
      outerContainer,
      view,
      views,
    });

    if (!views[view].initialized &&
      Object.prototype.hasOwnProperty.call(initialize, view)) {
      initialize[view]();
    }
    views[view].initialized = true;
  }
}

export default Views;

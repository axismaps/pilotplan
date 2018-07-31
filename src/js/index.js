import State from './state/state';
import Atlas from './atlas';
import Timeline from './timeline';

require('../scss/index.scss');

const components = {};

const app = {
  init() {
    components.state = new State({
      year: 2016,
    });

    const { state } = components;

    components.timeline = new Timeline({
      year: state.get('year'),
    });

    components.atlas = new Atlas({
      year: state.get('year'),
      onLoad: this.onLoad.bind(this),
    });
  },
  onLoad() {
    console.log('initialize other components', this);
  },
};


app.init();

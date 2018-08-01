import State from './state/state';
import setStateEvents from './stateEvents';
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
      updateYear(newYear) {
        state.update({ year: Math.round(newYear) });
      },
    });

    components.atlas = new Atlas({
      year: state.get('year'),
      onLoad: this.onLoad.bind(this),
    });
  },
  onLoad() {
    console.log('initialize other components', this);
    setStateEvents({ components });
  },
};


app.init();

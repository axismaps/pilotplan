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
      screenSize: [window.innerWidth, window.innerHeight],
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
    this.setStateEvents();
    this.listenForResize();
  },
  setStateEvents() {
    setStateEvents({ components });
  },
  listenForResize() {
    const { state } = components;
    d3.select(window).on('resize', () => {
      state.update({ screenSize: [window.innerWidth, window.innerHeight] });
    });
  },
};


app.init();

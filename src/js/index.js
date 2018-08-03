import State from './state/state';
import setStateEvents from './stateEvents';
import Atlas from './atlas';
import Timeline from './timeline';
import Layout from './layout';
import Sidebar from './sidebar';
import config from './config';

require('../scss/index.scss');

const components = {};

const app = {
  init() {
    components.state = new State({
      year: 2016,
      sidebarOpen: true,
      screenSize: [window.innerWidth, window.innerHeight],
    });

    const { state } = components;

    components.atlas = new Atlas({
      year: state.get('year'),
      onLoad: this.onLoad.bind(this),
    });
  },
  onLoad() {
    this.initComponents();
    this.setStateEvents();
    this.listenForResize();
  },
  initComponents() {
    const {
      state,
      atlas,
    } = components;

    state.set('currentLayers', atlas
      .getLayers()
      .filter(d => d.visibility === 'visible')
      .map(d => d.id));

    components.timeline = new Timeline({
      year: state.get('year'),
      updateYear(newYear) {
        state.update({ year: Math.round(newYear) });
      },
      yearRange: config.yearRange,
    });

    components.layout = new Layout({
      sidebarOpen: state.get('sidebarOpen'),
    });

    components.sidebar = new Sidebar({
      sidebarOpen: state.get('sidebarOpen'),
      layers: atlas.getLayers(),
      currentLayers: state.get('currentLayers'),
      onLayerClick(layerId) {
        const currentLayers = state.get('currentLayers');

        const layerIndex = currentLayers.indexOf(layerId);

        if (layerIndex === -1) {
          state.update({ currentLayers: [...currentLayers, layerId] });
        } else {
          state.update({
            currentLayers: [
              ...currentLayers.slice(0, layerIndex),
              ...currentLayers.slice(layerIndex + 1),
            ],
          });
        }
      },
    });
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

import State from './state/state';
import setStateEvents from './stateEvents';
import Atlas from './atlas';
import Timeline from './timeline';
import Layout from './layout';
import Sidebar from './sidebar';
import config from './config';
import loadData from './dataLoad';

require('../scss/index.scss');

const components = {};
let data;

const app = {
  components: {},
  data: null,
  init() {
    loadData((cleanedData) => {
      data = cleanedData;
      this.initState();
      this.initAtlas();
    });
  },
  initState() {
    components.state = new State({
      year: 2016,
      sidebarOpen: true,
      sidebarView: 'legend', // searching, results
      textSearch: null,
      clickSearch: null,
      areaSearch: null,
      currentLayers: null,
      language: 'en',
      screenSize: [window.innerWidth, window.innerHeight],
    });

    components.state.getAvailableLayers = () => {
      const year = components.state.get('year');
      const { layers } = data;

      const categories = layers.filter(d => d.startYear <= year);

      const filteredFeatures = categories.map((cat) => {
        const category = Object.assign({}, cat);
        category.features = category.features.filter(d => d.startYear <= year);
        return category;
      });
      return filteredFeatures;
    };
  },
  initAtlas() {
    const { state } = components;

    components.atlas = new Atlas({
      year: state.get('year'),
      onLoad: this.onAtlasLoad.bind(this),
    });
  },
  onAtlasLoad() {
    this.initComponents();
    this.setStateEvents();
    this.listenForResize();
  },
  initComponents() {
    const {
      state,
      atlas,
    } = components;

    console.log('layers', atlas.getLayers());

    // console.log(data.layers);

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
      layers: state.getAvailableLayers(),
      currentLayers: state.get('currentLayers'),
      language: state.get('language'),
      view: state.get('sidebarView'),
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
      onTextInput(val) {
        state.update({ textSearch: val });
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

import State from './state/state';
import setStateEvents from './stateEvents';
import Atlas from './atlas';
import Timeline from './timeline';
import Layout from './layout';
import Sidebar from './sidebar';
import { yearRange } from './config';
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
      areaSearchActive: false,
      areaSearch: null,
      currentLayers: null,
      highlightedFeature: null,
      language: 'en',
      screenSize: [window.innerWidth, window.innerHeight],
    });

    components.state.getAvailableLayers = () => {
      const year = components.state.get('year');
      const { layers } = data;

      const categories = layers.filter(d => d.startYear <= year);

      const filteredFeatures = categories.map((cat) => {
        const category = Object.assign({}, cat);
        category.features = category.features.filter(d =>
          d.startYear <= year &&
          d.endYear >= year);
        return category;
      });
      return filteredFeatures;
    };
  },
  initAtlas() {
    const { state } = components;

    components.atlas = new Atlas({
      highlightedFeature: state.get('highlightedFeature'),
      year: state.get('year'),
      layerNames: data.layerNames,
      onLoad: this.onAtlasLoad.bind(this),
      onClickSearch(features) {
        state.update({ clickSearch: features });
      },
      onAreaSearch(features) {
        state.update({ areaSearchActive: false, areaSearch: features });
      },
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
      yearRange,
    });

    components.layout = new Layout({
      sidebarOpen: state.get('sidebarOpen'),
      areaSearchActive: state.get('areaSearchActive'),
      onAreaButtonClick: () => {
        const areaSearchActive = !state.get('areaSearchActive');
        state.update({ areaSearchActive });
      },
    });

    components.sidebar = new Sidebar({
      highlightedFeature: state.get('highlightedFeature'),
      sidebarOpen: state.get('sidebarOpen'),
      availableLayers: state.getAvailableLayers(),
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
      onFeatureClick(feature) {
        console.log('feature', feature);
        const oldFeature = state.get('highlightedFeature');
        let newFeature;
        if (oldFeature === null) {
          newFeature = feature;
        } else {
          newFeature = oldFeature.id === feature.id ? null : feature;
        }

        state.update({ highlightedFeature: newFeature });
      },
    });
  },
  setStateEvents() {
    setStateEvents({ components, data });
  },
  listenForResize() {
    const { state } = components;
    d3.select(window).on('resize', () => {
      state.update({ screenSize: [window.innerWidth, window.innerHeight] });
    });
  },
};


app.init();

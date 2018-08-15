import State from './state/state';
import setStateEvents from './stateEvents';
import Atlas from './atlas';
import Timeline from './timeline';
import Layout from './layout';
import Sidebar from './sidebar';
import Footer from './footer';
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
      footerOpen: true,
      sidebarView: 'legend', // searching, results
      footerView: Object.keys(data.rasters)[1],
      textSearch: null,
      clickSearch: null,
      areaSearchActive: false,
      areaSearch: null,
      currentLayers: null,
      currentOverlay: null,
      currentView: null,
      highlightedLayer: null,
      highlightedFeature: null,
      language: 'en',
      screenSize: [window.innerWidth, window.innerHeight],
    });

    components.state.getAvailableLayers = () => {
      const year = components.state.get('year');
      const { layers } = data;

      const newLayers = layers.map((group) => {
        const newGroup = Object.assign({}, group);
        newGroup.layers = group.layers.filter(d =>
          d.startYear <= year &&
          d.endYear >= year)
          .map((layer) => {
            const newLayer = Object.assign({}, layer);
            newLayer.features = layer.features.filter(d =>
              d.startYear <= year &&
              d.endYear >= year &&
              d.id !== undefined);
            return newLayer;
          })
          .filter(layer => layer.features.length > 0);
        return newGroup;
      })
        .filter(group => group.layers.length > 0);
      return newLayers;
    };
    // console.log('views', data.rasters.views);

    components.state.getAvailableRasters = () => {
      const year = components.state.get('year');
      const footerView = components.state.get('footerView');
      const rasters = data.rasters[footerView];
      return rasters.filter(d => d.FirstYear <= year &&
        d.LastYear >= year);
    };

    // console.log('current raster', components.state.getAvailableRasters());

    components.state.getAllAvailableLayers = () => components.state.getAvailableLayers()
      .reduce((accumulator, group) => [...accumulator, ...group.layers], [])
      .map(layer => ({
        id: layer.id,
        status: true,
      }));

    components.state.set('currentLayers', components.state.getAllAvailableLayers());
  },
  initAtlas() {
    const { state } = components;

    components.atlas = new Atlas({
      highlightedFeature: state.get('highlightedFeature'),
      currentLayers: state.get('currentLayers'),
      currentOverlay: state.get('currentOverlay'),
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
      // atlas,
    } = components;

    // console.log(data.layers);

    // state.set('currentLayers', atlas
    //   .getLayers()
    //   .filter(d => d.visibility === 'visible')
    //   .map(d => d.id));

    // console.log('current layers', state.get('currentLayers'));

    components.timeline = new Timeline({
      year: state.get('year'),
      updateYear(newYear) {
        state.update({ year: Math.round(newYear) });
      },
      yearRange,
    });

    components.layout = new Layout({
      sidebarOpen: state.get('sidebarOpen'),
      footerOpen: state.get('footerOpen'),
      areaSearchActive: state.get('areaSearchActive'),
      onAreaButtonClick: () => {
        const areaSearchActive = !state.get('areaSearchActive');
        state.update({ areaSearchActive });
      },
    });
    console.log(Object.keys(data.rasters));
    components.footer = new Footer({
      footerView: state.get('footerView'),
      rasterData: state.getAvailableRasters(),
      onRasterClick(rasterData) {
        const getId = d => (d === null ? null : d.SS_ID);
        if (rasterData.type === 'overlay') {
          const currentOverlay = state.get('currentOverlay');
          if (getId(currentOverlay) === getId(rasterData)) {
            state.update({ currentOverlay: null });
          } else {
            state.update({ currentOverlay: rasterData });
          }
        } else if (rasterData.type === 'view') {
          state.update({ currentView: rasterData });
        }
      },
    });

    components.sidebar = new Sidebar({
      highlightedFeature: state.get('highlightedFeature'),
      sidebarOpen: state.get('sidebarOpen'),
      availableLayers: state.getAvailableLayers(),
      language: state.get('language'),
      view: state.get('sidebarView'),
      onLayerClick(layer) {
        const currentLayers = state.get('currentLayers');
        const layerIndex = currentLayers.map(d => d.id)
          .indexOf(layer.id);
        const newLayers = [
          ...currentLayers.slice(0, layerIndex),
          { id: layer.id, status: !currentLayers[layerIndex].status },
          ...currentLayers.slice(layerIndex + 1),
        ];
        state.update({ currentLayers: newLayers });
      },
      onTextInput(val) {
        state.update({ textSearch: val });
      },
      onFeatureClick(feature) {
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

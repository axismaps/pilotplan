import setStateEvents from './stateEvents';
import Atlas from './atlas';
import Timeline from './timeline';
import Layout from './layout';
import Sidebar from './sidebar';
import Footer from './footer';
import RasterProbe from './rasterProbe';
import getState from './initState';
import { yearRange } from './config';
import loadData from './dataLoad';

require('../scss/index.scss');

mapboxgl.accessToken = 'pk.eyJ1IjoiYXhpc21hcHMiLCJhIjoieUlmVFRmRSJ9.CpIxovz1TUWe_ecNLFuHNg';

// const components = {};
// const cachedMetadata = new Map();
// let data;

const app = {
  components: {},
  data: null,
  cachedMetadata: new Map(),
  init() {
    loadData((cleanedData) => {
      this.data = cleanedData;
      this.initState();
      this.initAtlas();
    });
  },
  initState() {
    this.components.state = getState();
    this.components.state.set('currentLayers', this.components.state.getAllAvailableLayers(this.data));
  },
  initAtlas() {
    const { state } = this.components;
    // console.log('test state', state.get('currentLayers'));
    // console.log('state', state.props());

    this.components.atlas = new Atlas({
      viewshedsGeo: this.data.viewshedsGeo,
      highlightedFeature: state.get('highlightedFeature'),
      currentLayers: state.get('currentLayers'),
      currentOverlay: state.get('currentOverlay'),
      rasterData: state.getAvailableRasters(this.data),
      year: state.get('year'),
      layerNames: this.data.layerNames,
      onLoad: this.onAtlasLoad.bind(this),
      onClickSearch(features) {
        state.update({ clickSearch: features });
      },
      onAreaSearch(features) {
        console.log('on area search');
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
    } = this.components;

    this.components.timeline = new Timeline({
      year: state.get('year'),
      updateYear(newYear) {
        state.update({ year: Math.round(newYear) });
      },
      yearRange,
    });

    this.components.layout = new Layout({
      overlayOn: state.get('currentOverlay') !== null,
      rasterProbeOpen: state.get('currentRasterProbe' !== null),
      sidebarOpen: state.get('sidebarOpen'),
      footerOpen: state.get('footerOpen'),
      allRasterOpen: state.get('allRasterOpen'),
      areaSearchActive: state.get('areaSearchActive'),
      onAreaButtonClick() {
        const areaSearchActive = !state.get('areaSearchActive');
        state.update({ areaSearchActive });
      },
      onOverlayButtonClick() {
        state.update({ currentRasterProbe: state.get('currentOverlay') });
      },
    });

    const onRasterClick = (rasterData) => {
      const getId = d => (d === null ? null : d.SS_ID);
      const currentView = state.get('currentView');
      const currentOverlay = state.get('currentOverlay');
      console.log('current view', currentView);
      if (rasterData.type === 'overlay') {
        if (getId(currentOverlay) === getId(rasterData)) {
          console.log('make overlay null');
          state.update({
            currentOverlay: null,
            currentRasterProbe: currentView === null ? null : currentView,
          });
        } else {
          state.update({
            currentOverlay: rasterData,
            currentRasterProbe: currentView === null ? rasterData : currentView,
          });
        }
      } else if (rasterData.type === 'view') {
        if (getId(currentView) === getId(rasterData)) {
          state.update({
            currentView: null,
            currentRasterProbe: null,
          });
        } else {
          state.update({
            currentView: rasterData,
            currentRasterProbe: rasterData,
          });
        }
      }
    };


    this.components.rasterProbe = new RasterProbe({
      cachedMetadata: this.cachedMetadata,
      currentView: state.get('currentView'),
      currentOverlay: state.get('currentOverlay'),
      onCloseClick() {
        // console.log('close click');
        const currentRasterProbe = state.get('currentRasterProbe');
        const { type } = currentRasterProbe;

        if (type === 'view') {
          state.update({
            currentView: null,
            currentRasterProbe: null,
          });
        } else if (type === 'overlay') {
          state.update({
            currentRasterProbe: null,
          });
        }
        // console.log('rasterprobe', currentRasterProbe);
      },
    });


    this.components.footer = new Footer({
      footerView: state.get('footerView'),
      rasterData: state.getAvailableRasters(this.data),
      cachedMetadata: this.cachedMetadata,
      onCategoryClick(newCategory) {
        const currentView = state.get('footerView');
        if (newCategory === currentView) return;
        state.update({ footerView: newCategory });
      },
      onRasterClick,
      onAllRasterCloseClick() {
        state.update({ allRasterOpen: false });
      },
      onAllRasterClick() {
        state.update({ allRasterOpen: true });
      },
    });

    this.components.sidebar = new Sidebar({
      highlightedFeature: state.get('highlightedFeature'),
      sidebarOpen: state.get('sidebarOpen'),
      availableLayers: state.getAvailableLayers(this.data),
      language: state.get('language'),
      view: state.get('sidebarView'),
      onLayerClick(layer) {
        const currentLayers = state.get('currentLayers');
        const layerIndex = currentLayers.map(d => d.id)
          .indexOf(layer.id);
        console.log('currentlayers', currentLayers);
        console.log('layer', layer, layerIndex);
        const newLayers = [
          ...currentLayers.slice(0, layerIndex),
          { id: layer.id, status: !currentLayers[layerIndex].status },
          ...currentLayers.slice(layerIndex + 1),
        ];
        state.update({ currentLayers: newLayers });
      },
      onRasterClick,
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
    setStateEvents({ components: this.components, data: this.data });
  },
  listenForResize() {
    const { state } = this.components;
    d3.select(window).on('resize', () => {
      state.update({ screenSize: [window.innerWidth, window.innerHeight] });
    });
  },
};


app.init();

import setStateEvents from './stateEvents';
import Atlas from './atlas';
import Timeline from './timeline';
import Layout from './layout';
import Sidebar from './sidebar';
import Footer from './footer';
import getState from './initState';
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
    components.state = getState();
    components.state.set('currentLayers', components.state.getAllAvailableLayers(data));
  },
  initAtlas() {
    const { state } = components;
    console.log('test state', state.get('currentLayers'));
    console.log('state', state.props());

    components.atlas = new Atlas({
      viewshedsGeo: data.viewshedsGeo,
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
      allRasterOpen: state.get('allRasterOpen'),
      areaSearchActive: state.get('areaSearchActive'),
      onAreaButtonClick: () => {
        const areaSearchActive = !state.get('areaSearchActive');
        state.update({ areaSearchActive });
      },
    });

    // should allRaster and footer be combined into one module?
    // have a lot of shared properties/methods
    const cachedMetadata = new Map();

    const onRasterClick = (rasterData) => {
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
    };


    // components.allRaster = new AllRaster({
    //   cachedMetadata,
    //   rasterData: state.getAvailableRasters(data),
    // onOuterClick() {
    //   state.update({ allRasterOpen: false });
    // },
    //   onRasterClick(rasterData) {
    //     // close allRaster screen first
    //     onRasterClick(rasterData);
    //   },
    // });


    components.footer = new Footer({
      footerView: state.get('footerView'),
      rasterData: state.getAvailableRasters(data),
      cachedMetadata,
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

    components.sidebar = new Sidebar({
      highlightedFeature: state.get('highlightedFeature'),
      sidebarOpen: state.get('sidebarOpen'),
      availableLayers: state.getAvailableLayers(data),
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

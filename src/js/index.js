import setStateEvents from './stateUpdate';
import Intro from './intro';
import Atlas from './atlas';
import Timeline from './timeline';
import Layout from './layout';
import Sidebar from './sidebar';
import Footer from './footer';
import RasterProbe from './rasterProbe';
import getState from './initState';
import { yearRange } from './config';
import loadData from './dataLoad';
import Views from './views';
import Eras from './eras';
import UrlParams from './url';
import LanguageDropdown from './languageDropdown';
import EraDropdown from './eraDropdown';

require('../scss/index.scss');

mapboxgl.accessToken = 'pk.eyJ1IjoiYXhpc21hcHMiLCJhIjoieUlmVFRmRSJ9.CpIxovz1TUWe_ecNLFuHNg';

const app = {
  components: {},
  data: null,
  cachedMetadata: new Map(),
  init() {
    loadData((cleanedData) => {
      this.data = cleanedData;
      console.log('translations', this.data.translations);
      this.initURL();

      this.initState();

      this.setStateEvents();

      this.initAtlas();
      this.initViews();
      this.initIntro();
      this.initEras();
      this.initLayout();


      // setTimeout(() => {
      //   this.components.state.update({
      //     year: 2000,
      //   });
      // }, 3000);

      // setTimeout(() => {
      //   const { state } = this.components;

      //   state.update({ view: 'map' });
      // }, 2000);
    });
  },
  initURL() {
    this.components.urlParams = new UrlParams({
      rasterData: this.data.rasters,
    });
  },
  initState() {
    const { urlParams } = this.components;

    this.components.state = getState({ urlParams });

    this.components.state.set('currentLayers', this.components.state.getAllAvailableLayers(this.data));
  },
  initViews() {
    const { state } = this.components;
    this.components.views = new Views({
      view: state.get('view'),
      initialize: {
        map: () => {
          // this initializes components on first toggle to map view
          // if components aren't already initialized from loading on map view
          this.initComponents();
          this.listenForResize();
        },
      },
      mapLoaded: state.get('mapLoaded'),
    });

    this.components.views.updateView();
  },
  initIntro() {
    const { state } = this.components;

    this.components.intro = new Intro({
      onBeginButtonClick: () => {
        state.update({ view: 'map' });
      },
      onJumpButtonClick: () => {
        state.update({ view: 'eras' });
      },
      translations: this.data.translations,
      language: state.get('language'),
    });

    this.components.languageDropdown = new LanguageDropdown({
      language: state.get('language'),
      onClick: () => {
        const currentLanguage = state.get('language');
        state.update({ language: currentLanguage === 'en' ? 'pr' : 'en' });
      },
    });

    this.components.eraDropdown = new EraDropdown({
      language: state.get('language'),
      onClick: (era) => {
        state.update({
          year: era.dates[0],
          view: 'eras',
        });
      },
      eras: this.data.eras,
      translations: this.data.translations,
    });
  },
  initEras() {
    const { state } = this.components;

    this.components.eras = new Eras({
      language: state.get('language'),
      eras: this.data.eras,
      onMapButtonClick: () => {
        state.update({ view: 'map' });
      },

      updateYear: (newYear) => {
        state.update({ year: newYear });
      },
      mouseEventsDisabled: (disabled) => {
        state.update({ mouseEventsDisabled: disabled });
      },
      year: state.get('year'),
      view: state.get('view'),
    });
  },
  initAtlas() {
    const { state } = this.components;

    this.components.atlas = new Atlas({
      overlayOpacity: state.get('overlayOpacity'),
      initialLocation: state.get('currentLocation'),
      viewshedsGeo: this.data.viewshedsGeo,
      highlightedFeature: state.get('highlightedFeature'),
      currentLayers: state.get('currentLayers'),
      currentOverlay: state.get('currentOverlay'),
      currentView: state.get('currentView'),
      rasterData: state.getAvailableRasters(this.data),
      year: state.get('year'),
      layerNames: this.data.layerNames,
      // onLoad: this.onAtlasLoad.bind(this),
      onLoad: () => {
        if (state.get('view') === 'map') {
          // initialize components on load only if starting on map view
          // otherwise, wait to initialize until toggling map view for first time
          // this.components.layout
          //   .config({
          //     exportLink: this.components.atlas.getMapExportLink(),
          //   })
          //   .initExportButton();
          this.initComponents();
          this.listenForResize();
        }
        state.update({ mapLoaded: true });
      },
      onClickSearch(features) {
        state.update({ clickSearch: features });
      },
      onAreaSearch(features) {
        state.update({ areaSearchActive: false, areaSearch: features });
      },
      onViewClick(newView) {
        state.update({
          currentView: newView,
          currentRasterProbe: newView,
        });
      },
      onMove(currentLocation) {
        state.update({
          currentLocation,
        });
        // state.update({
        // currentBounds: newBounds,
        // });
      },
      translations: this.data.translations,
      language: state.get('language'),
    });
  },
  // onAtlasLoad() {
  //   const { state } = this.components;
  //   if (state.get('view') === 'map') {

  //   }
  //   this.initComponents();
  //   this.listenForResize();
  // },
  initLayout() {
    const { state, eras, atlas } = this.components;
    this.components.layout = new Layout({
      translations: this.data.translations,
      language: state.get('language'),
      currentEra: eras.getCurrentEra(),
      overlayOn: state.get('currentOverlay') !== null,
      rasterProbeOpen: state.get('currentRasterProbe' !== null),
      sidebarOpen: state.get('sidebarOpen'),
      footerOpen: state.get('footerOpen'),
      allRasterOpen: state.get('allRasterOpen'),
      areaSearchActive: state.get('areaSearchActive'),
      registerOpen: state.get('registerOpen'),
      toggleRegisterScreen(status) {
        state.update({ registerOpen: status });
      },
      onAreaButtonClick() {
        const areaSearchActive = !state.get('areaSearchActive');
        state.update({ areaSearchActive });
      },
      onOverlayButtonClick() {
        state.update({ currentRasterProbe: state.get('currentOverlay') });
      },
      onErasButtonClick() {
        state.update({ view: 'eras' });
      },
      onSidebarToggleClick() {
        state.update({ sidebarOpen: !state.get('sidebarOpen') });
      },
      onBackButtonClick: () => {
        state.update({ view: 'intro' });
      },
      getExportLink: () => atlas.getMapExportLink(),
    });
  },
  initComponents() {
    const {
      state,
    } = this.components;

    console.log('initialize components');

    this.components.timeline = new Timeline({
      language: state.get('language'),
      eras: this.data.eras,
      year: state.get('year'),
      updateYear(newYear) {
        state.update({ year: Math.round(newYear) });
      },
      yearRange,
    });


    const onRasterClick = (rasterData) => {
      const getId = d => (d === null ? null : d.SS_ID);
      const currentView = state.get('currentView');
      const currentOverlay = state.get('currentOverlay');
      if (rasterData.type === 'overlay') {
        if (getId(currentOverlay) === getId(rasterData)) {
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
      overlayOpacity: state.get('overlayOpacity'),
      onCloseClick() {
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
      },
      onOverlayCloseClick() {
        state.update({
          currentOverlay: null,
          currentRasterProbe: null,
        });
      },
      onSliderDrag(newOpacity) {
        state.update({
          overlayOpacity: newOpacity,
        });
      },
    });

    this.components.footer = new Footer({
      translations: this.data.translations,
      language: state.get('language'),
      year: state.get('year'),
      footerView: state.getAutoFooterView(this.data),
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
      onToggleClick(toggle) {
        state.update({ footerOpen: toggle === undefined ? !state.get('footerOpen') : toggle });
      },
    });

    this.components.sidebar = new Sidebar({
      highlightedFeature: state.get('highlightedFeature'),
      sidebarOpen: state.get('sidebarOpen'),
      layerStyles: this.components.atlas.getStyle().layers,
      availableLayers: state.getAvailableLayers(this.data),
      viewLayersOn: state.getAvailableRasters(this.data).get('views').length > 0,
      cachedMetadata: this.cachedMetadata,
      translations: this.data.translations,
      language: state.get('language'),
      view: state.get('sidebarView'),
      onSearchReturn() {
        state.update({ highlightedFeature: null });
      },
      onLayerClick(layer) {
        const currentLayers = state.get('currentLayers');
        const layerIndex = currentLayers.map(d => d.sourceLayer)
          .indexOf(layer.sourceLayer);
        const newLayers = [
          ...currentLayers.slice(0, layerIndex),
          { sourceLayer: layer.sourceLayer, status: !currentLayers[layerIndex].status },
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
        // test if 'feature' is entire layer (has 'dataLayer') or array of features
        let newFeature;
        // if no old feature
        if (oldFeature === null) {
          newFeature = feature;
          // if new feature is entire layer
        } else if (Object.prototype.hasOwnProperty.call(feature, 'dataLayer')) {
          newFeature = oldFeature.dataLayer === feature.dataLayer ? null : feature;
          // if new feature is array of features (not entire layer)
          // and old layer is also array of features
        } else if (Array.isArray(oldFeature)) {
          newFeature = oldFeature[0].id === feature[0].id ? null : feature;
        } else {
          newFeature = feature;
        }

        console.log('new feature', newFeature);

        state.update({ highlightedFeature: newFeature });
      },
    });


    state.update({ componentsInitialized: true });
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

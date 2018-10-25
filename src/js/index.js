import setStateEvents from './stateUpdate';
import Intro from './intro';
import Timeline from './timeline';
import Layout from './layout';
import RasterProbe from './rasterProbe';
import getState from './initState';
import { yearRange } from './config';
import loadData from './dataLoad';
import Views from './views';
import Eras from './eras';
import UrlParams from './url';
import LanguageDropdown from './languageDropdown';
import EraDropdown from './eraDropdown';
import initAtlas from './initAtlas';
import initSidebar from './initSidebar';
import initFooter from './initFooter';

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
    this.components.state.set(
      'footerView',
      this.components.state.getAutoFooterView(this.data),
    );
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
      translations: this.data.translations,
    });
  },
  initAtlas,
  initLayout() {
    const { state, eras, atlas } = this.components;
    this.components.layout = new Layout({
      mobile: state.get('mobile'),
      year: state.get('year'),
      zoomedOut: state.get('currentLocation') !== null ?
        state.get('currentLocation').zoom < 11 : false,
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
        // console.log('close sidebar?', !state.get('sidebarOpen'));
        state.update({ sidebarOpen: !state.get('sidebarOpen') });
      },
      onBackButtonClick: () => {
        state.update({ view: 'intro' });
      },
      getExportLink: () => atlas.getMapExportLink(),
      getCanvas: () => atlas.getCanvas(),
    });
  },
  initComponents() {
    const {
      state,
    } = this.components;

    console.log('initialize components');
    setTimeout(() => {
      d3.select('.mapboxgl-ctrl-attrib')
        .styles({
          opacity: 1,
        })
        .html(`
        <a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a>
        <a class="mapbox-improve-map" href="https://www.mapbox.com/feedback/?owner=axismaps&amp;id=cjlxzhuj652652smt1jf50bq5&amp;access_token=pk.eyJ1IjoiYXhpc21hcHMiLCJhIjoieUlmVFRmRSJ9.CpIxovz1TUWe_ecNLFuHNg" target="_blank">Improve this map</a>
        <a href="https://www.digitalglobe.com/" target="_blank">© DigitalGlobe</a>
        `);
    }, 1000);


    this.components.timeline = new Timeline({
      mobile: state.get('mobile'),
      language: state.get('language'),
      eras: this.data.eras,
      year: state.get('year'),
      updateYear(newYear) {
        state.update({ year: Math.round(newYear) });
      },
      yearRange,
      stepSections: [
        {
          years: [yearRange[0], 1955],
          increment: 2,
        },
        {
          years: [1955, yearRange[1]],
          increment: 1,
        },
      ],
    });


    this.components.rasterProbe = new RasterProbe({
      cachedMetadata: this.cachedMetadata,
      currentView: state.get('currentView'),
      currentOverlay: state.get('currentOverlay'),
      overlayOpacity: state.get('overlayOpacity'),
      mobile: state.get('mobile'),
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

    this.components.footer = initFooter.call(this);

    this.components.sidebar = initSidebar.call(this);


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

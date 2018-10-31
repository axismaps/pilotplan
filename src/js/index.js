/**
 * Initializes components, sets callbacks for changes to application state
 * @module index
 */

import setStateEvents from './stateUpdate/stateUpdate';

import initState from './initComponents/initState';
import initData from './initComponents/initData';
import initURL from './initComponents/initURL';
import initAtlas from './initComponents/initAtlas';
import initSidebar from './initComponents/initSidebar';
import initFooter from './initComponents/initFooter';
import initViews from './initComponents/initViews';
import initIntro from './initComponents/initIntro';
import initEras from './initComponents/initEras';
import initLayout from './initComponents/initLayout';
import initTimeline from './initComponents/initTimeline';
import initRasterProbe from './initComponents/initRasterProbe';

import { accessToken } from './config';

require('../scss/index.scss');

const app = {
  components: {},
  data: null,
  cachedMetadata: new Map(),
  init() {
    mapboxgl.accessToken = accessToken;

    initData((cleanedData) => {
      this.data = cleanedData;

      this.initURL();
      this.initState();
      this.setStateEvents();

      this.initAtlas();
      this.initViews();
      this.initIntro();
      this.initEras();
      this.initLayout();
    });
  },
  initURL,
  initState,
  initViews,
  initIntro,
  initEras,
  initAtlas,
  initLayout,
  initComponents() {
    const {
      state,
    } = this.components;

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

    initTimeline.call(this);
    initRasterProbe.call(this);
    initFooter.call(this);
    initSidebar.call(this);

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

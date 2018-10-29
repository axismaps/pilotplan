/**
 * Initializes components, sets callbacks for changes to application state
 * @module index
 */

import setStateEvents from './stateUpdate';


import initState from './initState';
import initData from './initData';

import initURL from './initURL';
import initAtlas from './initAtlas';
import initSidebar from './initSidebar';
import initFooter from './initFooter';
import initViews from './initViews';
import initIntro from './initIntro';
import initEras from './initEras';
import initLayout from './initLayout';
import initTimeline from './initTimeline';
import initRasterProbe from './initRasterProbe';

require('../scss/index.scss');

mapboxgl.accessToken = 'pk.eyJ1IjoiYXhpc21hcHMiLCJhIjoieUlmVFRmRSJ9.CpIxovz1TUWe_ecNLFuHNg';

const app = {
  components: {},
  data: null,
  cachedMetadata: new Map(),
  init() {
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

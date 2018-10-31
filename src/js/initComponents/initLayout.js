import Layout from '../layout/layout';

const initLayout = function initLayout() {
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
    onMobileProbeClose: () => {
      state.update({ highlightedFeature: null });
    },
    getExportLink: () => atlas.getMapExportLink(),
    getCanvas: () => atlas.getCanvas(),
  });
};

export default initLayout;

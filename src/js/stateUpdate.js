import getUpdateYear from './stateUpdateYear';
import getUpdateView from './stateUpdateView';
import getUpdateTextSearch from './stateUpdateTextSearch';
import getUpdateLanguage from './stateUpdateLanguage';
import getStateUpdateCurrentLocation from './stateUpdateCurrentLocation';
import getUpdateClickSearch from './stateUpdateClickSearch';
import getAreaSearch from './stateUpdateAreaSearch';

const setStateEvents = ({ components, data }) => {
  const { state } = components;

  state.registerCallbacks({
    highlightedLayer() {
      const {
        atlas,
        sidebar,
      } = components;
      const { highlightedLayer } = this.props();
      sidebar.config({ highlightedLayer }).updateHighlightedLayer();
      atlas.config({ highlightedLayer }).updateHighlightedLayer();
    },
    year: getUpdateYear({ data, components }),
    view: getUpdateView({ components }),
    language: getUpdateLanguage({ data, components }),
    currentLocation: getStateUpdateCurrentLocation({ components }),
    textSearch: getUpdateTextSearch({ components }),
    clickSearch: getUpdateClickSearch({ components }),
    transitionsDisabled() {
      const { transitionsDisabled } = this.props();
      const { layout } = components;

      layout
        .config({
          transitionsDisabled,
        })
        .toggleTransitions();
    },
    screenSize() {
      const {
        timeline,
      } = components;

      timeline
        .updateScreenSize();
    },
    sidebarOpen() {
      const {
        sidebarOpen,
        // transitionsDisabled,
      } = this.props();
      const {
        layout,
        // atlas,
        sidebar,
      } = components;

      layout
        .config({
          sidebarOpen,
        })
        .updateSidebar();

      if (sidebarOpen) {
        layout.removeSidebarToggleLabel();
      } else {
        // sidebar
        //   .config({
        //     sidebarView: 'legend',
        //   })
        //   .updateView();
        sidebar.clearSearch();
      }
    },
    footerOpen() {
      const {
        footerOpen,
        // transitionsDisabled,
      } = this.props();
      const {
        layout,
        // atlas,
      } = components;

      layout
        .config({
          footerOpen,
        })
        .updateFooter();
    },
    currentLayers() {
      const {
        currentLayers,
      } = this.props();
      const {
        atlas,
        sidebar,
      } = components;
      atlas
        .config({
          currentLayers,
        })
        .updateCurrentLayers();

      sidebar
        .config({
          currentLayers,
        })
        .updateCurrentLayers();
    },


    areaSearch: getAreaSearch({ components }),
    areaSearchActive() {
      const {
        areaSearchActive,
      } = this.props();
      const {
        layout,
        atlas,
      } = components;

      layout
        .config({
          areaSearchActive,
        })
        .updateAreaSearch();

      layout.removeHintProbe();

      atlas
        .config({
          areaSearchActive,
        })
        .updateAreaSearch();
    },
    highlightedFeature() {
      const {
        highlightedFeature,
        // year,
      } = this.props();
      // console.log('extents', extents);
      // console.log('highlightfeature', highlightedFeature);

      const {
        atlas,
        sidebar,
      } = components;
      //
      atlas
        .config({
          highlightedFeature,
        })
        .updateHighlightedFeature();

      // if we're looking at layer, zoom to that layer extent from extents.json

      sidebar
        .config({
          highlightedFeature,
        })
        .updateHighlightedFeature();
    },
    currentOverlay() {
      const {
        currentOverlay,
        overlayOpacity,
      } = this.props();

      const {
        atlas,
        layout,
        urlParams,
      } = components;

      // console.log('overlay', currentOverlay);
      layout
        .config({
          overlayOn: currentOverlay !== null,
        })
        .updateOverlay();

      atlas
        .config({
          currentOverlay,
        })
        .updateOverlay();

      urlParams
        .config({
          overlay: currentOverlay !== null ? currentOverlay.SS_ID : null,
        })
        .update();
      if (overlayOpacity !== 1 && currentOverlay !== null) {
        state.update({ overlayOpacity: 1 });
      }
    },
    currentView() {
      const {
        currentView,
      } = this.props();

      const {
        atlas,
      } = components;

      atlas
        .config({
          currentView,
        })
        .updateView();
    },
    currentRasterProbe() {
      const {
        currentRasterProbe,
      } = this.props();

      const {
        layout,
        rasterProbe,
      } = components;


      layout
        .config({
          rasterProbeOpen: currentRasterProbe !== null,
        })
        .updateRasterProbe();

      rasterProbe
        .config({
          currentRasterProbe,
        })
        .update();
    },
    footerView() {
      const {
        footerView,
      } = this.props();
      const {
        footer,
        atlas,
      } = components;

      footer
        .config({
          footerView,
          rasterData: this.getAvailableRasters(data),
        })
        .updateRasterData();

      atlas
        .config({
          rasterData: this.getAvailableRasters(data),
        });
    },
    allRasterOpen() {
      const {
        allRasterOpen,
      } = this.props();
      const {
        layout,
        footer,
      } = components;

      layout
        .config({
          allRasterOpen,
        })
        .updateAllRaster();

      footer
        .config({
          allRasterOpen,
        })
        .updateAllRaster();
    },
    mouseEventsDisabled() {
      const { mouseEventsDisabled } = this.props();
      const { layout } = components;
      layout
        .config({ mouseEventsDisabled })
        .toggleMouseEvents();
    },
    mapLoaded() {
      const { mapLoaded } = this.props();
      const { views, layout } = components;
      views.config({ mapLoaded });
      layout.config({ mapLoaded }).updateMapLoaded();
    },
    overlayOpacity() {
      const { overlayOpacity } = this.props();
      const {
        rasterProbe,
        atlas,
      } = components;

      rasterProbe
        .config({
          overlayOpacity,
        })
        .updateSlider();
      atlas
        .config({
          overlayOpacity,
        })
        .updateOverlayOpacity();
    },
    registerOpen() {
      const { registerOpen } = this.props();
      const { layout } = components;

      layout
        .config({ registerOpen })
        .updateRegisterScreen();
    },
  });
};

export default setStateEvents;

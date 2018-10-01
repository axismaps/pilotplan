import getUpdateYear from './stateUpdateYear';
import getUpdateView from './stateUpdateView';
import getUpdateTextSearch from './stateUpdateTextSearch';
import getUpdateLanguage from './stateUpdateLanguage';
import {
  formatNonRasterResults,
  formatRasterResults,
} from './formatSearchResults';

const setStateEvents = ({ components, data }) => {
  const { state } = components;

  state.registerCallbacks({
    year: getUpdateYear({ data, components }),
    view: getUpdateView({ components }),
    language: getUpdateLanguage({ data, components }),
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
      } = components;

      layout
        .config({
          sidebarOpen,
        })
        .updateSidebar();
      // if (transitionsDisabled) {
      //   atlas.resizeMap();
      // } else {
      //   setTimeout(() => {
      //     atlas.resizeMap();
      //   }, 500);
      // }
      if (sidebarOpen) {
        layout.removeSidebarToggleLabel();
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

      // if (transitionsDisabled) {
      //   atlas.resizeMap();
      // } else {
      //   setTimeout(() => {
      //     atlas.resizeMap();
      //   }, 500);
      // }
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
    textSearch: getUpdateTextSearch({ components }),
    clickSearch() {
      const {
        clickSearch,
      } = this.props();
      const {
        sidebar,
        layout,
      } = components;

      const { raster, nonRaster } = clickSearch;

      const results = {
        raster: formatRasterResults(raster),
        nonRaster: formatNonRasterResults(nonRaster),
      };

      sidebar
        .config({
          results,
          view: 'clickSearch',
        })
        .updateResults();

      layout.removeHintProbe();
      // instead of this, check first if only one result
      // if only one result, make this highlightedFeature
      const layersToClear = this.getLayersToClear([
        'highlightedFeature',
      ]);
      if (clickSearch !== null && !this.get('sidebarOpen')) {
        this.update({ sidebarOpen: true });
      }

      state.update(layersToClear);
    },
    areaSearch() {
      const {
        areaSearch,
      } = this.props();
      const {
        sidebar,
        layout,
      } = components;

      const { raster, nonRaster } = areaSearch;

      const results = {
        raster: formatRasterResults(raster),
        nonRaster: formatNonRasterResults(nonRaster),
      };

      sidebar
        .config({
          results,
          view: 'clickSearch',
        })
        .updateResults();

      layout.removeHintProbe();

      const layersToClear = this.getLayersToClear([
        'highlightedFeature',
      ]);
      state.update(layersToClear);

      if (areaSearch !== null && !this.get('sidebarOpen')) {
        this.update({ sidebarOpen: true });
      }
    },
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
      } = this.props();

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
      const { views } = components;
      views.config({ mapLoaded });
    },

    currentLocation() {
      const { currentLocation } = this.props();
      const {
        urlParams,
        views,
        layout,
      } = components;
      const { center, bearing, zoom } = currentLocation;
      if (!views.mapViewInitialized()) return;

      urlParams
        .config({
          center: `${center.lat},${center.lng}`,
          zoom,
          bearing,
        })
        .update();

      layout
        .config({
          rotated: bearing !== -72,
        })
        .updateRotationButton();
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

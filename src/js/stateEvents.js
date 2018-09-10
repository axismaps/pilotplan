import getUpdateYear from './stateUpdateYear';

const setStateEvents = ({ components, data }) => {
  const { state } = components;

  const utils = {
    formatNonRasterResults(features) {
      return [...new Set(features.map(d => d.sourceLayer))]
        .map(groupName => ({
          id: groupName,
          features: features
            .filter(d => d.sourceLayer === groupName)
            .filter(d => d.properties.Name !== ''),
        }))
        .filter(d => d.features.length > 0);
    },
    formatRasterResults(rasters) {
      return [...new Set(rasters.map(d => d.category))]
        .map(categoryName => ({
          id: categoryName,
          features: rasters
            .filter(d => d.category === categoryName)
            .map(d => Object.assign({}, d, { id: d.SS_ID })),
        }))
        .filter(d => d.features.length > 0);
    },
  };

  state.registerCallbacks({
    year: getUpdateYear({ data, components }),
    // componentsInitialized() {
    //   console.log('yes', this.get('componentsInitialized'));
    // },
    view() {
      const {
        view,
      } = this.props();
      const {
        views,
        sidebar,
        eras,
      } = components;

      views
        .config({ view })
        .updateView();


      eras
        .config({ view });


      if (!this.get('componentsInitialized')) return;

      const layersToClear = this.getLayersToClear([
        'currentOverlay',
        'currentRasterProbe',
        'currentView',
        'highlightedFeature',
        'allRasterOpen',
      ]);

      if (sidebar !== undefined && sidebar.getView() !== 'legend') {
        sidebar.clearSearch();
      }


      state.update(Object.assign({
        // footerOpen: view === 'map',
        // sidebarOpen: view === 'map',
        footerOpen: true,
        sidebarOpen: true,
      }, layersToClear));
      // if (view === 'eras') {
      //   state.update({ year });
      // }
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
      } = this.props();
      const {
        layout,
        atlas,
      } = components;

      layout
        .config({
          sidebarOpen,
        })
        .updateSidebar();
      atlas.resizeMap();
    },
    footerOpen() {
      const {
        footerOpen,
      } = this.props();
      const {
        layout,
        atlas,
      } = components;

      layout
        .config({
          footerOpen,
        })
        .updateFooter();
      atlas.resizeMap();
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
    textSearch() {
      const {
        textSearch,
      } = this.props();
      const {
        sidebar,
        atlas,
      } = components;

      if (textSearch.length < 3) {
        sidebar
          .config({
            results: null,
            view: 'legend',
          })
          .updateResults();
      } else {
        const searchResults = atlas.textSearch(textSearch);
        const { raster, nonRaster } = searchResults;

        const formattedResults = {
          raster: utils.formatRasterResults(raster),
          nonRaster: utils.formatNonRasterResults(nonRaster),
        };
        //

        sidebar
          .config({
            results: formattedResults,
            view: 'textSearch',
          })
          .updateResults();

        const layersToClear = this.getLayersToClear([
          'highlightedFeature',
        ]);
        state.update(layersToClear);
      }
    },
    clickSearch() {
      const {
        clickSearch,
      } = this.props();
      const {
        sidebar,
      } = components;

      // const results = utils.formatNonRasterResults(clickSearch);
      const { raster, nonRaster } = clickSearch;

      const results = {
        raster: utils.formatRasterResults(raster),
        nonRaster: utils.formatNonRasterResults(nonRaster),
      };

      sidebar
        .config({
          results,
          view: 'clickSearch',
        })
        .updateResults();
      // instead of this, check first if only one result
      // if only one result, make this highlightedFeature
      const layersToClear = this.getLayersToClear([
        'highlightedFeature',
      ]);
      state.update(layersToClear);
    },
    areaSearch() {
      const {
        areaSearch,
      } = this.props();
      const {
        // layout,
        sidebar,
      } = components;

      const { raster, nonRaster } = areaSearch;

      const results = {
        raster: utils.formatRasterResults(raster),
        nonRaster: utils.formatNonRasterResults(nonRaster),
      };

      sidebar
        .config({
          results,
          view: 'clickSearch',
        })
        .updateResults();

      const layersToClear = this.getLayersToClear([
        'highlightedFeature',
      ]);
      state.update(layersToClear);
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
      } = this.props();

      const {
        atlas,
        layout,
      } = components;

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
    },
    currentView() {
      // update atlas here

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
      //
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
  });
};

export default setStateEvents;

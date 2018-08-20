const setStateEvents = ({ components, data }) => {
  const { state } = components;

  const utils = {
    formatResults(features) {
      const results = [...new Set(features.map(d => d.sourceLayer))]
        .map((groupName) => {
          const group = {
            id: groupName,
            features: features
              .filter(d => d.sourceLayer === groupName),
          };
          return group;
        });
      return results;
    },
  };

  state.registerCallbacks({
    year() {
      const {
        timeline,
        atlas,
        sidebar,
        footer,
      } = components;

      const {
        year,
      } = this.props();
      // console.log('year', year);

      timeline
        .config({
          year,
        })
        .updateYear();

      atlas
        .config({
          year,
        })
        .updateYear();

      footer
        .config({
          rasterData: this.getAvailableRasters(data),
        })
        // .updateFooterView();
        .updateRasterData();

      // const rasters = this.getAvailableRasters(data);
      // console.log('available rasters', rasters);

      sidebar
        .config({
          availableLayers: this.getAvailableLayers(data),
        })
        .updateAvailableLayers();

      state.update({ currentOverlay: null });
    },
    screenSize() {
      // const {
      //   screenSize,
      // } = this.props();
      const {
        timeline,
      } = components;
      // console.log(screenSize);
      timeline
        .updateScreenSize();
    },
    sidebarOpen() {
      const {
        sidebarOpen,
      } = this.props();
      const {
        layout,
      } = components;

      layout
        .config({
          sidebarOpen,
        })
        .updateSidebar();
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
      console.log('SEARCH: ', textSearch);
      if (textSearch.length < 3) {
        sidebar
          .config({
            results: null,
            view: 'legend',
          })
          .updateResults();
      } else {
        const results = atlas.textSearch(textSearch);
        sidebar
          .config({
            results,
            view: 'textSearch',
          })
          .updateResults();
        // console.log('results', results);
      }
    },
    clickSearch() {
      const {
        clickSearch,
      } = this.props();
      const {
        sidebar,
      } = components;

      const results = utils.formatResults(clickSearch);

      sidebar
        .config({
          results,
          view: 'clickSearch',
        })
        .updateResults();
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
    areaSearch() {
      const {
        areaSearch,
      } = this.props();
      const {
        layout,
        sidebar,
      } = components;
      // console.log('area', areaSearch);
      // console.log('formatted', utils.formatResults(areaSearch));

      layout.config({ });

      sidebar
        .config({
          results: utils.formatResults(areaSearch),
          view: 'clickSearch',
        })
        .updateResults();
    },
    highlightedFeature() {
      const {
        highlightedFeature,
      } = this.props();

      const {
        atlas,
        sidebar,
      } = components;
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

      console.log('current overlay', currentOverlay);
      const {
        atlas,
      } = components;

      atlas
        .config({
          currentOverlay,
        })
        .updateOverlay();
    },
    currentView() {
      const {
        currentView,
      } = this.props();
      console.log('current view', currentView);
    },
    footerView() {
      const {
        footerView,
      } = this.props();
      const {
        footer,
      } = components;

      footer
        .config({
          footerView,
          rasterData: this.getAvailableRasters(data),
        })
        .updateRasterData();
      // .updateFooterView();
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
  });
};

export default setStateEvents;

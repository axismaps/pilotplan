const setStateEvents = ({ components }) => {
  const { state } = components;

  const utils = {
    formatResults(features) {
      console.log('features', features);
      const results = [...new Set(features.map(d => d.sourceLayer))]
        .map((groupName) => {
          const group = {
            id: groupName,
            features: features
              .filter(d => d.sourceLayer === groupName),
          };
          return group;
        });
      console.log('formatted results', results);
      return results;
    },
  };

  state.registerCallbacks({
    year() {
      const {
        timeline,
        atlas,
        sidebar,
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


      sidebar
        .config({
          availableLayers: this.getAvailableLayers(),
        })
        .updateAvailableLayers();

      // setTimeout(() => {
      //   const renderedLayers = atlas.getRenderedLayers();
      //   console.log('rendered', renderedLayers.length);
      // }, 0);
    },
    screenSize() {
      const {
        screenSize,
      } = this.props();
      const {
        timeline,
      } = components;
      console.log(screenSize);
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
        console.log('results', results);
      }
    },
    clickSearch() {
      const {
        clickSearch,
      } = this.props();
      const {
        sidebar,
      } = components;

      console.log('features', clickSearch);
      const results = utils.formatResults(clickSearch);
      console.log('results', results);
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
    },
    highlightedLayer() {
      const { highlightedLayer } = this.props();
      console.log('id', highlightedLayer);
      const {
        atlas,
        sidebar,
      } = components;

      atlas
        .config({
          highlightedLayer,
        })
        .updateHighlightedLayer();

      sidebar
        .config({
          highlightedLayer,
        })
        .updateCurrentLayers();
    },
  });
};

export default setStateEvents;

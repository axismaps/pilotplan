const setStateEvents = ({ components }) => {
  const { state } = components;
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
        .updateLayout();
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
        .updateLayers();

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
      const results = [...new Set(clickSearch.map(d => d.sourceLayer))]
        .map((groupName) => {
          const group = {
            id: groupName,
            features: clickSearch
              .filter(d => d.sourceLayer === groupName)
              .map(d => d.properties),
          };
          return group;
        });
      console.log('results', results);
      sidebar
        .config({
          results,
          view: 'clickSearch',
        })
        .updateResults();
    },
  });
};

export default setStateEvents;

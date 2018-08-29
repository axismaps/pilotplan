import rasterMethods from './rasterMethods';

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
    year() {
      const {
        timeline,
        atlas,
        sidebar,
        footer,
      } = components;

      const {
        year,
        footerView,
      } = this.props();
      // console.log('year', year);
      const {
        getRasterDataByCategory,
      } = rasterMethods;

      const rasterData = this.getAvailableRasters(data);

      const rasterDataByCategory = getRasterDataByCategory({ rasterData });

      timeline
        .config({
          year,
        })
        .updateYear();

      atlas
        .config({
          year,
          rasterData,
        })
        .updateYear();

      footer
        .config({
          rasterData,
        })
        // .updateFooterView();
        .updateRasterData();

      sidebar
        .config({
          rasterData,
          availableLayers: this.getAvailableLayers(data),
        })
        .updateAvailableLayers();

      const stateToUpdate = {
        currentLayers: this.getAllAvailableLayers(data),
      };

      const sidebarView = sidebar.getView();
      if (sidebarView === 'textSearch') {
        Object.assign(stateToUpdate, { textSearch: sidebar.getSearchText() });
      } else if (sidebarView === 'clickSearch') {
        sidebar
          .config({
            view: 'legend',
          })
          .updateView();
      }

      if (rasterDataByCategory.length === 0) {
        // need to close footer if no results
        Object.assign(stateToUpdate, { footerView: 'views' });
      } else if (rasterData.get(footerView).length === 0) {
        Object.assign(stateToUpdate, { footerView: rasterDataByCategory[0].key });
      }

      const layersToClear = this.getLayersToClear([
        'currentOverlay',
        'highlightedFeature',
        'currentRasterProbe',
        'currentView',
      ]);

      Object.assign(stateToUpdate, layersToClear);
      // if (state.get('currentOverlay') !== null) {
      //   Object.assign(stateToUpdate, { currentOverlay: null });
      // }
      // if (state.get('highlightedFeature') !== null) {
      //   Object.assign(stateToUpdate, { highlightedFeature: null });
      // }
      // if (state.get('currentRasterProbe') !== null) {
      //   Object.assign(stateToUpdate, { currentRasterProbe: null });
      // }

      state.update(stateToUpdate);
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
        // console.log('format text', utils.formatNonRasterResults(results.nonRaster));

        sidebar
          .config({
            results: formattedResults,
            view: 'textSearch',
          })
          .updateResults();
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
    },
    highlightedFeature() {
      const {
        highlightedFeature,
      } = this.props();

      const {
        atlas,
        sidebar,
      } = components;
      // console.log('highlight feature', highlightedFeature);
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

      // const {
      //   currentView,
      // } = this.props();

      // const {
      //   rasterProbe,
      // } = components;

      // rasterProbe
      //   .config({
      //     currentView,
      //   })
      //   .updateView();
      // console.log('current view', currentView);
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
  });
};

export default setStateEvents;

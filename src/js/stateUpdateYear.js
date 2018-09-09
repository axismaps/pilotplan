import rasterMethods from './rasterMethods';

const getUpdateYear = ({
  components,
  data,
}) => {
  const updateYear = function updateYear() {
    const {
      timeline,
      atlas,
      sidebar,
      footer,
      eras,
    } = components;

    const {
      year,
      view,
      footerView,
      componentsInitialized,
    } = this.props();
    //
    const {
      getRasterDataByCategory,
    } = rasterMethods;

    const rasterData = this.getAvailableRasters(data);

    const rasterDataByCategory = getRasterDataByCategory({ rasterData });

    atlas
      .config({
        year,
        rasterData,
      })
      .updateYear();

    if (view === 'eras') {
      eras
        .config({
          year,
        })
        .updateEra();
    }

    if (!componentsInitialized) return;

    timeline
      .config({
        year,
      })
      .updateYear();

    footer
      .config({
        rasterData,
      })
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
        .clearSearch();
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

    this.update(stateToUpdate);
  };

  return updateYear;
};

export default getUpdateYear;
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
    } = components;

    const {
      year,
      footerView,
    } = this.props();
    //
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
      // search for current text input for new year
      Object.assign(stateToUpdate, { textSearch: sidebar.getSearchText() });
    } else if (sidebarView === 'clickSearch') {
      sidebar
        .clearSearch();
      // .config({
      //   view: 'legend',
      // })
      // .updateView();
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

import rasterMethods from '../rasterProbe/rasterMethods';

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
      layout,
      urlParams,
    } = components;

    const {
      year,
      // view,
      footerView,
      componentsInitialized,
    } = this.props();

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

    // if (view === 'eras') {
    eras
      .config({
        year,
      })
      .updateEra();

    urlParams
      .config({
        year,
      })
      .update();

    if (!componentsInitialized) {
      if (rasterDataByCategory.length === 0) {
        this.set('footerView', 'views');
      } else if (rasterData.get(footerView).length === 0) {
        this.set('footerView', rasterDataByCategory[0].key);
      }
      return;
    }
    const currentEra = eras.getCurrentEra();

    layout
      .config({
        currentEra,
        year,
      })
      .updateEra();

    timeline
      .config({
        year,
      })
      .updateYear();

    footer
      .config({
        year,
        rasterData,
      })
      .updateRasterData();

    const availableLayers = this.getAvailableLayers(data);

    sidebar
      .config({
        // rasterData,
        viewLayersOn: this.getAvailableRasters(data).get('views').length > 0,
        availableLayers,
      })
      .updateAvailableLayers();

    atlas.config({ availableLayers });

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

    // if (rasterDataByCategory.length === 0) {
    //   Object.assign(stateToUpdate, { footerView: 'views' });
    // } else if (rasterData.get(footerView).length === 0) {
    //   Object.assign(stateToUpdate, { footerView: rasterDataByCategory[0].key });
    // }
    {
      const currentFooterCategory = this.getAutoFooterView(data);
      if (footerView !== currentFooterCategory) {
        Object.assign(stateToUpdate, { footerView: currentFooterCategory });
      }
    }

    const layersToClear = this.getLayersToClear([
      'currentOverlay',
      'highlightedFeature',
      'currentRasterProbe',
      'currentView',
      'highlightedLayer',
    ]);

    Object.assign(stateToUpdate, layersToClear);

    this.update(stateToUpdate);
  };

  return updateYear;
};

export default getUpdateYear;

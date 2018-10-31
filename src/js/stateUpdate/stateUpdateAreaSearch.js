import {
  formatNonRasterResults,
  formatRasterResults,
} from '../footer/formatSearchResults';

const getUpdateAreaSearch = ({
  components,
}) => function updateAreaSearch() {
  const {
    areaSearch,
  } = this.props();
  const {
    sidebar,
    layout,
    atlas,
  } = components;

  atlas.setSearchLocation();

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
    'highlightedLayer',
  ]);
  this.update(layersToClear);

  if (areaSearch !== null && !this.get('sidebarOpen')) {
    this.update({ sidebarOpen: true });
  }
};

export default getUpdateAreaSearch;

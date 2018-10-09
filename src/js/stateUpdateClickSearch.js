import {
  formatNonRasterResults,
  formatRasterResults,
} from './formatSearchResults';

const getUpdateClickSearch = ({
  components,
}) => function updateClickSearch() {
  const {
    clickSearch,
  } = this.props();
  const {
    sidebar,
    layout,
    atlas,
  } = components;

  atlas.setSearchLocation();

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

  this.update(layersToClear);
};

export default getUpdateClickSearch;

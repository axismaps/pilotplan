/**
 * Callback for clickSearch field
 * "clickSearch" object field contains results from click search
 * @module
 * @memberof stateUpdate
 */
import {
  formatNonRasterResults,
  formatRasterResults,
} from '../data/data';

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

  const layersToClear = this.getLayersToClear([
    'highlightedFeature',
    'highlightedLayer',
  ]);
  if (clickSearch !== null && !this.get('sidebarOpen')) {
    this.update({ sidebarOpen: true });
  }

  this.update(layersToClear);
};

export default getUpdateClickSearch;

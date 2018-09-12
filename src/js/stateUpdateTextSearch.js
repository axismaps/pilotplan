import {
  formatNonRasterResults,
  formatRasterResults,
} from './formatSearchResults';

const getUpdateTextSearch = ({ components }) => {
  const updateTextSearch = function updateTextSearch() {
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
        raster: formatRasterResults(raster),
        nonRaster: formatNonRasterResults(nonRaster),
      };

      sidebar
        .config({
          results: formattedResults,
          view: 'textSearch',
        })
        .updateResults();

      const layersToClear = this.getLayersToClear([
        'highlightedFeature',
      ]);
      this.update(layersToClear);
    }
  };
  return updateTextSearch;
};

export default getUpdateTextSearch;

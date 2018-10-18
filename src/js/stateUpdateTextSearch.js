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
      layout,
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

      atlas.setSearchLocation();

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

      layout.removeHintProbe();

      const layersToClear = this.getLayersToClear([
        'highlightedFeature',
        'highlightedLayer',
      ]);


      this.update(layersToClear);
    }
  };
  return updateTextSearch;
};

export default getUpdateTextSearch;

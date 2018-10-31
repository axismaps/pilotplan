import rasterMethods from '../rasterProbe/rasterMethods';

const searchMethods = {
  listenForText({
    searchInput,
    onTextInput,
  }) {
    searchInput.on('input', function getValue() {
      const val = d3.select(this).node().value;

      onTextInput(val);
    });
  },
  clearResults({
    rasterResultsContainer,
    nonRasterResultsContainer,
  }) {
    rasterResultsContainer.selectAll('div').remove();
    nonRasterResultsContainer.selectAll('div').remove();
  },
  drawRasterSearchResults({
    translations,
    container,
    results,
    onRasterClick,
    cachedMetadata,
    language,
  }) {
    const {
      drawSearchResultGroups,
      drawRasterResultRows,
    } = searchMethods;

    const groups = drawSearchResultGroups({
      language,
      translations,
      container,
      results,
      isRaster: true,
    });

    drawRasterResultRows({
      onRasterClick,
      groups,
      cachedMetadata,
    });
  },
  drawNonRasterSearchResults({
    translations,
    container,
    results,
    onFeatureClick,
    language,
  }) {
    const {
      drawSearchResultGroups,
      drawNonRasterResultsRows,
    } = searchMethods;

    const groups = drawSearchResultGroups({
      language,
      translations,
      container,
      results,
    });

    drawNonRasterResultsRows({
      groups,
      onFeatureClick,
    });
  },
  drawSearchResultGroups({
    language,
    translations,
    container,
    results,
    isRaster = false,
  }) {
    const groups = container.selectAll('.sidebar__results-group')
      .data(results, d => (isRaster ? d.category : d.sourceLayer));

    groups.exit().remove();

    const newGroups = groups
      .enter()
      .append('div')
      .attr('class', 'sidebar__results-group');

    newGroups.append('div')
      .attr('class', 'sidebar__layer-group-title')
      .text(d => (isRaster ? translations.ViewConesPoly[language] :
        translations[d.sourceLayer][language]));

    newGroups.append('div')
      .attr('class', 'sidebar__result-rows');

    return newGroups.merge(groups);
  },
  drawRasterResultRows({
    groups,
    onRasterClick,
    cachedMetadata,
  }) {
    const { setEachRasterBackground } = rasterMethods;

    groups.each(function drawLayers(d) {
      const rows = d3.select(this)
        .select('.sidebar__result-rows')
        .selectAll('.sidebar__raster-results-row')
        .data(d.features, dd => dd.SS_ID);

      rows.exit().remove();

      const newRows = rows.enter()
        .append('div')
        .attr('class', 'sidebar__raster-results-row')
        .on('click', onRasterClick);

      const imageRows = newRows
        .append('div')
        .attr('class', 'sidebar__results-image-row');

      const newImages = imageRows
        .append('div')
        .attr('class', 'sidebar__raster-image');

      setEachRasterBackground({
        images: newImages,
        cachedMetadata,
        maxDim: 130,
        spinner: true,
      });


      imageRows
        .append('div')
        .attr('class', 'sidebar__raster-title')
        .text(dd => dd.Title);
    });
  },
  drawNonRasterResultsRows({
    groups,
    onFeatureClick,
  }) {
    groups.each(function drawLayers(d) {
      const uniqueFeatures = [...new Set(d.features.map(dd => dd.properties.Name))]
        .map(id => d.features.find(dd => dd.properties.Name === id));
      const rows = d3.select(this)
        .select('.sidebar__result-rows')
        .selectAll('.sidebar__results-row')
        .data(uniqueFeatures, dd => dd.properties.Name);

      rows.exit().remove();

      const newRows = rows.enter()
        .append('div')
        .attr('class', 'sidebar__results-row');

      const buttonRows = newRows
        .append('div')
        .attr('class', 'sidebar__results-button-row');

      buttonRows
        .append('div')
        .attr('class', 'sidebar__results-button')
        .text(dd => dd.properties.Name)
        .on('click', onFeatureClick);
    });
  },
  setSearchReturnListener({
    searchReturnContainer,
    textSearchReturnButton,
    clearSearch,
  }) {
    searchReturnContainer
      .on('click', clearSearch);
    textSearchReturnButton
      .on('click', clearSearch);
  },
};

export default searchMethods;

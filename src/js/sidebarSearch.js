import rasterMethods from './rasterMethods';

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
  clearResults(resultRowContainer) {
    if (resultRowContainer === undefined) return;
    resultRowContainer.remove();
  },
  drawRasterSearchResults({
    container,
    results,
    onRasterClick,
    cachedMetadata,
  }) {
    const {
      drawSearchResultGroups,
      drawRasterResultRows,
    } = searchMethods;

    const groups = drawSearchResultGroups({
      container,
      results,
      isRaster: true,
    });

    drawRasterResultRows({
      onRasterClick,
      groups,
      cachedMetadata,
    });

    // const rows = drawResultsRows({
    //   container,
    //   groups,
    // });

    // rows
    //   .text(d => d.Title)
    //   .on('click', onRasterClick);
  },
  drawNonRasterSearchResults({
    container,
    results,
    onFeatureClick,
  }) {
    const {
      drawSearchResultGroups,
      // drawResultsRows,
      drawNonRasterResultsRows,
    } = searchMethods;

    const groups = drawSearchResultGroups({
      container,
      results,
    });

    drawNonRasterResultsRows({
      groups,
      onFeatureClick,
    });
  },
  drawSearchResultGroups({
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
      .text(d => (isRaster ? d.category : d.sourceLayer)); // should be d[language]

    newGroups.append('div')
      .attr('class', 'sidebar__result-rows');
    // return newGroups;
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
    // draw title/data/rows here, in enter() selection
    groups.each(function drawLayers(d) {
      // get unique data;
      // console.log('features', d);
      const uniqueFeatures = [...new Set(d.features.map(dd => dd.id))]
        .map(id => d.features.filter(dd => dd.id === id));
      // console.log('ids', uniqueFeatures);
      const rows = d3.select(this)
        .select('.sidebar__result-rows')
        .selectAll('.sidebar__results-row')
        .data(uniqueFeatures, dd => dd[0].id);

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
        .text(dd => dd[0].properties.Name)
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

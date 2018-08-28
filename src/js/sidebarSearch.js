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
  }) {
    const groups = container.selectAll('.sidebar__results-group')
      .data(results, d => d.id);

    groups.exit().remove();

    const newGroups = groups
      .enter()
      .append('div')
      .attr('class', 'sidebar__results-group');

    newGroups.append('div')
      .attr('class', 'sidebar__layer-group-title')
      .text(d => d.id);

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
        .data(d.features, dd => dd.id);

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
      const rows = d3.select(this)
        .select('.sidebar__result-rows')
        .selectAll('.sidebar__results-row')
        .data(d.features, dd => dd.id);

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
    callback,
  }) {
    searchReturnContainer
      .on('click', callback);
    textSearchReturnButton
      .on('click', callback);
  },
};

export default searchMethods;

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
  drawResultRowContainer({ resultsContainer }) {
    return resultsContainer.append('div')
      .attr('class', 'sidebar__results-rows');
  },
  drawTextSearchResults({
    resultRowContainer,
    results,
    onFeatureClick,
  }) {
    console.log('results', results);
    // raster results
    resultRowContainer
      .selectAll('.sidebar__raster-results-row')
      .data(results.raster, d => d.SS_ID)
      .enter()
      .append('div')
      .attr('class', 'sidebar__raster-results-row')
      .text(d => d.Title);

    // non-raster results
    resultRowContainer
      .selectAll('.sidebar__results-row')
      .data(results.nonRaster, d => d.id)
      .enter()
      .append('div')
      .attr('class', 'sidebar__results-row')
      .on('click', onFeatureClick)
      .text(d => d.properties.Name);
  },
  drawClickSearchResults({
    resultRowContainer,
    results,
    onFeatureClick,
  }) {
    // console.log('results', results);
    const groups = resultRowContainer.selectAll('.sidebar__results-group')
      .data(results)
      .enter()
      .append('div')
      .attr('class', 'sidebar__results-group');

    groups.append('div')
      .attr('class', 'sidebar__layer-group-title')
      .text(d => d.id);

    groups.append('div')
      .attr('class', 'sidebar__result-layers');
    groups.each(function addResultsLayers(d) {
      d3.select(this)
        .select('.sidebar__result-layers')
        .selectAll('.sidebar__results-row')
        .data(d.features)
        .enter()
        .append('div')
        .attr('class', 'sidebar__results-row')
        .on('click', onFeatureClick)
        .text(dd => (dd.properties.Name === '' ? dd.properties.SubType : dd.properties.Name));
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

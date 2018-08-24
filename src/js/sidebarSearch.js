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
    onRasterClick,
  }) {
    console.log('results', results);
    // raster results
    resultRowContainer
      .selectAll('.sidebar__raster-results-row')
      .data(results, d => d.SS_ID)
      .enter()
      .append('div')
      .attr('class', 'sidebar__raster-results-row')
      .on('click', onRasterClick)
      .text(d => d.Title);

    // non-raster results
    // resultRowContainer
    //   .selectAll('.sidebar__results-row')
    //   .data(results, d => d.id)
    //   .enter()
    //   .append('div')
    //   .attr('class', 'sidebar__results-row')
    //   .on('click', onFeatureClick)
    //   .text(d => d.properties.Name);
  },
  drawClickSearchResults({
    resultRowContainer,
    results,
    onFeatureClick,
  }) {
    console.log('results', results);
    const groups = resultRowContainer.selectAll('.sidebar__results-group')
      .data(results, d => d.id)
      .enter()
      .append('div')
      .attr('class', 'sidebar__results-group');

    groups.append('div')
      .attr('class', 'sidebar__layer-group-title')
      .text(d => d.id);

    groups.append('div')
      .attr('class', 'sidebar__result-layers');
    groups.each(function addResultsLayers(d) {
      console.log('d', d);
      d3.select(this)
        .select('.sidebar__result-layers')
        .selectAll('.sidebar__results-row')
        .data(d.features, dd => dd.id)
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

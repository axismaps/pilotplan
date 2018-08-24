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
  }) {
    const {
      drawSearchResultGroups,
      drawGroupFeatures,
    } = searchMethods;

    const groups = drawSearchResultGroups({
      container,
      results,
    });

    drawGroupFeatures({
      groups,
      onClick: onRasterClick,
    });
    console.log('raster results', results);
    // raster results
    // container
    //   .selectAll('.sidebar__raster-results-row')
    //   .data(results, d => d.SS_ID)
    //   .enter()
    //   .append('div')
    //   .attr('class', 'sidebar__raster-results-row')
    //   .on('click', onRasterClick)
    //   .text(d => d.Title);
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

    return newGroups.merge(groups);
  },
  drawGroupFeatures({
    groups,
    onClick,
  }) {
    groups.each(function drawLayers(d, i) {
      console.log('d', d);
      const layers = d3.select(this)
        .select('.sidebar__result-rows')
        .selectAll('.sidebar__results-row')
        .data(d.features, dd => dd.id);

      layers.exit().remove();

      layers.enter()
        .append('div')
        .attr('class', 'sidebar__results-row')
        .text(dd => dd.Title)
        .on('click', onClick);
    });
    console.log('data test', d3.selectAll('.sidebar__results-row').data());
    return d3.selectAll('.sidebar__results-row');
  },
  drawNonRasterSearchResults({
    container,
    results,
    onFeatureClick,
  }) {
    console.log('nonraster results', results);
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
      .attr('class', 'sidebar__result-layers');
    // this should be separate function, needs to enter/exit on EACH
    // not just new
    newGroups.each(function addResultsLayers(d) {
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

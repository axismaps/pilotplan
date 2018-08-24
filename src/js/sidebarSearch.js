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
      drawResultsRows,
    } = searchMethods;

    const groups = drawSearchResultGroups({
      container,
      results,
    });

    const rows = drawResultsRows({
      container,
      groups,
    });

    rows
      .text(d => d.Title)
      .on('click', onRasterClick);
  },
  drawNonRasterSearchResults({
    container,
    results,
    onFeatureClick,
  }) {
    const {
      drawSearchResultGroups,
      drawResultsRows,
    } = searchMethods;

    const groups = drawSearchResultGroups({
      container,
      results,
    });

    const rows = drawResultsRows({
      container,
      groups,
      onClick: onFeatureClick,
    });

    rows
      .text(d => d.properties.Name)
      .on('click', onFeatureClick);
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
  drawResultsRows({
    groups,
    container,
  }) {
    groups.each(function drawLayers(d, i) {
      const layers = d3.select(this)
        .select('.sidebar__result-rows')
        .selectAll('.sidebar__results-row')
        .data(d.features, dd => dd.id);

      layers.exit().remove();

      layers.enter()
        .append('div')
        .attr('class', 'sidebar__results-row');
    });
    return container.selectAll('.sidebar__results-row');
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

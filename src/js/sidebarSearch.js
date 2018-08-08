const searchMethods = ({ privateProps }) => ({
  listenForText() {
    const {
      searchInput,
      onTextInput,
    } = privateProps.get(this);

    searchInput.on('input', function getValue() {
      const val = d3.select(this).node().value;

      onTextInput(val);
    });
  },
  clearResults() {
    const {
      resultRowContainer,
    } = privateProps.get(this);

    if (resultRowContainer === undefined) return;
    resultRowContainer.remove();
  },
  drawResultRowContainer() {
    const props = privateProps.get(this);
    const {
      resultsContainer,

    } = props;
    const resultRowContainer = resultsContainer.append('div')
      .attr('class', 'sidebar__results-rows');
    props.resultRowContainer = resultRowContainer;
  },
  drawTextSearchResults() {
    const props = privateProps.get(this);
    const {
      resultRowContainer,
      results,
      onFeatureClick,
    } = props;

    resultRowContainer
      .selectAll('.sidebar__results-row')
      .data(results)
      .enter()
      .append('div')
      .attr('class', 'sidebar__results-row')
      .on('click', onFeatureClick)
      .text(d => d.properties.Name);
  },
  drawClickSearchResults() {
    const props = privateProps.get(this);
    const {
      resultRowContainer,
      results,
      onFeatureClick,
    } = props;
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
});

export default searchMethods;

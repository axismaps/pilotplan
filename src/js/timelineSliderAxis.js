const axisMethods = ({ privateProps, privateMethods }) => ({
  initAxis() {
    const {
      drawAxisGroup,
      setAxisGenerator,
      updateAxis,
    } = privateMethods;
    const { axisOn } = privateProps.get(this);

    if (!axisOn) return;

    drawAxisGroup.call(this);
    setAxisGenerator.call(this);
    updateAxis.call(this);
  },
  drawAxisGroup() {
    const props = privateProps.get(this);
    const {
      trackHeight,
      svg,
      size,
    } = props;

    const { height } = size;

    props.axisGroup = svg.append('g')
      .attrs({
        transform: `translate(0, ${(height / 2) - (trackHeight / 2)})`,
        class: 'slider__axis',
      });
  },
  setTickProps() {
    // conditional statements here--year span to width ratio etc.
  },
  setAxisGenerator() {
    const props = privateProps.get(this);
    const {
      scale,
      stepSections,
    } = props;
    const domain = scale.domain();
    console.log('domain', domain);
    console.log('stepSections', stepSections);
    // const tickValues = [stepSections[0].years[0], 1900, 1910, 1920, 1930, 1940, 1950];

    const tickValues = [stepSections[0].years[0]];
    const span1 = stepSections[0];
    const span2 = stepSections[1];
    const increment1 = 20;
    const increment2 = 5;
    const numTicks1 = Math.round((span1.years[1] - span1.years[0]) / increment1);
    const numTicks2 = Math.round((span2.years[1] - span2.years[0]) / increment2);

    // const addTicks = (span, tickValue, round) => {
    //   const { increment, years } = span;
    //   // const tickValue = oneTickValue * increment;
    //   const numTicks = Math.round((years[1] - years[0]) / tickValue);
    //   const startPosition = tickValues.length - 1;
    //   for (let i = 0;
    //     i < numTicks;
    //     i += 1) {
    //     tickValues.push(Math.round((tickValues[startPosition + i] + tickValue) / round) * round);
    //   }
    // };

    for (let i = 0;
      i < numTicks1;
      i += 1) {
      tickValues.push(Math.round((tickValues[i] + increment1) / 10) * 10);
    }

    for (let i = 1;
      i < numTicks2;
      i += 1
    ) {
      tickValues.push(Math.round(tickValues[numTicks1] + ((i + 1) * increment2)));
    }
    console.log('tickValues', tickValues);

    props.axis = d3.axisBottom(scale)
      // .ticks(20)
      // .ticks([1900, 1920, 1950, 1975])
      .tickValues(tickValues)
      .tickFormat(d => (d % 10 === 0 ? d : ''));
  },
  updateAxis() {
    const props = privateProps.get(this);
    const {
      axisGroup,
      axis,
      axisOn,
    } = props;
    if (!axisOn) return;

    // console.log('axisgroup', axisGroup);
    // console.log('axis', axis);

    axisGroup
      .call(axis);

    axisGroup
      .selectAll('.tick')
      .each(function setMinorTick(d) {
        const tick = d3.select(this).select('line');
        if (d % 10 !== 0) {
          tick.attr('y2', 10);
        }
        // console.log('d', d);
      });
  },
});

export default axisMethods;

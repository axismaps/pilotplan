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
    const { isLabeledTick } = privateMethods;

    const tickValues = [];
    const span1 = stepSections[0];
    const span2 = stepSections[1];
    const increment1 = 20;
    const increment2 = 5;
    const numTicks1 = Math.round((span1.years[1] - span1.years[0]) / increment1);
    const numTicks2 = Math.round((span2.years[1] - span2.years[0]) / increment2);

    for (let i = 0;
      i < numTicks1;
      i += 1) {
      tickValues.push(Math.round((stepSections[0].years[0] + (increment1 * (i + 1))) / 10) * 10);
    }
    const startValSeg2 = tickValues.slice(-1)[0];

    for (let i = 1;
      i < numTicks2;
      i += 1
    ) {
      tickValues.push(Math.round(startValSeg2 + ((i + 1) * increment2)));
    }

    props.axis = d3.axisBottom(scale)
      // .ticks(20)
      // .ticks([1900, 1920, 1950, 1975])
      .tickValues(tickValues)
      .tickFormat(d => (isLabeledTick({ value: d, breakpoint: stepSections[0].years[1] }) ? d : ''));
  },
  isLabeledTick({ value, breakpoint }) {
    if (value > breakpoint) {
      return value % 10 === 0;
    }
    return [1930, 1892].includes(value);
  },
  updateAxis() {
    const props = privateProps.get(this);
    const {
      axisGroup,
      axis,
      axisOn,
      stepSections,
    } = props;
    const { isLabeledTick } = privateMethods;

    if (!axisOn) return;


    axisGroup
      .call(axis);

    axisGroup
      .selectAll('.tick')
      .each(function setMinorTick(d) {
        const tick = d3.select(this).select('line');
        if (!isLabeledTick({ value: d, breakpoint: stepSections[0].years[1] })) {
          tick.attr('y2', 10);
        }
      });
  },
});

export default axisMethods;

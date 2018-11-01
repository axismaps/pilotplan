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
  setAxisGenerator() {
    const props = privateProps.get(this);
    const {
      scale,
      stepSections,
      mobile,
    } = props;
    const { isLabeledTick } = privateMethods;

    const tickValues = [1900, 1915, 1930, 1945];
    const span2 = stepSections[1];
    const increment2 = 5;
    const numTicks2 = Math.round((span2.years[1] - span2.years[0]) / increment2);

    const startValSeg2 = 1950;

    for (let i = 1;
      i < numTicks2;
      i += 1
    ) {
      tickValues.push(Math.round(startValSeg2 + ((i + 1) * increment2)));
    }

    props.axis = d3.axisBottom(scale)
      .tickValues(tickValues)
      .tickFormat(d => (isLabeledTick({ value: d, breakpoint: stepSections[0].years[1] }) && !mobile ? d : ''));
  },
  isLabeledTick({ value, breakpoint }) {
    if (value > breakpoint) {
      return value % 10 === 0;
    }
    return [1900, 1930].includes(value);
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

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

    props.axis = d3.axisBottom(scale)
      .ticks(20)
      // .tickValues([1900, 1950, 2000])
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

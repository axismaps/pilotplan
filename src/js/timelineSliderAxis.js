const axisMethods = ({ privateProps, privateMethods }) => ({
  initAxis() {
    const {
      drawAxisGroup,
      setAxisGenerator,
      updateAxis,
    } = privateMethods;

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
    } = props;

    props.axis = d3.axisBottom(scale)
      .tickFormat(d => d);
  },
  updateAxis() {
    const props = privateProps.get(this);
    const {
      axisGroup,
      axis,
    } = props;

    // console.log('axisgroup', axisGroup);
    // console.log('axis', axis);

    axisGroup
      .call(axis);
  },
});

export default axisMethods;

const erasMethods = {
  setStepperListeners({
    erasStepperLeftButton,
    erasStepperRightButton,
    updateYear,
    getYear,
    eras,
    setAnimationDirection,
  }) {
    const { getCurrentEra } = erasMethods;

    const getEraIndex = () => {
      const year = getYear();
      const currentEra = getCurrentEra({ year, eras });
      return eras.findIndex(era => era.dates[0] === currentEra.dates[0]);
    };

    erasStepperLeftButton
      .on('click', () => {
        const eraIndex = getEraIndex();
        let newEra;
        if (eraIndex === 0) {
          [newEra] = eras.slice(-1);
        } else {
          newEra = eras[eraIndex - 1];
        }
        setAnimationDirection('right');
        updateYear(newEra.dates[0]);
      });

    erasStepperRightButton
      .on('click', () => {
        const eraIndex = getEraIndex();
        let newEra;
        if (eraIndex === eras.length - 1) {
          [newEra] = eras;
        } else {
          newEra = eras[eraIndex + 1];
        }
        setAnimationDirection('left');
        updateYear(newEra.dates[0]);
      });
  },
  getCurrentEra({ year, eras }) {
    console.log('eras', eras);
    return eras.find(era =>
      year >= era.dates[0] &&
      year <= era.dates[1]);
  },
  updateEra({
    currentEra,
    animationDirection,
    erasTitleContainer,
  }) {
    const getOffset = (selection) => {
      const titleWidth = selection.node().getBoundingClientRect().width;
      const pageWidth = window.innerWidth;
      return ((titleWidth + pageWidth) / 2) * (animationDirection === 'right' ? 1 : -1);
    };


    erasTitleContainer
      .style('left', '0px')
      .transition()
      .duration(750)
      .style('left', `${getOffset(d3.select('.eras__title'))}px`)
      .on('end', () => {
        erasTitleContainer.remove();
      });

    const newTitleContainer = d3.select('.eras__title-outer')
      .append('div')
      .attr('class', 'eras__title-container')
      .styles({
        left: '0px',
        opacity: 0,
      });
      // .style('left', `${-offset}px`);
    // need to calculate new offset.... OOF

    const newTitle = newTitleContainer.append('div')
      .attr('class', 'eras__title')
      .text(currentEra.name);
    const newOffset = getOffset(newTitle);
    newTitleContainer
      .style('left', `${-newOffset}px`)
      .style('opacity', 1);
    newTitleContainer
      .transition()
      .duration(750)
      .style('left', '0px');
  },
  getTitleContainer() {
    return d3.select('.eras__title');
  },
};

export default erasMethods;

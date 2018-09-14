const erasMethods = {
  setStepperListeners({
    erasStepperLeftButton,
    erasStepperRightButton,
    updateYear,
    getYear,
    eras,
    setAnimationDirection,
    mouseEventsDisabled,
  }) {
    const { getCurrentEra } = erasMethods;

    const getEraIndex = () => {
      const year = getYear();
      const currentEra = getCurrentEra({ year, eras });
      return eras.findIndex(era => era.dates[0] === currentEra.dates[0]);
    };

    erasStepperLeftButton
      .on('click', () => {
        mouseEventsDisabled(true);
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
        mouseEventsDisabled(true);
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
    return eras.find(era =>
      year >= era.dates[0] &&
      year <= era.dates[1]);
  },
  updateEra({
    currentEra,
    animationDirection,
    erasTitleContainer,
    mouseEventsDisabled,
    view,
    language,
  }) {
    if (view !== 'eras') {
      d3.select('.eras__title')
        .text(currentEra[language]);
      return;
    }
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
        mouseEventsDisabled(false);
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
      .text(currentEra[language]);
    const newOffset = getOffset(newTitle);
    newTitleContainer
      .style('left', `${-newOffset}px`)
      .style('opacity', 1);
    newTitleContainer
      .transition()
      .duration(750)
      .style('left', '0px');
  },
  updateDates({
    currentEra,
    animationDirection,
    titleOuterContainer,
    titleTextContainer,
    titleInnerContainer,
    view,
  }) {
    if (view !== 'eras') {
      d3.select('.eras__stepper-years')
        .text(`${currentEra.datesDisplay[0]} - ${currentEra.datesDisplay[1]}`);
      return;
    }
    const getOffset = (selection) => {
      const titleWidth = selection.node().getBoundingClientRect().width;
      const containerWidth = titleOuterContainer.node().getBoundingClientRect().width;
      return ((titleWidth + containerWidth) / 2) * (animationDirection === 'right' ? 1 : -1);
    };
    titleInnerContainer
      .style('left', '0px')
      .transition()
      .duration(750)
      .style('left', `${getOffset(titleTextContainer)}px`)
      .on('end', () => {
        titleInnerContainer.remove();
      });

    const newTitleContainer = titleOuterContainer
      .append('div')
      .attr('class', 'eras__stepper-years-inner')
      .styles({
        left: '0px',
        opacity: 0,
      });

    const newTitle = newTitleContainer.append('div')
      .attr('class', 'eras__stepper-years')
      .text(`${currentEra.datesDisplay[0]} - ${currentEra.datesDisplay[1]}`);
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

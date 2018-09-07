const erasMethods = {
  setStepperListeners({
    erasStepperLeftButton,
    erasStepperRightButton,
    updateYear,
    getYear,
    eras,
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
        updateYear(newEra.dates[0]);
      });
  },
  getCurrentEra({ year, eras }) {
    console.log('eras', eras);
    return eras.find(era =>
      year >= era.dates[0] &&
      year <= era.dates[1]);
  },
  updateEra() {
    console.log('update era');
  },
};

export default erasMethods;

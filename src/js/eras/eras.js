/**
 * Module for eras screen
 * @module eras
 */

import { selections } from '../config/config';
import erasMethods from './erasMethods';

const privateProps = new WeakMap();

const privateMethods = {
  setMapButtonListener() {
    const {
      erasMapButtonContainer,
      onMapButtonClick,
    } = privateProps.get(this);

    erasMapButtonContainer
      .on('click', onMapButtonClick);
  },
  setMapButtonText() {
    const {
      erasMapButtonText,
      translations,
      language,
    } = privateProps.get(this);
    erasMapButtonText
      .text(translations['go-to-map'][language]);
  },
  setStepperListeners() {
    const props = privateProps.get(this);
    const {
      erasStepperLeftButton,
      erasStepperRightButton,
      updateYear,
      mouseEventsDisabled,
      eras,
    } = props;

    const {
      setStepperListeners,
    } = erasMethods;

    setStepperListeners({
      erasStepperLeftButton,
      erasStepperRightButton,
      updateYear,
      eras,
      mouseEventsDisabled,
      getYear: () => props.year,
      setAnimationDirection: (direction) => {
        props.animationDirection = direction;
      },
    });
  },
  getCurrentEra({ year, eras }) {
    const { getCurrentEra } = erasMethods;
    return getCurrentEra({
      eras,
      year,
    });
  },
  setInitialEra() {
    const {
      year,
      eras,
      language,
    } = privateProps.get(this);
    const { getCurrentEra } = erasMethods;
    const currentEra = getCurrentEra({
      eras,
      year,
    });
    d3.select('.eras__title')
      .text(currentEra[language]);

    d3.select('.eras__stepper-years')
      .text(`${currentEra.datesDisplay[0]} - ${currentEra.datesDisplay[1]}`);
  },
};

class Eras {
  constructor(config) {
    const {
      erasMapButtonContainer,
      erasStepperLeftButton,
      erasStepperRightButton,
      erasMapButtonText,
    } = selections;

    privateProps.set(this, {
      erasMapButtonContainer,
      erasStepperLeftButton,
      erasStepperRightButton,
      erasMapButtonText,
      onMapButtonClick: null,
      year: null,
      previousYear: null,
      mouseEventsDisabled: null,
    });
    this.config(config);

    const {
      setMapButtonListener,
      setStepperListeners,
      setInitialEra,
      setMapButtonText,
    } = privateMethods;

    setMapButtonListener.call(this);
    setMapButtonText.call(this);
    setStepperListeners.call(this);
    setInitialEra.call(this);
  }
  config(config) {
    const props = privateProps.get(this);
    props.previousYear = props.year;
    Object.assign(props, config);
    if (props.previousYear === null) {
      props.previousYear = props.year;
    }
    return this;
  }
  getCurrentEra(inputYear) {
    const props = privateProps.get(this);
    const { eras } = props;
    const year = inputYear === undefined ? props.year : inputYear;
    const { getCurrentEra } = privateMethods;
    return getCurrentEra({ year, eras });
  }
  updateEra() {
    const props = privateProps.get(this);
    const {
      year,
      animationDirection,
      mouseEventsDisabled,
      view,
      eras,
      language,
    } = props;
    const {
      getCurrentEra,
      updateEra,
      updateDates,
    } = erasMethods;

    const currentEra = getCurrentEra({ year, eras });

    updateEra({
      view,
      mouseEventsDisabled,
      currentEra,
      animationDirection,
      language,
      erasTitleContainer: d3.select('.eras__title-container'),
    });

    updateDates({
      view,
      currentEra,
      animationDirection,
      titleOuterContainer: d3.select('.eras__stepper-years-outer'),
      titleTextContainer: d3.select('.eras__stepper-years'),
      titleInnerContainer: d3.select('.eras__stepper-years-inner'),
    });
  }
  updateLanguage() {
    const {
      view,
      mouseEventsDisabled,
      animationDirection,
      language,
      year,
      eras,
    } = privateProps.get(this);

    const {
      setMapButtonText,
    } = privateMethods;

    const {
      getCurrentEra,
      updateEra,
    } = erasMethods;

    const currentEra = getCurrentEra({ year, eras });

    setMapButtonText.call(this);

    updateEra({
      view,
      mouseEventsDisabled,
      currentEra,
      animationDirection,
      language,
      erasTitleContainer: d3.select('.eras__title-container'),
    });
  }
}

export default Eras;

import { eras, selections } from './config';
import erasMethods from './erasMethods';

console.log('eras', eras);

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
  setStepperListeners() {
    const props = privateProps.get(this);
    const {
      erasStepperLeftButton,
      erasStepperRightButton,
      updateYear,
      year,
    } = props;

    const {
      setStepperListeners,
    } = erasMethods;

    setStepperListeners({
      erasStepperLeftButton,
      erasStepperRightButton,
      updateYear,
      eras,
      // currentEra,
      getYear: () => props.year,
      setAnimationDirection: (direction) => {
        props.animationDirection = direction;
      },
    });
  },
  getCurrentEra({ year }) {
    console.log('eras', eras);
  },
  setInitialEra() {
    const {
      year,
    } = privateProps.get(this);
    const { getCurrentEra } = erasMethods;
    const currentEra = getCurrentEra({
      eras,
      year,
    });
    d3.select('.eras__title')
      .text(currentEra.name);
  },

};

class Eras {
  constructor(config) {
    const {
      erasMapButtonContainer,
      erasStepperLeftButton,
      erasStepperRightButton,
    } = selections;

    privateProps.set(this, {
      erasMapButtonContainer,
      erasStepperLeftButton,
      erasStepperRightButton,
      onMapButtonClick: null,
      year: null,
      previousYear: null,
    });
    this.config(config);
    const {
      setMapButtonListener,
      setStepperListeners,
      setInitialEra,
    } = privateMethods;

    setMapButtonListener.call(this);
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
  getCurrentEra() {
    const { year } = privateProps.get(this);
    const { getCurrentEra } = privateMethods;
    return getCurrentEra({ year });
  }
  updateEra() {
    const {
      year,
      animationDirection,
    } = privateProps.get(this);
    const {
      getCurrentEra,
      updateEra,
      getTitleContainer,
    } = erasMethods;

    const currentEra = getCurrentEra({ year, eras });

    updateEra({
      currentEra,
      animationDirection,
      erasTitleContainer: d3.select('.eras__title-container'),
    });
  }
}

export default Eras;

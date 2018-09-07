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
      getCurrentEra,
      setStepperListeners,
    } = erasMethods;

    setStepperListeners({
      erasStepperLeftButton,
      erasStepperRightButton,
      updateYear,
      eras,
      // currentEra,
      getYear: () => props.year,
    });
  },
  getCurrentEra({ year }) {
    console.log('eras', eras);
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
    });
    this.config(config);
    const {
      setMapButtonListener,
      setStepperListeners,
    } = privateMethods;

    setMapButtonListener.call(this);
    setStepperListeners.call(this);
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
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
    } = privateProps.get(this);
    const {
      updateEra,
    } = erasMethods;

    updateEra();
  }
}

export default Eras;

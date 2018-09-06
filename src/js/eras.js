import { eras, selections } from './config';

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
    });
    this.config(config);
    const {
      setMapButtonListener,
    } = privateMethods;

    setMapButtonListener.call(this);
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
  }
}

export default Eras;

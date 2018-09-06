import { selections } from './config';

const privateProps = new WeakMap();

const privateMethods = {
  setBeginButtonListener() {
    const props = privateProps.get(this);
    const {
      introBeginButtonContainer,
      onBeginButtonClick,
    } = props;

    console.log('set listener');
    introBeginButtonContainer
      .on('click', onBeginButtonClick);
  },
  setJumpButtonListener() {
    const props = privateProps.get(this);
    const {
      introJumpButtonContainer,
      onJumpButtonClick,
    } = props;

    introJumpButtonContainer
      .on('click', onJumpButtonClick);
  },
};

class Intro {
  constructor(config) {
    const {
      introJumpButtonContainer,
      introBeginButtonContainer,
    } = selections;

    privateProps.set(this, {
      introJumpButtonContainer,
      introBeginButtonContainer,
      onJumpButtonClick: null,
      onBeginButtonClick: null,
    });

    const {
      setBeginButtonListener,
      setJumpButtonListener,
    } = privateMethods;

    this.config(config);

    setBeginButtonListener.call(this);
    setJumpButtonListener.call(this);
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
}

export default Intro;

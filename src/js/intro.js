import { selections } from './config';

const privateProps = new WeakMap();

const privateMethods = {
  setBeginButtonListener() {
    const props = privateProps.get(this);
    const {
      beginButtonContainer,
      onBeginButtonClick,
    } = props;

    console.log('set listener');
    beginButtonContainer
      .on('click', onBeginButtonClick);
  },
  setJumpButtonListener() {
    const props = privateProps.get(this);
    const {
      jumpButtonContainer,
      onJumpButtonClick,
    } = props;

    jumpButtonContainer
      .on('click', onJumpButtonClick);
  },
};

const {
  jumpButtonContainer,
  beginButtonContainer,
} = selections;

class Intro {
  constructor(config) {
    privateProps.set(this, {
      jumpButtonContainer,
      beginButtonContainer,
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

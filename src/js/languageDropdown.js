import { selections } from './config';

const privateProps = new WeakMap();

const privateMethods = {
  init() {

  },
  setHoverListener() {

  },
  setClickEvent() {

  },
  openMenu() {

  },
  closeMenu() {

  },
};

class LanguageDropdown {
  constructor(config) {
    const {
      erasButtonContainer,
      erasButtonText,
    } = selections;
    privateProps.set(this, {
      erasButtonContainer,
      erasButtonText,
      timer: null,
      language: null,
    });
    this.config(config);
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
}

export default LanguageDropdown;

import { selections } from '../config/config';
import setDropdownListeners from './introDropdownBase';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);
    const {
      introLanguageButtonContainer,
      introLanguageDropdownContainer,
      introLanguageDropdownText,
      onClick,
    } = props;

    const {
      setClickListener,
    } = privateMethods;

    setDropdownListeners({
      buttonContainer: introLanguageButtonContainer,
      dropdownContainer: introLanguageDropdownContainer,
      getTimer: () => props.timer,
      setTimer: (newTimer) => {
        props.timer = newTimer;
      },
    });

    setClickListener({
      introLanguageDropdownText,
      onClick,
    });

    this.update();
  },
  setClickListener({
    introLanguageDropdownText,
    onClick,
  }) {
    introLanguageDropdownText
      .on('click', onClick);
  },
  setText({
    language,
    introLanguageDropdownText,
    introLanguageButtonText,
  }) {
    const text = {
      en: 'English Version',
      pr: 'Versão em Português',
    };
    introLanguageButtonText
      .text(text[language]);
    introLanguageDropdownText
      .text(language === 'en' ? text.pr : text.en);
  },
  resizeDropdown({
    introLanguageButtonContainer,
    introLanguageDropdownContainer,
  }) {
    const { width } = introLanguageButtonContainer
      .node()
      .getBoundingClientRect();
    introLanguageDropdownContainer
      .style('width', `${width}px`);
  },
};

class LanguageDropdown {
  constructor(config) {
    const {
      introLanguageButtonContainer,
      introLanguageButtonText,
      introLanguageDropdownText,
      introLanguageDropdownContainer,
    } = selections;
    privateProps.set(this, {
      introLanguageButtonContainer,
      introLanguageButtonText,
      introLanguageDropdownText,
      introLanguageDropdownContainer,
      timer: null,
      language: null,
      onClick: null,
    });
    this.config(config);
    const { init } = privateMethods;
    init.call(this);
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
  update() {
    const {
      language,
      introLanguageButtonText,
      introLanguageButtonContainer,
      introLanguageDropdownText,
      introLanguageDropdownContainer,
    } = privateProps.get(this);
    const {
      setText,
      resizeDropdown,
    } = privateMethods;

    setText({
      language,
      introLanguageDropdownText,
      introLanguageButtonText,
    });

    resizeDropdown({
      introLanguageButtonContainer,
      introLanguageDropdownContainer,
    });
  }
}

export default LanguageDropdown;

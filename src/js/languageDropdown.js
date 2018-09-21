import { selections } from './config';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);
    const {
      introLanguageButtonContainer,
      introLanguageDropdownContainer,
      onClick,
      language,
    } = props;

    const {
      setHoverListener,
    } = privateMethods;

    setHoverListener({
      introLanguageButtonContainer,
      introLanguageDropdownContainer,
      language,
      getTimer: () => props.timer,
      setTimer: (newTimer) => {
        props.timer = newTimer;
      },
      onClick,
    });

    this.update();
  },
  setHoverListener({
    introLanguageButtonContainer,
    introLanguageDropdownContainer,
    getTimer,
    setTimer,
    onClick,
  }) {
    const clearOldTimer = () => {
      const oldTimer = getTimer();
      if (oldTimer !== null) {
        clearTimeout(oldTimer);
      }
    };

    const setMenuCloseTimer = () => {
      const timer = setTimeout(() => {
        introLanguageDropdownContainer
          .classed('intro__language-dropdown--on', false);
        setTimer(null);
      }, 250);
      setTimer(timer);
    };

    introLanguageButtonContainer
      .on('mouseover', () => {
        // console.log('open');
        clearOldTimer();
        introLanguageDropdownContainer
          .classed('intro__language-dropdown--on', true);
      })
      .on('mouseout', () => {
        setMenuCloseTimer();
      });

    introLanguageDropdownContainer
      .on('mouseover', () => {
        clearOldTimer();
      })
      .on('mouseout', () => {
        setMenuCloseTimer();
      })
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
      translations: null,
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

import { selections } from '../config';

const privateProps = new WeakMap();

const privateMethods = {
  setBeginButtonListener() {
    const props = privateProps.get(this);
    const {
      introBeginButtonContainer,
      onBeginButtonClick,
    } = props;

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
  setText({
    translations,
    language,
    introBeginButtonText,
    introTitleText,
    // introSubtitleText,
    introSummaryText,
  }) {
    introBeginButtonText
      .text(translations['explore-map-button-text'][language]);

    introTitleText
      .text(translations.h1[language]);
    // introSubtitleText
    //   .text(translations)
    introSummaryText
      .text(translations['era-description'][language]);
  },
};

class Intro {
  constructor(config) {
    const {
      // introJumpButtonContainer,
      introBeginButtonContainer,
      introBeginButtonText,
      introTitleText,
      introSubtitleText,
      introSummaryText,
    } = selections;

    privateProps.set(this, {
      // introJumpButtonContainer,
      introBeginButtonContainer,
      introBeginButtonText,
      introTitleText,
      introSubtitleText,
      introSummaryText,
      // onJumpButtonClick: null,
      onBeginButtonClick: null,
      translations: null,
      language: null,
    });

    const {
      setBeginButtonListener,
      // setJumpButtonListener,
    } = privateMethods;

    this.config(config);

    setBeginButtonListener.call(this);
    // setJumpButtonListener.call(this);
    this.update();
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
  update() {
    const {
      introBeginButtonText,
      language,
      translations,
      introTitleText,
      introSubtitleText,
      introSummaryText,
    } = privateProps.get(this);
    const {
      setText,
    } = privateMethods;

    setText({
      introBeginButtonText,
      introTitleText,
      introSubtitleText,
      introSummaryText,
      language,
      translations,
    });
  }
}

export default Intro;

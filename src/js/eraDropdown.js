import setDropdownListeners from './dropdownBase';
import { selections } from './config';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);
    const {
      introJumpButtonContainer,
      introJumpDropdownContainer,
    } = props;

    setDropdownListeners({
      buttonContainer: introJumpButtonContainer,
      dropdownContainer: introJumpDropdownContainer,
      getTimer: () => props.timer,
      setTimer: (newTimer) => {
        props.timer = newTimer;
      },
    });

    this.update();
  },
  setContent({
    eras,
    introJumpDropdownContent,
    onClick,
    language,
  }) {
  // intro__jump-dropdown-item
    console.log('eras', eras);
    introJumpDropdownContent
      .selectAll('.intro__jump-dropdown-item')
      .remove();

    introJumpDropdownContent
      .selectAll('.intro__jump-dropdown-item')
      .data(eras)
      .enter()
      .append('div')
      .attr('class', 'intro__jump-dropdown-item')
      .text(d => d[language])
      .on('click', onClick);
  },
};

class EraDropdown {
  constructor(config) {
    const {
      introJumpButtonContainer,
      introJumpDropdownContainer,
      introJumpDropdownContent,
      introJumpButtonText,
    } = selections;

    const {
      init,
    } = privateMethods;

    privateProps.set(this, {
      introJumpButtonContainer,
      introJumpDropdownContainer,
      introJumpDropdownContent,
      introJumpButtonText,
      onClick: null,
      language: null,
      translations: null,
      eras: null,
      timer: null,
    });

    this.config(config);

    init.call(this);
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
  update() {
    const {
      eras,
      introJumpDropdownContent,
      language,
      onClick,
    } = privateProps.get(this);
    const { setContent } = privateMethods;
    setContent({
      eras,
      introJumpDropdownContent,
      onClick,
      language,
    });
    return this;
  }
}

export default EraDropdown;

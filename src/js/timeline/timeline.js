/**
 * timeline module/class represents map slider and timeline
 * @module timeline
 */
import TimelineSlider from './timelineSlider';
import { selections } from '../config/config';

const privateProps = new WeakMap();

const privateMethods = {
  drawSlider() {
    const props = privateProps.get(this);
    const {
      year,
      sliderContainer,
      outerContainer,
      updateYear,
      sliderSize,
      trackHeight,
      handleHeight,
      handleWidth,
      backgroundTrackAttrs,
      activeTrackAttrs,
      yearRange,
      stepSections,
      sliderPadding,
      eras,
      uniqueYears,
      language,
      mobile,
    } = props;

    props.slider = new TimelineSlider({
      mobile,
      language,
      eras,
      uniqueYears,
      container: sliderContainer,
      outerContainer,
      currentValue: year,
      size: sliderSize,
      padding: sliderPadding,
      trackHeight,
      handleHeight,
      handleWidth,
      backgroundTrackAttrs,
      activeTrackAttrs,
      stepSections,
      valueRange: yearRange,
      onDragEnd: updateYear,
      tooltip: true,
      onDrag: null,
    });
  },
  setText() {
    const {
      year,
      stepperTextContainer,
      uniqueYears,
    } = privateProps.get(this);
    stepperTextContainer.text(this.constructor.getUniqueYear(year, uniqueYears));
  },
  resizeSlider() {
    const props = privateProps.get(this);
    const {
      slider,
      sliderSize,
    } = props;

    slider
      .config({
        size: sliderSize,
      })
      .updateDimensions();
  },
  initEvents() {
    const {
      stepperLeftButton,
      stepperRightButton,
      updateYear,
      uniqueYears,
    } = privateProps.get(this);

    stepperLeftButton
      .on('click', () => {
        const { year } = privateProps.get(this);
        updateYear(this.constructor.getUniqueYear(year - 1, uniqueYears, -1));
      });
    stepperRightButton
      .on('click', () => {
        const { year } = privateProps.get(this);
        updateYear(this.constructor.getUniqueYear(year + 1, uniqueYears, 1));
      });
  },
  updateYear() {
    const {
      slider,
      year,
      uniqueYears,
    } = privateProps.get(this);

    slider
      .config({ currentValue: this.constructor.getUniqueYear(year, uniqueYears) })
      .update();
  },
  setSliderSize() {
    const props = privateProps.get(this);
    const {
      sliderContainer,
    } = props;
    const size = sliderContainer.node().getBoundingClientRect();
    const { width, height } = size;

    props.sliderSize = {
      width,
      height,
    };
  },
};

class Timeline {
  constructor(config) {
    const {
      timelineContainer,
      outerContainer,
      sliderContainer,
      stepperTextContainer,
      stepperLeftButton,
      stepperRightButton,
    } = selections;

    const {
      setSliderSize,
      drawSlider,
      initEvents,
      setText,
    } = privateMethods;

    privateProps.set(this, {
      container: timelineContainer,
      sliderContainer,
      stepperTextContainer,
      outerContainer,
      stepperLeftButton,
      stepperRightButton,
      trackHeight: 30,
      handleHeight: 40,
      handleWidth: 17,
      backgroundTrackAttrs: {
        rx: 8,
        ry: 8,
      },
      activeTrackAttrs: {
        rx: 8,
        ry: 8,
      },

      sliderPadding: { left: 10, right: 15 },
      yearRange: null,
      stepSections: null,
    });
    this.config(config);

    setSliderSize.call(this);
    drawSlider.call(this);
    initEvents.call(this);
    setText.call(this);
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
  updateYear() {
    const {
      updateYear,
      setText,
    } = privateMethods;
    updateYear.call(this);
    setText.call(this);
  }
  updateScreenSize() {
    const {
      setSliderSize,
      resizeSlider,
    } = privateMethods;
    setSliderSize.call(this);
    resizeSlider.call(this);
  }
  static getUniqueYear(year, uniqueYears, force) {
    let cYear = uniqueYears.find(y => y >= year);
    if (cYear !== year && force !== 1) {
      const prevYear = uniqueYears[uniqueYears.indexOf(cYear) - 1];
      if (force === -1) cYear = prevYear;
      else cYear = Math.abs(year - cYear) < Math.abs(year - prevYear) ? cYear : prevYear;
    }
    return cYear;
  }
}

export default Timeline;

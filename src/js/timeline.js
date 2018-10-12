import TimelineSlider from './timelineSlider';
import { selections } from './config';

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
      language,
    } = props;

    props.slider = new TimelineSlider({
      language,
      eras,
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
      onDrag: d => console.log('drag', d),
    });
  },
  setText() {
    const {
      year,
      stepperTextContainer,
    } = privateProps.get(this);
    stepperTextContainer.text(year);
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
    } = privateProps.get(this);
    // UPDATE CONTINOUS ON DRAG
    // STOP AT DATE LIMITS
    stepperLeftButton
      .on('click', () => {
        const { year } = privateProps.get(this);
        updateYear(year - 1);
      });
    stepperRightButton
      .on('click', () => {
        const { year } = privateProps.get(this);
        updateYear(year + 1);
      });
  },
  updateYear() {
    const {
      slider,
      year,
    } = privateProps.get(this);

    slider
      .config({ currentValue: year })
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
      // valueRange: [1950, 2016],
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
}

export default Timeline;

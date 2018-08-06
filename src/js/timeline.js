import TimelineSlider from './timelineSlider';

const privateProps = new WeakMap();

const privateMethods = {
  drawSlider() {
    const props = privateProps.get(this);
    const {
      year,
      sliderContainer,
      updateYear,
      sliderSize,
      trackHeight,
      handleHeight,
      handleWidth,
      backgroundTrackAttrs,
      activeTrackAttrs,
      yearRange,
      sliderPadding,
    } = props;

    props.slider = new TimelineSlider({
      container: sliderContainer,
      currentValue: year,
      size: sliderSize,
      padding: sliderPadding,
      trackHeight,
      handleHeight,
      handleWidth,
      backgroundTrackAttrs,
      activeTrackAttrs,
      valueRange: yearRange,
      onDragEnd: updateYear,
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
    console.log('slider size', sliderSize);

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
      setSliderSize,
      drawSlider,
      initEvents,
      setText,
    } = privateMethods;

    privateProps.set(this, {
      container: d3.select('.timeline-container'),
      sliderContainer: d3.select('.timeline-slider-container'),
      stepperTextContainer: d3.select('.timeline-stepper__year'),
      stepperLeftButton: d3.select('.timeline-stepper__left'),
      stepperRightButton: d3.select('.timeline-stepper__right'),
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
      sliderPadding: { left: 20, right: 20 },
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

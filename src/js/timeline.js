import TimelineSlider from './timelineSlider';

const privateProps = new WeakMap();

const privateMethods = {
  drawSlider() {
    const props = privateProps.get(this);
    const {
      year,
      sliderContainer,
      updateYear,
    } = props;

    const size = sliderContainer.node().getBoundingClientRect();
    const { width, height } = size;

    console.log('draw slider', width, height);

    props.slider = new TimelineSlider({
      container: sliderContainer,
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
      valueRange: [1950, 2016],
      currentValue: year,
      size: { width, height },
      padding: { left: 20, right: 20 },
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
      sliderContainer,
      slider,
    } = props;

    const size = sliderContainer.node().getBoundingClientRect();
    const { width, height } = size;

    slider
      .config({
        size: { width, height },
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
};

class Timeline {
  constructor(config) {
    const {
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
    });
    this.config(config);

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
    const { resizeSlider } = privateMethods;
    resizeSlider.call(this);
  }
}

export default Timeline;

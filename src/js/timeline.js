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
  initEvents() {
    console.log('init timeline events');
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
    } = privateMethods;

    privateProps.set(this, {
      container: d3.select('.timeline-container'),
      sliderContainer: d3.select('.timeline-slider-container'),
    });
    this.config(config);

    drawSlider.call(this);
    initEvents.call(this);
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
  updateYear() {
    const { updateYear } = privateMethods;
    updateYear.call(this);
  }
}

export default Timeline;

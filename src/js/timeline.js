import TimelineSlider from './timelineSlider';

const privateProps = new WeakMap();

const privateMethods = {
  drawSlider() {
    const props = privateProps.get(this);
    const {
      year,
      sliderContainer,
    } = props;

    const size = sliderContainer.node().getBoundingClientRect();
    const { width, height } = size;
    
    console.log('draw slider', width, height);

    props.slider = new TimelineSlider({
      container: sliderContainer,
      trackHeight: 20,
      backgroundTrackAttrs: {
        rx: 10,
        ry: 10,
      },
      activeTrackAttrs: {
        rx: 10,
        ry: 10,
      },
      valueRange: [1950, 2016],
      currentValue: year,
      size: { width, height },
      padding: { left: 20, right: 20 },
      onDragEnd: () => console.log('dragend'),
      onDrag: () => console.log('drag'),
    });
  },
  initEvents() {
    console.log('init timeline events');
  },
  updateYear() {

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
  }
  updateYear() {
    const { updateYear } = privateMethods;
    updateYear.call(this);
  }
}

export default Timeline;

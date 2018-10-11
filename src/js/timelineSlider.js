import getSliderBase from './timelineSliderBase';
import getSliderAxis from './timelineSliderAxis';
import getTooltipMethods from './timelineTooltipMethods';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const {
      setScale,
      updateScale,
      drawSvg,
      updateSvgSize,
      drawDetectionTrack,
      updateDetectionTrack,
      drawBackgroundTrack,
      updateBackgroundTrack,
      drawActiveTrack,
      drawHighlightedRange,
      drawHandle,
      initAxis,
      updateSliderPosition,
      setDrag,
      initTooltip,
    } = privateMethods;

    setScale.call(this);
    updateScale.call(this);
    drawSvg.call(this);
    updateSvgSize.call(this);
    drawDetectionTrack.call(this);
    updateDetectionTrack.call(this);
    drawBackgroundTrack.call(this);
    updateBackgroundTrack.call(this);
    drawActiveTrack.call(this);
    drawHighlightedRange.call(this);
    initAxis.call(this);
    drawHandle.call(this);

    updateSliderPosition.call(this);
    setDrag.call(this);

    initTooltip.call(this);

    return this;
  },
  drawHandle() {
    const props = privateProps.get(this);
    const {
      svg,
      handleHeight,
      // size,
      handleWidth,
      handleAttrs,
      handleDetail,
    } = props;

    props.handle = svg
      .append('g');

    props.handle
      .append('rect')
      .attrs(Object.assign({
        class: 'slider__handle',
        width: handleWidth,
        height: handleHeight,
        y: 0,
        x: 0,
        rx: 3,
        ry: 3,
      }, handleAttrs));

    const lineHeight = 20;
    if (!handleDetail) return;
    props.handle
      .append('line')
      .attrs({
        class: 'slider__line',
        x1: handleWidth / 2,
        x2: handleWidth / 2,
        y1: (handleHeight / 2) - (lineHeight / 2),
        y2: (handleHeight / 2) + (lineHeight / 2),
      });
  },
  setHandlePosition() {
    const props = privateProps.get(this);
    const {
      handleScale,
      handle,
      currentValue,
      handleWidth,
      size,
      handleHeight,
    } = props;

    // handle.attr('cx', handleScale(currentValue));
    // handle.attr('x', handleScale(currentValue) - (handleWidth / 2));
    handle
      .attr('transform', `translate(${handleScale(currentValue) - (handleWidth / 2)}, ${(size.height / 2) - (handleHeight / 2)})`);
  },
  setActiveTrackPosition() {
    const props = privateProps.get(this);
    const {
      handleScale,
      activeTrack,
      currentValue,
      valueRange,
      handleHeight,
    } = props;
    const width = (handleScale(currentValue) - handleScale(valueRange[0])) + (handleHeight);

    if (width < 0) return;

    activeTrack.attr('width', width);
  },
  updateSliderPosition() {
    const {
      setHandlePosition,
      setActiveTrackPosition,
    } = privateMethods;
    setHandlePosition.call(this);
    setActiveTrackPosition.call(this);
  },
  setDrag() {
    const props = privateProps.get(this);
    const {
      scale,
      detectionTrack,
      onDragEnd,
      tooltip,
      // onDrag,
    } = props;

    const { setTooltipPosition } = privateMethods;

    // const { updateSliderPosition } = privateMethods;

    detectionTrack.call(d3.drag()
      .on('start.interrupt', () => {
        detectionTrack.interrupt();
      })
      .on('end drag', () => {
        // const { valueRange } = props;
        // const sliderValue = scale.invert(d3.event.x);

        // if (sliderValue >= valueRange[0] && sliderValue <= valueRange[1]) {
        //   onDragEnd(sliderValue);
        // } else if (sliderValue < valueRange[0]) {
        //   onDragEnd(valueRange[0]);
        // } else if (sliderValue > valueRange[1]) {
        //   onDragEnd(valueRange[1]);
        // }
      })
      .on('start drag', () => {
        const { valueRange, svgPosition } = props;
        const sliderValue = scale.invert(d3.event.x);
        if (tooltip) {
          setTooltipPosition.call(this, { x: d3.event.x + svgPosition.left });
        }
        let newValue;
        if (sliderValue >= valueRange[0] && sliderValue <= valueRange[2]) {
          newValue = sliderValue;
        } else if (sliderValue < valueRange[0]) {
          /* eslint-disable prefer-destructuring */
          newValue = valueRange[0];
        } else if (sliderValue > valueRange[2]) {
          newValue = valueRange[2];
          /* eslint-enable prefer-destructuring */
        }
        // props.currentValue = newValue;
        // updateSliderPosition.call(this);
        onDragEnd(newValue);
      }));
  },
};

const baseMethods = getSliderBase({ privateProps, privateMethods });
const axisMethods = getSliderAxis({ privateProps, privateMethods });
const tooltipMethods = getTooltipMethods({ privateProps, privateMethods });

Object.assign(privateMethods, baseMethods, axisMethods, tooltipMethods);

class TimelineSlider {
  constructor(config) {
    privateProps.set(this, {
      dragging: false,
      tooltip: false,
      axisOn: true,
      handleDetail: true,
      trackHeight: 5,
      handleHeight: 20,
      highlightColor: 'black',
      activeTrackAttrs: {},
      handleAttrs: {},
      highlightedRange: undefined,
    });
    this.config(config);
    privateMethods.init.call(this);
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
  update() {
    const {
      updateSliderPosition,
    } = privateMethods;

    updateSliderPosition.call(this);
  }
  updateHighlightedRange() {
    const {
      highlightedRange,
      handleScale,
      highlightedRangeBar,
      highlightColor,
      valueRange,
      highlightedRangeLeftEnd,
      highlightedRangeRightEnd,
    } = privateProps.get(this);


    if (highlightedRange !== undefined) {
      const width = handleScale(highlightedRange[1]) - handleScale(highlightedRange[0]);
      const atStart = highlightedRange[0] === valueRange[0];
      const atEnd = highlightedRange[1] === valueRange[2];
      const bigEnough = width >= (handleScale.range()[1] - handleScale.range()[0]) / 2;

      highlightedRangeBar
        .attrs({
          x: handleScale(highlightedRange[0]),
          width,
          opacity: 1,
          fill: highlightColor,
        });
      highlightedRangeLeftEnd
        .attrs({
          cx: handleScale(highlightedRange[0]),
          fill: highlightColor,
          opacity: atStart && bigEnough ? 1 : 0,
        });
      highlightedRangeRightEnd
        .attrs({
          cx: handleScale(highlightedRange[1]),
          fill: highlightColor,
          opacity: atEnd && bigEnough ? 1 : 0,
        });
    } else {
      [
        highlightedRangeBar,
        highlightedRangeLeftEnd,
        highlightedRangeRightEnd,
      ].forEach(el => el.attr('opacity', 0));
    }
  }
  getScale() {
    const { scale } = privateProps.get(this);
    return scale;
  }
  getHandleScale() {
    const { handleScale } = privateProps.get(this);
    return handleScale;
  }
  getSvg() {
    const { svg } = privateProps.get(this);
    return svg;
  }
  getSize() {
    return privateProps.get(this).size;
  }
  getTrackHeight() {
    return privateProps.get(this).trackHeight;
  }
  updateDimensions() {
    const {
      updateScale,
      updateSvgSize,
      updateBackgroundTrack,
      updateDetectionTrack,
      updateAxis,
    } = privateMethods;

    updateScale.call(this);
    updateSvgSize.call(this);
    updateBackgroundTrack.call(this);
    updateDetectionTrack.call(this);
    updateAxis.call(this);

    this.update();
  }
  updateValueRange() {
    const {
      updateScaleValueRange,
    } = privateMethods;

    updateScaleValueRange.call(this);
  }
}

// Object.assign(ValueSlider.prototype, publicProps, publicMethods);

export default TimelineSlider;

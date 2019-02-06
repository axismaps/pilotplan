/**
 * Module comprises methods related to slider tooltip
 * @module timelineTooltipMethods
 * @memberof timeline
 */
import Timeline from './timeline';
import erasMethods from '../eras/erasMethods';

const getTooltipMethods = ({ privateProps, privateMethods }) => ({
  initTooltip() {
    const props = privateProps.get(this);
    const {
      detectionTrack,
      outerContainer,
      tooltip,
      svg,
    } = props;

    if (!tooltip) return;

    const { setTooltipPosition } = privateMethods;

    props.tooltipWidth = 400;
    const { tooltipWidth } = props;
    const tooltipMargin = 45;
    props.svgPosition = svg.node().getBoundingClientRect();
    const { svgPosition } = props;

    detectionTrack
      .on('mouseover', () => {
        props.tooltipContainer = outerContainer.append('div')
          .attr('class', 'slider__tooltip-container')
          .styles({
            position: 'absolute',
            width: `${tooltipWidth}px`,
            top: `${svgPosition.y - (tooltipMargin / 2) - 10}px`,
            height: `${svgPosition.height + tooltipMargin}px`,
          });

        props.tooltipYear = props.tooltipContainer
          .append('div')
          .attr('class', 'slider__tooltip-year')
          .text('YEAR');
        props.tooltipEra = props.tooltipContainer
          .append('div')
          .attr('class', 'slider__tooltip-era')
          .text('ERA');
      })
      .on('mousemove', () => {
        const { x } = d3.event;

        setTooltipPosition.call(this, { x });
      })
      .on('mouseout', () => {
        const { tooltipContainer } = privateProps.get(this);
        if (tooltipContainer === undefined) return;
        tooltipContainer.remove();
      });
  },
  setTooltipPosition({ x }) {
    const {
      tooltipContainer,
      tooltipWidth,
      scale,
      svgPosition,
      tooltipYear,
      eras,
      language,
      tooltipEra,
      uniqueYears,
    } = privateProps.get(this);

    const {
      getCurrentEra,
    } = erasMethods;

    const year = Math.round(scale.invert(x - svgPosition.left));
    const currentEra = getCurrentEra({ year, eras });

    if (currentEra === undefined) return;
    tooltipContainer
      .styles({
        left: `${x - (tooltipWidth / 2)}px`,
      });
    tooltipYear.text(Timeline.getUniqueYear(year, uniqueYears));
    tooltipEra.text(currentEra[language]);
  },
});

export default getTooltipMethods;

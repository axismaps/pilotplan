import erasMethods from './erasMethods';

const getTooltipMethods = ({ privateProps, privateMethods }) => ({
  initTooltip() {
    const props = privateProps.get(this);
    const {
      detectionTrack,
      outerContainer,
      tooltip,
      svg,
      // scale,
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
        // console.log('d3.event', (d3.event.x - svgPosition.left));
        // const { x } = d3.event;

        props.tooltipContainer = outerContainer.append('div')
          .attr('class', 'slider__tooltip-container')
          .styles({
            position: 'absolute',
            // left: `${x - (tooltipWidth / 2)}px`,
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
        // const {
        //   tooltipContainer,

        // } = privateProps.get(this);
        const { x } = d3.event;

        setTooltipPosition.call(this, { x });
        // tooltipContainer
        //   .styles({
        //     left: `${x - (tooltipWidth / 2)}px`,
        //   });
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
    } = privateProps.get(this);

    const {
      getCurrentEra,
    } = erasMethods;

    const year = Math.round(scale.invert(x - svgPosition.left));
    const currentEra = getCurrentEra({ year, eras });

    tooltipContainer
      .styles({
        left: `${x - (tooltipWidth / 2)}px`,
      });
    tooltipYear.text(year);
    tooltipEra.text(currentEra[language]);
  },
});

export default getTooltipMethods;

const controlMethods = {
  drawControls() {
    const buttonContainer = d3.select('.mapboxgl-ctrl-bottom-left')
      .append('div')
      .attr('class', 'atlas__button-container')
      .html(`
        <div class="atlas__center-button"><i class="icon-direction"></i></div>
        <div class="atlas__zoom-buttons">
          <div class="atlas__zoom-in-button"><i class="icon-plus"></i></div>
          <hr class="atlas__zoom-break" />
          <div class="atlas__zoom-out-button"><i class="icon-minus"></i></div>
        </div>
      `);
    return {
      zoomIn: buttonContainer.select('.atlas__zoom-in-button'),
      zoomOut: buttonContainer.select('.atlas__zoom-out-button'),
      center: buttonContainer.select('.atlas__center-button'),
    };
  },
  initControlListeners({
    controls,
    mbMap,
  }) {
    console.log('init');
  },
};

const initControls = ({
  mbMap,
}) => {
  const {
    drawControls,
    initControlListeners,
  } = controlMethods;
  const controls = drawControls();

  initControlListeners({
    controls,
    mbMap,
  });
};

export default initControls;

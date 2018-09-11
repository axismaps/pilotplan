const getProbeConfig = function getProbeConfig(d) {
  const image = d3.select(this);
  const imagePos = image.node().getBoundingClientRect();

  const imageLeft = imagePos.left;
  const imageWidth = imagePos.width;

  let html = [
    d.Title !== '' ? d.Title : d.Creator,
    d.FirstYear === d.LastYear ? d.FirstYear : `${d.FirstYear} - ${d.LastYear}`,
  ].reduce((accumulator, value) => {
    if (value !== '' && value !== undefined) {
      const row = `
        <div class="data-probe__row">${value}</div>
      `;
      return accumulator + row;
    }
    return accumulator;
  }, '');

  html += '<div class="data-probe__row data-probe__click-row">Click to view on map</div>';
  const probeWidth = 200;

  return {
    pos: {
      left: imageLeft + ((imageWidth / 2) - (probeWidth / 2)),
      bottom: (window.innerHeight - imagePos.top) + 15,
      width: probeWidth,
    },
    html,
  };
};

export default getProbeConfig;

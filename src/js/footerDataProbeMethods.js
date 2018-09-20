const getProbeConfig = function getProbeConfig(d, position, clicktext) {
  const image = d3.select(this);


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

  const text = clicktext !== undefined ? clicktext : 'Click to view on map';

  html += `<div class="data-probe__row data-probe__click-row">${text}</div>`;
  const getPos = () => {
    const imagePos = image.node().getBoundingClientRect();

    const imageLeft = imagePos.left;
    const imageWidth = imagePos.width;
    const probeWidth = 200;

    return {
      left: imageLeft + ((imageWidth / 2) - (probeWidth / 2)),
      bottom: (window.innerHeight - imagePos.top) + 15,
      width: probeWidth,
    };
  };


  const pos = position !== undefined ? position :
    getPos();
  return {
    pos,
    html,
  };
};

export default getProbeConfig;

const getProbeConfig = function getProbeConfig({
  data,
  position,
  clickText,
  selection,
}) {
  // const selection = d3.select(this);


  let html = [
    data.Title !== '' ? data.Title : data.Creator,
    data.FirstYear === data.LastYear ? data.FirstYear : `${data.FirstYear} - ${data.LastYear}`,
  ].reduce((accumulator, value) => {
    if (value !== '' && value !== undefined) {
      const row = `
        <div class="data-probe__row">${value}</div>
      `;
      return accumulator + row;
    }
    return accumulator;
  }, '');

  const text = clickText !== undefined ? clickText : 'Click to view on map';

  html += `<div class="data-probe__row data-probe__click-row">${text}</div>`;
  const getPos = () => {
    const imagePos = selection.node().getBoundingClientRect();

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

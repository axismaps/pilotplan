const getAreaSearchMethods = ({
  getAreaSearchActive,
  canvas,
  mbMap,
  getYear,
  onAreaSearch,
}) => {
  const localState = {
    start: null,
    current: null,
    box: null,
  };
  const areaMouseMethods = {
    getMousePos(e) {
      const rect = canvas.getBoundingClientRect();

      return new mapboxgl.Point(
        e.clientX - rect.left - canvas.clientLeft,
        e.clientY - rect.top - canvas.clientTop,
      );
    },
    onMouseDown(e) {
      const {
        onMouseMove,
        onMouseUp,
        getMousePos,
      } = areaMouseMethods;

      if (!getAreaSearchActive()) return;

      localState.start = getMousePos(e);

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    onMouseMove(e) {
      const {
        getMousePos,
      } = areaMouseMethods;
      const { start } = localState;
      const current = getMousePos(e);
      localState.current = current;

      if (localState.box === null || localState.box === undefined) {
        localState.box = d3.select('#map')
          .append('div')
          .attr('class', 'search-box');
      }

      const { box } = localState;

      const minX = Math.min(start.x, current.x);
      const maxX = Math.max(start.x, current.x);
      const minY = Math.min(start.y, current.y);
      const maxY = Math.max(start.y, current.y);

      const pos = `translate(${minX}px,${minY}px)`;

      box.styles({
        transform: pos,
        WebkitTransform: pos,
        width: `${maxX - minX}px`,
        height: `${maxY - minY}px`,
      })
        .classed('search-box--hidden', false);
    },
    onMouseUp(e) {
      console.log('up');
      const {
        onMouseMove,
        onMouseUp,
        getMousePos,
      } = areaMouseMethods;

      const {
        box,
        start,
      } = localState;

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      box.classed('search-box--hidden', true);

      const bbox = [start, getMousePos(e)];
      console.log(bbox);
      const features = mbMap.queryRenderedFeatures(bbox, {
        filter: [
          'all',
          ['<=', 'FirstYear', getYear()],
          ['>=', 'LastYear', getYear()],
          // ['match', 'Name', val],
        ],
      });
      // console.log('features', features);
      onAreaSearch(features);
    },
  };
  return areaMouseMethods;
};
// initAreaMethods() {
//   localProps.set(this, {
//     start: null,
//     current: null,
//     box: null,
//   });
//   const local = localProps.get(this);
//   const {
//     onMouseDown,
//     onMouseMove,
//     onMouseUp,
//   } = localMethods;

//   local.onMouseDown = onMouseDown.bind(this);
//   local.onMouseMove = onMouseMove.bind(this);
//   local.onMouseUp = onMouseUp.bind(this);
// },
// initAreaSearchListener({
//   canvas,
// }) {
//   const local = localProps.get(this);

//   const { onMouseDown } = local;

//   canvas.addEventListener('mousedown', onMouseDown, true);
// },


export default getAreaSearchMethods;

const localProps = new WeakMap();

const atlasSearchMethods = ({ privateProps, privateMethods }) => {
  const utils = {
    getMousePos({ e, canvas }) {
      const rect = canvas.getBoundingClientRect();

      return new mapboxgl.Point(
        e.clientX - rect.left - canvas.clientLeft,
        e.clientY - rect.top - canvas.clientTop,
      );
    },
  };

  const localMethods = {
    onMouseDown(e) {
      const {
        areaSearchActive,
        canvas,
      } = privateProps.get(this);
      const local = localProps.get(this);
      const {
        onMouseMove,
        onMouseUp,
      } = local;
      const { getMousePos } = utils;

      if (!areaSearchActive) return;

      local.start = getMousePos({ e, canvas });

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    onMouseMove(e) {
      const local = localProps.get(this);
      const {
        start,
      } = local;
      const { canvas } = privateProps.get(this);
      const { getMousePos } = utils;

      const current = getMousePos({ e, canvas });
      local.current = current;

      if (local.box === null || local.box === undefined) {
        local.box = d3.select('#map')
          .append('div')
          .attr('class', 'search-box');
      }

      const { box } = local;

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
      const {
        onMouseMove,
        onMouseUp,
        box,
        start,
      } = localProps.get(this);
      const {
        mbMap,
        canvas,
        onAreaSearch,
        year,
      } = privateProps.get(this);
      const { getMousePos } = utils;

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      box.classed('search-box--hidden', true);

      const bbox = [start, getMousePos({ e, canvas })];

      const features = mbMap.queryRenderedFeatures(bbox);
      // console.log('features', features);
      onAreaSearch(features);
    },
  };

  return {
    initAreaMethods() {
      localProps.set(this, {
        start: null,
        current: null,
        box: null,
      });
      const local = localProps.get(this);
      const {
        onMouseDown,
        onMouseMove,
        onMouseUp,
      } = localMethods;

      local.onMouseDown = onMouseDown.bind(this);
      local.onMouseMove = onMouseMove.bind(this);
      local.onMouseUp = onMouseUp.bind(this);
    },
    initAreaSearchListener() {
      const props = privateProps.get(this);
      const local = localProps.get(this);

      const { canvas } = props;
      const { onMouseDown } = local;

      canvas.addEventListener('mousedown', onMouseDown, true);
    },
  };
};

export default atlasSearchMethods;

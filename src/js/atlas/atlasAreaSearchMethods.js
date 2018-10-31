import dataMethods from './atlasDataMethods';

const getAreaSearchMethods = ({
  getAreaSearchActive,
  canvas,
  mbMap,
  getYear,
  onAreaSearch,
  getFlattenedRasterData,
  mobile,
}) => {
  const localState = {
    start: null,
    current: null,
    box: null,
  };
  const areaMouseMethods = {
    getMousePos(e) {
      const rect = canvas.getBoundingClientRect();

      if (!mobile) {
        return new mapboxgl.Point(
          e.clientX - rect.left - canvas.clientLeft,
          e.clientY - rect.top - canvas.clientTop,
        );
      }
      const touch = e.touches[0];
      return new mapboxgl.Point(
        touch.clientX,
        touch.clientY,
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

      if (!mobile) {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      } else {
        document.addEventListener('touchmove', onMouseMove);
        document.addEventListener('touchend', onMouseUp);
      }
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
    onMouseUp() {
      const {
        onMouseMove,
        onMouseUp,

      } = areaMouseMethods;

      const {
        box,
        start,
        current,
      } = localState;

      const {
        getRasterResults,
        getNonRasterResults,
      } = dataMethods;

      const flattenedRasterData = getFlattenedRasterData();
      if (!mobile) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      } else {
        document.removeEventListener('touchmove', onMouseMove);
        document.removeEventListener('touchend', onMouseUp);
      }

      box.classed('search-box--hidden', true);

      const bbox = [start, current];

      const features = mbMap.queryRenderedFeatures(bbox, {
        filter: [
          'all',
          ['<=', 'FirstYear', getYear()],
          ['>=', 'LastYear', getYear()],
        ],
      });

      const rasterFeatures = getRasterResults(features)
        .map(d => flattenedRasterData.find(dd => dd.SS_ID === d.properties.SS_ID));


      const nonRasterFeatures = getNonRasterResults(features);
      onAreaSearch({
        raster: rasterFeatures,
        nonRaster: nonRasterFeatures,
      });
    },
  };
  return areaMouseMethods;
};

export default getAreaSearchMethods;

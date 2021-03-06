/**
 * Module comprises function that returns zoom level for given bounds and min zoom
 * @module atlasGetZoom
 * @memberof atlas
 */
const getZoom = ({
  mbMap,
  bounds,
  highlightedFeature,
  padding = 0,
}) => {
  const {
    width,
    height,
  } = mbMap.getContainer()
    .getBoundingClientRect();

  const minLat = bounds.getSouth();
  const maxLat = bounds.getNorth();
  const maxLng = bounds.getEast();
  const minLng = bounds.getWest();

  /* eslint-disable no-mixed-operators */
  /**
   * best zoom level based on map width
   * @private
   */
  const zoom1 = Math.log(360.0 / 256.0 * (width - (2 * padding)) / (maxLng - minLng)) / Math.log(2);

  /**
   * best zoom level based on map height
   * @private
   */
  const zoom2 =
    Math.log(180.0 / 256.0 * (height - (2 * padding)) / (maxLat - minLat)) / Math.log(2);
  /* eslint-enable no-mixed-operators */
  const newZoom = ((zoom1 < zoom2) ? zoom1 : zoom2) - 0.3;
  const minZoom = mbMap.getLayer(highlightedFeature.style).minzoom;

  if (minZoom !== undefined) {
    if (minZoom > newZoom) return minZoom;
  }
  return newZoom;
};

export default getZoom;

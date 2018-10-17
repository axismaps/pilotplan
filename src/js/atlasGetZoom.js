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

  // const width = 1110;
  // const height = 723;
  const minLat = bounds.getSouth();
  const maxLat = bounds.getNorth();
  const maxLng = bounds.getEast();
  const minLng = bounds.getWest();

  /* eslint-disable no-mixed-operators */
  // best zoom level based on map width
  const zoom1 = Math.log(360.0 / 256.0 * (width - (2 * padding)) / (maxLng - minLng)) / Math.log(2);

  // best zoom level based on map height
  const zoom2 =
    Math.log(180.0 / 256.0 * (height - (2 * padding)) / (maxLat - minLat)) / Math.log(2);
  /* eslint-enable no-mixed-operators */
  const newZoom = ((zoom1 < zoom2) ? zoom1 : zoom2) - 0.3;
  const minZoom = mbMap.getLayer(highlightedFeature.style).minzoom;
  // console.log('min zoom', highlightedFeature.style, minZoom);
  // console.log('highlightedFeature', highlightedFeature);
  if (minZoom !== undefined) {
    if (minZoom > newZoom) return minZoom;
  }
  return newZoom;
};

export default getZoom;

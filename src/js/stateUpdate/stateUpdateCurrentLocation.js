const getStateUpdateCurrentLocation = ({
  components,
}) => function updateCurrentLocation() {
  const { currentLocation } = this.props();
  const {
    urlParams,
    views,
    layout,
  } = components;
  const { center, bearing, zoom } = currentLocation;
  if (!views.mapViewInitialized()) return;
  // console.log('zoom', zoom);

  urlParams
    .config({
      center: `${center.lat},${center.lng}`,
      zoom,
      bearing,
    })
    .update();

  layout
    .config({
      rotated: bearing !== -72,
      zoomedOut: zoom < 11,
    })
    .updateLocation();
};

export default getStateUpdateCurrentLocation;

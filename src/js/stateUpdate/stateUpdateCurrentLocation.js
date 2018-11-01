const getStateUpdateCurrentLocation = ({
  components,
}) => function updateCurrentLocation() {
  const { currentLocation } = this.props();
  const {
    urlParams,
    views,
    layout,
    atlas,
  } = components;
  const { center, bearing, zoom } = currentLocation;
  if (!views.mapViewInitialized()) return;

  const style = atlas.getStyle();

  urlParams
    .config({
      center: `${center.lat},${center.lng}`,
      zoom,
      bearing,
    })
    .update();

  layout
    .config({
      rotated: bearing !== style.bearing ||
      Math.abs(style.center[0] - center.lng) > 0.0001 ||
      Math.abs(style.center[1] - center.lat) > 0.0001 ||
        zoom !== style.zoom,
      zoomedOut: zoom < 11,
    })
    .updateLocation();
};

export default getStateUpdateCurrentLocation;

const atlasMethods = {
  getLayerStyle({
    layer,
    year,
  }) {
    if (!('filter' in layer)) return layer;
    layer.filter = layer.filter.map((f) => {
      if (f[0] === 'all') {
        return f.map((dd, i) => {
          if (i === 0) return dd;
          const copyFilter = [...dd];
          if (copyFilter[1] === 'FirstYear' || copyFilter[1] === 'LastYear') {
            copyFilter[2] = year;
          }
          return copyFilter;
        });
      }
      return f;
    });
    return layer;
  },
  getCurrentStyle({
    style,
    year,
  }) {
    const { getLayerStyle } = atlasMethods;
    const styleCopy = JSON.parse(JSON.stringify(style));
    styleCopy.layers = styleCopy.layers.map(layer => getLayerStyle({ layer, year }));

    return styleCopy;
  },
  getCurrentStyleFromMap({
    mbMap,
    year,
  }) {
    const { getCurrentStyle } = atlasMethods;
    return getCurrentStyle({
      style: mbMap.getStyle(),
      year,
    });
  },
  getMap({
    viewshedsGeo,
    initApp,
    style,
  }) {
    const mbMap = new mapboxgl.Map({
      container: 'map',
      style,
    })
      .on('load', () => {
        initApp();
      })
      .on('mouseover', 'viewconespoint', (d) => {
        const coneFeature = viewshedsGeo.features.find(cone =>
          cone.properties.SS_ID === d.features[0].properties.SS_ID);

        const existingSource = mbMap.getSource('viewshed');
        if (existingSource === undefined) {
          mbMap.addSource('viewshed', {
            type: 'geojson',
            data: coneFeature,
          });
        } else {
          existingSource.setData(coneFeature);
        }
        mbMap.addLayer({
          id: 'viewshed-feature',
          type: 'fill',
          source: 'viewshed',
          layout: {},
          paint: {
            'fill-color': 'black',
            'fill-opacity': 0.5,
          },
        });
      })
      .on('mouseout', 'viewconespoint', () => {
        mbMap.removeLayer('viewshed-feature');
      });
    return mbMap;
  },
  updateYear({
    year,
    mbMap,
  }) {
    const {
      getLayerStyle,
    } = atlasMethods;

    const styleCopy = JSON.parse(JSON.stringify(mbMap.getStyle()));
    styleCopy.layers = styleCopy.layers.map(layer => getLayerStyle({ layer, year }));
    mbMap.setStyle(styleCopy);
  },
  getMapLayers(mbMap) {
    return mbMap
      .getStyle()
      .layers
      .map(d => mbMap.getLayer(d.id));
  },
  getSourceLayers(mbMap) {
    const sources = mbMap
      .getStyle()
      .layers
      .map(d => d['source-layer'])
      .filter(d => d !== undefined);

    return [...new Set(sources)];
  },
  getAllFeatures() {

  },
};

export default atlasMethods;

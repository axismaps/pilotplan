import getProbeConfig from './footerDataProbeMethods';
import atlasClickSearchMethods from './atlasClickSearchMethods';

const atlasMethods = {
  getLayerStyle({
    layer,
    year,
  }) {
    if (!('filter' in layer)) return layer;

    const newLayer = Object.assign({}, layer);
    newLayer.filter = layer.filter.map((f) => {
      if (f[0] === 'all') {
        return f.map((d, i) => {
          if (i === 0) return d;
          const copyFilter = [...d];
          if (copyFilter[1] === 'FirstYear' || copyFilter[1] === 'LastYear') {
            copyFilter[2] = year;
          }
          return copyFilter;
        });
      } else if (f[1] === 'FirstYear' || f[1] === 'LastYear') {
        const copyFilter = [...f];
        copyFilter[2] = year;
        return copyFilter;
      }
      return f;
    });

    return newLayer;
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
    getCurrentView,
    setCancelClickSearch,
    getRasterData,
    onViewClick,
    onMove,
    dataProbe,
  }) {
    const {
      addConeToMap,
      removeCone,
    } = atlasMethods;

    const { removePulse } = atlasClickSearchMethods;

    let coneFeature;

    const mbMap = new mapboxgl.Map({
      minZoom: 9,
      logoPosition: 'bottom-right',
      container: 'map',
      style,

    })
      // .on('mousedown', () => {
      //   d3.select('.mapboxgl-canvas')
      //     .style('cursor', 'grab');
      // })
      // .on('mouseup', () => {
      //   d3.select('.mapboxgl-canvas')
      //     .style('cursor', 'pointer');
      // })
      .on('moveend', () => {
        const center = mbMap.getCenter();
        const zoom = mbMap.getZoom();
        const bearing = mbMap.getBearing();

        onMove({ center, zoom, bearing });
      })
      .on('movestart', () => {
        removePulse();
      })
      .on('load', () => {
        // console.log('get loaded style', mbMap.getStyle().layers.map(d => mbMap.getLayer(d.id)));
        initApp();
      })
      .on('mouseover', 'viewconespoint', (d) => {
        coneFeature = viewshedsGeo.features.find(cone =>
          cone.properties.SS_ID === d.features[0].properties.SS_ID);
        const offset = 15;
        const probeConfig = getProbeConfig(
          coneFeature.properties, {
            left: d.point.x + offset,
            bottom: (window.innerHeight - d.point.y) + offset,
            width: 200,
          },
          'Click for details',
        );

        dataProbe
          .config(probeConfig)
          .draw();
        const currentView = getCurrentView();

        if (currentView !== null &&
          currentView.SS_ID !== coneFeature.properties.SS_ID) {
          const viewCone = viewshedsGeo.features.find(cone =>
            cone.properties.SS_ID === currentView.SS_ID);
          addConeToMap({
            coneFeature: {
              type: 'FeatureCollection',
              features: [coneFeature, viewCone],
            },
            mbMap,
          });
        } else {
          addConeToMap({
            coneFeature,
            mbMap,
          });
        }
      })
      .on('mouseout', 'viewconespoint', () => {
        const currentView = getCurrentView();
        dataProbe.remove();

        removeCone({ mbMap });

        if (currentView !== null) {
          const viewCone = viewshedsGeo.features.find(cone =>
            cone.properties.SS_ID === currentView.SS_ID);
          addConeToMap({
            mbMap,
            coneFeature: viewCone,
          });
        }
      })
      .on('click', 'viewconespoint', () => {
        const views = getRasterData().get('views');
        const newView = views.find(d => d.SS_ID === coneFeature.properties.SS_ID);

        onViewClick(newView);
        setCancelClickSearch();
      });
    // console.log('mbMap', mbMap);
    // console.log('style', mbMap.getStyle());
    return mbMap;
  },
  addConeToMap({
    coneFeature,
    mbMap,
  }) {
    if (mbMap.getLayer('viewshed-feature') !== undefined) {
      mbMap.removeLayer('viewshed-feature');
    }
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
  },
  removeCone({
    mbMap,
  }) {
    const existingLayer = mbMap.getLayer('viewshed-feature');
    if (existingLayer === undefined) return;
    mbMap.removeLayer('viewshed-feature');
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
    // console.log('getLayers', mbMap.getStyle().layers);
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

import getProbeConfig from '../footer/footerDataProbeMethods';
import atlasClickSearchMethods from './atlasClickSearchMethods';

const atlasMethods = {
  getCurrentLocation({
    mbMap,
  }) {
    const center = mbMap.getCenter();
    const zoom = mbMap.getZoom();
    const bearing = mbMap.getBearing();

    return { center, zoom, bearing };
  },
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
  getLayerOpacities({
    mbMap,
  }) {
    return mbMap.getStyle().layers.reduce((accumulator, layer) => {
      // console.log('layer', layer);
      /* eslint-disable no-param-reassign */
      if (layer.type === 'fill') {
        const opacity = mbMap.getPaintProperty(layer.id, 'fill-opacity');
        accumulator[layer.id] = opacity === undefined ? 1 : opacity;
      } else if (layer.type === 'line') {
        const opacity = mbMap.getPaintProperty(layer.id, 'line-opacity');
        accumulator[layer.id] = opacity === undefined ? 1 : opacity;
      } else {
        accumulator[layer.id] = 1;
      }
      return accumulator;
      /* eslint-enable no-param-reassign */
    }, {});
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
    getLanguage,
    translations,
    getCurrentView,
    setCancelClickSearch,
    getRasterData,
    onViewClick,
    onMove,
    dataProbe,
    onLayerSourceData,
    onFeatureSourceData,
    onReturnToSearch,
    // correctAttribution,
  }) {
    const {
      addConeToMap,
      removeCone,
      getCurrentLocation,
    } = atlasMethods;

    const { removePulse } = atlasClickSearchMethods;

    let coneFeature;

    const mbMap = new mapboxgl.Map({
      minZoom: 9,
      maxZoom: 17,
      // maxZoom: 14.9,
      logoPosition: 'bottom-right',
      container: 'map',
      style,
      preserveDrawingBuffer: true,
      // attributionControl: false,
      attributionControl: true,
      // customAttribution: `
      //   <a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a>
      //   <a class="mapbox-improve-map" href="https://www.mapbox.com/feedback/?owner=axismaps&amp;id=cjlxzhuj652652smt1jf50bq5&amp;access_token=pk.eyJ1IjoiYXhpc21hcHMiLCJhIjoieUlmVFRmRSJ9.CpIxovz1TUWe_ecNLFuHNg" target="_blank">Improve this map</a>
      //   <a href="https://www.digitalglobe.com/" target="_blank">© DigitalGlobe</a>
      // `,
    })
      // .addControl(new mapboxgl.AttributionControl({
      //   customAttribution: `
      //   <a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a>
      //   <a class="mapbox-improve-map" href="https://www.mapbox.com/feedback/?owner=axismaps&amp;id=cjlxzhuj652652smt1jf50bq5&amp;access_token=pk.eyJ1IjoiYXhpc21hcHMiLCJhIjoieUlmVFRmRSJ9.CpIxovz1TUWe_ecNLFuHNg" target="_blank">Improve this map</a>
      //   <a href="https://www.digitalglobe.com/" target="_blank">© DigitalGlobe</a>
      // `,
      // }))
      // .on('mousedown', () => {
      //   d3.select('.mapboxgl-canvas')
      //     .style('cursor', 'grab');
      // })
      // .on('mouseup', () => {
      //   d3.select('.mapboxgl-canvas')
      //     .style('cursor', 'pointer');
      // })
      .on('moveend', () => {
        const currentLocation = getCurrentLocation({ mbMap });
        onMove(currentLocation);
      })
      // .on('zoomend', () => {
      //   console.log('endzoom', mbMap.getZoom());
      // })
      .on('movestart', () => {
        removePulse();
      })
      .on('load', () => {
        // console.log('get loaded style', mbMap.getStyle().layers.map(d => mbMap.getLayer(d.id)));
        initApp();
      })
      // .on('render', () => {
      //   correctAttribution();
      // })
      .on('sourcedata', () => {
        onLayerSourceData();
        onReturnToSearch();
        onFeatureSourceData();
      })
      .on('mouseover', 'viewconespoint', (d) => {
        coneFeature = viewshedsGeo.features.find(cone =>
          cone.properties.SS_ID === d.features[0].properties.SS_ID);
        const offset = 15;
        // const probeConfig = getProbeConfig(
        //   coneFeature.properties, {
        //     left: d.point.x + offset,
        //     bottom: (window.innerHeight - d.point.y) + offset,
        //     width: 200,
        //   },
        //   'Click for details',
        // );
        const probeConfig = getProbeConfig({
          data: coneFeature.properties,
          position: {
            left: d.point.x + offset,
            bottom: (window.innerHeight - d.point.y) + offset,
            width: 200,
          },
          clickText: translations['click-for-details'][getLanguage()],
        });

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
        'fill-color': 'white',
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
};

export default atlasMethods;
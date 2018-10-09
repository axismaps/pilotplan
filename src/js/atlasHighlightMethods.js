import union from '@turf/union';
import { colors } from './config';

const atlasHighlightMethods = {
  getHighlightedGeoJSON({
    highlightedFeature,
    year,
    mbMap,
  }) {
    const features = mbMap.querySourceFeatures('composite', {
      sourceLayer: highlightedFeature.sourceLayer,
      layers: [highlightedFeature.style],
      filter: [
        'all',
        ['<=', 'FirstYear', year],
        ['>=', 'LastYear', year],
        ['==', 'Name', highlightedFeature.properties.Name],
      ],
    });
    // console.log('features', features);

    if (highlightedFeature.layer.type === 'fill') {
      return {
        type: 'FeatureCollection',
        features: [features.reduce((accumulator, feature) =>
          union(accumulator, feature))],
      };
    }
    return {
      type: 'FeatureCollection',
      features,
    };
  },
  getLayerBounds({
    year,
    highlightedFeature,
    extentsData,
  }) {
    console.log('get layer bounds', highlightedFeature);
    const extentsForLayer =
      extentsData[highlightedFeature.sourceLayer][highlightedFeature.dataLayer];
    const years = Object.keys(extentsForLayer).map(d => parseInt(d, 10));
    const closestYear = years.reduce((accumulator, d) => {
      if (d <= year && d > accumulator) {
        return d;
      }
      return accumulator;
    });
    const featureExtent = extentsForLayer[String(closestYear)];
    const sw = new mapboxgl.LngLat(featureExtent[0], featureExtent[1]);
    const ne = new mapboxgl.LngLat(featureExtent[2], featureExtent[3]);
    return new mapboxgl.LngLatBounds(sw, ne);
  },
  clearHighlightedFeature(mbMap) {
    const polyLayers = [
      'highlighted-feature-fill',
      'highlighted-feature-outline-top',
      'highlighted-feature-outline-bottom',
    ];

    const lineLayers = [
      'highlighted-feature-outline-top',
      'highlighted-feature-outline-bottom',
    ];

    const existingHighlighted = mbMap.getSource('highlighted');

    const existingPoly = mbMap.getLayer('highlighted-feature-fill');
    const existingOutline = mbMap.getLayer('highlighted-feature-outline-top');

    if (existingHighlighted !== undefined) {
      if (existingPoly !== undefined) {
        polyLayers.forEach((layer) => {
          mbMap.removeLayer(layer);
        });
      } else if (existingOutline !== undefined) {
        lineLayers.forEach((layer) => {
          mbMap.removeLayer(layer);
        });
      }
    }
  },
  drawHighlightedFeature({
    highlightedFeature,
    mbMap,
    year,
    geoJSON,
  }) {
    const existingHighlighted = mbMap.getSource('highlighted');

    if (highlightedFeature === null) return;
    // console.log('highlighted', highlightedFeature);
    let featureJSON;
    const notEntireLayer = !Object.prototype.hasOwnProperty.call(highlightedFeature, 'dataLayer');
    // JUST CONVERT TO JSON EARLIER INTSEAD
    if (notEntireLayer && geoJSON === undefined) {
      // featureJSON = highlightedFeature.reduce((accumulator, feature) => {
      //   /* eslint-disable no-param-reassign */
      //   accumulator.features.push(feature.toJSON());
      //   /* eslint-enable no-param-reassign */
      //   return accumulator;
      // }, {
      //   type: 'FeatureCollection',
      //   features: [],
      // });
      featureJSON = {
        type: 'FeatureCollection',
        features: mbMap.querySourceFeatures('composite', {
          sourceLayer: highlightedFeature.sourceLayer,
          layers: [highlightedFeature.style],
          filter: [
            'all',
            ['<=', 'FirstYear', year],
            ['>=', 'LastYear', year],
            ['==', '$id', highlightedFeature.id],
          ],
        }),
      };
    } else if (geoJSON !== undefined) {
      featureJSON = geoJSON;
    } else {
      // gets all features in layer
      featureJSON = {
        type: 'FeatureCollection',
        features: mbMap.querySourceFeatures('composite', {
          sourceLayer: highlightedFeature.sourceLayer,
          layers: [highlightedFeature.style],
          filter: [
            'all',
            ['<=', 'FirstYear', year],
            ['>=', 'LastYear', year],
            ['==', 'SubType', highlightedFeature.dataLayer], // this should be the field name...
          ],
        }),
      };
    }

    // const bbox = getBBox(featureJSON);

    if (existingHighlighted === undefined) {
      mbMap.addSource('highlighted', {
        type: 'geojson',
        data: featureJSON,
      });
    } else {
      existingHighlighted.setData(featureJSON);
    }

    const fillLayer = {
      id: 'highlighted-feature-fill',
      type: 'fill',
      source: 'highlighted',
      layout: {},
      paint: {
        'fill-color': colors.highlightColor,
        'fill-opacity': 0.2,
        // 'line-join': 'round',
      },
    };
    const outlineLayerTop = {
      id: 'highlighted-feature-outline-top',
      type: 'line',
      source: 'highlighted',
      layout: {
        'line-join': 'round',
      },
      paint: {
        'line-width': 2,
        'line-color': '#eee',

      },
    };

    const outlineLayerBottom = {
      id: 'highlighted-feature-outline-bottom',
      type: 'line',
      source: 'highlighted',
      layout: {
        'line-join': 'round',
      },
      paint: {
        'line-width': 8,
        'line-color': colors.highlightColor,
        'line-opacity': 0.5,

      },
    };

    const isPolygon = feature => feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon';

    // return if no features are returned
    if (featureJSON.features.length === 0) return;

    if (featureJSON.type === 'FeatureCollection') {
      if (isPolygon(featureJSON.features[0])) {
        mbMap.addLayer(fillLayer);
      }
      mbMap.addLayer(outlineLayerBottom);
      mbMap.addLayer(outlineLayerTop);
    } else {
      if (isPolygon(featureJSON)) {
        mbMap.addLayer(fillLayer);
      }
      mbMap.addLayer(outlineLayerBottom);
      mbMap.addLayer(outlineLayerTop);
    }

    // if (bbox.includes(Infinity) || !notEntireLayer) return;

    // mbMap.fitBounds(bbox, { padding: 100 });
  },
};

export default atlasHighlightMethods;

import getBBox from '@turf/bbox';
import { colors } from './config';

const atlasHighlightMethods = {
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
  }) {
    const existingHighlighted = mbMap.getSource('highlighted');

    if (highlightedFeature === null) return;
    let featureJSON;
    // JUST CONVERT TO JSON EARLIER INTSEAD
    if ('toJSON' in highlightedFeature) {
      featureJSON = highlightedFeature.toJSON();
    } else if (highlightedFeature.type === 'Feature') {
      featureJSON = highlightedFeature;
    } else {
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

    // console.log('feature', featureJSON);

    const bbox = getBBox(featureJSON);
    // console.log('bbox', bbox);

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

    if (bbox.includes(Infinity)) return;

    mbMap.fitBounds(bbox, { padding: 100 });
  },
};

export default atlasHighlightMethods;

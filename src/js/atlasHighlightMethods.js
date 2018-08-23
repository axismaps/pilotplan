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
    if (highlightedFeature.type === 'Feature') {
      featureJSON = highlightedFeature.toJSON();
    } else {
      featureJSON = {
        type: 'FeatureCollection',
        // features: mbMap.queryRenderedFeatures({ layers: [highlightedFeature.id] })
        //   .map(d => d.toJSON()),
        features: mbMap.querySourceFeatures('composite', {
          sourceLayer: highlightedFeature.sourceLayer,
          layers: [highlightedFeature.id],
          filter: [
            'all',
            ['<=', 'FirstYear', year],
            ['>=', 'LastYear', year],
            ['==', 'SubType', highlightedFeature.en],
          ],
        }),
      };
    }
    // console.log('featureJSON', featureJSON);
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
        // 'fill-outline-color': 'blue',
        'fill-color': colors.highlightColor,
        'fill-opacity': 0.2,
      },
    };
    const outlineLayerTop = {
      id: 'highlighted-feature-outline-top',
      type: 'line',
      source: 'highlighted',
      layout: {},
      paint: {
        'line-width': 2,
        'line-color': '#1a1a1a',
      },
    };

    const outlineLayerBottom = {
      id: 'highlighted-feature-outline-bottom',
      type: 'line',
      source: 'highlighted',
      layout: {},
      paint: {
        'line-width': 8,
        'line-color': colors.highlightColor,
        'line-opacity': 0.5,
      },
    };
    if (featureJSON.type === 'FeatureCollection') {
      mbMap.addLayer(fillLayer);
      mbMap.addLayer(outlineLayerBottom);
      mbMap.addLayer(outlineLayerTop);
    } else {
      if (featureJSON.geometry.type === 'Polygon') {
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

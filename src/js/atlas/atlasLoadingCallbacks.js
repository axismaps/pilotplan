/**
 * Module comprises methods to set callbacks for feature highlighting and zooming
 * These callbacks are fired when map moves and are on timers to determine
 * when feature loading is complete.
 * This is all a way to work around the limitations imposed by querying vector tiles,
 * namely that we can only access data that is loaded in the current vector tiles
 * @module atlasLoadingCallbacks
 * @memberof atlas
 */

import getBBox from '@turf/bbox';
import area from '@turf/area';
import length from '@turf/length';
import highlightMethods from './atlasHighlightMethods';
/* eslint-disable no-param-reassign */
const setLoadingCallbacks = ({ props, privateMethods }) => {
  const {
    drawHighlightedFeature,
    clearHighlightedFeature,
    getHighlightedGeoJSON,
    updateLuminosity,
  } = highlightMethods;

  props.onReturnToSearch = () => {
    const {
      mbMap,
      searchLocationLoading,
      highlightLoadingTimer,
      highlightedFeature,
      year,
    } = props;

    const { zoomToAndHighlightFeature } = privateMethods;
    if (!searchLocationLoading) return;

    if (highlightLoadingTimer !== null) {
      clearTimeout(highlightLoadingTimer);
    }

    props.highlightLoadingTimer = setTimeout(() => {
      props.highlightedFeatureJSON = getHighlightedGeoJSON({
        highlightedFeature,
        year,
        mbMap,
      });
      zoomToAndHighlightFeature({ props });
    }, 500);
  };

  props.onLayerSourceData = () => {
    const {
      highlightLayerLoading,
      highlightLoadingTimer,
      highlightedLayer,
      mbMap,
      toggleOverlayFade,
    } = props;

    const { layers } = mbMap.getStyle();

    if (!highlightLayerLoading) return;

    if (highlightLoadingTimer !== null) {
      clearTimeout(highlightLoadingTimer);
    }

    props.highlightLoadingTimer = setTimeout(() => {
      layers.forEach((layer) => {
        const isLayer = highlightedLayer.dataLayer === layer.id ||
          highlightedLayer.style === layer.id ||
          layer.id.includes(highlightedLayer.dataLayer);

        if (layer.type === 'line') {
          if (!isLayer) {
            mbMap.setPaintProperty(layer.id, 'line-opacity', 0.1);
          } else if (isLayer) {
            mbMap.setPaintProperty(layer.id, 'line-opacity', 1);
            updateLuminosity(mbMap, layer.id, 'line-color');
          }
        } else if (layer.type === 'fill') {
          if (!isLayer) {
            mbMap.setPaintProperty(layer.id, 'fill-opacity', 0.1);
          } else if (isLayer) {
            mbMap.setPaintProperty(layer.id, 'fill-opacity', 1);
            updateLuminosity(mbMap, layer.id, 'fill-color');
          }
        } else if (layer.type === 'symbol') {
          if (!isLayer) {
            mbMap.setPaintProperty(layer.id, 'text-opacity', 0.1);
          } else if (isLayer) {
            mbMap.setPaintProperty(layer.id, 'text-opacity', 1);
          }
        }
      });
      toggleOverlayFade(true);
      props.highlightLayerLoading = false;
    }, 700);
  };

  props.onFeatureSourceData = function onFeatureSourceData() {
    const {
      highlightFeatureLoading,
      highlightLoadingTimer,
      highlightedFeature,
      highlightedFeatureJSON,
      mbMap,
      year,
      mobile,
      toggleMouseEventsDisabled,
    } = props;
    if (!highlightFeatureLoading) return;

    if (highlightLoadingTimer !== null) {
      clearTimeout(highlightLoadingTimer);
    }
    props.highlightLoadingTimer = setTimeout(() => {
      const newJSON = getHighlightedGeoJSON({
        highlightedFeature,
        year,
        mbMap,
      });

      let lastIteration;
      /**
       * guess if map is done loading
       * using really arbitrary comparison of total feature area or length
       * @private
       */
      if (highlightedFeature.geometry.type.includes('Polygon')) {
        lastIteration = Math.abs(area(newJSON.features[0]) -
        area(highlightedFeatureJSON.features[0])) < 5 ||
          area(newJSON.features[0]) <= area(highlightedFeatureJSON.features[0]);
      } else if (highlightedFeature.geometry.type.includes('String')) {
        const previousLength = d3.sum(highlightedFeatureJSON.features.map(d => length(d)));
        const currentLength = d3.sum(newJSON.features.map(d => length(d)));
        lastIteration = Math.abs(currentLength - previousLength) < 1 ||
          currentLength <= previousLength;
      }

      if (lastIteration) {
        props.highlightedFeatureJSON = null;
        props.highlightFeatureLoading = false;
        toggleMouseEventsDisabled(false);
      } else {
        props.highlightedFeatureJSON = newJSON;
        props.onFeatureSourceData();
        props.counter += 1;
      }

      if (lastIteration && props.counter !== 0) return;
      const newBounds = getBBox(newJSON);
      mbMap.fitBounds(newBounds, { padding: mobile ? 0 : 200 });
      clearHighlightedFeature(mbMap);
      drawHighlightedFeature({
        highlightedFeature,
        mbMap,
        year,
        geoJSON: newJSON,
      });
    }, 500);
  };
};
/* eslint-enable no-param-reassign */

export default setLoadingCallbacks;

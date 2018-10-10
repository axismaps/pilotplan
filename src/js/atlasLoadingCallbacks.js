import getBBox from '@turf/bbox';
import area from '@turf/area';
import length from '@turf/length';
import highlightMethods from './atlasHighlightMethods';
/* eslint-disable no-param-reassign */
const getLoadingCallbacks = ({ props }) => {
  const {
    drawHighlightedFeature,
    clearHighlightedFeature,
    getHighlightedGeoJSON,
  } = highlightMethods;

  props.onReturnToSearch = () => {
    const {
      mbMap,
      searchLocationLoading,
      highlightLoadingTimer,
      highlightedFeature,
      year,
      onFeatureSourceData,
    } = props;

    if (!searchLocationLoading) return;

    if (highlightLoadingTimer !== null) {
      clearTimeout(highlightLoadingTimer);
    }

    props.highlightLoadingTimer = setTimeout(() => {
      props.highlightFeatureLoading = true;
      props.searchLocationLoading = false;


      props.highlightedFeatureJSON = getHighlightedGeoJSON({
        highlightedFeature,
        year,
        mbMap,
      });

      onFeatureSourceData();
      props.counter = 0;
      const newBounds = getBBox(props.highlightedFeatureJSON);
      mbMap.fitBounds(newBounds, { padding: 200 });
    }, 500);
  };

  props.onLayerSourceData = () => {
    const {
      highlightLayerLoading,
      highlightLoadingTimer,
      highlightedFeature,
      mbMap,
      year,
    } = props;
    if (!highlightLayerLoading) return;

    if (highlightLoadingTimer !== null) {
      clearTimeout(highlightLoadingTimer);
    }
    props.highlightLoadingTimer = setTimeout(() => {
      drawHighlightedFeature({
        highlightedFeature,
        mbMap,
        year,
      });
      props.highlightLayerLoading = false;
    }, 500);
  };

  props.onFeatureSourceData = () => {
    const {
      highlightFeatureLoading,
      highlightLoadingTimer,
      highlightedFeature,
      highlightedFeatureJSON,
      mbMap,
      year,
    } = props;
    if (!highlightFeatureLoading) return;

    if (highlightLoadingTimer !== null) {
      clearTimeout(highlightLoadingTimer);
    }
    // console.log('highlighted', highlightedFeature);
    props.highlightLoadingTimer = setTimeout(() => {
      const newJSON = getHighlightedGeoJSON({
        highlightedFeature,
        year,
        mbMap,
      });

      let lastIteration;
      // move all this to somewhere else
      if (highlightedFeature.geometry.type.includes('Polygon')) {
        lastIteration = Math.abs(area(newJSON.features[0]) -
        area(highlightedFeatureJSON.features[0])) < 5 ||
          area(newJSON.features[0]) <= area(highlightedFeatureJSON.features[0]);
      } else if (highlightedFeature.geometry.type.includes('String')) {
        // console.log('newjson', newJSON);
        const previousLength = d3.sum(highlightedFeatureJSON.features.map(d => length(d)));
        const currentLength = d3.sum(newJSON.features.map(d => length(d)));
        // console.log(previousLength, currentLength);
        lastIteration = Math.abs(currentLength - previousLength) < 1 ||
          currentLength <= previousLength;
      }

      if (lastIteration) {
        props.highlightedFeatureJSON = null;
        props.highlightFeatureLoading = false;
      } else {
        props.highlightedFeatureJSON = newJSON;
        props.onFeatureSourceData();
        props.counter += 1;
      }

      if (lastIteration && props.counter !== 0) return;
      const newBounds = getBBox(newJSON);
      mbMap.fitBounds(newBounds, { padding: 200 });
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

export default getLoadingCallbacks;

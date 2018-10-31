import getBBox from '@turf/bbox';
import area from '@turf/area';
import length from '@turf/length';
import highlightMethods from './atlasHighlightMethods';
/* eslint-disable no-param-reassign */
const setLoadingCallbacks = ({ props }) => {
  const {
    drawHighlightedFeature,
    clearHighlightedFeature,
    getHighlightedGeoJSON,
  } = highlightMethods;

  props.correctAttribution = () => {
    const {
      initialLoadTimer,
      attributedCorrected,
    } = props;
    if (attributedCorrected) return;
    if (initialLoadTimer !== null) {
      clearTimeout(initialLoadTimer);
    }

    props.initialLoadTimer = setTimeout(() => {
      props.attributedCorrected = true;
      d3.select('.mapboxgl-ctrl-attrib')

        .html(`
        <a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a>
        <a class="mapbox-improve-map" href="https://www.mapbox.com/feedback/?owner=axismaps&amp;id=cjlxzhuj652652smt1jf50bq5&amp;access_token=pk.eyJ1IjoiYXhpc21hcHMiLCJhIjoieUlmVFRmRSJ9.CpIxovz1TUWe_ecNLFuHNg" target="_blank">Improve this map</a>
        <a href="https://www.digitalglobe.com/" target="_blank">© DigitalGlobe</a>
        `);
    }, 2000);
  };

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
      props.highlightedFeatureJSON = getHighlightedGeoJSON({
        highlightedFeature,
        year,
        mbMap,
      });

      props.highlightFeatureLoading = true;
      props.searchLocationLoading = false;
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
          }
        } else if (layer.type === 'fill') {
          if (!isLayer) {
            mbMap.setPaintProperty(layer.id, 'fill-opacity', 0.1);
          } else if (isLayer) {
            mbMap.setPaintProperty(layer.id, 'fill-opacity', 1);
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

export default setLoadingCallbacks;

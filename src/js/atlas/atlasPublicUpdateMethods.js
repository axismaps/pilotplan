/**
 * Module comprises public update methods for the atlas module (Atlas class prototype)
 * @module atlasPublicUpdateMethods
 * @memberof atlas
 */

import getBBox from '@turf/bbox';

import clickSearchMethods from './atlasClickSearchMethods';
import highlightMethods from './atlasHighlightMethods';
import generalMethods from './atlasMethods';
import getZoom from './atlasGetZoom';

const getAtlasUpdateMethods = ({
  privateProps,
  privateMethods,
}) => {
  const updateMethods = {
    updateCurrentLayers() {
      const {
        mbMap,
        currentLayers,
      } = privateProps.get(this);

      const { layers } = mbMap.getStyle();


      layers
        .filter(layer => layer.id !== 'mapbox-satellite')
        .forEach((layer) => {
          const visible = mbMap.getLayoutProperty(layer.id, 'visibility') === 'visible';

          const currentLayer = currentLayers
            .find(d => d.sourceLayer === layer['source-layer']);

          const toggled = currentLayer === undefined ? true : currentLayer.status;


          if (visible && !toggled) {
            mbMap.setLayoutProperty(layer.id, 'visibility', 'none');
          } else if (!visible && toggled) {
            mbMap.setLayoutProperty(layer.id, 'visibility', 'visible');
          }
        });
    },
    updateAreaSearch() {
      const {
        areaSearchActive,
        mbMap,
        mapContainer,
        clickSearch,
      } = privateProps.get(this);

      const {
        initClickSearchListener,
        disableClickSearchListener,
        toggleMapAreaSearchMode,
      } = clickSearchMethods;

      toggleMapAreaSearchMode({
        mapContainer,
        areaSearchActive,
      });

      if (areaSearchActive) {
        disableClickSearchListener({
          mbMap,
          clickSearch,
        });
        mbMap.dragPan.disable();
      } else {
        initClickSearchListener({
          mbMap,
          clickSearch,
        });
        mbMap.dragPan.enable();
      }
    },
    updateHighlightedLayer() {
      const props = privateProps.get(this);
      const {
        highlightedLayer,
        mbMap,
        layerOpacities,
        layerFills,
        year,
        extentsData,
        onLayerSourceData,
        highlightLoadingTimer,
        toggleOverlayFade,
      } = props;

      const {
        getLayerBounds,
      } = highlightMethods;

      const { layers } = mbMap.getStyle();


      if (highlightedLayer === null) {
        if (highlightLoadingTimer !== null) {
          clearTimeout(highlightLoadingTimer);
        }
        layers.forEach((layer) => {
          let opacityField;
          let fillField;
          if (layer.type === 'fill') {
            opacityField = 'fill-opacity';
            fillField = 'fill-color';
          } else if (layer.type === 'line') {
            opacityField = 'line-opacity';
            fillField = 'line-color';
          } else if (layer.type === 'symbol') {
            opacityField = 'text-opacity';
          }
          if (opacityField !== undefined) {
            mbMap.setPaintProperty(layer.id, opacityField, layerOpacities[layer.id]);
            if (fillField && layerFills[layer.id]) {
              mbMap.setPaintProperty(layer.id, fillField, layerFills[layer.id]);
            }
          }
          props.highlightLayerLoading = false;
        });
        toggleOverlayFade(false);
        return;
      }

      props.highlightLayerLoading = true;
      props.highlightFeatureLoading = false;
      const newBounds = getLayerBounds({
        year,
        highlightedFeature: highlightedLayer,
        extentsData,
      });
      const newZoom = getZoom({
        mbMap,
        bounds: newBounds,
        highlightedFeature: highlightedLayer,
        padding: 0,
      });

      const rendered = mbMap.queryRenderedFeatures({
        layers: [highlightedLayer.style],
      });
      if (rendered.length === 0) {
        mbMap.easeTo({
          bearing: 0,
          zoom: newZoom,
          center: newBounds.getCenter(),
          duration: 1500,
        });
      }

      onLayerSourceData();
    },
    updateHighlightedFeature() {
      const {
        clearHighlightedFeature,
        getHighlightedGeoJSON,
      } = highlightMethods;

      const props = privateProps.get(this);

      const {
        mbMap,
        highlightedFeature,
        year,
        onReturnToSearch,
        searchLocation,
      } = props;

      const { zoomToAndHighlightFeature } = privateMethods;

      clearHighlightedFeature(mbMap);

      if (highlightedFeature === null) return;
      const highlightedFeatureJSON = getHighlightedGeoJSON({
        highlightedFeature,
        year,
        mbMap,
      });

      if (highlightedFeatureJSON.features.length > 0) {
        props.highlightedFeatureJSON = highlightedFeatureJSON;
        zoomToAndHighlightFeature({ props });
      } else {
        props.highlightLayerLoading = false;
        props.searchLocationLoading = true;
        onReturnToSearch();
        mbMap.easeTo(searchLocation);
      }
    },
    updateOverlayOpacity() {
      const props = privateProps.get(this);
      const {
        mbMap,
        overlayOpacity,
      } = props;

      mbMap.setPaintProperty('overlay-layer', 'raster-opacity', overlayOpacity);
    },
    updateOverlay() {
      const props = privateProps.get(this);
      const {
        currentOverlay,
        mbMap,
        overlayOpacity,
      } = props;


      if (mbMap.getSource('overlay') !== undefined) {
        mbMap.removeLayer('overlay-layer');
        mbMap.removeSource('overlay');
      }


      if (currentOverlay === null) return;

      const dev = /[?&]dev=true/.test(window.location.search) ? 'dev' : '';
      const sourceUrl = `mapbox://axismaps.pilot${currentOverlay.Notes}${dev}`;

      mbMap.addSource(
        'overlay',
        {
          type: 'raster',
          url: sourceUrl,
        },
      );

      mbMap.addLayer({
        id: 'overlay-layer',
        type: 'raster',
        source: 'overlay',
        paint: {
          'raster-opacity': overlayOpacity,
        },
      }, 'viewconespoint');

      const bounds = new mapboxgl.LngLatBounds([
        currentOverlay.bounds.slice(0, 2),
        currentOverlay.bounds.slice(2, 4),
      ]);
      mbMap.fitBounds(bounds);
    },
    updateView() {
      const props = privateProps.get(this);
      const {
        currentView,
        mbMap,
        viewshedsGeo,
      } = props;
      const {
        addConeToMap,
        removeCone,
      } = generalMethods;

      if (currentView === null) {
        removeCone({ mbMap });
      } else {
        const coneFeature = viewshedsGeo.features.find(d =>
          d.properties.SS_ID === currentView.SS_ID);
        addConeToMap({
          coneFeature,
          mbMap,
        });
        const bbox = getBBox(coneFeature);
        mbMap.fitBounds(bbox, { padding: 100 });
      }
    },
    resizeMap() {
      const { mbMap } = privateProps.get(this);
      mbMap.resize();
    },
    updateYear() {
      const {
        updateYear,
      } = privateMethods;
      updateYear.call(this);
    },
  };
  return updateMethods;
};

export default getAtlasUpdateMethods;

import getBBox from '@turf/bbox';

import clickSearchMethods from './atlasClickSearchMethods';
import highlightMethods from './atlasHighlightMethods';
import generalMethods from './atlasMethods';
import getZoom from './atlasGetZoom';

const getAtlasUpdateMethods = ({
  privateProps,
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
          // console.log('layer', layer);

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

    updateHighlightedFeature() {
      const {
        clearHighlightedFeature,
        getLayerBounds,
        getHighlightedGeoJSON,
      } = highlightMethods;

      const props = privateProps.get(this);

      const {
        mbMap,
        highlightedFeature,
        year,
        extentsData,
        onLayerSourceData,
        onReturnToSearch,
        onFeatureSourceData,
        searchLocation,
      } = props;

      clearHighlightedFeature(mbMap);


      if (highlightedFeature !== null && Object.prototype.hasOwnProperty.call(highlightedFeature, 'dataLayer')) {
        const newBounds = getLayerBounds({
          year,
          highlightedFeature,
          extentsData,
        });
        const newZoom = getZoom({
          mbMap,
          bounds: newBounds,
          highlightedFeature,
          padding: 0,
        });
        console.log('newZoom', newZoom);
        // console.log('new zoom', newZoom);
        props.highlightLayerLoading = true;
        props.highlightFeatureLoading = false;
        onLayerSourceData();
        mbMap.easeTo({
          bearing: 0,
          zoom: newZoom,
          center: newBounds.getCenter(),
          duration: 1500,
        });
      } else {
        if (highlightedFeature === null) return;
        const highlightedFeatureJSON = getHighlightedGeoJSON({
          highlightedFeature,
          year,
          mbMap,
        });

        if (highlightedFeatureJSON.features.length > 0) {
          props.highlightedFeatureJSON = highlightedFeatureJSON;
          props.highlightFeatureLoading = true;
          props.searchLocationLoading = false;
          onFeatureSourceData();
          props.counter = 0;
          const newBounds = getBBox(props.highlightedFeatureJSON);
          mbMap.fitBounds(newBounds, { padding: 200, minZoom: 8 });
        } else {
          props.highlightLayerLoading = false;
          props.searchLocationLoading = true;
          onReturnToSearch();
          mbMap.easeTo(searchLocation);
        }

        // mbMap.jumpTo(searchLocation);
      }
    },
    updateOverlayOpacity() {
      const props = privateProps.get(this);
      const {
        mbMap,
        overlayOpacity,
      } = props;
      // console.log('overlay', mbMap.getLayer('overlay-layer'), overlayOpacity);
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

      const sourceUrl = `mapbox://axismaps.pilot${currentOverlay.SS_ID}`;

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
        // const mapBBox = mbMap.getBounds();
        // console.log('bounds1', bbox);
        // console.log('bounds2', mapBBox);
        mbMap.fitBounds(bbox, { padding: 100 });
        // const bearing = mbMap.getBearing();
        // console.log('bearing', bearing);
        // console.log('get zoom', mbMap.getZoom());
      }
    },
    resizeMap() {
      const { mbMap } = privateProps.get(this);
      mbMap.resize();
    },
  };
  return updateMethods;
};

export default getAtlasUpdateMethods;

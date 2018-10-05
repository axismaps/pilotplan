import getBBox from '@turf/bbox';
import clickSearchMethods from './atlasClickSearchMethods';
import highlightMethods from './atlasHighlightMethods';
import generalMethods from './atlasMethods';

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
        drawHighlightedFeature,
        getLayerBounds,
      } = highlightMethods;

      const props = privateProps.get(this);

      const {
        mbMap,
        highlightedFeature,
        year,
        extentsData,
        onSourceData,
      } = props;

      clearHighlightedFeature(mbMap);

      if (highlightedFeature !== null && Object.prototype.hasOwnProperty.call(highlightedFeature, 'sourceLayer')) {
        // get bounds
        // set status to highlighting or whatever
        // zoom to, get data and highlight at end in callback
        const newBounds = getLayerBounds({
          year,
          highlightedFeature,
          extentsData,
        });
        props.highlightLoading = true;
        onSourceData();
        mbMap.fitBounds(newBounds);
      } else {
        drawHighlightedFeature({
          highlightedFeature,
          mbMap,
          year,
          // extentsData,
        });
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

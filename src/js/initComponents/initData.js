import { eras } from '../config';

const cleanData = (rawData) => {
  const [
    rawLayers,
    rawViewsheds,
    rawAerials,
    rawMaps,
    rawPlans,
    rawExtents,
    rawTranslations,
    rawLegendSwatches,
  ] = rawData;

  const layerGroups = [
    'Views',
    'Landscape',
    'Urbanism',
  ];

  const layers = layerGroups
    .map((group) => {
      const groupRecord = {
        group,
        layers: Object.keys(rawLayers)
          .filter(groupKey => rawLayers[groupKey].group === group)
          .map((groupKey) => {
            const layerRecord = Object.assign({}, rawLayers[groupKey]);
            layerRecord.sourceLayer = groupKey;
            layerRecord.features = Object.keys(layerRecord.features)
              .map((featureKey) => {
                const featureRecord = Object.assign({}, layerRecord.features[featureKey]);
                featureRecord.dataLayer = featureKey;

                return featureRecord;
              });
            return layerRecord;
          }),
      };
      return groupRecord;
    });

  const views = rawViewsheds.features.map((d) => {
    const record = Object.assign({}, d.properties);
    record.type = 'view';
    return record;
  });

  const processOverlay = data => data.map((d) => {
    const record = Object.assign({}, d);
    record.type = 'overlay';
    return record;
  });

  const translations = rawTranslations
    .reduce((accumulator, d) => {
      const { en, pr } = d;
      /* eslint-disable no-param-reassign */
      accumulator[`${d.id}`] = { en, pr };
      /* eslint-enable no-param-reassign */
      return accumulator;
    }, {});


  const erasWithTranslations = eras.map(d => Object.assign({}, d, translations[d.id]));
  console.log('translations', translations);
  console.log('eras', erasWithTranslations);

  const rasters = new Map();

  rasters.set('views', views);
  rasters.set('maps', processOverlay(rawMaps));
  rasters.set('plans', processOverlay(rawPlans));
  rasters.set('aerials', processOverlay(rawAerials));

  const data = {
    layers,
    viewshedsGeo: rawViewsheds,
    rasters,
    translations,
    eras: erasWithTranslations,
    extents: rawExtents,
    legendSwatches: rawLegendSwatches,
  };

  return data;
};

const loadData = (callback) => {
  Promise.all([
    d3.json('data/config.json'),
    d3.json('data/ViewConesPoly.json'),
    d3.json('data/AerialExtents.json'),
    d3.json('data/MapExtents.json'),
    d3.json('data/PlanExtents.json'),
    d3.json('data/extents.json'),
    d3.csv('data/translations.csv'),
    d3.csv('img/legend/legend.csv'),
  ]).then((rawData) => {
    const data = cleanData(rawData);
    callback(data);
  });
};

export default loadData;

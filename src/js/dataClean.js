const cleanData = (rawData) => {
  // console.log('raw data', rawData);
  const [
    rawLayers,
    rawViewsheds,
    rawAerials,
    rawMaps,
    rawPlans,
  ] = rawData;

  const layerGroups = [
    'Views',
    'Landscape',
    'Urbanism',
  ];

  // console.log('rawLayers', rawLayers);
  // console.log('rawview', rawViewsheds);
  // console.log('rawAerials', rawAerials);
  // console.log('rawMaps', rawMaps);
  // console.log('rawPlans', rawPlans);

  const layers = layerGroups
    .map((group) => {
      const groupRecord = {
        group,
        layers: Object.keys(rawLayers)
          .filter(groupKey => rawLayers[groupKey].group === group)
          .map((groupKey) => {
            const layerRecord = Object.assign({}, rawLayers[groupKey]);
            layerRecord.id = groupKey;
            layerRecord.features = Object.keys(layerRecord.features)
              .map((featureKey) => {
                const featureRecord = Object.assign({}, layerRecord.features[featureKey]);
                featureRecord.id = featureRecord.style;
                delete featureRecord.style;
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

  console.log('layers', layers);

  const data = {
    layers,
    viewshedsGeo: rawViewsheds,
    rasters: {
      views,
      aerials: processOverlay(rawAerials),
      maps: processOverlay(rawMaps),
      plans: processOverlay(rawPlans),
    },
  };

  return data;
};

export default cleanData;

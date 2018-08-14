const cleanData = (rawData) => {
  // console.log('raw data', rawData);
  const [rawLayers] = rawData;
  console.log('raw', rawData);
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

  console.log('layers', layers);

  const data = {
    layers,
  };

  return data;
};

export default cleanData;

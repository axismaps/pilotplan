const cleanData = (rawData) => {
  console.log('raw data', rawData);
  const [rawLayers] = rawData;

  const layers = Object.keys(rawLayers)
    .map((groupKey) => {
      const groupRecord = Object.assign({}, rawLayers[groupKey]);
      groupRecord.id = groupKey;
      groupRecord.features = Object.keys(groupRecord.features)
        .map((featureKey) => {
          const featureRecord = Object.assign({}, groupRecord.features[featureKey]);
          featureRecord.id = featureRecord.style;
          delete featureRecord.style;
          return featureRecord;
        });
      return groupRecord;
    });

  const data = {
    layers,
  };

  return data;
};

export default cleanData;

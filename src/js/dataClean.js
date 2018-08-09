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
  // console.log('layers', layers);

  // const layers = Object.keys(rawLayers)
  //   .map((groupKey) => {
  //     const groupRecord = Object.assign({}, rawLayers[groupKey]);
  //     groupRecord.id = groupKey;
  //     groupRecord.features = Object.keys(groupRecord.features)
  //       .map((featureKey) => {
  //         const featureRecord = Object.assign({}, groupRecord.features[featureKey]);
  //         featureRecord.id = featureRecord.style;
  //         delete featureRecord.style;
  //         return featureRecord;
  //       });
  //     return groupRecord;
  //   });

  // const layerCategories = [...new Set(layers.map(d => d.group))];

  // const layerNames = layers.reduce((accumulator, layerGroup) => {
  //   layerGroup.features.forEach((layer) => {
  //     if (layer.id !== undefined) {
  //       const { en, pr } = layer;
  //       accumulator[layer.id] = { en, pr };
  //     }
  //   });
  //   return accumulator;
  // }, {});

  const data = {
    layers,
    // layerNames,
    // layerCategories,
  };

  return data;
};

export default cleanData;

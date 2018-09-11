export const formatNonRasterResults = features =>
  [...new Set(features.map(d => d.sourceLayer))]
    .map(groupName => ({
      id: groupName,
      features: features
        .filter(d => d.sourceLayer === groupName)
        .filter(d => d.properties.Name !== ''),
    }))
    .filter(d => d.features.length > 0);

export const formatRasterResults = rasters =>
  [...new Set(rasters.map(d => d.category))]
    .map(categoryName => ({
      id: categoryName,
      features: rasters
        .filter(d => d.category === categoryName)
        .map(d => Object.assign({}, d, { id: d.SS_ID })),
    }))
    .filter(d => d.features.length > 0);

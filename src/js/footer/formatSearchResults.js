export const formatNonRasterResults = features =>
  [...new Set(features.map(d => d.sourceLayer))]
    .map(sourceLayer => ({
      sourceLayer,
      features: features
        .filter(d => d.sourceLayer === sourceLayer)
        .filter(d => d.properties.Name !== ''),
    }))
    .filter(d => d.features.length > 0);

export const formatRasterResults = rasters =>
  [...new Set(rasters.map(d => d.category))]
    .map(category => ({
      category,
      features: rasters
        .filter(d => d.category === category),
    }))
    .filter(d => d.features.length > 0);

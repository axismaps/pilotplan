for f in $1*.shp;\
  do mapshaper $f field-types=FirstYear:number,LastYear:number -o data/geojson/$(basename "$f" .shp).json;\
done

mv data/geojson/AerialExtentsPoly.json data/geojson/visual/AerialExtentsPoly.json
mv data/geojson/BasemapExtentsPoly.json data/geojson/visual/BasemapExtentsPoly.json
mv data/geojson/MapExtentsPoly.json data/geojson/visual/MapExtentsPoly.json
mv data/geojson/PlanExtentsPoly.json data/geojson/visual/PlanExtentsPoly.json
mv data/geojson/ViewConesPoly.json data/geojson/visual/ViewConesPoly.json

mv data/geojson/*.json data/geojson/geography/
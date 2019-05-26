for f in data/geojson/geography/*.json; \
  do \
  CMD="mapshaper $f -each 'Layer="\""`basename $f .json`"\""' -o data/geojson/geography/new/`basename $f`"; \
  eval $CMD; \
done

mapshaper -i data/geojson/geography/new/*Poly.json combine-files -merge-layers force -o data/geojson/geography/new/poly.json
mapshaper -i data/geojson/geography/new/*Line.json combine-files -merge-layers force -o data/geojson/geography/new/line.json

tippecanoe -Z 9 -z 11 -ab -ai -f -o data/tiles/allzooms.mbtiles \
  -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le_1 -x Shape_Leng -x SHAPE_Area -x Notes -x Join_Count -x TARGET_FID -x OBJECTID -x Height -x alturaapro -x ano -x Title \
  -j '{ "*": ["all", ["in", "Layer", "BoundariesPoly", "BuiltDomainPoly", "InfrastructureLine", "OpenSpacesPoly", "RoadsLine", "SectorsPoly", "WaterBodiesPoly", "WatersLine"], ["!in", "SubType", "Collector", "Local", "Service"]] }' \
  data/geojson/geography/new/poly.json \
  data/geojson/geography/new/line.json

# Adding in buildings
tippecanoe -Z 12 -z 12 -aN -ab -ai -f -o data/tiles/BuildingsPoly.mbtiles \
  -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le_1 -x Shape_Leng -x SHAPE_Area -x Notes -x Join_Count -x TARGET_FID -x OBJECTID -x Height -x alturaapro -x ano -x Title \
  -j '{ "*": ["all", ["in", "Layer", "BoundariesPoly", "BuildingsPoly", "BuiltDomainPoly", "InfrastructureLine", "OpenSpacesPoly", "RoadsLine", "SectorsPoly", "WaterBodiesPoly", "WatersLine"], ["!in", "SubType", "Collector", "Local", "Service"]] }' \
  data/geojson/geography/new/poly.json \
  data/geojson/geography/new/line.json

# Removing filter to add local roads
tippecanoe -Z 13 -z 17 -aN -ab -ai -f -o data/tiles/LocalRoads.mbtiles \
  -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le_1 -x Shape_Leng -x SHAPE_Area -x Notes -x Join_Count -x TARGET_FID -x OBJECTID -x Height -x alturaapro -x ano -x Title \
  data/geojson/geography/new/poly.json \
  data/geojson/geography/new/line.json

tippecanoe -Z 9 -z 17 -r1 -pk -pf -f -o data/tiles/ViewCones.mbtiles data/geojson/geography/ViewConesPoint.json

tile-join -f -o data/tiles/pilot.mbtiles data/tiles/allzooms.mbtiles data/tiles/BuildingsPoly.mbtiles data/tiles/LocalRoads.mbtiles data/tiles/ViewCones.mbtiles
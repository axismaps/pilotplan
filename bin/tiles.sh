npm run views

# No local roads buildings, or parcels
tippecanoe -Z 8 -z 11 -pf -pk -ab -ai -f -o data/tiles/allzooms.mbtiles \
  -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le_1 -x Shape_Leng -x SHAPE_Area -x Notes -x Join_Count -x TARGET_FID -x OBJECTID -x Height -x alturaapro -x ano -x Title \
  -j '{ "RoadsLine": ["!in", "SubType", "Collector", "Local", "Service"] }' \
  data/geojson/geography/BoundariesPoly.json \
  data/geojson/geography/BuiltDomainPoly.json \
  data/geojson/geography/InfrastructureLine.json \
  data/geojson/geography/OpenSpacesPoly.json \
  data/geojson/geography/RoadsLine.json \
  data/geojson/geography/SectorsPoly.json \
  data/geojson/geography/WaterBodiesPoly.json \
  data/geojson/geography/WatersLine.json

# Adding in buildings
tippecanoe -Z 12 -z 12 -pf -pk -ab -ai -f -o data/tiles/BuildingsPoly.mbtiles \
  -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le_1 -x Shape_Leng -x SHAPE_Area -x Notes -x Join_Count -x TARGET_FID -x OBJECTID -x Height -x alturaapro -x ano -x Title \
  -j '{ "RoadsLine": ["!in", "SubType", "Collector", "Local", "Service"] }' \
  data/geojson/geography/BoundariesPoly.json \
  data/geojson/geography/BuildingsPoly.json \
  data/geojson/geography/BuiltDomainPoly.json \
  data/geojson/geography/InfrastructureLine.json \
  data/geojson/geography/OpenSpacesPoly.json \
  data/geojson/geography/RoadsLine.json \
  data/geojson/geography/SectorsPoly.json \
  data/geojson/geography/WaterBodiesPoly.json \
  data/geojson/geography/WatersLine.json

# Removing filter to add local roads
tippecanoe -Z 13 -z 17 -pf -pk -ab -ai -f -o data/tiles/LocalRoads.mbtiles \
  -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le_1 -x Shape_Leng -x SHAPE_Area -x Notes -x Join_Count -x TARGET_FID -x OBJECTID -x Height -x alturaapro -x ano -x Title \
  data/geojson/geography/BoundariesPoly.json \
  data/geojson/geography/BuildingsPoly.json \
  data/geojson/geography/BuiltDomainPoly.json \
  data/geojson/geography/InfrastructureLine.json \
  data/geojson/geography/OpenSpacesPoly.json \
  data/geojson/geography/RoadsLine.json \
  data/geojson/geography/SectorsPoly.json \
  data/geojson/geography/WaterBodiesPoly.json \
  data/geojson/geography/WatersLine.json

tippecanoe -Z 9 -z 17 -pf -pk -r1 -pk -pf -f -o data/tiles/ViewCones.mbtiles data/geojson/geography/ViewConesPoint.json

tile-join -pk -f -o data/tiles/pilot.mbtiles data/tiles/allzooms.mbtiles data/tiles/BuildingsPoly.mbtiles data/tiles/LocalRoads.mbtiles data/tiles/ViewCones.mbtiles

mapbox-tile-copy data/tiles/pilot.mbtiles "s3://pilotplan/tiles/{z}/{x}/{y}?timeout=10000"
tippecanoe -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le_1 -x Shape_Leng -x SHAPE_Area -x Notes -Z 9 -z 17 -aD -aG -ab -ai -f -o data/tiles/allzooms.mbtiles \
  -j '{ "RoadsLine": ["!in", "SubType", "Collector", "Local", "Arterial"] }' \
  data/geojson/geography/BoundariesPoly.json \
  data/geojson/geography/BuiltDomainPoly.json \
  data/geojson/geography/InfrastructureLine.json \
  data/geojson/geography/OpenSpacesPoly.json \
  data/geojson/geography/RoadsLine.json \
  data/geojson/geography/SectorsPoly.json \
  data/geojson/geography/ViewConesPoint.json \
  data/geojson/geography/WaterBodiesPoly.json \
  data/geojson/geography/WatersLine.json

tippecanoe -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le_1 -x Shape_Leng -x SHAPE_Area -x Notes -Z 11 -z 17 -aD -aG -ab -ai -f -o data/tiles/ArterialRoads.mbtiles \
  -j '{ "*": ["==", "SubType", "Arterial"] }' \
  data/geojson/geography/RoadsLine.json

tippecanoe -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le_1 -x Shape_Leng -x SHAPE_Area -x Notes -Z 13 -z 17 -aD -aG -ab -ai -f -o data/tiles/LocalRoads.mbtiles \
  -j '{ "*": ["in", "SubType", "Collector", "Local"] }' \
  data/geojson/geography/RoadsLine.json

tippecanoe -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le_1 -x Shape_Leng -x SHAPE_Area -x Notes -Z 12 -z 17 -aD -aG -ab -ai -f -o data/tiles/BuildingsPoly.mbtiles data/geojson/geography/BuildingsPoly.json

tippecanoe -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le_1 -x Shape_Leng -x SHAPE_Area -x Notes -Z 14 -z 17 -aD -aG -ab -ai -f -o data/tiles/ParcelsPoly.mbtiles data/geojson/geography/ParcelsPoly.json

tile-join -f -o data/tiles/pilot.mbtiles data/tiles/allzooms.mbtiles data/tiles/BuildingsPoly.mbtiles data/tiles/ParcelsPoly.mbtiles data/tiles/ArterialRoads.mbtiles data/tiles/LocalRoads.mbtiles

source .env

mapbox upload axismaps.dd66zwg7 data/tiles/pilot.mbtiles
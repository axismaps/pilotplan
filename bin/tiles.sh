# No local roads buildings, or parcels
tippecanoe -Z 9 -z 11 -aN -ab -ai -f -o data/tiles/allzooms.mbtiles \
  -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le_1 -x Shape_Leng -x SHAPE_Area -x Notes -x Join_Count -x TARGET_FID -x OBJECTID -x Height -x alturaapro -x ano -x Title \
  -j '{ "RoadsLine": ["!in", "SubType", "Collector", "Local", "Service"] }' \
  data/geojson/geography/BoundariesPoly.json \
  data/geojson/geography/BuiltDomainPoly.json \
  data/geojson/geography/InfrastructureLine.json \
  data/geojson/geography/OpenSpacesPoly.json \
  data/geojson/geography/RoadsLine.json \
  data/geojson/geography/SectorsPoly.json \
  data/geojson/geography/ViewConesPoint.json \
  data/geojson/geography/WaterBodiesPoly.json \
  data/geojson/geography/WatersLine.json

# Adding in buildings
tippecanoe -Z 12 -z 12 -aN -ab -ai -f -o data/tiles/BuildingsPoly.mbtiles \
  -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le_1 -x Shape_Leng -x SHAPE_Area -x Notes -x Join_Count -x TARGET_FID -x OBJECTID -x Height -x alturaapro -x ano -x Title \
  -j '{ "RoadsLine": ["!in", "SubType", "Collector", "Local", "Service"] }' \
  data/geojson/geography/BoundariesPoly.json \
  data/geojson/geography/BuildingsPoly.json \
  data/geojson/geography/BuiltDomainPoly.json \
  data/geojson/geography/InfrastructureLine.json \
  data/geojson/geography/OpenSpacesPoly.json \
  data/geojson/geography/RoadsLine.json \
  data/geojson/geography/SectorsPoly.json \
  data/geojson/geography/ViewConesPoint.json \
  data/geojson/geography/WaterBodiesPoly.json \
  data/geojson/geography/WatersLine.json

# Removing filter to add local roads
tippecanoe -Z 13 -z 13 -aN -ab -ai -f -o data/tiles/LocalRoads.mbtiles \
  -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le_1 -x Shape_Leng -x SHAPE_Area -x Notes -x Join_Count -x TARGET_FID -x OBJECTID -x Height -x alturaapro -x ano -x Title \
  data/geojson/geography/BoundariesPoly.json \
  data/geojson/geography/BuildingsPoly.json \
  data/geojson/geography/BuiltDomainPoly.json \
  data/geojson/geography/InfrastructureLine.json \
  data/geojson/geography/OpenSpacesPoly.json \
  data/geojson/geography/RoadsLine.json \
  data/geojson/geography/SectorsPoly.json \
  data/geojson/geography/ViewConesPoint.json \
  data/geojson/geography/WaterBodiesPoly.json \
  data/geojson/geography/WatersLine.json

# Adding parcels and doing all zooms
tippecanoe -Z 14 -z 17 -aN -ab -ai -f -o data/tiles/ParcelsPoly.mbtiles \
  -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le_1 -x Shape_Leng -x SHAPE_Area -x Notes -x Join_Count -x TARGET_FID -x OBJECTID -x Height -x alturaapro -x ano -x Title \
  data/geojson/geography/BoundariesPoly.json \
  data/geojson/geography/BuildingsPoly.json \
  data/geojson/geography/BuiltDomainPoly.json \
  data/geojson/geography/InfrastructureLine.json \
  data/geojson/geography/OpenSpacesPoly.json \
  data/geojson/geography/ParcelsPoly.json \
  data/geojson/geography/RoadsLine.json \
  data/geojson/geography/SectorsPoly.json \
  data/geojson/geography/ViewConesPoint.json \
  data/geojson/geography/WaterBodiesPoly.json \
  data/geojson/geography/WatersLine.json

tile-join -f -o data/tiles/pilot.mbtiles data/tiles/allzooms.mbtiles data/tiles/BuildingsPoly.mbtiles data/tiles/ParcelsPoly.mbtiles data/tiles/LocalRoads.mbtiles

if [ "$1" == dev ]; then
  id="axismaps.01c7rsvl"
  tileset="dev"
else
  id="axismaps.dd66zwg7"
  tileset="production"
fi

echo Uploading to $tileset tileset

source .env

mapbox upload $id data/tiles/pilot.mbtiles
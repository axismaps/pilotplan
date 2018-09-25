tippecanoe -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le1 -x SHAPE_Area -Z 9 -aD -aG -ab -ai -f -o data/tiles/allzooms.mbtiles \
  data/geojson/geography/BoundariesPoly.json \
  data/geojson/geography/BuiltDomainPoly.json \
  data/geojson/geography/InfrastructureLine.json \
  data/geojson/geography/OpenSpacesPoly.json \
  data/geojson/geography/RoadsLine.json \
  data/geojson/geography/SectorsPoly.json \
  data/geojson/geography/ViewConesPoint.json \
  data/geojson/geography/WaterBodiesPoly.json \
  data/geojson/geography/WatersLine.json

tippecanoe -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le1 -x SHAPE_Area -Z 12 -aD -aG -ab -ai -f -o data/tiles/BuildingsPoly.mbtiles data/geojson/geography/BuildingsPoly.json

tippecanoe -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le1 -x SHAPE_Area -Z 14 -aD -aG -ab -ai -f -o data/tiles/ParcelsPoly.mbtiles data/geojson/geography/ParcelsPoly.json

tile-join -f -o data/tiles/pilot.mbtiles data/tiles/allzooms.mbtiles data/tiles/BuildingsPoly.mbtiles data/tiles/ParcelsPoly.mbtiles

source .env

mapbox upload axismaps.dd66zwg7 data/tiles/pilot.mbtiles
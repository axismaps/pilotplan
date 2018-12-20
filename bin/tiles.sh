tippecanoe -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le_1 -x Shape_Leng -x SHAPE_Area -x Notes -Z 9 -z 17 -aD -aG -ab -ai -f -o data/tiles/allzooms.mbtiles \
  -j '{ "RoadsLine": ["in", "Type", "Motorway", "Motorway_link", "Primary", "Primary_link"] }' \
  -j '{ "*": [ "all", [ "<=", "FirstDate", 2016 ], [ ">=", "LastDate", 2016 ] ] }' \
  data/geojson/geography/BoundariesPoly.json \
  data/geojson/geography/GroundCoverPoly.json \
  data/geojson/geography/HidrographyLine.json \
  data/geojson/geography/HidrographyPoly.json \
  data/geojson/geography/OpenSpacesPoly.json \
  data/geojson/geography/RoadsLine.json \
  data/geojson/geography/UtilitiesLine.json \
  data/geojson/geography/UtilitiesPoly.json
  #data/geojson/geography/ViewConesPoint.json

tippecanoe -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le_1 -x Shape_Leng -x SHAPE_Area -x Notes -Z 11 -z 17 -aD -aG -ab -ai -f -o data/tiles/ArterialRoads.mbtiles \
  -j '{ "*": ["in", "Type", "Secondary", "Secondary_link", "Tertiary", "Tertiary_link"] }' \
  -j '{ "*": [ "all", [ "<=", "FirstDate", 2016 ], [ ">=", "LastDate", 2016 ] ] }' \
  data/geojson/geography/RoadsLine.json

tippecanoe -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le_1 -x Shape_Leng -x SHAPE_Area -x Notes -Z 13 -z 17 -aD -aG -ab -ai -f -o data/tiles/LocalRoads.mbtiles \
  -j '{ "*": ["!in", "Type", "Motorway", "Motorway_link", "Primary", "Primary_link", "Secondary", "Secondary_link", "Tertiary", "Tertiary_link"] }' \
  -j '{ "*": [ "all", [ "<=", "FirstDate", 2016 ], [ ">=", "LastDate", 2016 ] ] }' \
  data/geojson/geography/RoadsLine.json

tippecanoe -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le_1 -x Shape_Leng -x SHAPE_Area -x Notes -Z 12 -z 17 -aD -aG -ab -ai -f -o data/tiles/BuildingsPoly.mbtiles data/geojson/geography/BuildingsPoly.json

tile-join -f -o data/tiles/pilot.mbtiles data/tiles/allzooms.mbtiles data/tiles/BuildingsPoly.mbtiles data/tiles/ParcelsPoly.mbtiles data/tiles/ArterialRoads.mbtiles data/tiles/LocalRoads.mbtiles

source .env

# mapbox upload axismaps.dd66zwg7 data/tiles/pilot.mbtiles
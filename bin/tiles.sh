tippecanoe -Z 9 -z 10 -S 10 -ab -ai -f -o data/tiles/10.mbtiles \
  -j '{ "RoadsLine": ["!in", "Type", "Tertiary", "Unclassified", "Primary_link", "Secondary_link", "Tertiary_link", "Residential", "Service", "Street", "Pedestrian", "Track", "Track_grade5", "Path", "Cycleway", "Footway"] }' \
  -j '{ "*": ["all", ["<=", "FirstYear", 2016], [">=", "LastYear", 2016]] }' \
  data/geojson/geography/high/BoundariesPoly.json \
  data/geojson/geography/high/GroundCoverPoly.json \
  data/geojson/geography/high/HidrographyLine.json \
  data/geojson/geography/high/HidrographyPoly.json \
  data/geojson/geography/high/RoadsLine.json \
  data/geojson/geography/high/UtilitiesLine.json \
  data/geojson/geography/high/WaterWorksPoly.json

tippecanoe -Z 11 -z 11 -S 10 -ab -ai -f -o data/tiles/11.mbtiles \
  -j '{ "RoadsLine": ["!in", "Type", "Residential", "Service", "Street", "Pedestrian", "Track", "Track_grade5", "Path", "Cycleway", "Footway"] }' \
  -j '{ "*": [ "all", [ "<=", "FirstYear", 2016 ], [ ">=", "LastYear", 2016]] }' \
  data/geojson/geography/high/BoundariesPoly.json \
  data/geojson/geography/high/GroundCoverPoly.json \
  data/geojson/geography/high/HidrographyLine.json \
  data/geojson/geography/high/HidrographyPoly.json \
  data/geojson/geography/high/RoadsLine.json \
  data/geojson/geography/high/UtilitiesLine.json \
  data/geojson/geography/high/WaterWorksPoly.json

tippecanoe -Z 12 -z 12 -S 10 -ab -ai -f -o data/tiles/12.mbtiles \
  -j '{ "RoadsLine": ["!in", "Type", "Street", "Pedestrian", "Track", "Track_grade5", "Path", "Cycleway", "Footway"] }' \
  -j '{ "OpenSpacesPoly": ["in", "Type", "Square", "park"] }' \
  -j '{ "*": [ "all", [ "<=", "FirstYear", 2016 ], [ ">=", "LastYear", 2016]] }' \
  data/geojson/geography/high/BoundariesPoly.json \
  data/geojson/geography/high/GroundCoverPoly.json \
  data/geojson/geography/high/HidrographyLine.json \
  data/geojson/geography/high/HidrographyPoly.json \
  data/geojson/geography/high/OpenSpacesPoly.json \
  data/geojson/geography/high/RoadsLine.json \
  data/geojson/geography/high/UtilitiesLine.json \
  data/geojson/geography/high/WaterWorksPoly.json

tippecanoe -Z 13 -z 13 -S 10 -ab -ai -f -o data/tiles/13.mbtiles \
  -j '{ "OpenSpacesPoly": ["in", "Type", "Square", "park"] }' \
  -j '{ "*": [ "all", [ "<=", "FirstYear", 2016 ], [ ">=", "LastYear", 2016]] }' \
  data/geojson/geography/high/BoundariesPoly.json \
  data/geojson/geography/high/GroundCoverPoly.json \
  data/geojson/geography/high/HidrographyLine.json \
  data/geojson/geography/high/HidrographyPoly.json \
  data/geojson/geography/high/OpenSpacesPoly.json \
  data/geojson/geography/high/RoadsLine.json \
  data/geojson/geography/high/UtilitiesLine.json \
  data/geojson/geography/high/WaterWorksPoly.json

tippecanoe -Z 14 -z 17 -S 10 -ab -ai -f -o data/tiles/14.mbtiles \
  -j '{ "*": [ "all", [ "<=", "FirstYear", 2016 ], [ ">=", "LastYear", 2016]] }' \
  data/geojson/geography/high/BoundariesPoly.json \
  data/geojson/geography/high/BuildingsPoly.json \
  data/geojson/geography/high/ChemicalCompositionPoint.json \
  data/geojson/geography/high/FloodPoly.json \
  data/geojson/geography/high/GroundCoverPoly.json \
  data/geojson/geography/high/HidrographyLine.json \
  data/geojson/geography/high/HidrographyPoly.json \
  data/geojson/geography/high/HouseholdPoly.json \
  data/geojson/geography/high/HousingPoly.json \
  data/geojson/geography/high/MinorityStatus.json \
  data/geojson/geography/high/OpenSpacesPoly.json \
  data/geojson/geography/high/OverallPoly.json \
  data/geojson/geography/high/PrecipitationPoint.json \
  data/geojson/geography/high/RoadsLine.json \
  data/geojson/geography/high/SocioeconomicPoly.json \
  data/geojson/geography/high/UtilitiesLine.json \
  data/geojson/geography/high/WaterWorksPoly.json

tile-join -pk -f -o data/tiles/houston.mbtiles data/tiles/10.mbtiles data/tiles/11.mbtiles data/tiles/12.mbtiles data/tiles/13.mbtiles data/tiles/14.mbtiles

# cd data/tiles
# mb-util --image_format=pbf houston.mbtiles houston
# gzip -d -r -S .pbf *
# find . -type f -exec mv '{}' '{}'.pbf \;
# aws s3 sync . s3://highways-waterways/tiles/ --acl="public-read"

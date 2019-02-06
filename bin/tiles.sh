tippecanoe -Z 9 -z 10 -S 10 -ab -ai -pf -pk -f -o data/tiles/10.mbtiles \
  -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le_1 -x Shape_Leng -x SHAPE_Area -x Notes -x Join_Count -x TARGET_FID -x OBJECTID -x Height -x alturaapro -x ano -x Title \
  -j '{ "RoadsLine": ["!in", "Type", "Tertiary", "Unclassified", "Primary_link", "Secondary_link", "Tertiary_link", "Residential", "Service", "Street", "Pedestrian", "Track", "Track_grade5", "Path", "Cycleway", "Footway"] }' \
  -j '{ "HidrographyPoly" : ["!in", "Type", "Flood", ""] }' \
  data/geojson/geography/BoundariesPoly.json \
  data/geojson/geography/ChemicalCompositionPoint.json \
  data/geojson/geography/GroundCoverPoly.json \
  data/geojson/geography/HidrographyLine.json \
  data/geojson/geography/HidrographyPoly.json \
  data/geojson/geography/RoadsLine.json \
  data/geojson/geography/UtilitiesLine.json \
  data/geojson/geography/UtilitiesPoly.json \
  # data/geojson/geography/VulnerabilityPoint.json \
  data/geojson/geography/WaterWorksPoly.json

tippecanoe -Z 11 -z 11 -S 10 -ab -ai -pf -pk -f -o data/tiles/11.mbtiles \
  -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le_1 -x Shape_Leng -x SHAPE_Area -x Notes -x Join_Count -x TARGET_FID -x OBJECTID -x Height -x alturaapro -x ano -x Title \
  -j '{ "RoadsLine": ["!in", "Type", "Residential", "Service", "Street", "Pedestrian", "Track", "Track_grade5", "Path", "Cycleway", "Footway"] }' \
  -j '{ "HidrographyPoly" : ["!in", "Type", "Flood", ""] }' \
  data/geojson/geography/BoundariesPoly.json \
  data/geojson/geography/ChemicalCompositionPoint.json \
  data/geojson/geography/GroundCoverPoly.json \
  data/geojson/geography/HidrographyLine.json \
  data/geojson/geography/HidrographyPoly.json \
  data/geojson/geography/RoadsLine.json \
  data/geojson/geography/UtilitiesLine.json \
  data/geojson/geography/UtilitiesPoly.json \
  # data/geojson/geography/VulnerabilityPoint.json \
  # data/geojson/geography/VulnerabilityPoly.json \
  data/geojson/geography/WaterWorksPoly.json

tippecanoe -Z 12 -z 12 -S 10 -ab -ai -pf -pk -f -o data/tiles/12.mbtiles \
  -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le_1 -x Shape_Leng -x SHAPE_Area -x Notes -x Join_Count -x TARGET_FID -x OBJECTID -x Height -x alturaapro -x ano -x Title \
  -j '{ "RoadsLine": ["!in", "Type", "Street", "Pedestrian", "Track", "Track_grade5", "Path", "Cycleway", "Footway"] }' \
  -j '{ "OpenSpacesPoly": ["in", "Type", "Square", "park"] }' \
  -j '{ "HidrographyPoly" : ["!in", "Type", "Flood", ""] }' \
  data/geojson/geography/BoundariesPoly.json \
  data/geojson/geography/ChemicalCompositionPoint.json \
  data/geojson/geography/GroundCoverPoly.json \
  data/geojson/geography/HidrographyLine.json \
  data/geojson/geography/HidrographyPoly.json \
  data/geojson/geography/OpenSpacesPoly.json \
  data/geojson/geography/RoadsLine.json \
  data/geojson/geography/UtilitiesLine.json \
  data/geojson/geography/UtilitiesPoly.json \
  # data/geojson/geography/VulnerabilityPoint.json \
  # data/geojson/geography/VulnerabilityPoly.json \
  data/geojson/geography/WaterWorksPoly.json

tippecanoe -Z 13 -z 13 -S 10 -ab -ai -pf -pk -f -o data/tiles/13.mbtiles \
  -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le_1 -x Shape_Leng -x SHAPE_Area -x Notes -x Join_Count -x TARGET_FID -x OBJECTID -x Height -x alturaapro -x ano -x Title \
  -j '{ "OpenSpacesPoly": ["in", "Type", "Square", "park"] }' \
  -j '{ "HidrographyPoly" : ["!in", "Type", "Flood", ""] }' \
  data/geojson/geography/BoundariesPoly.json \
  data/geojson/geography/ChemicalCompositionPoint.json \
  data/geojson/geography/GroundCoverPoly.json \
  data/geojson/geography/HidrographyLine.json \
  data/geojson/geography/HidrographyPoly.json \
  data/geojson/geography/OpenSpacesPoly.json \
  data/geojson/geography/RoadsLine.json \
  data/geojson/geography/UtilitiesLine.json \
  data/geojson/geography/UtilitiesPoly.json \
  # data/geojson/geography/VulnerabilityPoint.json \
  # data/geojson/geography/VulnerabilityPoly.json \
  data/geojson/geography/WaterWorksPoly.json

tippecanoe -Z 14 -z 17 -S 10 -ab -ai -pf -pk -f -o data/tiles/14.mbtiles \
  -x osm_id -x Shape_Leng -x Shape_Area -x layer -x Date -x Address -x SHAPE_Le_1 -x Shape_Leng -x SHAPE_Area -x Notes -x Join_Count -x TARGET_FID -x OBJECTID -x Height -x alturaapro -x ano -x Title \
  -j '{ "HidrographyPoly" : ["!in", "Type", "Flood", ""] }' \
  data/geojson/geography/BoundariesPoly.json \
  data/geojson/geography/BuildingsPoly.json \
  data/geojson/geography/ChemicalCompositionPoint.json \
  data/geojson/geography/GroundCoverPoly.json \
  data/geojson/geography/HidrographyLine.json \
  data/geojson/geography/HidrographyPoly.json \
  data/geojson/geography/OpenSpacesPoly.json \
  data/geojson/geography/RoadsLine.json \
  data/geojson/geography/UtilitiesLine.json \
  data/geojson/geography/UtilitiesPoly.json \
  # data/geojson/geography/VulnerabilityPoint.json \
  # data/geojson/geography/VulnerabilityPoly.json \
  data/geojson/geography/WaterWorksPoly.json

tile-join -pk -f -o data/tiles/houston.mbtiles data/tiles/10.mbtiles data/tiles/11.mbtiles data/tiles/12.mbtiles data/tiles/13.mbtiles data/tiles/14.mbtiles

cd data/tiles
mb-util --image_format=pbf houston.mbtiles houston
gzip -d -r -S .pbf *
find . -type f -exec mv '{}' '{}'.pbf \;
aws s3 sync . s3://highways-waterways/tiles/ --acl="public-read"

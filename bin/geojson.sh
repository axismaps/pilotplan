for f in $1*.shp;\
  do mapshaper $f field-types=FirstYear:number,LastYear:number \
    -each 'Name=null' where='Name=undefined' \
    -each 'Type=null' where='Type=undefined' \
    -each 'FirstYear=Math.floor(FirstDate / 10000)' where='!FirstYear' \
    -each 'LastYear=Math.floor(LastDate / 10000)' where='!LastYear' \
    -each 'FirstDate=null' where='FirstDate=undefined' \
    -each 'LastDate=null' where='LastDate=undefined' \
    -filter-fields FirstYear,LastYear,FirstDate,LastDate,Name,Type \
    -o data/geojson/$(basename "$f" .shp).json;\
done

mv data/geojson/AerialExtentsPoly.json data/geojson/visual/AerialExtentsPoly.json
mv data/geojson/BasemapExtentsPoly.json data/geojson/visual/BasemapExtentsPoly.json
mv data/geojson/MapExtentsPoly.json data/geojson/visual/MapExtentsPoly.json
mv data/geojson/PlanExtentsPoly.json data/geojson/visual/PlanExtentsPoly.json
mv data/geojson/ViewConeExtentsPoly.json data/geojson/visual/ViewConeExtentsPoly.json

mv data/geojson/*.json data/geojson/geography/high/

for f in data/geojson/geography/high/*;\
  do mapshaper $f \
    -simplify 0.05 keep-shapes no-repair \
    -o data/geojson/geography/low/$(basename "$f");\
  mapshaper $f \
    -simplify 0.05 keep-shapes no-repair \
    -o data/geojson/geography/med/$(basename "$f");\
done
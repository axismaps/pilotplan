"""Deal with raster transparency and convert to MBTiles for uploading"""

import os
import re
import sys
from string import Template
from shutil import copyfile
from osgeo import gdal
import rasterio

PATH = 'data/geotiff/'

def raster_bands(tif, sub):
  if re.search(r"\.tif$", tif):
    f = PATH + sub + tif
    print 'Reading raster', f
    src = gdal.Open(f)
    ras = rasterio.open(f)
    val = ras.read(1)[0][0]

    if (src.RasterCount == 4 or (val != 0 and val != 255)) and ras.dtypes[0] == 'uint8':
      print '4 correct bands found'
      copyfile(f, PATH + 'converted/' + tif)
      project_raster(tif)
    elif src.RasterCount == 1 or src.RasterCount == 3 or src.RasterCount == 4:
      s = Template("""gdal_translate -b 1 ${f} -a_nodata none red.tif &&
          gdal_translate -b ${b2} ${f} -a_nodata none green.tif &&
          gdal_translate -b ${b3} ${f} -a_nodata none blue.tif && 
          gdal_calc.py -A red.tif -B green.tif -C blue.tif --outfile=mask.tif --calc="logical_and(A!=${nodata},B!=${nodata},C!=${nodata})*255" --NoDataValue=0 &&
          gdal_merge.py -separate -ot Byte -o ${path}converted/${tif} red.tif green.tif blue.tif mask.tif &&
          rm red.tif &&
          rm green.tif &&
          rm blue.tif &&
          rm mask.tif""")
      if src.RasterCount == 1:
        print '1 band raster found'
        os.system(s.substitute(f=f, b2='1', b3='1', nodata=str(val), path=PATH, tif=tif))
        project_raster(tif)
      elif src.RasterCount >= 3:
        print '3+ band raster found'
        os.system(s.substitute(f=f, b2='2', b3='3', nodata=str(val), path=PATH, tif=tif))
        project_raster(tif)
    else:
      print f + ' has wrong number of bands!'

def project_raster(tif):
  basename = re.sub(r"\.tif$", '', tif)
  s = Template("""gdalwarp -t_srs EPSG:3857 ${path}converted/${tif} ${path}converted/${base}_merc.tif &&
    gdal_translate -of mbtiles ${path}converted/${base}_merc.tif ${path}converted/${base}.mbtiles &&
    gdaladdo -r nearest ${path}converted/${base}.mbtiles 2 4 8 16 32""")
  os.system(s.substitute(path=PATH, tif=tif, base=basename))

if sys.argv[1]:
  files = sys.argv[1].replace(PATH, '').split('/')
  raster_bands(files[1], files[0] + '/')
else:
  for subdir in os.listdir(PATH):
    if subdir[0] != '.' and subdir != 'converted':
      subdir += '/'
      for t in os.listdir(PATH + subdir):
        raster_bands(t, subdir)

"""Deal with raster transparency and convert to MBTiles for uploading"""

import os
import re
from string import Template
from shutil import copyfile
from osgeo import gdal
import rasterio

PATH = 'data/geotiff/'

for subdir in os.listdir(PATH):
  if subdir[0] != '.' and subdir != 'converted':
    subdir += '/'
    for tif in os.listdir(PATH + subdir):
      if re.search(r"\.tif$", tif):
        f = PATH + subdir + tif
        src = gdal.Open(f)
        ras = rasterio.open(f)
        val = min(255, ras.read(1)[0][0])

        if src.RasterCount == 4 or (val != 0 and val != 255):
          if ras.dtypes[0] == 'uint16':
            os.system('gdal_translate -ot Byte ' + f + ' ' + PATH + 'converted/' + tif)
          else:
            copyfile(f, PATH + 'converted/' + tif)
        elif src.RasterCount == 1 or src.RasterCount == 3:
          s = Template("""gdal_translate -b 1 -ot Byte ${f} -a_nodata none red.tif &&
              gdal_translate -b ${b2} -ot Byte ${f} -a_nodata none green.tif &&
              gdal_translate -b ${b3} -ot Byte ${f} -a_nodata none blue.tif && 
              gdal_calc.py -A red.tif -B green.tif -C blue.tif --outfile=mask.tif --calc="logical_and(A!=${nodata},B!=${nodata},C!=${nodata})*255" --NoDataValue=0 &&
              gdal_merge.py -separate -o ${path}converted/${tif} red.tif green.tif blue.tif mask.tif &&
              rm red.tif &&
              rm green.tif &&
              rm blue.tif &&
              rm mask.tif""")
          if src.RasterCount == 1:
            os.system(s.substitute(f=f, b2='1', b3='1', nodata=str(val), path=PATH, tif=tif))
          elif src.RasterCount == 3:
            os.system(s.substitute(f=f, b2='2', b3='3', nodata=str(val), path=PATH, tif=tif))
        else:
          print f + ' has wrong number of bands!'

for tif in os.listdir(PATH + 'converted/'):
  basename = re.sub(r"\.tif$", '', tif)
  s = Template("""gdalwarp -t_srs EPSG:3857 ${path}converted/${tif} ${path}converted/${base}_merc.tif &&
    gdal_translate -of mbtiles ${path}converted/${base}_merc.tif ${path}converted/${base}.mbtiles &&
    gdaladdo -r nearest ${path}converted/${base}.mbtiles 2 4 8 16 32""")
  os.system(s.substitute(path=PATH, tif=tif, base=basename))

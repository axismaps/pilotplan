import os
import re
from string import Template
from shutil import copyfile
from osgeo import gdal
import rasterio

Path = 'data/geotiff/'

for subdir in os.listdir(Path):
  if subdir[0] != '.' and subdir != 'converted':
    subdir += '/'
    for tif in os.listdir(Path + subdir):
      if re.search(r"\.tif$", tif):
        f = Path + subdir + tif
        src = gdal.Open(f)
        ras = rasterio.open(f)
        val = min(255, ras.read(1)[0][0])

        if src.RasterCount == 4 or (val != 0 and val != 255):
          copyfile(f, Path + 'converted/' + tif)
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
            os.system(s.substitute(f=f, b2='1', b3='1', nodata=str(val), path=Path, tif=tif))
            # pass
          elif src.RasterCount == 3:
            os.system(s.substitute(f=f, b2='2', b3='3', nodata=str(val), path=Path, tif=tif))
            # pass
        else:
          print f + ' has wrong number of bands!'

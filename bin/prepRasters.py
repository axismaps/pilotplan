import os
import re
from osgeo import gdal

Path = 'data/geotiff/'

for subdir in os.listdir(Path):
  if subdir[0] != '.':
    subdir += '/'
    for tif in os.listdir(Path + subdir):
      if re.search(r"\.tif$", tif):
        src = gdal.Open(Path + subdir + tif)
        if src.RasterCount == 1:
          print '1 band'
        elif src.RasterCount == 3:
          print '3 bands'
        elif src.RasterCount == 4:
          print '4 bands'
        else:
          print Path + subdir + tif + ' has wrong number of bands!'

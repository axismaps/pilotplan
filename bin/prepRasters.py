import os
import re
from string import Template
from shutil import copyfile
from osgeo import gdal

Path = 'data/geotiff/'

for subdir in os.listdir(Path):
  if subdir[0] != '.' and subdir != 'converted':
    subdir += '/'
    for tif in os.listdir(Path + subdir):
      if re.search(r"\.tif$", tif):
        file = Path + subdir + tif
        src = gdal.Open(file)
        if src.RasterCount == 1 or src.RasterCount == 3 or src.RasterCount == 4:
          s = Template("""gdal_translate -b 1 -ot Byte ${f} red.tif && 
              gdal_translate -b ${b2} -ot Byte ${f} green.tif && 
              gdal_translate -b ${b3} -ot Byte ${f} blue.tif &&  
              gdal_translate -a_nodata none ${f} no.tif && 
              gdal_calc.py -A no.tif --outfile=mask.tif --calc="(A<=255)*255" && 
              gdal_merge.py -separate -o ${path}converted/${tif} red.tif green.tif blue.tif mask.tif && 
              rm red.tif && 
              rm green.tif && 
              rm blue.tif && 
              rm no.tif && 
              rm mask.tif""")
          if src.RasterCount == 1:
             os.system(s.substitute(f=file, b2='1', b3='1', path=Path, tif=tif))
          elif src.RasterCount == 3:
            os.system(s.substitute(f=file, b2='2', b3='3', path=Path, tif=tif))
          else:
            copyfile(file, Path + 'converted/' + tif)
        else:
          print file + ' has wrong number of bands!'


"""Deal with raster transparency and convert to MBTiles for uploading"""

import argparse
import os
import re
from string import Template
from shutil import copyfile
from osgeo import gdal
import rasterio

PARSER = argparse.ArgumentParser()
PARSER.add_argument('file', nargs='?')
PARSER.add_argument('--fixed')
PARSER.add_argument('--nodata', type=int)
PARSER.add_argument('--dev')
ARGS = PARSER.parse_args()

PATH = 'data/geotiff/'

def raster_bands(tif, sub):
  if re.search(r"\.tif$", tif):
    tif_file = PATH + sub + tif
    print 'Reading raster', tif_file
    src = gdal.Open(tif_file)
    ras = rasterio.open(tif_file)

    if ARGS.nodata:
      val = ARGS.nodata
    else:
      val = ras.read(1)[0][0]

    if (src.RasterCount == 4 or (val != 0 and val != 255)) and ras.dtypes[0] == 'uint8':
      print '4 correct bands found'
      copyfile(tif_file, PATH + 'converted/' + tif)
      project_raster(tif)
    elif src.RasterCount == 1 or src.RasterCount == 3 or src.RasterCount == 4:
      print 'Using ' + str(val) + ' for no data'
      gdal_string = Template("""gdal_translate -b 1 ${f} -a_nodata none ${path}converted/red.tif &&
          gdal_translate -b ${b2} ${f} -a_nodata none ${path}converted/green.tif &&
          gdal_translate -b ${b3} ${f} -a_nodata none ${path}converted/blue.tif &&
          echo Calculating file mask
          gdal_calc.py -A ${path}converted/red.tif -B ${path}converted/green.tif -C ${path}converted/blue.tif --outfile=${path}converted/mask.tif --calc="logical_and(A!=${nodata},B!=${nodata},C!=${nodata})*255" --NoDataValue=0 &&
          echo Merging files
          gdal_merge.py -separate -ot Byte -o ${path}converted/${tif} ${path}converted/red.tif ${path}converted/green.tif ${path}converted/blue.tif ${path}converted/mask.tif &&
          echo Cleaning up
          rm ${path}converted/red.tif &&
          rm ${path}converted/green.tif &&
          rm ${path}converted/blue.tif &&
          rm ${path}converted/mask.tif""")
      if src.RasterCount == 1:
        print '1 band raster found'
        os.system(gdal_string.substitute(f=tif_file, b2='1', b3='1', nodata=str(val),
                                         path=PATH, tif=tif))
        project_raster(tif)
      elif src.RasterCount >= 3:
        print '3+ band raster found'
        os.system(gdal_string.substitute(f=tif_file, b2='2', b3='3', nodata=str(val),
                                         path=PATH, tif=tif))
        project_raster(tif)
    else:
      print tif_file + ' has wrong number of bands!'

def project_raster(tif):
  basename = re.sub(r"\.tif$", '', tif)
  if ARGS.dev:
    basename += 'dev'

  merc_string = Template("""gdalwarp -t_srs EPSG:3857 \
    ${path}converted/${tif} ${path}converted/${base}_merc.tif""")
  os.system(merc_string.substitute(path=PATH, tif=tif, base=basename))

  if ARGS.fixed:
    mb_string = Template("""echo Converting to MBTiles &&
      gdal2mbtiles --no-fill-borders --min-resolution 9 --max-resolution 17\
        ${path}converted/${base}_merc.tif ${path}converted/${base}.mbtiles""")
  else:
    mb_string = Template("""gdal_translate -of mbtiles \
        ${path}converted/${base}_merc.tif ${path}converted/${base}.mbtiles &&
      gdaladdo -r nearest ${path}converted/${base}.mbtiles 2 4 8 16 32 64""")
  os.system(mb_string.substitute(path=PATH, tif=tif, base=basename))

if ARGS.file:
  FILES = ARGS.file.replace(PATH, '').split('/')
  raster_bands(FILES[1], FILES[0] + '/')
  os.system('source .env && node bin/raster.js')
  # os.system('find data/geotiff/converted/ -type f  ! -name ".gitignore"  -delete')
else:
  for subdir in os.listdir(PATH):
    if subdir[0] != '.' and subdir != 'converted':
      subdir += '/'
      for t in os.listdir(PATH + subdir):
        raster_bands(t, subdir)

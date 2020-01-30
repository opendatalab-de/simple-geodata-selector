#!/bin/sh
./convert-shapefile.sh vg250_2018-12-31.utm32s.shape.ebenen/vg250_ebenen/VG250_GEM.dbf gemeinden ../src/data/
./convert-shapefile.sh vg250_2018-12-31.utm32s.shape.ebenen/vg250_ebenen/VG250_KRS.dbf landkreise ../src/data/
./convert-shapefile.sh vg250_2018-12-31.utm32s.shape.ebenen/vg250_ebenen/VG250_LAN.dbf bundeslaender ../src/data/

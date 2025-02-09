simple-geodata-selector
=======================

Online Version: http://opendatalab.de/projects/geojson-utilities/ (Stand 31.12.2018)
Online Version: http://geodata.bw-im.de (Stand 31.12.2023)

Skripte für Datenkonvertierung
==============================

	ogr2ogr -f GeoJSON -s_srs epsg:25832 -t_srs epsg:4326 landkreise_sim0.geojson vg250_krs.dbf
	ogr2ogr -f GeoJSON -s_srs epsg:25832 -t_srs epsg:4326 -simplify 20 landkreise_sim20.geojson vg250_krs.dbf
	ogr2ogr -f GeoJSON -s_srs epsg:25832 -t_srs epsg:4326 -simplify 200 landkreise_sim200.geojson vg250_krs.dbf


	ogr2ogr -f GeoJSON -s_srs epsg:25832 -t_srs epsg:4326 gemeinden_sim0.geojson vg250_gem.dbf
	ogr2ogr -f GeoJSON -s_srs epsg:25832 -t_srs epsg:4326 -simplify 20 gemeinden_sim20.geojson vg250_gem.dbf
	ogr2ogr -f GeoJSON -s_srs epsg:25832 -t_srs epsg:4326 -simplify 200 gemeinden_sim200.geojson vg250_gem.dbf

	ogr2ogr -f GeoJSON -s_srs epsg:25832 -t_srs epsg:4326 bundeslaender_sim0.geojson vg250_bld.dbf
	ogr2ogr -f GeoJSON -s_srs epsg:25832 -t_srs epsg:4326 -simplify 20 bundeslaender_sim20.geojson vg250_bld.dbf
	ogr2ogr -f GeoJSON -s_srs epsg:25832 -t_srs epsg:4326 -simplify 200 bundeslaender_sim200.geojson vg250_bld.dbf

Siehe auch Verzeichnis converter/



Datenstand
==================

Für den Datensatz wurden die Verwaltungsgebiete zum Stand 31.12.2023 (Quelle: Geodatenzentrum) verwendet und mit
den Einwohner- und Flächenzahlen zum Stand 31.12.2023 (Jahresausgabe) (Quelle: Destatis) verknüpft.

Datenquellen:

* https://gdz.bkg.bund.de/index.php/default/open-data/verwaltungsgebiete-1-250-000-ebenen-stand-31-12-vg250-ebenen-31-12.html
* https://www.destatis.de/DE/Themen/Laender-Regionen/Regionales/Gemeindeverzeichnis/_inhalt.html
* http://regenesis.pudo.org/

© GeoBasis-DE / BKG 2023

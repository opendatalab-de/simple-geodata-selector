simple-geodata-selector
=======================

Online Version: http://opendatalab.de/projects/geojson-utilities/


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

Für den Datensatz wurden die Verwaltungsgebiete zum Stand 1.1.2016 verwendet und mit 
den Einwohner- und Flächenzahlen zum Stand 30.06.2016 (Q2) verknüpft.

Datenquellen:

* http://www.geodatenzentrum.de/geodaten/gdz_rahmen.gdz_div?gdz_spr=deu&gdz_akt_zeile=5&gdz_anz_zeile=1&gdz_unt_zeile=14&gdz_user_id=0
* https://www.destatis.de/DE/ZahlenFakten/LaenderRegionen/Regionales/Gemeindeverzeichnis/Administrativ/AdministrativeUebersicht.html
* http://regenesis.pudo.org/

© GeoBasis-DE / BKG 2016

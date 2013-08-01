simple-geodata-selector
=======================


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

Datenquelle:

http://www.geodatenzentrum.de/geodaten/gdz_rahmen.gdz_div?gdz_spr=deu&gdz_akt_zeile=5&gdz_anz_zeile=1&gdz_unt_zeile=15&gdz_user_id=0

© GeoBasis-DE / BKG 2013
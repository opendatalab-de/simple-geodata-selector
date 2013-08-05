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


Änderung der Daten
==================

Für den Datensatz wurden die Verwaltungsgebiete zum Stand 1.1.2013 verwendet und mit 
den Einwohnerzahlen zum Stand 30.06.2013 (Q2) verknüpft. Alle Wasserflächen wurden aus den 
Geo-Daten rausgefiltert. 

Einige Gemeinden konnten nicht den Flächen zugeordnet werden. Diese werden im Folgenden aufgelistet:

Mittelangeln, RS: 010595949185
Bad Suderode, RS: 150855005035
Gernrode, Stadt, RS: 150855005120
Rieder, RS: 150855005255
Mühlanger, RS: 150910230230

Da sich zum 1.1.2013 einige Verwaltungsgebiete geändert haben, haben wir ein Mapping auf die neuen Gebiete durchgeführt. 

GeoData RS: 010595974011 => Einwohner RS: 010595974187 / Boren
GeoData RS: 010595990165 => Einwohner RS: 010595990186 / Steinbergkirche
GeoData RS: 031565401001 => Einwohner RS: 031560017017 / Bad Grund (Harz)
GeoData RS: 120615114017 => Einwohner RS: 120615112017 / Bersteland
GeoData RS: 120615114097 => Einwohner RS: 120615112097 / Drahnsdorf
GeoData RS: 120615114164 => Einwohner RS: 120615112164 / Golßen
GeoData RS: 120615114244 => Einwohner RS: 120615112244 / Kasel-Golzig
GeoData RS: 120615114265 => Einwohner RS: 120615112265 / Krausnick-Groß Wasserburg
GeoData RS: 120615114405 => Einwohner RS: 120615112405 / Rietzneuendorf-Staakow
GeoData RS: 120615114428 => Einwohner RS: 120615112428 / Schlepzig
GeoData RS: 120615114435 => Einwohner RS: 120615112435 / Schönwald
GeoData RS: 120615114471 => Einwohner RS: 120615112471 / Steinreich
GeoData RS: 120615114510 => Einwohner RS: 120615112510 / Unterspreewald

Darüber hinaus fanden wir einige Gemeinden, für die zwar Flächeninformationen zur 
Verfügung stehen, die jedoch in den Einwohnerzahlen-Daten nicht zu finden waren:

Nonnenkloster (RS: 096789454454)
Stollbergerforst (RS: 096789455455)
Vollburg (RS: 096789456456)
Schmellerforst (RS: 097729451451)
Winzerwald (RS: 097749452452)
Auwald (RS: 097759451451)
Brand (RS: 097799451451)
Dornstadt-Linkersbaindt (RS: 097799452452)
Esterholz (RS: 097799453453)


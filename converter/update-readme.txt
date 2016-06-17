1) Download "Verwaltungsgebiete 1:250.000" from http://www.geodatenzentrum.de/geodaten/gdz_rahmen.gdz_div?gdz_spr=deu&gdz_akt_zeile=5&gdz_anz_zeile=0&gdz_user_id=0
2) extract it here and run update-data.sh
3) Download "Erscheinungsweise vierteljährlich (Quartalsausgabe)" Excel-Format Quartal from https://www.destatis.de/DE/ZahlenFakten/LaenderRegionen/Regionales/Gemeindeverzeichnis/Administrativ/AdministrativeUebersicht.html
4) run node convertPopulationData.js <XLS-File> ../src/data/destatis.json
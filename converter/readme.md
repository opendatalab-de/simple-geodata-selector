# Upgrade the data for the maps
1) Download "Verwaltungsgebiete 1:250.000" from https://gdz.bkg.bund.de/ (use UTM32s Shape)
2) extract it here, adapt and run update-data.sh
3) Download "Jahresausgabe" Excel-Format from https://www.destatis.de/DE/Themen/Laender-Regionen/Regionales/Gemeindeverzeichnis/_inhalt.html
4) run `npm install`
4) run `node convertPopulationData.js <XLSX-File> ../src/data/destatis.json`

/**
 * Convert Destatis AuszugGV3QAktuell.xls
 */

var XLSX = require('xlsx');
var fs = require('fs');
var process = require('process');

if(process.argv.length < 4) {
    console.log('usage: [xlsInputFile] [outputFile]');
    process.exit(1);
}

var workbook = XLSX.readFile(process.argv[2]);

var result = {};
var sheet = workbook.Sheets[workbook.SheetNames[1]];

var readCell = function(column, rowNum) {
    var cell = sheet[column + rowNum];
    return cell && cell.v ? cell.v : null;
};

for(var i = 7; sheet['A' + i]; i++) {
    if(readCell('K', i)) {
        var rs = readCell('C', i) + readCell('D', i) + readCell('E', i) + readCell('F', i) + readCell('G', i);
        result[rs] = {
            'RS': rs,
            'area': readCell('I', i),
            'area_date': readCell('J', i),
            'population': readCell('K', i),
            'population_m': readCell('L', i),
            'population_w': readCell('M', i),
            'population_density': readCell('N', i),
            'zip': readCell('O', i),
            'center_lon': readCell('P', i),
            'center_lat': readCell('Q', i),
            'travel_key': readCell('R', i),
            'travel_desc': readCell('S', i),
            'density_key': readCell('T', i),
            'density_desc': readCell('U', i)
        };
    }
}

fs.writeFileSync(process.argv[3], JSON.stringify(result));
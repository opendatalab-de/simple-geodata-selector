/**
 * Convert Destatis AuszugGV2QAktuell.xls
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
            'population': readCell('J', i),
            'population_m': readCell('K', i),
            'population_w': readCell('L', i),
            'population_density': readCell('M', i),
            'zip': readCell('N', i),
            'center_lon': readCell('O', i),
            'center_lat': readCell('P', i),
            'travel_key': readCell('Q', i),
            'travel_desc': readCell('R', i),
            'density_key': readCell('S', i),
            'density_desc': readCell('T', i)
        };
    }
}

fs.writeFileSync(process.argv[3], JSON.stringify(result));

'use strict';

(function (sgs, async, $) {
    var fetchData = function (table, year, callback, progressCallback) {
        $.ajax({
            dataType: 'json',
            url: 'http://api.regenesis.pudo.org/cube/' + table + '/aggregate?cut=jahr.text:' + year + '&drilldown=gemein',
            success: callback,
            progress: progressCallback
        });
    };

    var enrichWithOneTable = function (geojson, tableCode, year, data) {
        var key = tableCode + '-' + year;

        geojson.features.forEach(function (feature) {
            var properties = data.cells.filter(function (cell) {
                return cell['gemein.name'] == feature.properties.ARS.substr(0, 5) + feature.properties.ARS.substr(9, 3);
            });
            if (properties && properties[0]) {
                delete properties[0]['gemein.name'];
                delete properties[0]['gemein.label'];
                delete properties[0]['record_count'];
                feature.properties[key] = properties[0];
            }
        });
    };

    var enrich = function (geojson, tables, finalCallback) {
        async.eachLimit(tables, 2, function (table, tableCallback) {
            fetchData(table.code, table.year, function (data) {
                enrichWithOneTable(geojson, table.code, table.year, data);
                tableCallback();
            }, table.progressCallback);
        }, finalCallback);
    };

    sgs.regenesis = {
        'enrich': enrich
    };
})(sgs, async, jQuery);
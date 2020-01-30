'use strict';

(function (sgs, $) {
    var dataDefinitions = [
        {
            'code': 'WIKIDATA',
            'name': 'Wikidata (Daten von Wikipedia)',
            'source': 'wikidata',
            'desc': 'Name, KFZ-Kennzeichen, Webseite, Vorwahl, PLZ, Bild, Bürgermeister, erstmalige Erwähnung, Facebook Places ID',
            'descriptionUrl': 'https://de.wikipedia.org/wiki/Wikidata'
        }];

    dataDefinitions
        .filter(function (def) {
            return def.source === 'regenesis'
        })
        .forEach(function (def) {
            def.descriptionUrl = 'http://regenesis.pudo.org/regional/statistics/' + def.urlFragment + '.' + def.code.substr(0, 5) + '.html';
        });

    var generateOptionsHtml = function () {
        var html = '';

        dataDefinitions.forEach(function (table, index) {
            html += '<div class="panel panel-default">';
            html += '<div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#collapse' + table.code + '">'
                + table.name + ' <small>' + table.code + '</small></a></h4></div>';
            html += '<div id="collapse' + table.code + '" class="panel-collapse collapse' + ((index < 1) ? ' in' : '') + '"><div class="panel-body">';
            html += '<form class="form-inline form-additional-data"><input type="hidden" name="table" value="' + table.code + '" />';

            if (table.years) {
                html += '<label>Jahre:</label>';
                table.years.forEach(function (year) {
                    html += ' <div class="checkbox"><label><input type="checkbox" name="year" value="' + year + '" /> ' + year + '</label></div>';
                });
            } else if (table.keyDates) {
                html += '<label>Stichtage:</label>';
                table.keyDates.forEach(function (keyDate) {
                    html += ' <div class="checkbox"><label><input type="checkbox" name="keyDate" value="' + keyDate + '" /> ' + keyDate + '</label></div>';
                });
            } else {
                html += '<div class="checkbox"><label><input type="checkbox" name="allData" value="1" /> ' + (table.desc ? table.desc : 'Alle Metadaten') + '</label></div>';
            }

            html += '</form>';
            if (table.descriptionUrl) {
                html += '<br /><a href="' + table.descriptionUrl + '" target="_blank" class="btn btn-default"><span class="glyphicon glyphicon-share"></span> Datensatzbeschreibung</a>';
            }
            html += '</div></div>';
            html += '</div>';
        });

        return html;
    };

    var initDialog = function () {
        $('.additional-data-selection').html(generateOptionsHtml());
        $('.collapse').collapse({
            toggle: false,
            parent: '#accordion'
        });
        $('.form-additional-data').on('change', function () {
            var panelClass = $(this).find('input:checked').length > 0 ? 'panel-info' : 'panel-default';
            $(this).closest('.panel').removeClass('panel-default panel-info').addClass(panelClass);
        });
    };

    var getSelectedTables = function () {
        var tables = [];

        $('.form-additional-data').each(function (index, form) {
            if ($(form).find('input:checked').length > 0) {
                var years = [];
                $(form).find('input[name="year"]:checked').each(function (index, yearCheckbox) {
                    years.push($(yearCheckbox).val());
                });

                var code = $(form).find('input[name="table"]').val();
                var definition = dataDefinitions.find(function (tableDefinition) {
                    return tableDefinition.code == code;
                });

                if (years.length > 0) {
                    years.forEach(function (year) {
                        tables.push({
                            'name': definition.name + ' ' + year,
                            'code': code,
                            'year': year,
                            'source': definition.source
                        });
                    });
                } else {
                    tables.push({
                        'name': definition.name,
                        'code': code,
                        'source': definition.source
                    });
                }
            }
        });

        return tables;
    };

    sgs.additionalDataDialog = {
        'getSelectedTables': getSelectedTables,
        'initDialog': initDialog
    };
})(sgs, jQuery);

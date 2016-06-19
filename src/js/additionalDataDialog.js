'use strict';

(function (sgs, $) {
    var dataDefinitions = [
        {
            'code': 'WIKIDATA',
            'name': 'Wikidata (Daten von Wikipedia)',
            'source': 'wikidata',
            'desc': 'Name, KFZ-Kennzeichen, Webseite, Vorwahl, PLZ, Bild, Bürgermeister, erstmalige Erwähnung, Facebook Places ID'
        },
        {
            'code': '71231gj001',
            'name': 'Realsteuern',
            'urlFragment': 'realsteuervergleich',
            'years': ['2008', '2009', '2010', '2011', '2012'],
            'source': 'regenesis'
        }, {
            'code': '12612gj005',
            'name': 'Statistik der Geburten',
            'urlFragment': 'statistik-der-geburten',
            'years': ['2008', '2009', '2010', '2012'],
            'source': 'regenesis'
        }, {
            'code': '12613gj002',
            'urlFragment': 'statistik-der-sterbefalle',
            'name': 'Statistik der Sterbefälle',
            'years': ['2008', '2009', '2010', '2011', '2012'],
            'source': 'regenesis'
        }, /*
         * { 'code': '42111gj001', 'name': 'Verarbeitendes Gewerbe', 'keyDates':
         * ['30.09.2009', '30.09.2010', '30.09.2011', '30.09.2012'] }
         */, /*
         * { 'code': '13111gj001', 'name': 'Beschäftigungsstatistik der
         * Bundesagentur für Arbeit', 'keyDates': ['30.06.2011',
         * '30.06.2010', '30.06.2009', '30.06.2008'] }
         */, {
            'code': '13211gj001',
            'name': 'Arbeitsmarktstatistik der Bundesagentur für Arbeit',
            'urlFragment': 'arbeitsmarktstatistik-der-bundesagentur-fur-arbeit',
            'years': ['2008', '2012', '2013'],
            'source': 'regenesis'
        }, {
            'code': '73111gj001',
            'name': 'Lohn- und Einkommensteuerstatistik',
            'urlFragment': 'lohn-und-einkommensteuerstatistik',
            'years': ['2007'],
            'source': 'regenesis'
        }, {
            'code': '45412gj001',
            'name': 'Tourismuszahlen',
            'urlFragment': 'monatserhebung-im-tourismus',
            'years': ['2008', '2009', '2010', '2011', '2013'],
            'source': 'regenesis'
        }, {
            'code': '46241gj001',
            'name': 'Statistik der Straßenverkehrsunfälle',
            'urlFragment': 'statistik-der-strassenverkehrsunfalle',
            'years': ['2008', '2009', '2010', '2011', '2012'],
            'source': 'regenesis'
        }, /*
         * { 'code': '32271gj001', 'name': 'Erhebung der Wasser- und
         * Abwasserentgelte', 'keyDates': ['01.01.2008', '01.01.2009',
         * '01.01.2010'] }
         */, {
            // more codes available
            'code': '31121gj001',
            'name': 'Statistik der Baufertigstellungen',
            'urlFragment': 'statistik-der-baufertigstellungen',
            'years': ['2008', '2009', '2010', '2011', '2012'],
            'source': 'regenesis'
        }, /*
         * { // more codes available 'code': '31231gj003', 'name':
         * 'Fortschreibung des Wohngebäude- und Wohnungsbestandes', 'keyDates':
         * ['31.12.2008', '31.12.2009', '31.12.2010', '31.12.2011'] }
         */, {
            // more codes available
            'code': '71137gj001',
            'name': 'Kassenergebnisse der Gemeinden',
            'urlFragment': 'vierteljahrliche-kassenergebnisse-der-gemeinden',
            'years': ['2008', '2009', '2010', '2011', '2012'],
            'source': 'regenesis'
        }, {
            // more codes available
            'code': '31111gj001',
            'name': 'Statistik der Baugenehmigungen',
            'urlFragment': 'statistik-der-baugenehmigungen',
            'years': ['2008', '2009', '2010', '2011', '2012'],
            'source': 'regenesis'
        }, /*
         * { 'code': '14211gj001', 'name': 'Allgemeine Europawahlstatistik',
         * 'keyDates': ['07.06.2009'] }
         */, /*
         * { 'code': '14111gj001', 'name': 'Allgemeine
         * Bundestagswahlstatistik', 'keyDates': ['27.09.2009'] }
         */, {
            'code': '12711gj001',
            'name': 'Wanderungsstatistik',
            'urlFragment': 'wanderungsstatistik',
            'years': ['2008', '2009', '2010', '2011', '2012'],
            'source': 'regenesis'
        }, /*
         * { 'code': '12411gj004', 'name': 'Fortschreibung des
         * Bevölkerungsstandes', 'keyDates': ['31.12.2008', '31.12.2009',
         * '31.12.2010', '31.12.2011'] }
         */];

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
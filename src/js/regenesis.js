'use strict';

(function(sgs, async, $) {
	var tableDefinitions = [{
		'code': '71231gj001',
		'name': 'Realsteuern',
		'years': ['2008', '2009', '2010', '2011']
	}, {
		'code': '12612gj005',
		'name': 'Statistik der Geburten',
		'years': ['2008', '2009', '2010', '2012']
	}, {
		'code': '12613gj002',
		'name': 'Statistik der Sterbefälle',
		'years': ['2008', '2009', '2010', '2011', '2012']
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
		'years': ['2008', '2012']
	}, {
		'code': '73111gj001',
		'name': 'Lohn- und Einkommensteuerstatistik',
		'years': ['2012']
	}, {
		'code': '45412gj001',
		'name': 'Tourismuszahlen',
		'years': ['2008', '2009', '2010', '2011']
	}, {
		'code': '46241gj001',
		'name': 'Statistik der Straßenverkehrsunfälle',
		'years': ['2008', '2009', '2010', '2011']
	}, /*
		 * { 'code': '32271gj001', 'name': 'Erhebung der Wasser- und
		 * Abwasserentgelte', 'keyDates': ['01.01.2008', '01.01.2009',
		 * '01.01.2010'] }
		 */, {
		// more codes available
		'code': '31121gj001',
		'name': 'Statistik der Baufertigstellungen',
		'years': ['2008', '2009', '2010', '2011', '2012']
	}, /*
		 * { // more codes available 'code': '31231gj003', 'name':
		 * 'Fortschreibung des Wohngebäude- und Wohnungsbestandes', 'keyDates':
		 * ['31.12.2008', '31.12.2009', '31.12.2010', '31.12.2011'] }
		 */, {
		// more codes available
		'code': '71137gj001',
		'name': 'Kassenergebnisse der Gemeinden',
		'years': ['2008', '2009', '2010', '2011']
	}, {
		// more codes available
		'code': '31111gj001',
		'name': 'Statistik der Baugenehmigungen',
		'years': ['2008', '2009', '2010', '2011', '2012']
	}, /*
		 * { 'code': '14211gj001', 'name': 'Allgemeine Europawahlstatistik',
		 * 'keyDates': ['07.06.2009'] }
		 */, /*
			 * { 'code': '14111gj001', 'name': 'Allgemeine
			 * Bundestagswahlstatistik', 'keyDates': ['27.09.2009'] }
			 */, {
		'code': '12711gj001',
		'name': 'Wanderungsstatistik',
		'years': ['2008', '2009', '2010', '2011', '2012']
	}, /*
		 * { 'code': '12411gj004', 'name': 'Fortschreibung des
		 * Bevölkerungsstandes', 'keyDates': ['31.12.2008', '31.12.2009',
		 * '31.12.2010', '31.12.2011'] }
		 */];

	var fetchData = function(table, year, callback) {
		$.ajax({
			dataType: 'json',
			url: 'http://api.regenesis.pudo.org/cube/' + table + '/aggregate?cut=jahr.text:' + year + '&drilldown=gemein',
			success: callback
		});
	};

	var enrichWithOneTable = function(geojson, tableCode, year, data) {
		var key = tableCode + '-' + year;

		geojson.features.forEach(function(feature) {
			var properties = data.cells.filter(function(cell) {
				return cell['gemein.name'] == feature.properties.RS.substr(0, 5) + feature.properties.RS.substr(9, 3);
			});
			if (properties && properties[0]) {
				delete properties[0]['gemein.name'];
				delete properties[0]['gemein.label'];
				delete properties[0]['record_count'];
				feature.properties[key] = properties[0];
			}
		});
	};

	var enrich = function(geojson, tables, finalCallback) {
		async.eachLimit(tables, 3, function(table, tableCallback) {
			async.eachLimit(table.years, 3, function(year, yearCallback) {
				fetchData(table.code, year, function(data) {
					enrichWithOneTable(geojson, table.code, year, data);
					yearCallback();
				});
			}, tableCallback);
		}, finalCallback);
	};

	/**
	 * DIALOG
	 */
	var generateOptionsHtml = function() {
		var html = '';

		tableDefinitions.forEach(function(table, index) {
			html += '<div class="panel panel-default">';
			html += '<div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#collapse' + table.code + '">'
					+ table.name + ' <small>' + table.code + '</small></a></h4></div>';
			html += '<div id="collapse' + table.code + '" class="panel-collapse collapse' + ((index < 1) ? ' in' : '') + '"><div class="panel-body">';
			html += '<form class="form-inline form-regenesis"><input type="hidden" name="table" value="' + table.code + '" />';

			if (table.years) {
				html += '<label>Jahre:</label>';
				table.years.forEach(function(year) {
					html += ' <div class="checkbox"><label><input type="checkbox" name="year" value="' + year + '" /> ' + year + '</label></div>';
				});
			} else if (table.keyDates) {
				html += '<label>Stichtage:</label>';
				table.keyDates.forEach(function(keyDate) {
					html += ' <div class="checkbox"><label><input type="checkbox" name="keyDate" value="' + keyDate + '" /> ' + keyDate + '</label></div>';
				});
			}

			html += '</form><br /><a href="http://regenesis.pudo.org/regional/statistics/realsteuervergleich.' + table.code.substr(5)
					+ '.html" target="_blank" class="btn btn-default"><span class="glyphicon glyphicon-share"></span> Datensatzbeschreibung</a>';
			html += '</div></div>';
			html += '</div>';
		});

		return html;
	};

	var initDialog = function() {
		$('.regenesis-selection').html(generateOptionsHtml());
		$('.collapse').collapse({
			toggle: false,
			parent: '#accordion'
		});
		$('.form-regenesis').on('change', function() {
			var panelClass = $(this).find('input:checked').length > 0 ? 'panel-info' : 'panel-default';
			$(this).closest('.panel').removeClass('panel-default panel-info').addClass(panelClass);
		});
	};

	var enrichAccordingToDialog = function(geojson, callback) {
		var tables = [];

		$('.form-regenesis').each(function(index, form) {
			if ($(form).find('input:checked').length > 0) {
				var years = [];
				$(form).find('input[name="year"]:checked').each(function(index, yearCheckbox) {
					years.push($(yearCheckbox).val());
				});

				var tableOptions = {
					'code': $(form).find('input[name="table"]').val(),
					'years': years
				};
				tables.push(tableOptions);
			}
		});

		enrich(geojson, tables, callback);
	};

	sgs.regenesis = {
		'enrich': enrichAccordingToDialog,
		'initDialog': initDialog
	};
})(sgs, async, jQuery);
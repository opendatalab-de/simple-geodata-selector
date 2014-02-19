'use strict';

(function(sgs, async, $) {
	sgs.regenesis = {
		fetchData: function(table, year, callback) {
			$.ajax({
				dataType: 'json',
				url: 'http://api.regenesis.pudo.org/cube/' + table + '/aggregate?cut=jahr.text:' + year + '&drilldown=gemein',
				success: callback
			});
		},
		enrich: function(geojson, options, finalCallback) {
			async.eachLimit(options.tables, 5, function(table, callback) {
				sgs.regenesis.fetchData(table, '2011', function(data) {
					sgs.regenesis.enrichWith(geojson, table, data);
					callback();
				});
			}, finalCallback);
		},
		enrichWith: function(geojson, table, data) {
			geojson.features.forEach(function(feature) {
				var properties = data.cells.filter(function(cell) {
					// wechseln auf RS-Schlüssel
					return cell['gemein.label'] == feature.properties.GEN;
				});
				feature.properties[table] = properties;
			});
		}
	};
})(sgs, async, jQuery);
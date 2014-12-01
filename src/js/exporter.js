'use strict';

(function(sgs) {
	var elementId = 1;
	var currentDate = new Date().toJSON();
	sgs.exporter = {
		filterFeatures: function(source, rsPrefixes, clickThatHood) {
			var result = {
				"type": "FeatureCollection",
				"crs": {
					"type": "name",
					"properties": {
						"name": "urn:ogc:def:crs:OGC:1.3:CRS84"
					}
				},
				"source": "© GeoBasis-DE / BKG 2013 (Daten verändert)",
				"features": []
			};
			for ( var x = 0; x < source.features.length; x++) {
				var rs = source.features[x].properties.RS;
				for ( var p = 0; p < rsPrefixes.length; p++) {
					if (rs.indexOf(rsPrefixes[p]) == 0) {
						if (clickThatHood) {
							result.features.push(sgs.exporter.convertClickThatHoodProperties(source.features[x]));
						}
						else {
							result.features.push(source.features[x]);
						}
						break;
					}
				}
			}
			return result;
		},
		convertClickThatHoodProperties:function(source) {
			var result = {};
			var properties = {};
			properties['name'] = source.properties.GEN;
			properties['cartodb_id'] = elementId++;
			properties['created_at'] = currentDate;
			properties['updated_at'] = currentDate;

			result['properties'] = properties;
			result['type'] = source['type'];
			result['geometry'] = source['geometry'];
			return result;
		},
		exportData: function(data, filename) {
			var blob = new Blob([JSON.stringify(data)], {
				type: "text/plain;charset=utf-8"
			});
			saveAs(blob, filename + '.geojson');
		}
	};
})(sgs);
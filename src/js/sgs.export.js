sgs.exporter = {
	filterFeatures : function(source, rsPrefixes) {
		var result = {
			"type" : "FeatureCollection",
			"crs" : {
				"type" : "name",
				"properties" : {
					"name" : "urn:ogc:def:crs:OGC:1.3:CRS84"
				}
			},
			"source" : "© GeoBasis-DE / BKG 2013 (Daten verändert)",
			"features" : []
		};

		for ( var x = 0; x < source.features.length; x++) {
			var rs = source.features[x].properties.RS;
			for ( var p = 0; p < rsPrefixes.length; p++) {
				if (rs.indexOf(rsPrefixes[p]) != -1) {
					result.features.push(source.features[x]);
					break;
				}
			}
		}

		return result;
	}
};
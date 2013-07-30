(function(sgs, L) {
	'use strict';

	var map = {
		leafletMap: null,
		init: function() {
			this.leafletMap = L.map('map', {
				center: [51.463, 7.88],
				zoom: 11,
				minZoom: 5,
				maxZoom: 11
			});

			this.addTileLayer();
		},
		addTileLayer: function() {
			var attribution = '© 2013 CloudMade – Map data <a href="http://creativecommons.org/licenses/by-sa/2.0/">CCBYSA</a> 2013 <a href="http://www.openstreetmap.org/">OpenStreetMap.org</a> contributors – <a href="http://cloudmade.com/terms_conditions">Terms of Use</a>';
			L.tileLayer('http://{s}.tile.cloudmade.com/036a729cf53d4388a8ec345e1543ef53/44094/256/{z}/{x}/{y}.png', {
				'maxZoom': 18,
				'attribution': attribution
			}).addTo(this.leafletMap);
		},
		addAreaLayers: function(geojson, callback) {
			L.geoJson(geojson.features, {
				style: {
					'opacity': 0.5,
					'weight': 1
				},
				onEachFeature: callback
			}).addTo(this.leafletMap);
		}
	};

	sgs.map = map;
})(sgs, L);
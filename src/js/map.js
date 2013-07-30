(function(sgs, L) {
	'use strict';

	var map = {
		leafletMap : null,
		init : function() {
			this.leafletMap = L.map('map', {
				center : [ 51.463, 7.88 ],
				zoom : 7,
				minZoom : 5,
				maxZoom : 11
			});

			this.addTileLayer();
			this.addAreaLayers();
		},
		addTileLayer : function() {
			var attribution = '© 2013 CloudMade – Map data <a href="http://creativecommons.org/licenses/by-sa/2.0/">CCBYSA</a> 2013 <a href="http://www.openstreetmap.org/">OpenStreetMap.org</a> contributors – <a href="http://cloudmade.com/terms_conditions">Terms of Use</a>';
			L
					.tileLayer(
							'http://{s}.tile.cloudmade.com/036a729cf53d4388a8ec345e1543ef53/44094/256/{z}/{x}/{y}.png',
							{
								'maxZoom' : 18,
								'attribution' : attribution
							}).addTo(this.leafletMap);
		},
		addAreaLayers : function(geojson, callback) {
			$('.ajax-loader').show();
			var that = this;

			$.ajax({
				dataType : "json",
				url : 'data/landkreise.geojson',
				success : function(geojson) {
					L.geoJson(geojson.features, {
						style : {
							'opacity' : 0.5,
							'weight' : 1
						},
						onEachFeature : function(feature, layer) {
							landkreise[feature.properties.RS] = layer;
							layer.on("click", function(e) {
								if (e.target.selected) {
									e.target.setStyle({
										color : "#03f"
									});
									e.target.selected = false;
								} else {
									e.target.setStyle({
										color : "#ff0000"
									});
									e.target.selected = true;
								}
							});

						}
					}).addTo(that.leafletMap);
					$('.ajax-loader').hide();
					that.selectLayers('');

				},
				progress : function(evt) {
					if (evt.lengthComputable) {
						var percent = parseInt((evt.loaded / evt.total * 100), 10);
						console.log("Loaded " + percent + "%");
					} else {
						console.log("Length not computable.");
					}
				}
			});
		},
		selectLayers : function(rs) {
			var selectedLayers = [];
			for ( var key in landkreise) {
				if (landkreise[key].selected) {
					selectedLayers.push(key);
				}
			}
			return selectedLayers;
		}
	};

	sgs.map = map;
})(sgs, L);
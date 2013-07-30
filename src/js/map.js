(function(sgs, L) {
	'use strict';

	var knownAreaTypes = [ 'Landkreis', 'Kreis', 'Kreisfreie Stadt' ];
	var areaStatus = {};

	function updateSelectionStatus() {
		var status = $('table');
		for ( var x = 0; x < knownAreaTypes.length; x++) {
			areaStatus[knownAreaTypes[x]] = 0;
		}
		for ( var x = 0; x < knownAreaTypes.length; x++) {
			status.append("<tr><td>" + knownAreaTypes[x] + "</td><td>"
					+ areaStatus[knownAreaTypes[x]] + "</td></tr>");
		}
		$('#selectionStatus').html(status);

	}

	function selectLayer(layer) {
		layer.setStyle({
			color : "#ff0000"
		});
		layer.selected = true;
		updateSelectionStatus();
	}
	function deselectLayer(layer) {
		layer.setStyle({
			color : "#03f"
		});
		layer.selected = false;
		updateSelectionStatus();
	}
	function progressReport(event) {
		if (event.lengthComputable) {
			var percent = parseInt((event.loaded / event.total * 100), 10);
			timer.draw(percent);
		}
	}
	var map = {
		leafletMap : null,
		init : function() {
			this.leafletMap = L.map('map', {
				center : [ 51.165691, 10.451526 ],
				zoom : 7,
				minZoom : 5,
				maxZoom : 12
			});

			this.addTileLayer();
			this.addAreaLayers();
			var that = this;
			$('.btn-export').on('click', function() {

				var exportLayer = $('form.options select[name=exportLayer]').val();
				var simplify = $('form.options select[name=simplify]').val();
				$('.timer').show();

				$.ajax({
					dataType : "json",
					url : 'data/' + exportLayer + '_sim' + simplify + '.geojson',
					success : function(geoJson) {
						var selectedRs = sgs.map.getSelectedLayers();
						var filteredGeoJson = sgs.exporter.filterFeatures(geoJson, selectedRs);
						var filename = exportLayer + "_simplify" + simplify;
						sgs.exporter.exportData(filteredGeoJson, filename);
						$('.timer').hide();
					},
					progress : progressReport
				});

			});
			$('.btn-clear').on('click', function() {
				for ( var key in landkreise) {
					if (landkreise[key].selected) {
						deselectLayer(landkreise[key]);
					}
				}
			});

			$('.chkbox-bdl input[type=checkbox]').on('click', function(element) {
				that.selectLayers(element.target.value, element.target.checked);
			});
			updateSelectionStatus();
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
				url : 'data/landkreise_sim200.geojson',
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
									deselectLayer(e.target);
								} else {
									selectLayer(e.target);
								}
							});

						}
					}).addTo(that.leafletMap);
					$('.ajax-loader').hide();
				},
				progress : progressReport
			});
		},
		selectLayers : function(rs, select) {
			var selectedLayers = [];
			for ( var key in landkreise) {
				if (key.indexOf(rs) == 0) {
					if (select) {
						selectLayer(landkreise[key]);
					} else {
						deselectLayer(landkreise[key]);
					}
				}
			}
			return selectedLayers;
		},
		getSelectedLayers : function() {
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

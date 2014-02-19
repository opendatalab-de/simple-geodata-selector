(function(sgs, L) {
	'use strict';

	function updateSelectionStatus() {
		var status = 0;
		for ( var key in landkreise) {
			if (landkreise[key].selected) {
				status++;
			}
		}
		$('#selectionStatus').html(status);

	}
	function selectLayer(layer) {
		layer.setStyle({
			color: "#ff0000"
		});
		layer.selected = true;
		updateSelectionStatus();
	}
	function deselectLayer(layer) {
		layer.setStyle({
			color: "#03f"
		});
		layer.selected = false;
		updateSelectionStatus();
	}
	function progressReport(event) {
		if (event.lengthComputable) {
			var percent = parseInt((event.loaded / event.total * 100), 10);
			sgs.timer.draw(percent);
		}
	}

	var layerControl = {
		control: null,
		colors: ['brown', 'red', 'black', 'green', 'purple', 'orange', 'grey'],
		count: 0,
		init: function(map) {
			this.control = L.control.layers(null, null, {
				position: 'bottomleft'
			});
			this.control.addTo(map);
		},
		addLayer: function(layer, name) {
			this.control.addOverlay(layer, name);
			this.count++;
		},
		getNextLayerStyle: function() {
			var color = this.colors[this.count % this.colors.length];
			return {
				'color': color,
				'fillColor': color,
				'weight': 1
			};
		}
	};

	var map = {
		leafletMap: null,
		info: null,
		init: function() {
			this.leafletMap = L.map('map', {
				center: [51.165691, 10.451526],
				zoom: 7,
				minZoom: 5,
				maxZoom: 12
			});

			this.createInfoControl();
			this.addFileLayerControl();
			layerControl.init(this.leafletMap);
			this.addTileLayer();
			this.addAreaLayers();

			var that = this;
			$('.btn-export').on('click', function() {

				var exportLayer = $('form.options select[name=exportLayer]').val();
				var simplify = $('form.options select[name=simplify]').val();
				var regenesisOptions = sgs.map.getRegenesisOptions();
				$('.timer').show();

				$.ajax({
					dataType: "json",
					url: 'data/' + exportLayer + '_sim' + simplify + '.geojson',
					success: function(geoJson) {
						var selectedRs = sgs.map.getSelectedLayers(exportLayer);
						var filteredGeoJson = sgs.exporter.filterFeatures(geoJson, selectedRs);
						sgs.regenesis.enrich(filteredGeoJson, regenesisOptions, function() {
							var filename = exportLayer + "_simplify" + simplify;
							sgs.exporter.exportData(filteredGeoJson, filename);
							$('.timer').hide();
						});
					},
					progress: progressReport
				});

			});
			$('.btn-clear').on('click', function() {
				for ( var key in landkreise) {
					if (landkreise[key].selected) {
						deselectLayer(landkreise[key]);
					}
					$('.chkbox-bdl input[type=checkbox]').each(function(index, element) {
						element.checked = false;
					});
				}
			});

			$('.chkbox-bdl input[type=checkbox]').on('click', function(element) {
				that.selectLayers(element.target.value, element.target.checked);
			});
			updateSelectionStatus();
		},
		addFileLayerControl: function() {
			var layerOptions = {
				fitBounds: true,
				style: $.proxy(layerControl.getNextLayerStyle, layerControl),
				onEachFeature: function(feature, layer) {
					layer.bindPopup(sgs.jsonToTable(feature.properties));
				}
			};

			L.Control.FileLayerLoad.LABEL = '<span class="glyphicon glyphicon-folder-open" style="font-size:15px;"></span>';
			var fileControl = new L.Control.fileLayerLoad({
				'layerOptions': layerOptions
			});
			this.leafletMap.addControl(fileControl);
			fileControl.loader.on('data:loaded', function(data) {
				layerControl.addLayer(data.layer, data.filename);
			});
		},
		createInfoControl: function() {
			this.info = L.control();

			this.info.onAdd = function(map) {
				this._div = L.DomUtil.create('div', 'info');
				this.update();
				return this._div;
			};

			this.info.update = function(props) {
				this._div.innerHTML = '<h4>Kreis</h4>' + (props ? '<b>' + props.GEN + ' (' + props.DES + ')</b><br>RS: ' + props.RS : 'Mit der Maus auswählen');
			};

			this.info.addTo(this.leafletMap);
		},
		addTileLayer: function() {
			var attribution = '© 2013 CloudMade – Map data <a href="http://creativecommons.org/licenses/by-sa/2.0/">CCBYSA</a> 2013 <a href="http://www.openstreetmap.org/">OpenStreetMap.org</a> contributors – <a href="http://cloudmade.com/terms_conditions">Terms of Use</a>';
			L.tileLayer('http://{s}.tile.cloudmade.com/036a729cf53d4388a8ec345e1543ef53/44094/256/{z}/{x}/{y}.png', {
				'maxZoom': 18,
				'attribution': attribution
			}).addTo(this.leafletMap);
		},
		addAreaLayers: function(geojson, callback) {
			$('.ajax-loader').show();
			var that = this;

			$.ajax({
				dataType: "json",
				url: 'data/landkreise_sim200.geojson',
				success: function(geojson) {
					var layer = L.geoJson(geojson.features, {
						style: {
							'opacity': 0.5,
							'weight': 1
						},
						onEachFeature: function(feature, layer) {
							landkreise[feature.properties.RS] = layer;
							layer['DES'] = feature.properties.DES;
							layer.on("click", function(e) {
								if (e.target.selected) {
									deselectLayer(e.target);
								} else {
									selectLayer(e.target);
								}
							});

							layer.on("mouseover", function(e) {
								that.info.update(feature.properties);
							});

							layer.on("mouseout", function(e) {
								that.info.update();
							});

						}
					});
					layer.addTo(that.leafletMap);
					layerControl.addLayer(layer, 'Kreise');
					$('.ajax-loader').hide();
				},
				progress: progressReport
			});
		},
		selectLayers: function(rs, select) {
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
		getSelectedLayers: function(exportLayer) {
			var selectedLayers = [];
			if (exportLayer == "bundeslaender") {
				$('.chkbox-bdl input[type=checkbox]').each(function(index, element) {
					if (element.checked)
						selectedLayers.push(element.value);
				});
			} else {

				for ( var key in landkreise) {
					if (landkreise[key].selected) {
						selectedLayers.push(key);
					}
				}
			}
			return selectedLayers;
		},
		getRegenesisOptions: function() {
			var options = {
				tables: []
			};
			$('.regenesis-table:checked').each(function(index, element) {
				options.tables.push($(element).val());
			});
			return options;
		}
	};

	sgs.map = map;
})(sgs, L);

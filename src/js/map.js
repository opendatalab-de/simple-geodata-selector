(function(sgs, L) {
	'use strict';
	var counties = [];

	function updateSelectionStatus() {
		var status = counties.filter(function(county) {
			return county.selected;
		}).length;
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
	function setupDownloadDialog(tables) {
		var progressBars = [{
			'id': 'dl-geojson',
			'name': 'Download der deutschlandweiten GeoJSON Datei'
		},{
			'id': 'dl-destatis',
			'name': 'Download der Destatis-Zahlen'
		}];
		tables.forEach(function(table) {
			progressBars.push({
				'id': 'dl-additional-data-' + table.code,
				'name': table.name,
				'table': table
			});
		});

		var html = '';
		var progressCallbacks = {};
		progressBars.forEach(function(progressBar) {
			var callback = function(event) {
				var percent = (event.lengthComputable) ? parseInt((event.loaded / event.total * 100), 10) : '100';
				$('.' + progressBar.id + ' .progress-bar').css('width', percent + '%').find('span').text(percent + '% complete');
			};
			progressCallbacks[progressBar.id] = callback;
			if (progressBar.table) {
				progressBar.table.progressCallback = callback;
			}

			html += '<div class="' + progressBar.id + '">';
			html += '<p>' + progressBar.name + '</p>';
			html += '<div class="progress progress-striped active"><div class="progress-bar" style="width: 0%">';
			html += '<span class="sr-only">0% complete</span>';
			html += '</div></div></div>';
		});
		$('.download-progress-box').html(html);

		return progressCallbacks;
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
			sgs.additionalDataDialog.initDialog();

			var that = this;
			$('.btn-export').on('click', function() {
				var exportLayer = $('form.options select[name=exportLayer]').val();
				var simplify = $('form.options select[name=simplify]').val();
				var clickThatHood = $('form input[name=clickthathood]').prop("checked");
				var selectedRs = sgs.map.getSelectedLayers(exportLayer);
				if (selectedRs.length < 1) {
					alert('Wähle zuerst per Klick auf die Karte Stadt- & Landkreise aus, für die Daten exportiert werden sollen.');
					return false;
				}
				var tables = sgs.additionalDataDialog.getSelectedTables();
				var progressCallbacks = setupDownloadDialog(tables);
				$('#downloadDialog').modal('show');

				$.ajax({
					dataType: "json",
					url: 'data/' + exportLayer + '_sim' + simplify + '.geojson',
					success: function(geoJson) {
						var filteredGeoJson = sgs.exporter.filterFeatures(geoJson, selectedRs, clickThatHood);
						sgs.destatis.enrich(filteredGeoJson, progressCallbacks['dl-destatis'], function() {
							var wikidataTable = tables.filter(function(table) {
								return table.source === 'wikidata';
							});
							sgs.wikidata.enrich(wikidataTable, filteredGeoJson, function() {
								var regenesisTables = tables.filter(function(table) {
									return table.source === 'regenesis';
								});
								sgs.regenesis.enrich(filteredGeoJson, regenesisTables, function() {
									var filename = exportLayer + "_simplify" + simplify;
									sgs.exporter.exportData(filteredGeoJson, filename);
									$('#downloadDialog').modal('hide');
								});
							});
						});
					},
					progress: progressCallbacks['dl-geojson']
				});
			});
			$('.btn-clear').on('click', function() {
				counties
					.filter(function(county) {
                        return county.selected;
                    })
					.forEach(function(county) {
						deselectLayer(county);
					});
				$('.chkbox-bdl input[type=checkbox]').each(function(index, element) {
					element.checked = false;
				});
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
				this._div.innerHTML = '<h4>Kreis</h4>' + (props ? '<b>' + props.GEN + ' (' + props.BEZ + ')</b><br>RS: ' + props.RS : 'Mit der Maus auswählen');
			};

			this.info.addTo(this.leafletMap);
		},
		addTileLayer: function() {
			var attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
			L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
				'maxZoom': 18,
				'attribution': attribution,
				'id': 'mapbox/light-v10',
				'tileSize': 512,
				'zoomOffset': -1,
				'accessToken': 'pk.eyJ1IjoiY29kZWZvcmhlaWxicm9ubiIsImEiOiJaVW1RaEhzIn0.dTT9PWOqjBbzpw7S--GnAA'
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
							counties.push(layer);
							layer['BEZ'] = feature.properties.BEZ;
                            layer['RS'] = feature.properties.ARS;
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
            counties
                .filter(function (county) {
                    return county.RS.indexOf(rs) === 0
                })
                .forEach(function (county) {
                    if (select) {
                        selectLayer(county);
                    } else {
                        deselectLayer(county);
                    }
                });
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
                counties
                    .filter(function(county) {
                        return county.selected;
                    })
                    .forEach(function(county) {
						selectedLayers.push(county.RS);
                    });
			}
			return selectedLayers;
		}
	};

	sgs.map = map;
})(sgs, L);

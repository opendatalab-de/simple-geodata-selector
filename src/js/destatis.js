'use strict';

(function (sgs, $) {
    var superiorLevelSumKeys = ['population', 'population_m', 'population_w'];
    var superiorLevelResultInitialValue = {};
    superiorLevelSumKeys.forEach(function (key) {
        superiorLevelResultInitialValue[key] = 0;
    });

    var enrichGeojson = function (geojson, destatisData) {
        geojson.features.forEach(function (feature) {
            if (feature.properties.RS.length > 5) {
                // commune
                feature.properties.destatis = destatisData[feature.properties.RS];
            }
            else {
                // administrative level above commune (county, state)
                feature.properties.destatis = Object.keys(destatisData)
                    .filter(function (key) {
                        return key.indexOf(feature.properties.RS) === 0;
                    })
                    .map(function (key) {
                        return destatisData[key];
                    })
                    .reduce(function (result, currentRow) {
                        superiorLevelSumKeys.forEach(function (key) {
                            result[key] += currentRow[key];
                        });
                        return result;
                    }, Object.assign({}, superiorLevelResultInitialValue));
            }
        });
    };

    var enrich = function (geojson, finalCallback) {
        $.ajax({
            dataType: 'json',
            url: 'data/destatis.json',
            success: function (data) {
                enrichGeojson(geojson, data);
                finalCallback();
            }
        });
    };

    sgs.destatis = {
        'enrich': enrich
    };
})(sgs, jQuery);
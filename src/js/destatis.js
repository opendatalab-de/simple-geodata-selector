'use strict';

(function(sgs, $) {
    var enrichGeojson = function(geojson, destatisData) {
        geojson.features.forEach(function(feature) {
            feature.properties.destatis = destatisData[feature.properties.RS];
        });
    };
    
    var enrich = function(geojson, finalCallback) {
        $.ajax({
            dataType: 'json',
            url: 'data/destatis.json',
            success: function(data) {
                enrichGeojson(geojson, data);
                finalCallback();
            }
        });
    };
    
    sgs.destatis = {
        'enrich': enrich
    };
})(sgs, jQuery);
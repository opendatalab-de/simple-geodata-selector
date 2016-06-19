'use strict';

(function (sgs) {
    var doRequest = function (callback) {
        var sparql_querry = 'PREFIX wikibase: <http://wikiba.se/ontology#>\nPREFIX wd: <http://www.wikidata.org/entity/>\nPREFIX wdt: <http://www.wikidata.org/prop/direct/>\n\nSELECT ?cid ?country ?AGS ?website WHERE {\n    ?cid wdt:P31 wd:Q262166 .\n    ?cid wdt:P439 ?AGS .\n    ?cid wdt:P856 ?website .\n    OPTIONAL {\n        ?cid rdfs:label ?country filter (lang(?country) = "de") .\n    }\n}';
        var url = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql?query=' + encodeURIComponent(sparql_querry);

        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.setRequestHeader('accept', 'application/sparql-results+json');

        request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                callback(null, JSON.parse(this.response));
            } else {
                callback(this.status, null);
            }
        };

        request.onerror = function (e) {
            callback(e, null);
        };

        request.send();
    };

    var enrich = function (table, geoJSON, finalCallback) {
        if (!table) {
            finalCallback();
            return true;
        }
        doRequest(function (err, responseData) {
            if (table.progressCallback) table.progressCallback({});
            if (err) {
                console.error("ERROR. Wikipedia Request was not succesful.", err);
                finalCallback();
                return false;
            }

            var wikidata = responseData.results.bindings.map(function (responseEntry) {
                var convertedEntry = {};
                Object.keys(responseEntry).forEach(function (key) {
                    convertedEntry[key] = responseEntry[key].value;
                });
                return convertedEntry;
            });

            geoJSON.features.forEach(function (feature) {
                feature.properties.wikipedia = wikidata.find(function (entry) {
                    return entry.AGS == feature.properties.RS.substr(0, 5) + feature.properties.RS.substr(9, 3);
                });
            });
            finalCallback();
        });
    };

    sgs.wikidata = {
        enrich: enrich
    }
})(sgs);
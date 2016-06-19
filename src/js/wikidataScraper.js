'use strict';

(function (sgs) {
    var doRequest = function (callback) {
        var sparql_query = 'SELECT ?cid ?name ?AGS ?_licence_plate_code ?_official_website ?_local_dialing_code ?_postal_code ?_image ?_head_of_government ?_time_of_earliest_written_record ?_Facebook_Places_ID WHERE {\n  ?cid wdt:P31 wd:Q262166.\n  ?cid wdt:P439 ?AGS.\n  OPTIONAL {\n    ?cid rdfs:label ?name.\n    FILTER((LANG(?name)) = "de")\n  }\n  OPTIONAL { ?cid wdt:P395 ?_licence_plate_code. }\n  OPTIONAL { ?cid wdt:P856 ?_official_website. }\n  OPTIONAL { ?cid wdt:P473 ?_local_dialing_code. }\n  OPTIONAL { ?cid wdt:P281 ?_postal_code. }\n  OPTIONAL { ?cid wdt:P18 ?_image. }\n  OPTIONAL { ?cid wdt:P6 ?_head_of_government. }\n  OPTIONAL { ?cid wdt:P1249 ?_time_of_earliest_written_record. }\n  OPTIONAL { ?cid wdt:P1997 ?_Facebook_Places_ID. }\n}';
        var url = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql?query=' + encodeURIComponent(sparql_query);

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
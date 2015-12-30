function SPARQLRequest(geoJSON, callback) {

   var sparql_querry = 'PREFIX wikibase: <http://wikiba.se/ontology#>\nPREFIX wd: <http://www.wikidata.org/entity/>\nPREFIX wdt: <http://www.wikidata.org/prop/direct/>\n\nSELECT ?cid ?country ?AGS ?website WHERE {\n    ?cid wdt:P31 wd:Q262166 .\n    ?cid wdt:P439 ?AGS .\n    ?cid wdt:P856 ?website .\n    OPTIONAL {\n        ?cid rdfs:label ?country filter (lang(?country) = "de") .\n    }\n}';
   var url = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql?query=' + encodeURIComponent(sparql_querry);

   var request = new XMLHttpRequest();
   request.open('GET', url, true);

   request.setRequestHeader('accept', 'application/sparql-results+json');

   request.onload = function () {
      if (this.status >= 200 && this.status < 400) {
         var tempWikidata = JSON.parse(this.response);

         var wikidata = [];

         tempWikidata.results.bindings.forEach(function (tempObj, i){
            wikidata.push(new Object());
            Object.keys(tempObj).forEach(function (key) {
               wikidata[i][key] = tempObj[key].value;
            });
         });

         geoJSON.features.forEach(function(feature) {

            var filtered = wikidata.find(function(entry) {
               return entry.AGS == feature.properties.RS.substr(0, 5) + feature.properties.RS.substr(9, 3);
            });

            feature.properties.wikipedia = filtered;
         });

      } else {
         console.log("ERROR. Wikipedia Request was not succesful. Please try it again later, and when the problem persists, contact the system Administrator");
      }
   };

   request.onerror = function () {
      console.log("ERROR. Wikipedia Request was not succesful. Please try it again later, and when the problem persists, contact the system Administrator");
   };

   request.send();

   callback();
}

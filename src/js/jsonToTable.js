(function(sgs) {
	'use strict';

	var jsonToTable = function(jsonObject) {
		var html = '<div class="property-list"><table class="table table-bordered"><tbody>';
		for ( var property in jsonObject) {
			var value = jsonObject[property];
			html += '<tr><th>' + property + '</th><td>' + value + '</td></tr>';
		}
		html += '</tbody></table></div>';
		return html;
	};

	sgs.jsonToTable = jsonToTable;
})(sgs);
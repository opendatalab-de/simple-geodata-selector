(function(sgs) {
	'use strict';

	var jsonToTable = function(jsonObject, nested) {
		var html = (nested) ? '' : '<div class="property-list">';
		html += '<table class="table table-bordered"><tbody>';
		for ( var property in jsonObject) {
			var value = jsonObject[property];
			if (!nested && typeof value == 'object') {
				value = jsonToTable(value, true);
			}
			html += '<tr><th>' + property + '</th><td>' + value + '</td></tr>';
		}
		html += '</tbody></table>';
		html += (nested) ? '' : '</div>';
		return html;
	};

	sgs.jsonToTable = jsonToTable;
})(sgs);
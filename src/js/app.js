var sgs = {};

var landkreise = {};

(function(sgs) {
	'use strict';

	sgs.init = function() {
		sgs.map.init();
		$('.toggle-tooltip').tooltip();
	};
})(sgs);

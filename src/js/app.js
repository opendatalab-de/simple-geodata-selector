var sgs = {};

(function(sgs) {
	'use strict';

	sgs.init = function() {
		sgs.map.init();
		sgs.timer.draw(50);
	};
})(sgs);

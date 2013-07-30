'use strict';

(function(sgs) {

	var timer = {
		draw: function(percent) {
			var html = '<div class="percent"></div><div id="slice"' + (percent > 50 ? ' class="gt50"' : '') + '><div class="pie"></div>'
					+ (percent > 50 ? '<div class="pie fill"></div>' : '') + '</div>';
			$('div.timer').html(html);
			var deg = 360 / 100 * percent;
			$('#slice .pie').css({
				'-moz-transform': 'rotate(' + deg + 'deg)',
				'-webkit-transform': 'rotate(' + deg + 'deg)',
				'-o-transform': 'rotate(' + deg + 'deg)',
				'transform': 'rotate(' + deg + 'deg)'
			});
			$('.percent').html(Math.round(percent) + '%');
		}
	};

	sgs.timer = timer;
})(sgs);
(function($) {
	var hasOnProgress = ("onprogress" in $.ajaxSettings.xhr());
	if (!hasOnProgress) {
		return;
	}

	var oldXHR = $.ajaxSettings.xhr;
	$.ajaxSettings.xhr = function() {
		var xhr = oldXHR();
		if (xhr instanceof XMLHttpRequest) {
			xhr.addEventListener('progress', this.progress, false);
		}
		if (xhr.upload) {
			xhr.upload.addEventListener('progress', this.progress, false);
		}
		return xhr;
	};
})(jQuery);
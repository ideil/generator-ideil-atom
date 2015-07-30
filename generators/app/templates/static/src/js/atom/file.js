(function ($, window, undefined) {
	function getFilename($upload) {
		var fullPath = $upload.val();

		if (fullPath) {
			var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
			var filename = fullPath.substring(startIndex);

			if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
				filename = filename.substring(1);
			}

			$upload.siblings('.js-file-name').text(filename);
		}
	}

	$('.js-file').on('change', function() {
		getFilename($(this));
	});
})(jQuery, window);

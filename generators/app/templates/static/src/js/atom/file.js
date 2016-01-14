//# Uploaded filename
//
//* Get title of uploaded file for use in custom `input[type="file"]`

(function ($, window, undefined) {
    'use strict';

    function getFilename($upload) {
        $('.js-file').on('change', function() {
            var fullPath = $upload.val();

            if (fullPath) {
                var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
                var filename = fullPath.substring(startIndex);

                if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                    filename = filename.substring(1);
                }

                $upload.siblings('.js-file-name').text(filename);
            }
        });
    }

    getFilename($('.js-file'));
})(jQuery, window);

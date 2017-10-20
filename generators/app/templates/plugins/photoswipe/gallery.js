/* global PhotoSwipe, PhotoSwipeUI_Default */
/* jshint maxlen: 150, camelcase: false */

'use strict';

var pswpOptions;

function photoswipe($gallery) {
    var $pswp = $('.pswp')[0];

    $gallery.each(function (index) {
        var $self = $(this),
            $links = $self.find('a'),
            length = $links.length,
            currIndex,
            uid = index + 1,
            // Create array of slides
            getItems = function () {
                var items = [];
                $links.each(function (index) {
                    var $this = $(this),
                        img = new Image();
                    img.onload = function () {
                        var item;
                        length--;
                        item = {
                            src: $this.attr('href'),
                            title: $this.attr('title'),
                            msrc: $this.find('img').attr('src'),
                            w: this.width,
                            h: this.height
                        };
                        items[index] = item;
                        if (length === 0) {
                            $gallery.removeClass('is-disable');
                            if (hashData.pid && hashData.gid === uid) {
                                openPhotoSwipe(hashData.pid, $items, true);
                            }
                        }
                    };
                    img.src = $this.attr('href');
                });
                return items;
            },
            $items = getItems(),
            // Get gallery and slide id from URL
            parseHash = function () {
                var hash = window.location.hash.substring(1),
                    params = {},
                    vars = hash.split('&'),
                    i,
                    pair;

                if (hash.length < 5) {
                    return params;
                }
                for (i = 0; i < vars.length; i++) {
                    if (!vars[i]) {
                        continue;
                    }
                    pair = vars[i].split('=');
                    if (pair.length < 2) {
                        continue;
                    }
                    params[pair[0]] = pair[1];
                }
                if (params.gid) {
                    params.gid = parseInt(params.gid, 10);
                }
                return params;
            },
            // Init Photoswipe
            openPhotoSwipe = function () {
                var pswp,
                    options = {
                        galleryUID: uid,
                        index: currIndex,
                        getThumbBoundsFn: pswpOptions.zoomAnimation ?
                            function (index) {
                                var thumbnail = $($links[index]).find('img')[0],
                                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                                    rect = thumbnail.getBoundingClientRect();
                                return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
                            } : false
                    };
                $.extend(options, pswpOptions);
                pswp = new PhotoSwipe($pswp, PhotoSwipeUI_Default, $items, options);
                pswp.init();
            },
            hashData = parseHash();

        // Open Photoswipe on click
        $links.on('click', function (event) {
            var $target = $(this)[0],
                isDisable = $(this).closest('.js-pswp').hasClass('is-disable');
            event.preventDefault();
            $.each($links, function (index, elem) {
                if ($target === elem) {
                    currIndex = index;
                    return false;
                }
            });
            if (!isDisable) {
                openPhotoSwipe(currIndex, $items);
            }
        });
    }).addClass('is-disable');
}

//## Options
// http://photoswipe.com/documentation/options.html
//*
pswpOptions = {
    // Buttons/elements
    closeEl: true,
    captionEl: true,
    fullscreenEl: true,
    zoomEl: true,
    shareEl: false,
    counterEl: true,
    arrowEl: true,
    preloaderEl: true,
    // Tap on sliding area should close gallery
    tapToClose: false,
    // Tap should toggle visibility of controls
    tapToToggleControls: true,
    // Mouse click on image should close the gallery,
    // only when image is smaller than size of the viewport
    clickToCloseNonZoomable: true,
    indexIndicatorSep: ' / ',
    // Share buttons
    // Available variables for URL:
    // {{url}}             - url to current page
    // {{text}}            - title
    // {{image_url}}       - encoded image url
    // {{raw_image_url}}   - raw image url
    shareButtons: [
        {
            id: 'facebook',
            label: 'Share on Facebook',
            url: 'https://www.facebook.com/sharer/sharer.php?u={{url}}'
        },
        {
            id: 'twitter',
            label: 'Tweet',
            url: 'https://twitter.com/intent/tweet?text={{text}}&url={{url}}'
        },
        {
            id: 'pinterest',
            label: 'Pin it',
            url: 'http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}'
        },
        {
            id: 'download',
            label: 'Download image',
            url: '{{raw_image_url}}',
            download: true
        }
    ],
    zoomAnimation: true
};

//## Initialize
//
//*
photoswipe($('.js-pswp'));

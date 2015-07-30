// /*global */
// /*jshint devel:true */

(function ($, window, undefined) {
	// console.log('Hi world!');

	var initCarousel = function ($carousel) {
		$carousel.slick({
			prevArrow: '<button class="c-btn-prev"><span class="icon"></span></button>',
			nextArrow: '<button class="c-btn-next"><span class="icon"></span></button>',
			slidesToShow: 3,
			slidesToScroll: 3

			// dots: true,
			// arrows: false,
			// autoplay: true,
			// autoplaySpeed: 2000,
			// centerMode: true,
			// variableWidth: true,
			// infinite: false,
		});
	};

	// Initialize
	initCarousel($('.js-carousel-triple'));
})(jQuery, window);

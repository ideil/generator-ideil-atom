//# Carousel
//
//*

'use strict';

function initCarousel($carousel, initialSlide) {
    initialSlide = initialSlide ? initialSlide : 0;

    $carousel.slick({
        prevArrow: '<button class="c-btn-prev"><span class="i-icon i-arrow-ltr"></span></button>',
        nextArrow: '<button class="c-btn-next"><span class="i-icon i-arrow-ltr"></span></button>',
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: initialSlide

        // dots: true,
        // arrows: false,
        // autoplay: true,
        // autoplaySpeed: 2000,
        // centerMode: true,
        // variableWidth: true,
        // infinite: false,
        // pauseOnFocus: true,
        // pauseOnHover: true,
    });
}


//## Initialize
//
//*

$('.js-carousel').each(function () {
    var $self = $(this);

    initCarousel($self);
});

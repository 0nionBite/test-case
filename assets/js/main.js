import $ from 'jquery';
import '../css/style.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.min.js';

$(document).ready(function(){
    $('.slider').slick({
        dots: true,
        speed: 500,
        autoplay: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        waitForAnimate: false,
    });

    $('.products').slick({
        dots: false,
        infinite: true,
        speed: 500,
        autoplay: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        waitForAnimate: false,
        touchMove: false,
        arrows: true,
    });
})
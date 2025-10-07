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
        speed: 500,
        autoplay: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        waitForAnimate: false,
        responsive: [
          {
            breakpoint: 500,
            settings: {
              slidesToShow: 1,
              arrows: false,
            }
          }
        ]
    });

    const addToCartButtons = document.querySelectorAll('.purchase');

    const counterElement = document.querySelector('.cart-count');

  let cart = JSON.parse(localStorage.getItem('cart')) || {};

  Object.keys(cart).forEach(productId => {
    const count = cart[productId];
    if (count > 0) {
      counterElement.textContent = parseInt(counterElement.textContent) + count;

      const button = document.querySelector(`.purchase[data-id="${productId}"]`);
      if (button) {
        button.textContent = 'В КОРЗИНЕ';
        button.classList.add('in-cart');
      }
    }
  });

  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-id');

      if (button.classList.contains('in-cart')) {
        cart[productId] = (cart[productId] || 0) - 1;
        button.textContent = 'В КОРЗИНУ';
        button.classList.remove('in-cart');
      } else {
        cart[productId] = (cart[productId] || 0) + 1;
        button.textContent = 'В КОРЗИНЕ';
        button.classList.add('in-cart');
      }

      const total = Object.values(cart).reduce((sum, count) => sum + count, 0);
      counterElement.textContent = total;

      localStorage.setItem('cart', JSON.stringify(cart));
    });

      button.addEventListener('mouseenter', () => {
    if (button.classList.contains('in-cart')) {
      button.dataset.originalText = button.textContent;
      button.textContent = 'Убрать из корзины';
    }
  });

  button.addEventListener('mouseleave', () => {
    if (button.classList.contains('in-cart') && button.dataset.originalText) {
      button.textContent = button.dataset.originalText;
    }
  });
  });
});


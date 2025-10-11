import '../css/style.scss';

document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('.purchase');
  const counterElement = document.querySelector('.cart-count');

  let cart = JSON.parse(localStorage.getItem('cart')) || {};

  Object.keys(cart).forEach(productId => {
    const count = cart[productId];
    if (count > 0) {
      const total = Object.values(cart).reduce((sum, c) => sum + c, 0);
      counterElement.textContent = total;

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
        if (cart[productId] <= 0) delete cart[productId];
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

  const headerSlider = document.querySelector('.slider');
  if (headerSlider) {
    const slides = Array.from(headerSlider.querySelectorAll('.slide'));
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slider-dots';
    headerSlider.appendChild(dotsContainer);

    let currentSlide = 0;
    const totalSlides = slides.length;

    // Создание точек
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot';
      dot.setAttribute('aria-label', `Перейти к слайду ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');
    updateDots();

    function goToSlide(index) {
      currentSlide = index;
      const offset = -currentSlide * 100;
      headerSlider.style.setProperty('--slide-offset', `${offset}%`);
      updateDots();
    }

    function updateDots() {
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      goToSlide(currentSlide);
    }

    let slideInterval = setInterval(nextSlide, 4000);

    headerSlider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    headerSlider.addEventListener('mouseleave', () => {
      slideInterval = setInterval(nextSlide, 4000);
    });

    const style = document.createElement('style');
    style.textContent = `
      .slider {
        display: flex;
        overflow: hidden;
        position: relative;
        width: 100%;
      }
      .slide {
        min-width: 100%;
        flex-shrink: 0;
        transition: transform 0.5s ease-in-out;
      }
      .slider-dots {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 8px;
      }
      .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #ccc;
        border: none;
        cursor: pointer;
      }
      .dot.active {
        background: #333;
      }
    `;
    document.head.appendChild(style);

    headerSlider.style.setProperty('--slide-offset', '0%');
    headerSlider.style.position = 'relative';
    headerSlider.style.setProperty('display', 'block');
    slides.forEach(slide => {
      slide.style.transform = 'translateX(var(--slide-offset))';
    });
  }

const productsSlider = document.querySelector('.products');
if (productsSlider) {
  const originalCards = Array.from(productsSlider.querySelectorAll('.card'));
  if (originalCards.length === 0) return;

  const clonesStart = originalCards.map(card => card.cloneNode(true));
  const clonesEnd = originalCards.map(card => card.cloneNode(true));

  const wrapper = document.createElement('div');
  wrapper.className = 'products-wrapper';
  productsSlider.innerHTML = '';
  wrapper.append(...clonesStart, ...originalCards, ...clonesEnd);
  productsSlider.appendChild(wrapper);

  const allCards = Array.from(wrapper.querySelectorAll('.card'));
  const totalOriginal = originalCards.length;
  let currentIndex = totalOriginal;
  let isTransitioning = false;
  let autoInterval;

  function getSlidesToShow() {
    return window.innerWidth < 500 ? 1 : 4;
  }

  function updateSlider() {
    const slidesToShow = getSlidesToShow();
    const card = allCards[0];
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const gap = parseInt(getComputedStyle(wrapper).gap) || 20;
    const totalVisibleWidth = slidesToShow * cardWidth + (slidesToShow - 1) * gap;

    wrapper.style.transform = `translateX(${-currentIndex * totalVisibleWidth / slidesToShow}px)`;
  }

  function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;

    const slidesToShow = getSlidesToShow();
    currentIndex += slidesToShow;

    wrapper.style.transition = 'transform 0.5s ease-in-out';
    updateSlider();

    setTimeout(() => {
      const maxSafeIndex = totalOriginal * 2;
      if (currentIndex >= maxSafeIndex) {
        currentIndex = totalOriginal;
        wrapper.style.transition = 'none';
        updateSlider();
        setTimeout(() => {
          wrapper.style.transition = 'transform 0.5s ease-in-out';
          isTransitioning = false;
        }, 50);
      } else {
        isTransitioning = false;
      }
    }, 500);
  }

  updateSlider();

  autoInterval = setInterval(nextSlide, 3000);

  productsSlider.addEventListener('mouseenter', () => clearInterval(autoInterval));
  productsSlider.addEventListener('mouseleave', () => {
    autoInterval = setInterval(nextSlide, 3000);
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateSlider();
    }, 250);
  });
}
});
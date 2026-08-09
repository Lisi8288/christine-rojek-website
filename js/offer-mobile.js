document.addEventListener('DOMContentLoaded', function () {
  var carousel = document.querySelector('.offer-mobile');
  if (!carousel) return;

  var cards = Array.prototype.slice.call(carousel.querySelectorAll('.offer-mobile__card'));
  var prevBtn = carousel.querySelector('.offer-mobile__btn--prev');
  var nextBtn = carousel.querySelector('.offer-mobile__btn--next');
  var indicator = carousel.querySelector('.offer-mobile__current');
  var current = 0;

  function render() {
    cards.forEach(function (card, i) {
      card.classList.toggle('is-active', i === current);
    });
    if (indicator) indicator.textContent = current + 1;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === cards.length - 1;
  }

  prevBtn.addEventListener('click', function () {
    if (current > 0) { current--; render(); }
  });
  nextBtn.addEventListener('click', function () {
    if (current < cards.length - 1) { current++; render(); }
  });

  var touchStartX = null;
  carousel.querySelector('.offer-mobile__stage').addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  carousel.querySelector('.offer-mobile__stage').addEventListener('touchend', function (e) {
    if (touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      if (dx < 0 && current < cards.length - 1) { current++; render(); }
      if (dx > 0 && current > 0) { current--; render(); }
    }
    touchStartX = null;
  }, { passive: true });

  render();
});

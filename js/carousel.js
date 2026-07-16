document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.offer-carousel').forEach(function (carousel) {
    var track = carousel.querySelector('.offer-carousel__track');
    var slides = Array.prototype.slice.call(track.children);
    var dotsWrap = carousel.querySelector('.offer-carousel__dots');
    var btns = carousel.querySelectorAll('.offer-carousel__btn');

    function goTo(i) {
      track.scrollTo({ left: slides[i].offsetLeft, behavior: 'smooth' });
    }

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'offer-carousel__dot';
      dot.setAttribute('aria-label', 'Angebot ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function currentIndex() {
      var trackCenter = track.scrollLeft + track.clientWidth / 2;
      var closest = 0;
      var closestDist = Infinity;
      slides.forEach(function (slide, i) {
        var dist = Math.abs((slide.offsetLeft + slide.offsetWidth / 2) - trackCenter);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      return closest;
    }

    function updateDots() {
      var idx = currentIndex();
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === idx);
      });
    }

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dir = parseInt(btn.getAttribute('data-dir'), 10);
        var next = Math.min(slides.length - 1, Math.max(0, currentIndex() + dir));
        goTo(next);
      });
    });

    track.addEventListener('scroll', function () {
      clearTimeout(track._scrollTimer);
      track._scrollTimer = setTimeout(updateDots, 80);
    });

    updateDots();
  });
});

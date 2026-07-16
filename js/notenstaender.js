document.addEventListener('DOMContentLoaded', function () {
  var stage = document.querySelector('.notenstaender__stage');
  if (!stage) return;
  var bg = stage.querySelector('.notenstaender__bg');

  var leftLeaves = Array.prototype.slice.call(stage.querySelectorAll('.notenstaender__page--left .notenstaender__leaf'));
  var rightLeaves = Array.prototype.slice.call(stage.querySelectorAll('.notenstaender__page--right .notenstaender__leaf'));
  var total = leftLeaves.length;
  var current = 0;
  var mobileRight = false; // on mobile: false = showing left page of spread, true = showing right page
  var indicatorWrap = document.querySelector('.notenstaender__page-indicator');
  var indicator = document.querySelector('.notenstaender__page-current');
  var btns = document.querySelectorAll('.notenstaender__side-btn');
  var mq = window.matchMedia('(max-width: 767px)');

  function flashTurn(leaf) {
    leaf.classList.add('is-turning');
    window.setTimeout(function () { leaf.classList.remove('is-turning'); }, 900);
  }

  function applyZone(leaves, newCurrent, prevCurrent) {
    leaves.forEach(function (leaf, i) {
      leaf.classList.toggle('is-flipped', i < newCurrent);
      var wasActive = i === prevCurrent;
      var isActive = i === newCurrent;
      leaf.classList.toggle('is-active', isActive);
      if ((wasActive && !isActive) || (isActive && !wasActive)) {
        flashTurn(leaf);
      }
    });
  }

  function render(prevCurrent) {
    applyZone(leftLeaves, current, prevCurrent === undefined ? current : prevCurrent);
    applyZone(rightLeaves, current, prevCurrent === undefined ? current : prevCurrent);
    if (indicator) indicator.textContent = current + 1;
    var showRight = mq.matches && mobileRight;
    stage.classList.toggle('is-right', showRight);
    if (bg && mq.matches) {
      bg.style.objectPosition = showRight ? '86% 50%' : '22% 50%';
    } else if (bg) {
      bg.style.objectPosition = '';
    }
    btns.forEach(function (btn) {
      var dir = parseInt(btn.getAttribute('data-dir'), 10);
      var disabled;
      if (mq.matches) {
        disabled = (dir < 0 && current === 0 && !mobileRight) || (dir > 0 && current === total - 1 && mobileRight);
      } else {
        disabled = (dir < 0 && current === 0) || (dir > 0 && current === total - 1);
      }
      btn.disabled = disabled;
      btn.style.opacity = disabled ? '0.35' : '1';
      btn.style.cursor = disabled ? 'default' : 'pointer';
    });
  }

  function next() {
    if (mq.matches) {
      if (!mobileRight) { mobileRight = true; render(current); return; }
      if (current < total - 1) { var prev = current; current++; mobileRight = false; render(prev); }
      return;
    }
    if (current < total - 1) { var p = current; current++; render(p); }
  }

  function prev() {
    if (mq.matches) {
      if (mobileRight) { mobileRight = false; render(current); return; }
      if (current > 0) { var nx = current; current--; mobileRight = true; render(nx); }
      return;
    }
    if (current > 0) { var p2 = current; current--; render(p2); }
  }

  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dir = parseInt(btn.getAttribute('data-dir'), 10);
      btn.classList.remove('is-swinging');
      void btn.offsetWidth;
      btn.classList.add('is-swinging');
      if (dir > 0) next(); else prev();
    });
  });

  stage.setAttribute('tabindex', '0');
  stage.setAttribute('role', 'group');
  stage.setAttribute('aria-label', 'Angebot-Buch, mit Pfeiltasten blättern');
  stage.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  });

  var touchStartX = null;
  stage.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { if (dx < 0) next(); else prev(); }
    touchStartX = null;
  }, { passive: true });

  if (indicatorWrap) indicatorWrap.setAttribute('aria-live', 'polite');

  render(0);
});

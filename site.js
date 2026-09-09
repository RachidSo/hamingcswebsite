// Hamingcs — shared behavior: nav scroll state, tab groups, scroll reveal.

document.addEventListener('DOMContentLoaded', function () {
  var nav = document.querySelector('.site-nav');
  var progress = document.querySelector('.progress');
  var progressBar = document.querySelector('[data-progress]');
  var progressHead = document.querySelector('[data-progress-head]');

  if (nav || progress) {
    var onScroll = function () {
      var y = window.scrollY || window.pageYOffset;
      if (nav) nav.classList.toggle('is-scrolled', y > 8);

      if (progressBar || progressHead) {
        var docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        var p = Math.min(1, Math.max(0, y / docH));
        if (progressBar) progressBar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
        if (progressHead) progressHead.style.transform = 'translateX(' + (p * window.innerWidth).toFixed(1) + 'px)';
        if (progress) progress.classList.toggle('is-on', y > 8);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    var closeNav = function () {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeNav();
    });
  }

  document.querySelectorAll('[data-tabs]').forEach(function (group) {
    var target = group.getAttribute('data-tabs');
    var buttons = group.querySelectorAll('button');
    var panels = document.querySelectorAll('[data-tabset="' + target + '"] [data-tabpanel]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-tab');
        buttons.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
        panels.forEach(function (p) {
          p.classList.toggle('is-active', p.getAttribute('data-tabpanel') === key);
        });
      });
    });
  });

  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }
});

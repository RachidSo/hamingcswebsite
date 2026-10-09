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
    var syncAria = function () {
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', b.classList.contains('is-active') ? 'true' : 'false'); });
    };
    buttons.forEach(function (btn) {
      var panel = document.querySelector('[data-tabset="' + target + '"] [data-tabpanel="' + btn.getAttribute('data-tab') + '"]');
      if (panel) {
        if (!panel.id) panel.id = target + '-panel-' + btn.getAttribute('data-tab');
        btn.setAttribute('aria-controls', panel.id);
      }
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-tab');
        buttons.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
        panels.forEach(function (p) {
          p.classList.toggle('is-active', p.getAttribute('data-tabpanel') === key);
        });
        syncAria();
      });
    });
    syncAria();
  });

  // Founder interview reuses the FAQ tabs. Without JavaScript every category and answer is shown;
  // with it, one category at a time and only its first question open.
  document.querySelectorAll('.interview-grid').forEach(function (grid) {
    grid.querySelectorAll('.faq-set').forEach(function (set) {
      set.querySelectorAll('details').forEach(function (d, i) { d.open = i === 0; });
    });
    grid.classList.add('is-enhanced');
  });

  // Click to enlarge: every screenshot in #qa-cloud opens in a modal dialog (Esc or Close to dismiss, focus returns to the
  // thumbnail). Without JavaScript the link opens the full-size image in a new tab.
  var lightbox = document.querySelector('.lightbox');
  if (lightbox && typeof lightbox.showModal === 'function') {
    var lbImg = lightbox.querySelector('img');
    var lbCap = lightbox.querySelector('.lightbox__cap');
    var lbTrigger = null;
    document.querySelectorAll('[data-lightbox]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        lbTrigger = link;
        var thumb = link.querySelector('img');
        var figure = link.closest('figure');
        var cap = figure ? figure.querySelector('figcaption') : null;
        lbImg.src = link.getAttribute('href');
        lbImg.alt = thumb ? thumb.alt : '';
        lbCap.textContent = cap ? cap.textContent : '';
        lightbox.showModal();
      });
    });
    lightbox.querySelector('.lightbox__close').addEventListener('click', function () { lightbox.close(); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) lightbox.close(); });
    lightbox.addEventListener('close', function () {
      lbImg.removeAttribute('src');
      if (lbTrigger) lbTrigger.focus();
    });
  }

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

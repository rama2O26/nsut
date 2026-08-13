
  // Dynamically size the fixed top-banner + nav stack, so nav never
  // overlaps the banner regardless of how the university name wraps
  // on a given screen width (fixes the mobile overlap bug).
  (function () {
    const banner = document.querySelector('.top-banner');
    const nav = document.querySelector('header.site-nav');
    const navLinks = document.querySelector('nav.links');
    const hero = document.querySelector('.hero');
    if (!banner || !nav) return;

    function isMobile() { return window.innerWidth <= 860; }

    function apply() {
      const bannerH = banner.offsetHeight;
      const announcement = document.querySelector('.announcement-banner');
      const announcementH = announcement ? announcement.offsetHeight : 0;
      const navTop = bannerH + announcementH;

      // On the homepage the announcement strip sits between the university
      // banner and the navigation. Keep all three fixed layers in the stack
      // so the announcement can never cover the navigation.
      if (announcement) announcement.style.top = bannerH + 'px';
      nav.style.top = navTop + 'px';

      const navH = nav.offsetHeight;
      const totalH = bannerH + announcementH + navH;

      document.documentElement.style.setProperty('--fixed-bars-h', totalH + 'px');

      if (hero) {
        const extra = isMobile() ? 40 : 60;
        hero.style.paddingTop = (totalH + extra) + 'px';
      }
      if (navLinks) {
        if (isMobile()) {
          navLinks.style.top = navH + 'px';
          navLinks.style.height = 'calc(100vh - ' + totalH + 'px)';
        } else {
          navLinks.style.top = '';
          navLinks.style.height = '';
        }
      }

      document.querySelectorAll('section[id]').forEach(function (s) {
        s.style.scrollMarginTop = (totalH + 14) + 'px';
      });
    }

    apply();
    window.addEventListener('resize', apply);
    window.addEventListener('orientationchange', function () {
      setTimeout(apply, 150);
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(apply);
    }
    // Safety re-check shortly after load in case webfonts/images shift layout
    window.addEventListener('load', function () { setTimeout(apply, 200); });
  })();



  // Hero background — floating mathematical symbols
  (function () {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const ctx = canvas.getContext('2d');
    const hero = canvas.closest('.hero');
    let w, h, symbols, dpr;

    const GLYPHS = ['∫', '∑', 'π', '∞', '√', 'Δ', 'θ', 'λ', '∂', '≈', '±', '∇', 'Ω', '∮'];
    const COLORS = ['230,201,131', '212,185,106']; // bright gold, brass-light

    function glyphCount() {
      const area = w * h;
      return Math.min(34, Math.max(16, Math.round(area / 42000)));
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.offsetWidth;
      h = hero.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = glyphCount();
      symbols = Array.from({ length: count }, spawn);
    }

    function spawn() {
      return {
        char: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 22 + 16,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        rotation: (Math.random() - 0.5) * 0.6,
        rotSpeed: (Math.random() - 0.5) * 0.006,
        opacity: Math.random() * 0.32 + 0.28,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      };
    }

    function step() {
      ctx.clearRect(0, 0, w, h);

      for (const s of symbols) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0 || s.x > w) s.vx *= -1;
        if (s.y < 0 || s.y > h) s.vy *= -1;
        s.x = Math.max(0, Math.min(w, s.x));
        s.y = Math.max(0, Math.min(h, s.y));
        s.rotation += s.rotSpeed;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.font = `italic 300 ${s.size}px 'Fraunces', Georgia, serif`;
        ctx.fillStyle = `rgba(${s.color},${s.opacity})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(s.char, 0, 0);
        ctx.restore();
      }

      requestAnimationFrame(step);
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    resize();
    requestAnimationFrame(step);
  })();

  // Shared multi-page navigation: active state + Visit Info dropdown
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const currentFile = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const pageMap = {
    'index.html': 'home',
    'committee.html': 'committee',
    'speakers.html': 'speakers',
    'awards.html': 'awards',
    'schedule.html': 'schedule',
    'abstract-submission.html': 'abstract',
    'register.html': 'register',
    'venue.html': 'venue',
    'attractions.html': 'sightseeing',
    'contact.html': 'contact'
  };
  const currentPage = pageMap[currentFile] || 'home';
  if (navLinks) {
    navLinks.querySelectorAll('a[data-page]').forEach(a => {
      if (a.dataset.page === currentPage) a.classList.add('is-active');
    });
    const visitGroup = navLinks.querySelector('.nav-dropdown[data-page-group="visit"]');
    if (visitGroup && (currentPage === 'venue' || currentPage === 'sightseeing')) visitGroup.classList.add('is-active');

    const dropdownToggle = navLinks.querySelector('.nav-dropdown-toggle');
    const dropdown = navLinks.querySelector('.nav-dropdown');
    if (dropdownToggle && dropdown) {
      dropdownToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = dropdown.classList.toggle('is-open');
        dropdownToggle.setAttribute('aria-expanded', String(open));
      });
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('is-open');
          dropdownToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  // Nearby attractions accordion
  document.querySelectorAll('.attraction-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.attraction-card');
      const isOpen = card.classList.contains('open');
      card.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Schedule day tabs
  const tabs = document.querySelectorAll('.day-tab');
  const panels = document.querySelectorAll('.day-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector('.day-panel[data-day="' + tab.dataset.day + '"]').classList.add('active');
    });
  });

  // Nav background on scroll
  const siteNav = document.querySelector('.site-nav');
  const onScroll = () => {
    if (window.scrollY > 40) siteNav.classList.add('scrolled');
    else siteNav.classList.remove('scrolled');
  };
  if (siteNav) {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Scroll-reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // Live countdown to conference start — Dec 24, 2026, 09:00 local
  const countdownTarget = new Date('2026-12-24T09:00:00');
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');
  function pad(n){ return String(n).padStart(2, '0'); }
  function updateCountdown(){
    if (!cdDays || !cdHours || !cdMins || !cdSecs) return;
    const diff = countdownTarget - new Date();
    if (diff <= 0){
      cdDays.textContent = cdHours.textContent = cdMins.textContent = cdSecs.textContent = '00';
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    cdDays.textContent = pad(days);
    cdHours.textContent = pad(hours);
    cdMins.textContent = pad(mins);
    cdSecs.textContent = pad(secs);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

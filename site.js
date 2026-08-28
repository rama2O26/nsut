
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
          navLinks.style.setProperty('--mobile-nav-panel-top', navTop + 'px');
          navLinks.style.top = navTop + 'px';
          navLinks.style.height = 'calc(100vh - ' + navTop + 'px)';
        } else {
          navLinks.style.removeProperty('--mobile-nav-panel-top');
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



  // Hero background — animated mathematical network
  (function () {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const hero = canvas.closest('.hero');
    if (!hero) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, nodes = [], dpr = 1;
    let resizeTimer;

    const NODE_COUNT_DESKTOP = 48;
    const NODE_COUNT_MOBILE = 26;
    const MAX_LINK_DISTANCE = 165;
    const NODE_COLOR = '230,201,131';
    const LINE_COLOR = '212,185,106';

    function nodeCount() {
      return window.innerWidth <= 860 ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;
    }

    function spawnNode() {
      const speed = window.innerWidth <= 860 ? 0.21 : 0.29;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        radius: Math.random() * 1.5 + 1.1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.012 + Math.random() * 0.016
      };
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.offsetWidth;
      h = hero.offsetHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = Array.from({ length: nodeCount() }, spawnNode);
    }

    function drawNetwork(animate) {
      ctx.clearRect(0, 0, w, h);

      // Very subtle depth haze behind the network.
      const glow = ctx.createRadialGradient(w * 0.55, h * 0.42, 0, w * 0.55, h * 0.42, Math.max(w, h) * 0.65);
      glow.addColorStop(0, 'rgba(196,150,58,0.095)');
      glow.addColorStop(1, 'rgba(176,141,69,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      for (const n of nodes) {
        if (animate) {
          n.x += n.vx;
          n.y += n.vy;
          n.pulse += n.pulseSpeed;

          if (n.x < -20 || n.x > w + 20) n.vx *= -1;
          if (n.y < -20 || n.y > h + 20) n.vy *= -1;
          n.x = Math.max(-20, Math.min(w + 20, n.x));
          n.y = Math.max(-20, Math.min(h + 20, n.y));
        }
      }

      // Draw connections first so nodes remain crisp on top.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);

          if (dist < MAX_LINK_DISTANCE) {
            const strength = 1 - dist / MAX_LINK_DISTANCE;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${LINE_COLOR},${0.035 + strength * 0.13})`;
            ctx.lineWidth = 0.65 + strength * 0.45;
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        const pulse = 1 + Math.sin(n.pulse) * 0.16;
        const r = n.radius * pulse;

        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 2.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${NODE_COLOR},0.085)`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${NODE_COLOR},${0.42 + pulse * 0.16})`;
        ctx.fill();
      }
    }

    function step() {
      drawNetwork(true);
      requestAnimationFrame(step);
    }

    resize();

    // For reduced-motion users, show a calm static network rather than hiding it.
    if (reduceMotion) {
      drawNetwork(false);
      return;
    }

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });
    window.addEventListener('orientationchange', () => setTimeout(resize, 150));

    requestAnimationFrame(step);
  })();

  // Shared multi-page navigation: active state + Visit Info dropdown
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const siteNav = document.querySelector('header.site-nav');
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
    function setMenu(open) {
      navLinks.classList.toggle('open', open);
      document.body.classList.toggle('nav-open', open);
      if (siteNav) siteNav.classList.toggle('mobile-menu-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      if (!open) {
        const visit = navLinks.querySelector('.nav-dropdown');
        const toggle = navLinks.querySelector('.nav-dropdown-toggle');
        if (visit) visit.classList.remove('is-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    }
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    window.addEventListener('resize', () => { if (window.innerWidth > 860) setMenu(false); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') setMenu(false);
    });
  }

  // Back-to-top button appears after a short scroll and returns smoothly to the top.
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    const updateBackToTop = () => backToTop.classList.toggle('visible', window.scrollY > 420);
    updateBackToTop();
    window.addEventListener('scroll', updateBackToTop, {passive:true});
    backToTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
  }

  // Nearby attractions accordion
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
  const navHeader = document.querySelector('.site-nav');
  const onScroll = () => {
    if (window.scrollY > 40) navHeader.classList.add('scrolled');
    else navHeader.classList.remove('scrolled');
  };
  if (navHeader) {
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
    }, { threshold: 0.1, rootMargin: '0px 0px 900px 0px' });
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

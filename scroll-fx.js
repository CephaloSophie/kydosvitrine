// Scroll-triggered reveal animations
(function() {
  const observers = [];
  function initScrollFx() {
    const els = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.revealDelay || '0');
          setTimeout(() => el.classList.add('revealed'), delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => observer.observe(el));
    observers.push(observer);
  }
  // Parallax on scroll
  function initParallax() {
    const els = document.querySelectorAll('[data-parallax]');
    if (!els.length) return;
    function tick() {
      const scrollY = window.scrollY;
      els.forEach(el => {
        const speed = parseFloat(el.dataset.parallax || '0.3');
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + scrollY - window.innerHeight / 2) * speed;
        el.style.transform = `translateY(${-offset}px)`;
      });
      requestAnimationFrame(tick);
    }
    tick();
  }
  // Counter animation
  function animateCounters() {
    const counters = document.querySelectorAll('[data-count-to]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.countTo);
        const suffix = el.dataset.countSuffix || '';
        const duration = 1500;
        const start = Date.now();
        function step() {
          const progress = Math.min((Date.now() - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(target * eased) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        step();
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => observer.observe(el));
  }
  document.addEventListener('DOMContentLoaded', () => {
    initScrollFx();
    initParallax();
    animateCounters();
  });
  window.initScrollFx = initScrollFx;
})();

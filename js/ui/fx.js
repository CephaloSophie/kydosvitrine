/* Effets partagés : fond d'enseignes flottantes, apparitions au défilement,
 * compteurs animés. Tout se met en pause hors écran / onglet caché. */
import { reducedMotion } from '../dom.js';

/* ---------- Fond : enseignes qui dérivent lentement ---------- */
export function startBackground() {
  const canvas = document.createElement('canvas');
  canvas.className = 'bgfx';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  const glyphs = ['♠', '♥', '♦', '♣', '◆'];
  const colors = ['#22E1FF', '#FF3EA5', '#FFD23F', '#C77DFF', '#3DFFA2', '#8EA2FF'];
  let w = 0; let hgt = 0; let parts = []; let raf = 0; let last = 0; let scrollY = window.scrollY;

  function resize() {
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    w = window.innerWidth; hgt = window.innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(hgt * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(36, Math.max(14, (w * hgt) / 42000)));
    parts = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * hgt,
      z: 0.25 + Math.random() * 0.9,
      g: glyphs[(Math.random() * glyphs.length) | 0],
      c: colors[(Math.random() * colors.length) | 0],
      r: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.004,
      a: 0.05 + Math.random() * 0.1
    }));
    draw(0);
  }

  function draw(dt) {
    ctx.clearRect(0, 0, w, hgt);
    const sy = window.scrollY;
    const dScroll = sy - scrollY;
    scrollY = sy;
    for (const p of parts) {
      p.y -= (dt * 0.012 + dScroll * 0.15) * p.z;
      p.r += p.vr * dt * 0.06;
      if (p.y < -40) { p.y = hgt + 40; p.x = Math.random() * w; }
      if (p.y > hgt + 40) { p.y = -40; p.x = Math.random() * w; }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.c;
      ctx.font = `${Math.round(14 + p.z * 26)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.g, 0, 0);
      ctx.restore();
    }
  }

  function loop(now) {
    const dt = Math.min(64, now - (last || now));
    last = now;
    draw(dt);
    raf = requestAnimationFrame(loop);
  }

  function play() {
    if (raf || reducedMotion() || document.hidden) return;
    last = 0;
    raf = requestAnimationFrame(loop);
  }
  function pause() { cancelAnimationFrame(raf); raf = 0; }

  resize();
  window.addEventListener('resize', () => { resize(); }, { passive: true });
  document.addEventListener('visibilitychange', () => (document.hidden ? pause() : play()));
  play();
}

/* ---------- Apparitions au défilement ---------- */
let revealObserver = null;
export function observeReveals(root) {
  const items = root.querySelectorAll('[data-reveal]');
  if (reducedMotion() || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          revealObserver.unobserve(e.target);
        }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  }
  items.forEach((el) => revealObserver.observe(el));
}

/* ---------- Déclenche une fonction quand un élément devient visible ---------- */
export function whenVisible(el, fn, { threshold = 0.35, once = true } = {}) {
  if (!('IntersectionObserver' in window)) { fn(true); return () => {}; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { fn(true); if (once) io.disconnect(); }
      else if (!once) fn(false);
    }
  }, { threshold });
  io.observe(el);
  return () => io.disconnect();
}

/* ---------- Compteur animé ---------- */
export function countUp(el, to, { duration = 1200, pad = 0 } = {}) {
  const target = Number(to);
  if (!Number.isFinite(target) || reducedMotion()) { el.textContent = String(to); return; }
  const t0 = performance.now();
  const step = (now) => {
    const k = Math.min(1, (now - t0) / duration);
    const v = Math.round(target * (1 - Math.pow(1 - k, 4)));
    el.textContent = pad ? String(v).padStart(pad, '0') : String(v);
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

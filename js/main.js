/* Point d'entrée : écran de chargement → contenu (JSON ou API, une seule
 * fois) → polices et images clés → site. */
import { fmt, reducedMotion } from './dom.js';
import { createBoot } from './boot.js';
import { loadContent } from './content.js';
import { initI18n, detectBootLang, T, site } from './i18n.js';
import { initRouter, routeFromPath, setCurrent, scrollToId, currentRoute } from './router.js';
import { applyMeta } from './meta.js';
import { buildShell, updateShell } from './ui/shell.js';
import { say } from './ui/croupier.js';
import { closeMenu } from './ui/menu.js';
import { startBackground } from './ui/fx.js';
import { renderHome } from './views/home.js';
import { renderLegal } from './views/legal.js';
import { renderNotFound } from './views/notfound.js';

const cfg = window.KYDOS_CONFIG || {};
const FALLBACK_TEXTS = {
  loading: 'Initialisation des IA…', content: 'Chargement du contenu…',
  errorTitle: 'Connexion perdue', errorText: 'Impossible de charger le contenu du site.', retry: 'Réessayer'
};
const bootLang = detectBootLang();
const bootTexts = { ...FALLBACK_TEXTS, ...((cfg.bootTexts && (cfg.bootTexts[bootLang] || cfg.bootTexts.fr)) || {}) };

let destroyView = null;
let routerReady = false;

function withTimeout(promise, ms) {
  return Promise.race([promise, new Promise((r) => setTimeout(r, ms))]);
}

function loadFonts() {
  if (!document.fonts || !document.fonts.load) return Promise.resolve();
  return Promise.all([
    document.fonts.load('700 1em "Chakra Petch"', 'KÝDOS'),
    document.fonts.load('600 1em "Chakra Petch"', 'KÝDOS'),
    document.fonts.load('400 1em "Inter Variable"', 'Belote'),
    document.fonts.load('500 1em "JetBrains Mono Variable"', '0123')
  ]).catch(() => {});
}

function preloadImages(urls, onProgress) {
  let done = 0;
  return Promise.all(urls.map((src) => new Promise((resolve) => {
    const im = new Image();
    const finish = () => { done += 1; onProgress(done / urls.length); resolve(); };
    im.onload = finish;
    im.onerror = finish;
    im.decoding = 'async';
    im.src = src;
  })));
}

async function render(route, hash, { initial = false } = {}) {
  closeMenu();
  if (destroyView) { destroyView(); destroyView = null; }
  setCurrent(route);
  updateShell(route);
  const main = document.getElementById('main');
  if (route === 'home') destroyView = renderHome(main);
  else if (route === 'cgu' || route === 'confidentialite') destroyView = renderLegal(main, route);
  else destroyView = renderNotFound(main);
  applyMeta(route);
  if (route === 'home') say('donne', true);
  else say(route === 'notfound' ? 'notfound' : 'legal', true);

  if (hash && hash !== 'top') {
    requestAnimationFrame(() => { if (!scrollToId(hash, false)) window.scrollTo(0, 0); });
  } else {
    window.scrollTo(0, 0);
  }
  if (!initial) main.focus({ preventScroll: true });
}

function currentChapter() {
  const secs = document.querySelectorAll('[data-chapter]');
  const mid = window.innerHeight / 2;
  for (const s of secs) {
    const r = s.getBoundingClientRect();
    if (r.top <= mid && r.bottom >= mid) return s.id;
  }
  return '';
}

async function start(boot) {
  boot.progress(6, bootTexts.content);
  let data;
  try {
    ({ data } = await loadContent((p) => boot.progress(6 + p * 38)));
  } catch (err) {
    console.error('[Kýdos] Chargement du contenu impossible :', err);
    boot.error(bootTexts, err.detail || err.message, () => start(boot));
    return;
  }

  initI18n(data);
  const L = T().loader;
  const crew = L.crewNames || [];
  boot.progress(46, L.steps.content);
  boot.log(fmt(L.log, { name: crew[0] || '' }));

  await withTimeout(loadFonts(), 2500);
  boot.progress(62, L.steps.fonts);
  boot.log(fmt(L.log, { name: crew[1] || '' }));

  const S = site();
  const route = routeFromPath();
  const critical = [S.brand.logo, 'assets/brand/logo-256.webp', `assets/mascots/${S.crew.croupier}.svg`];
  if (route === 'notfound') critical.push(`assets/mascots/${S.crew.notFound}.svg`);
  let logged = 1;
  await withTimeout(preloadImages(critical, (p) => {
    boot.progress(62 + p * 30, L.steps.images);
    const k = Math.min(crew.length - 1, 1 + Math.ceil(p * 2));
    if (k > logged) { logged = k; boot.log(fmt(L.log, { name: crew[k] || '' })); }
  }), 4000);

  buildShell();
  if (!document.querySelector('.bgfx')) startBackground();
  await render(route, window.location.hash.slice(1), { initial: true });

  await boot.done(reducedMotion() ? 0 : (cfg.minLoaderMs ?? 1600));
  boot.progress(100, L.steps.ready);
  await boot.exit();
  document.documentElement.classList.add('is-ready');

  if (!routerReady) {
    routerReady = true;
    initRouter(render);
    // Changement de langue : on reconstruit sans aucun nouvel appel réseau.
    document.addEventListener('kydos:lang', async () => {
      const route = currentRoute();
      const anchor = route === 'home' ? currentChapter() : '';
      const before = anchor ? document.getElementById(anchor).getBoundingClientRect().top : 0;
      const y = window.scrollY;
      buildShell();
      await render(route, '', { initial: true });
      requestAnimationFrame(() => {
        const el = anchor && document.getElementById(anchor);
        if (el) window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top - before);
        else window.scrollTo(0, y);
        const btn = document.querySelector('.hud .lang');
        if (btn) btn.focus({ preventScroll: true });
      });
    });
  }
}

function boot() {
  document.documentElement.lang = bootLang;
  start(createBoot(bootTexts));
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

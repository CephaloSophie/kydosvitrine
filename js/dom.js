/* Petits utilitaires DOM : création d'éléments sans innerHTML (le contenu peut
 * venir d'une API), texte enrichi minimal, préférences de mouvement. */

const SVG_NS = 'http://www.w3.org/2000/svg';

function applyAttrs(el, attrs) {
  if (!attrs) return;
  for (const [key, val] of Object.entries(attrs)) {
    if (val === null || val === undefined || val === false) continue;
    if (key === 'class') el.setAttribute('class', Array.isArray(val) ? val.filter(Boolean).join(' ') : val);
    else if (key === 'style' && typeof val === 'object') {
      for (const [p, v] of Object.entries(val)) {
        if (v === null || v === undefined) continue;
        if (p.startsWith('--')) el.style.setProperty(p, String(v));
        else el.style[p] = v;
      }
    } else if (key === 'dataset') Object.assign(el.dataset, val);
    else if (key.startsWith('on') && typeof val === 'function') el.addEventListener(key.slice(2).toLowerCase(), val);
    else if (key === 'text') el.textContent = val;
    else el.setAttribute(key, val === true ? '' : String(val));
  }
}

function append(el, children) {
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    if (Array.isArray(child)) append(el, child);
    else el.append(child instanceof Node ? child : String(child));
  }
}

export function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  applyAttrs(el, attrs);
  append(el, children);
  return el;
}

export function s(tag, attrs, ...children) {
  const el = document.createElementNS(SVG_NS, tag);
  applyAttrs(el, attrs);
  append(el, children);
  return el;
}

/** Remplace {cle} par vars.cle. */
export function fmt(str, vars = {}) {
  return String(str ?? '').replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));
}

/**
 * Texte enrichi sûr : **gras**, [libellé](url) et {variables}.
 * Les liens internes (/...) sont gérés par le routeur ; les liens externes
 * s'ouvrent dans un nouvel onglet.
 */
export function rich(text, vars = {}) {
  const frag = document.createDocumentFragment();
  const src = fmt(text, vars);
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m;
  while ((m = re.exec(src))) {
    if (m.index > last) frag.append(src.slice(last, m.index));
    if (m[1] !== undefined) frag.append(h('strong', null, m[1]));
    else frag.append(link(m[2], m[3]));
    last = re.lastIndex;
  }
  if (last < src.length) frag.append(src.slice(last));
  return frag;
}

export function link(label, href, attrs = {}) {
  const safe = /^(https?:|mailto:|\/|#)/i.test(href) ? href : '#';
  const external = /^https?:/i.test(safe);
  return h('a', {
    href: safe,
    ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
    ...(safe.startsWith('/') ? { 'data-link': '' } : {}),
    ...attrs
  }, label);
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
export const reducedMotion = () => motionQuery.matches;

export const wait = (ms) => new Promise((r) => setTimeout(r, ms));
export const nextFrame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/** Glyphes d'enseigne et couleur de carte. */
export const SUITS = { heart: '♥', spade: '♠', diamond: '♦', club: '♣' };
export const isRed = (suit) => suit === 'heart' || suit === 'diamond';

/** Carte à jouer ivoire (décorative par défaut). */
export function playingCard({ rank, suit, size = 'md', label, extraClass } = {}) {
  const glyph = SUITS[suit] || '♠';
  return h('span', {
    class: ['pcard', `pcard--${size}`, isRed(suit) ? 'pcard--red' : 'pcard--black', extraClass],
    'aria-hidden': label ? null : 'true',
    role: label ? 'img' : null,
    'aria-label': label || null
  },
    h('span', { class: 'pcard__corner pcard__corner--tl' }, h('b', null, rank), h('i', null, glyph)),
    h('span', { class: 'pcard__pip' }, glyph),
    h('span', { class: 'pcard__corner pcard__corner--br' }, h('b', null, rank), h('i', null, glyph))
  );
}

/** Icônes en ligne (tracés simples, currentColor). */
const ICONS = {
  bid: 'M4 7h16M4 12h10M4 17h6|M17 14l3 3-3 3',
  live: 'M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0|M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8',
  replay: 'M4 12a8 8 0 1 0 2.3-5.6|M4 4v4h4|M10 9l5 3-5 3z',
  stats: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  offline: 'M3 3l18 18|M8.5 16.4a5 5 0 0 1 7 0|M5 12.9a10 10 0 0 1 4.2-2.5|M12 20h.01',
  eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z|M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0',
  trophy: 'M8 21h8M12 17v4|M7 4h10v5a5 5 0 0 1-10 0z|M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3',
  users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z|M2 21v-1a6 6 0 0 1 12 0v1|M16 3.5a4 4 0 0 1 0 7.5M22 21v-1a6 6 0 0 0-4-5.6',
  chart: 'M3 3v18h18|M7 15l4-4 3 3 5-6',
  chat: 'M4 5h16v11H9l-5 4z|M8 10h8M8 13h5',
  check: 'M4 12l5 5L20 6',
  arrowL: 'M15 5l-7 7 7 7',
  arrowR: 'M9 5l7 7-7 7',
  arrowD: 'M12 4v16|M6 14l6 6 6-6',
  close: 'M5 5l14 14M19 5L5 19',
  shuffle: 'M3 7h4l10 10h4|M3 17h4l3-3|M14 10l3-3h4|M18 4l3 3-3 3|M18 14l3 3-3 3',
  mail: 'M3 5h18v14H3z|M3 6l9 7 9-7',
  zoom: 'M11 11m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0|M21 21l-5-5|M8 11h6M11 8v6',
  play: 'M7 4l13 8-13 8z',
  crown: 'M3 8l4 4 5-7 5 7 4-4-2 11H5z',
  info: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0|M12 11v6|M12 7.5v.5',
  gift: 'M3 9h18v4H3z|M5 13v8h14v-8|M12 9v12|M12 9s-1-5-4-5a2 2 0 0 0 0 4h4zM12 9s1-5 4-5a2 2 0 0 1 0 4h-4z',
  robot: 'M5 8h14v11H5z|M12 4v4|M12 3.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0|M9 13h.01M15 13h.01|M9 16h6|M2 12v3M22 12v3',
  globe: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0|M3 12h18|M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18',
  menu: 'M4 7h16M4 12h16M4 17h16',
  hand: 'M7 5.5l4-1.5 1.8 12.5L8.8 18z|M11.5 4.2l4.2.6-1.2 12.5-3.9-.5|M15.8 5.3l4 1.8-3.6 12-2.4-1.1'
};

export function icon(name, extraClass) {
  const def = ICONS[name];
  if (!def) return null;
  return s('svg', { class: ['ico', extraClass], viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false' },
    ...def.split('|').map((d) => s('path', { d })));
}

/** Image avec dimensions (évite les décalages de mise en page). */
export function img(src, alt, { width, height, lazy = true, cls, sizes, srcset, fetchpriority } = {}) {
  return h('img', {
    src, alt: alt || '', width, height, class: cls,
    loading: lazy ? 'lazy' : 'eager', decoding: 'async', sizes, srcset, fetchpriority
  });
}

/** Stockage local tolérant (navigation privée, stockage bloqué…). */
export const store = {
  get(key) { try { return window.localStorage.getItem(key); } catch { return null; } },
  set(key, val) { try { window.localStorage.setItem(key, val); } catch { /* ignoré */ } }
};

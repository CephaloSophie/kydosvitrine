/* Le robot croupier : commente la partie en bas de l'écran. */
import { h, reducedMotion, store } from '../dom.js';
import { T, site } from '../i18n.js';

const KEY = 'kydos.croupier';
let root = null;
let typed = null;
let live = null;
let btn = null;
let timer = 0;
let hideTimer = 0;
let currentKey = null;
let collapsed = store.get(KEY) === 'off';

export function mountCroupier(parent) {
  const t = T();
  root = h('aside', { class: ['croupier', collapsed && 'is-collapsed'], 'aria-label': t.ui.croupierName });
  btn = h('button', {
    type: 'button', class: 'croupier__avatar',
    'aria-expanded': String(!collapsed),
    'aria-label': collapsed ? t.ui.croupierShow : t.ui.croupierHide,
    onclick: toggle
  }, h('img', { src: `assets/mascots/${site().crew.croupier}.svg`, alt: '', width: 120, height: 132 }), h('i', { class: 'croupier__ring' }));
  typed = h('span', { class: 'croupier__typed' });
  live = h('p', { class: 'sr-only', 'aria-live': 'polite' });
  const bubble = h('div', { class: 'croupier__bubble' },
    h('span', { class: 'croupier__name' }, t.ui.croupierName),
    h('p', { class: 'croupier__text', 'aria-hidden': 'true' }, typed, h('span', { class: 'croupier__caret' }, '▌')),
    live
  );
  root.append(btn, bubble);
  parent.append(root);
  if (currentKey) say(currentKey, true);
  return root;
}

function toggle() {
  collapsed = !collapsed;
  store.set(KEY, collapsed ? 'off' : 'on');
  root.classList.toggle('is-collapsed', collapsed);
  btn.setAttribute('aria-expanded', String(!collapsed));
  btn.setAttribute('aria-label', collapsed ? T().ui.croupierShow : T().ui.croupierHide);
  if (!collapsed && currentKey) say(currentKey, true);
}

export function say(key, force = false) {
  if (!root) { currentKey = key; return; }
  if (key === currentKey && !force) return;
  currentKey = key;
  const text = T().croupier[key];
  if (!text) return;
  clearInterval(timer);
  clearTimeout(hideTimer);
  root.classList.remove('is-quiet');
  root.classList.remove('is-pop');
  void root.offsetWidth;
  root.classList.add('is-pop');
  live.textContent = collapsed ? '' : text;
  if (reducedMotion()) {
    typed.textContent = text;
  } else {
    let i = 0;
    typed.textContent = '';
    timer = setInterval(() => {
      i += 1;
      typed.textContent = text.slice(0, i);
      if (i >= text.length) clearInterval(timer);
    }, 24);
  }
  // Sur petit écran, la bulle se fait discrète après lecture.
  if (window.matchMedia('(max-width: 720px)').matches) {
    hideTimer = setTimeout(() => root.classList.add('is-quiet'), 6500);
  }
}

/* Menu = une main de cartes. Jouer une carte mène au chapitre. */
import { h, icon, playingCard, wait, reducedMotion } from '../dom.js';
import { T, site } from '../i18n.js';
import { hrefFor } from '../router.js';
import { game } from '../state.js';

let overlay = null;
let lastFocus = null;

/** Liste ordonnée de toutes les étapes du parcours (hors pages légales). */
export function journey() {
  const plis = site().chapters.map((c, i) => ({ id: c.id, card: c.card, n: i + 1 }));
  return [
    { id: 'donne', special: 'donne' },
    ...plis,
    { id: 'maison', special: 'maison' },
    { id: 'capot', special: 'capot' }
  ];
}

export function specialCard(kind) {
  const glyph = { donne: '♠♥♦♣', maison: '◆', capot: '★' }[kind];
  return h('span', { class: ['pcard', 'pcard--md', 'pcard--special', `pcard--${kind}`], 'aria-hidden': 'true' },
    h('span', { class: 'pcard__special' }, glyph));
}

export function openMenu() {
  if (overlay) return;
  const t = T();
  lastFocus = document.activeElement;
  const steps = journey();
  const hand = h('ol', { class: 'menu__hand', style: { '--n': steps.length } },
    steps.map((st, i) => {
      const won = game.collected.includes(st.id);
      const face = st.special ? specialCard(st.special) : playingCard({ rank: t.ui.ranks[st.card.rank] || st.card.rank, suit: st.card.suit });
      return h('li', { class: 'menu__slot', style: { '--i': i } },
        h('a', {
          class: ['menu__card', won && 'is-won'],
          href: hrefFor('home', st.id === 'donne' ? 'top' : st.id),
          onclick: () => close(true)
        },
          face,
          h('span', { class: 'menu__label' },
            st.n ? h('small', null, `${t.ui.trick} ${String(st.n).padStart(2, '0')}`) : null,
            t.nav[st.id] || st.id)
        ));
    }));

  overlay = h('div', { class: 'menu', role: 'dialog', 'aria-modal': 'true', 'aria-label': t.ui.menuTitle },
    h('div', { class: 'menu__backdrop', onclick: () => close() }),
    h('div', { class: 'menu__panel' },
      h('div', { class: 'menu__head' },
        h('p', { class: 'menu__title' }, t.ui.menuTitle),
        h('p', { class: 'menu__hint' }, t.ui.menuHint),
        h('button', { type: 'button', class: 'menu__close', 'aria-label': t.ui.menuClose, onclick: () => close() }, icon('close'))
      ),
      hand,
      h('div', { class: 'menu__foot' },
        h('a', { href: hrefFor('cgu'), onclick: () => close(true) }, t.ui.legalLinks.cgu),
        h('a', { href: hrefFor('confidentialite'), onclick: () => close(true) }, t.ui.legalLinks.confidentialite),
        h('a', { href: `mailto:${site().contactEmail}` }, site().contactEmail)
      )
    )
  );
  overlay.addEventListener('keydown', onKey);
  document.body.append(overlay);
  document.documentElement.classList.add('menu-open');
  requestAnimationFrame(() => {
    overlay.classList.add('is-open');
    const first = overlay.querySelector('.menu__card');
    if (first) first.focus({ preventScroll: true });
  });
  document.dispatchEvent(new CustomEvent('kydos:menu', { detail: { open: true } }));
}

async function close(navigating = false) {
  if (!overlay) return;
  const el = overlay;
  overlay = null;
  el.classList.remove('is-open');
  el.classList.add('is-closing');
  document.documentElement.classList.remove('menu-open');
  document.dispatchEvent(new CustomEvent('kydos:menu', { detail: { open: false } }));
  if (!navigating && lastFocus) lastFocus.focus({ preventScroll: true });
  await wait(reducedMotion() ? 0 : 320);
  el.remove();
}

export const closeMenu = () => close();

function onKey(e) {
  if (e.key === 'Escape') { e.preventDefault(); close(); return; }
  if (e.key !== 'Tab' || !overlay) return;
  const items = overlay.querySelectorAll('a[href], button');
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

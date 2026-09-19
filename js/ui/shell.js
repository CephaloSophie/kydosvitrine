/* Coque commune : barre haute (HUD), pied de page, croupier, fond animé. */
import { h, icon, playingCard, reducedMotion } from '../dom.js';
import { T, site, getLang, setLang, nextLang, locales } from '../i18n.js';
import { hrefFor, currentRoute } from '../router.js';
import { game, onGame } from '../state.js';
import { openMenu, journey } from './menu.js';
import { mountCroupier } from './croupier.js';

let header = null;
let footer = null;
let unsub = null;

export function buildShell() {
  const app = document.getElementById('app');
  const t = T();
  if (unsub) unsub();
  app.replaceChildren(
    h('a', {
      class: 'skip', href: '#main',
      onclick: (e) => { e.preventDefault(); const m = document.getElementById('main'); m.focus(); m.scrollIntoView(); }
    }, t.ui.skipLink),
    header = buildHeader(),
    h('main', { id: 'main', class: 'view', tabindex: '-1' }),
    footer = buildFooter()
  );
  mountCroupier(app);
  unsub = onGame(updateTracker);
  updateTracker(game, { type: 'init' });
}

function langButton(extraClass) {
  const t = T();
  return h('button', {
    type: 'button', class: ['lang', extraClass], 'aria-label': t.ui.langSwitchTo,
    onclick: () => setLang(nextLang())
  },
    icon('globe'),
    locales().map((l) => h('span', { class: ['lang__opt', l === getLang() && 'is-on'], lang: l }, t.ui.langShort[l] || l.toUpperCase()))
  );
}

function buildHeader() {
  const t = T();
  const slots = site().chapters.map((c, i) => h('li', null,
    h('a', {
      class: 'slot', href: hrefFor('home', c.id), 'data-slot': c.id,
      'aria-label': `${t.ui.trick} ${i + 1} : ${t.nav[c.id]}`
    },
      h('span', { class: 'slot__empty', 'aria-hidden': 'true' }, String(i + 1)),
      playingCard({ rank: t.ui.ranks[c.card.rank] || c.card.rank, suit: c.card.suit, size: 'xs', extraClass: 'slot__card' })
    )));

  return h('header', { class: 'hud' },
    h('div', { class: 'hud__inner' },
      h('a', { class: 'hud__brand', href: hrefFor('home'), 'aria-label': `${site().name} — ${t.ui.home}` },
        h('img', { src: 'assets/brand/logo-256.webp', alt: '', width: 256, height: 256 }),
        h('span', { class: 'hud__word' }, 'KÝDOS', h('small', null, 'BELOTE'))
      ),
      h('nav', { class: 'tracker', 'aria-label': t.ui.tricks },
        h('span', { class: 'tracker__label' }, t.ui.tricks, ' ', h('b', { 'data-tracker': 'count' }, '0'), '/', String(site().chapters.length)),
        h('ol', { class: 'tracker__slots' }, slots),
        h('span', { class: 'tracker__score', 'aria-live': 'off' },
          h('small', null, t.ui.us), h('b', { 'data-tracker': 'score' }, '000'))
      ),
      h('a', { class: 'hud__back', href: hrefFor('home') }, icon('arrowL'), h('span', null, t.ui.backToTable)),
      h('div', { class: 'hud__actions' },
        langButton(),
        h('button', { type: 'button', class: 'hud__menu', 'aria-label': t.ui.menuOpen, 'aria-haspopup': 'dialog', onclick: openMenu },
          icon('hand'), h('span', null, 'Menu'))
      )
    )
  );
}

let shownScore = 0;
let scoreRaf = 0;
function updateTracker(g, evt) {
  if (!header) return;
  header.querySelector('[data-tracker="count"]').textContent = String(g.collected.length);
  header.querySelectorAll('[data-slot]').forEach((el) => {
    el.classList.toggle('is-won', g.collected.includes(el.dataset.slot));
  });
  header.classList.toggle('is-capot', g.capot);
  const scoreEl = header.querySelector('[data-tracker="score"]');
  const target = g.capot ? site().capotPoints : g.score;
  cancelAnimationFrame(scoreRaf);
  if (reducedMotion() || evt.type === 'init' || evt.type === 'reset') {
    shownScore = target;
    scoreEl.textContent = String(target).padStart(3, '0');
    return;
  }
  const from = shownScore;
  const t0 = performance.now();
  const step = (now) => {
    const k = Math.min(1, (now - t0) / 700);
    shownScore = Math.round(from + (target - from) * (1 - Math.pow(1 - k, 3)));
    scoreEl.textContent = String(shownScore).padStart(3, '0');
    if (k < 1) scoreRaf = requestAnimationFrame(step);
  };
  scoreRaf = requestAnimationFrame(step);
  const tracker = header.querySelector('.tracker');
  tracker.classList.remove('is-bump');
  void tracker.offsetWidth;
  tracker.classList.add('is-bump');
}

/** Élément « slot » du HUD pour un chapitre (cible de l'envol de la carte). */
export function slotFor(id) {
  return header && header.querySelector(`[data-slot="${id}"]`);
}

export function updateShell(route) {
  document.documentElement.dataset.route = route;
}

function buildFooter() {
  const t = T();
  const S = site();
  const steps = journey().filter((s) => s.id !== 'donne');
  return h('footer', { class: 'footer' },
    h('div', { class: 'footer__glow', 'aria-hidden': 'true' }),
    h('div', { class: 'footer__inner' },
      h('div', { class: 'footer__brand' },
        h('img', { src: 'assets/brand/logo-256.webp', alt: '', width: 256, height: 256, loading: 'lazy' }),
        h('div', null,
          h('p', { class: 'footer__name' }, 'KÝDOS', h('span', null, 'BELOTE')),
          h('p', { class: 'footer__tagline' }, t.footer.tagline),
          h('p', { class: 'footer__made' }, t.footer.madeBy)
        )
      ),
      h('nav', { class: 'footer__col', 'aria-label': t.footer.exploreTitle },
        h('p', { class: 'footer__title' }, t.footer.exploreTitle),
        h('ul', { class: 'footer__explore' }, steps.map((st) => h('li', null, h('a', { href: hrefFor('home', st.id) }, t.nav[st.id]))))
      ),
      h('nav', { class: 'footer__col', 'aria-label': t.footer.legalTitle },
        h('p', { class: 'footer__title' }, t.footer.legalTitle),
        h('ul', null,
          h('li', null, h('a', { href: hrefFor('cgu') }, t.ui.legalLinks.cgu)),
          h('li', null, h('a', { href: hrefFor('confidentialite') }, t.ui.legalLinks.confidentialite)),
          h('li', null, h('a', { href: `mailto:${S.contactEmail}` }, t.footer.contact))
        ),
        langButton('lang--footer')
      )
    ),
    h('div', { class: 'footer__bottom' },
      h('p', null, `© ${S.copyrightYear} ${S.copyrightHolder} · ${S.name}. ${t.footer.rights}`),
      h('p', { class: 'footer__note' }, t.footer.note)
    ),
    h('p', { class: 'footer__giant', 'aria-hidden': 'true' }, 'KÝDOS')
  );
}

export function isHome() { return currentRoute() === 'home'; }

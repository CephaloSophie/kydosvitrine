/* Pages légales : CGU et politique de confidentialité, rendues depuis le JSON. */
import { h, icon, rich, link, reducedMotion } from '../dom.js';
import { T, site } from '../i18n.js';
import { hrefFor } from '../router.js';
import { observeReveals } from '../ui/fx.js';

const pad = (n) => String(n).padStart(2, '0');

export function renderLegal(main, route) {
  const t = T();
  const S = site();
  const doc = t.legal[route];
  const F = t.legal.fields;
  const co = S.company || {};
  const vars = { email: co.email || S.contactEmail, company: co.name || S.copyrightHolder, website: co.website || '' };
  const path = hrefFor(route);

  const dl = (rows) => {
    const items = rows.filter(([, v]) => v && String(v).trim());
    if (!items.length) return null;
    return h('dl', { class: 'idcard' }, items.map(([k, v, href]) => h('div', { class: 'idcard__row' },
      h('dt', null, k),
      h('dd', null, href ? link(v, href) : v))));
  };

  const block = (b) => {
    switch (b.type) {
      case 'p': return h('p', null, rich(b.text, vars));
      case 'h': return h('h3', null, rich(b.text, vars));
      case 'list': return h('ul', null, (b.items || []).map((it) => h('li', null, rich(it, vars))));
      case 'identity': return dl([
        [F.name, co.name],
        [F.legalForm, co.legalForm],
        [F.shareCapital, co.shareCapital],
        [F.registration, co.registration],
        [F.vatNumber, co.vatNumber],
        [F.address, co.address],
        [F.publicationDirector, co.publicationDirector],
        [F.email, co.email, co.email && `mailto:${co.email}`],
        [F.website, co.website && co.website.replace(/^https?:\/\//, ''), co.website]
      ]);
      case 'host': {
        const sh = S.siteHost || {};
        return dl([
          [F.siteHost, [sh.name, sh.address].filter(Boolean).join(' — ')],
          [F.gameServerHost, [co.gameServerHost, co.gameServerHostAddress].filter(Boolean).join(' — ')]
        ]);
      }
      case 'mediator': return dl([
        [F.consumerMediator, co.consumerMediator, co.consumerMediatorUrl || null]
      ]);
      default: return null;
    }
  };

  const toc = h('ol', { class: 'legal__toc-list' }, doc.sections.map((sec, i) => h('li', null,
    h('a', {
      href: `${path}#${sec.id}`, 'data-toc': sec.id,
      onclick: (e) => {
        e.preventDefault();
        const el = document.getElementById(sec.id);
        if (el) {
          el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
          history.replaceState(history.state, '', `${path}#${sec.id}`);
          el.setAttribute('tabindex', '-1');
          el.focus({ preventScroll: true });
        }
      }
    }, h('span', { class: 'legal__toc-n' }, pad(i + 1)), sec.title))));

  const sections = doc.sections.map((sec, i) => h('section', { class: 'legal__sec', id: sec.id, 'aria-labelledby': `${sec.id}-h` },
    h('h2', { id: `${sec.id}-h` }, h('span', { class: 'legal__n' }, pad(i + 1)), sec.title),
    (sec.blocks || []).map(block)));

  const other = route === 'cgu' ? 'confidentialite' : 'cgu';
  const article = h('article', { class: `legal legal--${route}` },
    h('div', { class: 'legal__hero' },
      h('div', { class: 'wrap' },
        h('a', { class: 'legal__back', href: hrefFor('home') }, icon('arrowL'), t.ui.backToTable),
        h('p', { class: 'legal__kicker', 'data-reveal': '' }, doc.kicker),
        h('h1', { class: 'legal__title', 'data-reveal': '' }, doc.title),
        h('p', { class: 'legal__updated', 'data-reveal': '' }, `${t.ui.lastUpdated} `, h('time', null, doc.updated)),
        h('p', { class: 'legal__intro', 'data-reveal': '' }, doc.intro),
        h('div', { class: 'legal__seal', 'aria-hidden': 'true' }, h('span', null, route === 'cgu' ? '♠' : '♦')))),
    h('div', { class: 'wrap legal__layout' },
      h('nav', { class: 'legal__toc', 'aria-label': t.ui.toc },
        h('p', { class: 'legal__toc-title' }, t.ui.toc),
        toc,
        h('a', { class: 'legal__other', href: hrefFor(other) }, t.ui.legalLinks[other], icon('arrowR'))),
      h('div', { class: 'legal__body' }, sections)));

  main.replaceChildren(article);
  observeReveals(main);

  // Sommaire : met en avant la section en cours de lecture.
  let io = null;
  if ('IntersectionObserver' in window) {
    const links = new Map(Array.from(toc.querySelectorAll('[data-toc]')).map((a) => [a.dataset.toc, a]));
    io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        links.forEach((a, id) => a.classList.toggle('is-on', id === e.target.id));
      }
    }, { rootMargin: '-20% 0px -70% 0px' });
    sections.forEach((s) => io.observe(s));
  }
  return () => { if (io) io.disconnect(); };
}

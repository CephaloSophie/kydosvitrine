/* Page introuvable, inspirée de l'écran 404 de l'application. */
import { h, icon } from '../dom.js';
import { T, site } from '../i18n.js';
import { hrefFor } from '../router.js';

export function renderNotFound(main) {
  const t = T();
  const nf = t.notfound;
  main.replaceChildren(h('section', { class: 'notfound', 'aria-labelledby': 'nf-title' },
    h('div', { class: 'notfound__grid', 'aria-hidden': 'true' }),
    h('div', { class: 'notfound__inner' },
      h('p', { class: 'notfound__code', 'aria-hidden': 'true' },
        h('span', null, nf.code[0]),
        h('img', { src: `assets/mascots/${site().crew.notFound}.svg`, alt: '', width: 120, height: 300 }),
        h('span', null, nf.code[1])),
      h('h1', { id: 'nf-title', class: 'notfound__title' }, nf.title),
      h('p', { class: 'notfound__text' }, nf.text),
      h('a', { class: 'btn btn--primary btn--lg', href: hrefFor('home') }, icon('arrowL'), nf.cta))));
  return () => {};
}

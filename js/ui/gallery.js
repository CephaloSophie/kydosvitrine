/* Vitrine : un téléphone paysage et une main de cartes-écrans qu'on peut battre. */
import { h, icon, reducedMotion, wait } from '../dom.js';

export function createGallery(V, items, ui) {
  const groups = ['all', ...Array.from(new Set(items.map((it) => it.group)))];
  let list = items.slice();
  let index = 0;
  let filter = 'all';

  const screen = h('div', { class: 'gdevice__screen' });
  const counter = h('span', { class: 'gallery__counter' });
  const title = h('h3', { class: 'gallery__title' });
  const caption = h('p', { class: 'gallery__text' });
  const chip = h('span', { class: 'gallery__group' });
  const hand = h('ol', { class: 'gallery__hand' });
  const live = h('p', { class: 'sr-only', 'aria-live': 'polite' });

  const filters = h('div', { class: 'gallery__filters', role: 'group', 'aria-label': V.counter },
    groups.map((g) => h('button', {
      type: 'button', class: ['chip-btn', g === 'all' && 'is-on'], 'aria-pressed': String(g === 'all'), 'data-group': g,
      onclick: () => setFilter(g)
    }, g === 'all' ? V.all : (V.groups[g] || g))));

  const device = h('figure', { class: 'gdevice' },
    h('div', { class: 'gdevice__frame' },
      h('i', { class: 'gdevice__cam', 'aria-hidden': 'true' }),
      screen,
      h('i', { class: 'gdevice__btn', 'aria-hidden': 'true' })),
    h('button', { type: 'button', class: 'gdevice__zoom', 'aria-label': ui.zoom, onclick: openLightbox }, icon('zoom')));

  const stage = h('div', {
    class: 'gallery__stage', tabindex: '0', role: 'region', 'aria-roledescription': 'carousel', 'aria-label': V.title.join(' '),
    onkeydown: (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    }
  },
    h('button', { type: 'button', class: 'gallery__nav gallery__nav--prev', 'aria-label': ui.prev, onclick: () => go(-1) }, icon('arrowL')),
    device,
    h('button', { type: 'button', class: 'gallery__nav gallery__nav--next', 'aria-label': ui.next, onclick: () => go(1) }, icon('arrowR')));

  // Glisser du doigt sur l'écran.
  let x0 = null;
  screen.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
  screen.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  });

  const shuffleBtn = h('button', { type: 'button', class: 'btn btn--ghost btn--sm gallery__shuffle', onclick: shuffle }, icon('shuffle'), V.shuffle);

  const root = h('div', { class: 'gallery', 'data-reveal': '' },
    h('div', { class: 'gallery__top' }, filters, shuffleBtn),
    stage,
    h('div', { class: 'gallery__caption' }, h('div', { class: 'gallery__meta' }, counter, chip), title, caption, live),
    h('div', { class: 'gallery__deck' }, hand));

  function text(it) { return V.items[it.id] || { title: it.id, caption: '', alt: '' }; }

  function buildHand() {
    hand.replaceChildren(...list.map((it, i) => h('li', { style: { '--i': i, '--r': `${((i * 37) % 11) - 5}deg` } },
      h('button', {
        type: 'button', class: ['gthumb', i === index && 'is-on'], 'aria-label': text(it).title, 'aria-current': i === index ? 'true' : null,
        onclick: () => show(i, i > index ? 1 : -1)
      }, h('img', { src: it.thumb, alt: '', width: 640, height: Math.round((640 * it.height) / it.width), loading: 'lazy', decoding: 'async' }),
        h('span', { class: 'gthumb__n' }, String(i + 1).padStart(2, '0'))))));
  }

  function show(i, dir = 1, instant = false) {
    const n = list.length;
    index = ((i % n) + n) % n;
    const it = list[index];
    const tx = text(it);
    const im = h('img', { src: it.src, alt: tx.alt, width: it.width, height: it.height, decoding: 'async', class: 'gdevice__img', draggable: 'false' });
    const old = screen.querySelector('.gdevice__img:not(.is-leaving)');
    if (old && !instant && !reducedMotion()) {
      old.classList.add('is-leaving', dir > 0 ? 'to-left' : 'to-right');
      im.classList.add('is-entering', dir > 0 ? 'from-right' : 'from-left');
      setTimeout(() => old.remove(), 650);
      requestAnimationFrame(() => requestAnimationFrame(() => im.classList.remove('is-entering')));
    } else if (old) old.remove();
    screen.append(im);
    counter.textContent = `${V.counter} ${String(index + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
    title.textContent = tx.title;
    caption.textContent = tx.caption;
    chip.textContent = V.groups[it.group] || it.group;
    chip.dataset.group = it.group;
    live.textContent = `${tx.title}. ${tx.caption}`;
    hand.querySelectorAll('.gthumb').forEach((b, k) => {
      b.classList.toggle('is-on', k === index);
      if (k === index) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    const active = hand.children[index];
    if (active) {
      const left = active.offsetLeft - (hand.clientWidth - active.offsetWidth) / 2;
      hand.scrollTo({ left, behavior: instant || reducedMotion() ? 'auto' : 'smooth' });
    }
    // Précharge le suivant.
    const nx = list[(index + 1) % n];
    if (nx) { const p = new Image(); p.src = nx.src; }
  }

  function go(d) { show(index + d, d); }

  function setFilter(g) {
    filter = g;
    filters.querySelectorAll('.chip-btn').forEach((b) => {
      const on = b.dataset.group === g;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    list = g === 'all' ? items.slice() : items.filter((it) => it.group === g);
    index = 0;
    buildHand();
    show(0, 1);
  }

  async function shuffle() {
    if (!reducedMotion()) {
      hand.classList.add('is-shuffling');
      await wait(620);
    }
    for (let i = list.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    index = 0;
    buildHand();
    hand.classList.remove('is-shuffling');
    show(0, 1);
  }

  /* ---- Visionneuse plein écran ---- */
  let dialog = null;
  function openLightbox() {
    const it = list[index];
    const tx = text(it);
    if (!dialog) {
      dialog = h('dialog', { class: 'lightbox', 'aria-label': ui.zoom },
        h('button', { type: 'button', class: 'lightbox__close', 'aria-label': ui.close, onclick: () => dialog.close() }, icon('close')),
        h('img', { class: 'lightbox__img', alt: '' }),
        h('p', { class: 'lightbox__cap' }));
      dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
      document.body.append(dialog);
    }
    const im = dialog.querySelector('img');
    im.src = it.src; im.alt = tx.alt; im.width = it.width; im.height = it.height;
    dialog.querySelector('.lightbox__cap').textContent = `${tx.title} — ${tx.caption}`;
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
  }

  buildHand();
  show(0, 1, true);
  root.destroy = () => { if (dialog) dialog.remove(); };
  return root;
}

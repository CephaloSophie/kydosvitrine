/* La vitrine : une donne de belote contrée en huit plis. */
import { h, icon, img, playingCard, rich, SUITS, isRed, reducedMotion, wait } from '../dom.js';
import { T, site } from '../i18n.js';
import { hrefFor } from '../router.js';
import { game, collect, reachCapot, resetGame, chapterDef } from '../state.js';
import { observeReveals, whenVisible, countUp } from '../ui/fx.js';
import { say } from '../ui/croupier.js';
import { slotFor } from '../ui/shell.js';
import { createLab } from '../ui/lab.js';
import { createBrain } from '../ui/brain.js';
import { createConsole } from '../ui/console.js';
import { createBracket } from '../ui/bracket.js';
import { createGallery } from '../ui/gallery.js';

const pad = (n) => String(n).padStart(2, '0');

export function renderHome(main) {
  const t = T();
  const S = site();
  const total = S.chapters.length;
  const num = (id) => S.chapters.findIndex((c) => c.id === id) + 1;
  const destroyers = [];
  const keep = (el) => { if (el && el.destroy) destroyers.push(el.destroy); return el; };

  const sections = [
    hero(t, S),
    annonces(t, num('annonces'), total),
    jeu(t, S, num('jeu'), total),
    ecurie(t, S, num('ecurie'), total, keep),
    cerveau(t, S, num('cerveau'), total, keep),
    formats(t, S, num('formats'), total),
    arene(t, S, num('arene'), total, keep),
    cagnotte(t, S, num('cagnotte'), total),
    vitrine(t, S, num('vitrine'), total, keep),
    maison(t),
    capot(t, S)
  ];
  main.replaceChildren(...sections);
  observeReveals(main);
  const stopSpy = spyChapters(main);
  requestAnimationFrame(() => document.documentElement.classList.add('home-ready'));

  return () => { stopSpy(); destroyers.forEach((d) => d()); };
}

/* ======================================================================
 * Mécanique des plis : le chapitre au centre de l'écran est « joué ».
 * ==================================================================== */
function spyChapters(main) {
  const secs = Array.from(main.querySelectorAll('[data-chapter]'));
  if (!('IntersectionObserver' in window)) return () => {};
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const id = e.target.dataset.chapter;
      document.documentElement.dataset.chapter = id;
      secs.forEach((s) => s.classList.toggle('is-current', s === e.target));
      say(id);
      if (id === 'capot') { playTricksUpTo(secs, id).then(() => reachCapot()); continue; }
      if (chapterDef(id)) playTricksUpTo(secs, id);
    }
  }, { rootMargin: '-46% 0px -46% 0px', threshold: 0 });
  secs.forEach((s) => io.observe(s));
  return () => io.disconnect();
}

let queue = Promise.resolve();
/** Joue, dans l'ordre, les plis pas encore ramassés jusqu'à ce chapitre. */
function playTricksUpTo(secs, id) {
  const order = site().chapters.map((c) => c.id);
  const stop = id === 'capot' ? order.length : order.indexOf(id) + 1;
  const todo = order.slice(0, stop).filter((cid) => !game.collected.includes(cid));
  todo.forEach((cid) => {
    queue = queue.then(() => flyTrick(secs.find((s) => s.dataset.chapter === cid), cid));
  });
  return queue;
}

async function flyTrick(section, id) {
  if (game.collected.includes(id)) return;
  const flip = section && section.querySelector('.ch-flip');
  if (flip) flip.classList.add('is-flipped');
  const slot = slotFor(id);
  const face = flip && flip.querySelector('.pcard');
  const visible = face && face.getBoundingClientRect().bottom > 0 && face.getBoundingClientRect().top < window.innerHeight;
  const hudVisible = slot && slot.offsetParent !== null;
  if (!reducedMotion() && visible && hudVisible) {
    await wait(420);
    const a = face.getBoundingClientRect();
    const b = slot.getBoundingClientRect();
    const ghost = face.cloneNode(true);
    ghost.classList.add('pcard--ghost');
    Object.assign(ghost.style, { position: 'fixed', left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px`, margin: 0, zIndex: 80 });
    document.body.append(ghost);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    const sc = b.height / a.height;
    const anim = ghost.animate([
      { transform: 'translate(0,0) rotate(0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.55}px, ${dy * 0.55 - 60}px) rotate(-14deg) scale(${(1 + sc) / 2})`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) rotate(0) scale(${sc})`, opacity: 0.2 }
    ], { duration: 720, easing: 'cubic-bezier(.5,0,.2,1)' });
    await anim.finished.catch(() => {});
    ghost.remove();
  }
  const evt = collect(id);
  if (evt && slot && hudVisible) popScore(slot, evt);
}

function popScore(slot, evt) {
  const t = T();
  const r = slot.getBoundingClientRect();
  const labels = [`+${evt.gained}`];
  if (evt.bonus) labels.push(t.ui.bonus[evt.bonus]);
  if (evt.lastTrick) labels.push(t.ui.bonus.lastTrick);
  const pop = h('span', { class: 'score-pop', 'aria-hidden': 'true', style: { left: `${r.left + r.width / 2}px`, top: `${r.bottom + 6}px` } },
    labels.map((l, i) => h('span', { class: i ? 'score-pop__bonus' : 'score-pop__pts' }, l)));
  document.body.append(pop);
  setTimeout(() => pop.remove(), 1900);
}

/* ======================================================================
 * Briques communes
 * ==================================================================== */
function chapter(id, cls, ...children) {
  return h('section', { class: ['chapter', `chapter--${id}`, cls], id, 'data-chapter': id, 'aria-labelledby': `${id}-title` },
    h('span', { class: 'chapter__water', 'aria-hidden': 'true' }), ...children);
}

function head(t, id, n, total) {
  const c = t.chapters[id];
  const def = chapterDef(id);
  let flip = null;
  if (def) {
    flip = h('span', { class: ['ch-flip', game.collected.includes(id) && 'is-flipped'], 'aria-hidden': 'true' },
      h('span', { class: 'ch-flip__inner' },
        h('span', { class: 'ch-flip__back' }),
        playingCard({ rank: t.ui.ranks[def.card.rank] || def.card.rank, suit: def.card.suit, size: 'sm' })));
  }
  const title = Array.isArray(c.title) ? c.title : [c.title];
  return h('header', { class: 'ch-head', 'data-reveal': '' },
    h('div', { class: 'ch-head__meta' },
      flip,
      h('p', { class: 'ch-kicker' },
        n ? h('span', { class: 'ch-num' }, `${t.ui.trick} ${pad(n)} / ${pad(total)}`) : null,
        h('span', null, c.kicker))),
    h('h2', { class: 'ch-title', id: `${id}-title` }, title.map((line, i) => h('span', { class: i ? 'ch-title__alt' : 'ch-title__main' }, line))),
    c.lead ? h('p', { class: 'ch-lead' }, c.lead) : null);
}

function device(media, alt, cls) {
  return h('figure', { class: ['device', cls] },
    h('div', { class: 'device__frame' },
      h('i', { class: 'device__cam', 'aria-hidden': 'true' }),
      h('div', { class: 'device__screen' }, img(media.src, alt, { width: media.width, height: media.height })),
      h('i', { class: 'device__btn', 'aria-hidden': 'true' })));
}

/* ======================================================================
 * 00 · La donne (hero)
 * ==================================================================== */
function hero(t, S) {
  const H = t.hero;
  const suitsLine = ['spade', 'heart', 'diamond'];
  const handCards = S.chapters.map((c, i) => h('li', { style: { '--i': i, '--n': S.chapters.length } },
    h('a', { class: 'hand__card', href: hrefFor('home', c.id), 'aria-label': `${t.ui.trick} ${i + 1} : ${t.nav[c.id]}` },
      playingCard({ rank: t.ui.ranks[c.card.rank] || c.card.rank, suit: c.card.suit, size: 'md' }),
      h('span', { class: 'hand__label' }, t.nav[c.id]))));

  const tickerItems = (dup) => H.ticker.map((it) => h('li', { class: `tick tick--${it.tone}`, 'aria-hidden': dup ? 'true' : null },
    h('span', { class: 'tick__tag' }, it.tone === 'live' ? h('i') : null, it.tag), h('span', null, it.text)));

  return h('section', { class: 'hero', id: 'top', 'data-chapter': 'donne', 'aria-labelledby': 'hero-title' },
    h('div', { class: 'hero__bg', 'aria-hidden': 'true' },
      h('div', { class: 'hero__sun' }),
      h('div', { class: 'hero__floor' }, h('div', { class: 'hero__grid' })),
      h('div', { class: 'hero__horizon' })),
    h('div', { class: 'hero__inner' },
      h('div', { class: 'hero__copy' },
        h('p', { class: 'hero__kicker' }, h('i', { class: 'pulse-dot' }), H.kicker),
        h('h1', { class: 'hero__title', id: 'hero-title' },
          h('span', { class: 'hero__word', 'data-text': H.title }, H.title),
          h('span', { class: 'hero__sub' }, H.subtitle)),
        h('ul', { class: 'hero__tagline' }, H.tagline.map((line, i) => h('li', { style: { '--i': i } },
          h('i', { class: ['suit', isRed(suitsLine[i % 3]) ? 'suit--red' : 'suit--cold'] }, SUITS[suitsLine[i % 3]]), line))),
        h('p', { class: 'hero__lead' }, H.lead),
        h('div', { class: 'hero__ctas' },
          h('a', { class: 'btn btn--primary btn--lg', href: hrefFor('home', 'annonces') }, H.ctaPrimary, icon('arrowD')),
          h('a', { class: 'btn btn--outline btn--lg', href: hrefFor('home', 'capot') }, H.ctaSecondary)),
        h('ul', { class: 'hero__chips' }, H.chips.map((c) => h('li', null, h('b', null, c.value), h('span', null, c.label))))
      ),
      h('div', { class: 'hero__visual' },
        h('div', { class: 'ring' },
          h('div', { class: 'ring__glow', 'aria-hidden': 'true' }),
          h('div', { class: 'ring__dial', 'aria-hidden': 'true' }),
          h('div', { class: 'ring__orbit', 'aria-hidden': 'true' }, ['heart', 'diamond', 'club', 'spade'].map((s, i) => h('span', { class: `ring__suit ring__suit--${s}`, style: { '--k': i } }, SUITS[s]))),
          h('img', { class: 'ring__logo', src: S.brand.logo, srcset: `${S.brand.logo} 512w, ${S.brand.logoLarge} 1024w`, sizes: '(max-width: 720px) 78vw, 520px', alt: S.name, width: S.brand.logoSize, height: S.brand.logoSize, fetchpriority: 'high', decoding: 'async' })
        )
      )
    ),
    h('nav', { class: 'hand', 'aria-label': H.handLabel },
      h('p', { class: 'hand__title' }, H.handLabel),
      h('ol', { class: 'hand__fan' }, handCards)),
    h('div', { class: 'ticker', role: 'marquee', 'aria-label': 'Live' },
      h('ul', { class: 'ticker__track' }, tickerItems(false), tickerItems(true)))
  );
}

/* ======================================================================
 * 01 · Les annonces
 * ==================================================================== */
function annonces(t, n, total) {
  const c = t.chapters.annonces;
  const ladder = [80, 90, 100, 110, 120, 130, 140, 150, 160];
  const current = h('span', { class: 'bids__value' }, '—');
  const currentSuit = h('span', { class: 'bids__suit' });
  const board = h('div', { class: 'bids__board', 'data-reveal': '' },
    h('div', { class: 'bids__current' }, h('small', null, 'Kýdos'), current, currentSuit),
    h('ol', { class: 'bids__ladder' }, ladder.map((v) => h('li', { class: 'bid', 'data-v': v }, String(v)))),
    h('div', { class: 'bids__calls' },
      h('span', { class: 'call call--contre' }, c.contre.label),
      h('span', { class: 'call call--surcontre' }, c.surcontre.label)));

  const cards = c.bids.map((b) => h('article', { class: `bidcard bidcard--${b.suit}`, 'data-bid': b.value, 'data-suit': b.suit, 'data-reveal': '' },
    h('p', { class: 'bidcard__call' }, h('b', null, b.value), h('i', { class: isRed(b.suit) ? 'suit--red' : 'suit--cold' }, SUITS[b.suit])),
    h('h3', null, b.title),
    h('p', null, b.text)));

  const stamps = h('div', { class: 'stamps' },
    h('div', { class: 'stamp stamp--contre', 'data-reveal': '' }, h('b', null, c.contre.label), h('p', null, c.contre.text)),
    h('div', { class: 'stamp stamp--surcontre', 'data-reveal': '' }, h('b', null, c.surcontre.label), h('p', null, c.surcontre.text)));

  const sec = chapter('annonces', null,
    h('div', { class: 'wrap' },
      head(t, 'annonces', n, total),
      h('div', { class: 'bids' }, h('div', { class: 'bids__aside' }, board), h('div', { class: 'bids__list' }, cards, stamps))));

  // L'enchère affichée suit la carte au centre de l'écran.
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const v = Number(e.target.dataset.bid);
        const suit = e.target.dataset.suit;
        current.textContent = String(v);
        currentSuit.textContent = SUITS[suit];
        currentSuit.className = `bids__suit ${isRed(suit) ? 'suit--red' : 'suit--cold'}`;
        board.querySelectorAll('.bid').forEach((b) => {
          const bv = Number(b.dataset.v);
          b.classList.toggle('is-on', bv === v);
          b.classList.toggle('is-passed', bv < v);
        });
        cards.forEach((cd) => cd.classList.toggle('is-active', cd === e.target));
      }
    }, { rootMargin: '-42% 0px -42% 0px' });
    cards.forEach((cd) => io.observe(cd));
    whenVisible(stamps, () => board.classList.add('is-called'), { threshold: 0.5 });
  }
  return sec;
}

/* ======================================================================
 * 02 · La table
 * ==================================================================== */
function jeu(t, S, n, total) {
  const c = t.chapters.jeu;
  return chapter('jeu', null,
    h('div', { class: 'wrap' },
      head(t, 'jeu', n, total),
      h('div', { class: 'jeu' },
        h('div', { class: 'jeu__stage', 'data-reveal': '' },
          device(S.media.jeuDevice, c.deviceAlt, 'device--tilt'),
          h('div', { class: 'jeu__console' },
            createConsole(c.consoleTitle, c.console),
            h('p', { class: 'jeu__console-cap' }, c.consoleCaption)),
          h('figure', { class: 'jeu__proof' },
            img(S.media.jeuConsole.src, c.consoleAlt, { width: S.media.jeuConsole.width, height: S.media.jeuConsole.height })),
        ),
        h('ul', { class: 'features' }, c.features.map((f, i) => h('li', { class: 'feature', style: { '--d': `${i * 70}ms` }, 'data-reveal': '' },
          h('span', { class: 'feature__icon' }, icon(f.icon)),
          h('h3', null, f.title),
          h('p', null, f.text))))
      )));
}

/* ======================================================================
 * 03 · L'écurie
 * ==================================================================== */
function ecurie(t, S, n, total, keep) {
  const c = t.chapters.ecurie;
  const ranks = ['A', 'R', 'D', 'V'];
  return chapter('ecurie', null,
    h('div', { class: 'wrap' },
      head(t, 'ecurie', n, total),
      keep(createLab(c.lab, S.lab)),
      h('ul', { class: 'roles' }, c.roles.map((r, i) => h('li', { class: ['role', isRed(r.suit) ? 'role--red' : 'role--black'], style: { '--d': `${i * 80}ms`, '--r': `${(i - 1.5) * 3}deg` }, 'data-reveal': '' },
        h('span', { class: 'role__corner', 'aria-hidden': 'true' }, h('b', null, t.ui.ranks[ranks[i]]), h('i', null, SUITS[r.suit])),
        h('span', { class: 'role__pip', 'aria-hidden': 'true' }, SUITS[r.suit]),
        h('h3', null, r.title),
        h('p', null, r.text),
        h('span', { class: 'role__corner role__corner--br', 'aria-hidden': 'true' }, h('b', null, t.ui.ranks[ranks[i]]), h('i', null, SUITS[r.suit]))))),
      h('div', { class: 'ecurie__shot', 'data-reveal': '' }, device(S.media.ecurieDevice, c.deviceAlt, 'device--flat'))
    ));
}

/* ======================================================================
 * 04 · Le cerveau
 * ==================================================================== */
function cerveau(t, S, n, total, keep) {
  const c = t.chapters.cerveau;
  return chapter('cerveau', null,
    h('div', { class: 'wrap' },
      head(t, 'cerveau', n, total),
      keep(createBrain(c, S.crew.croupier)),
      h('div', { class: 'cerveau__shot', 'data-reveal': '' }, device(S.media.cerveauDevice, c.deviceAlt, 'device--tilt-r'))));
}

/* ======================================================================
 * 05 · Les formats
 * ==================================================================== */
function formats(t, S, n, total) {
  const c = t.chapters.formats;
  const seatPos = ['n', 'e', 's', 'w'];
  return chapter('formats', null,
    h('div', { class: 'wrap' },
      head(t, 'formats', n, total),
      h('ul', { class: 'formats' }, S.formats.map((f, i) => {
        const tx = c.items[f.id];
        return h('li', { class: `format format--${f.id}`, style: { '--fc': f.color, '--d': `${i * 110}ms` }, 'data-reveal': '' },
          h('div', { class: 'format__table', 'aria-hidden': 'true' },
            h('div', { class: 'format__felt' }, h('span', null, SUITS[f.suit])),
            f.seats.map((m, k) => h('span', { class: ['seat', `seat--${seatPos[k]}`, k % 2 ? 'seat--eux' : 'seat--nous'] },
              h('img', { src: `assets/mascots/${m}.svg`, alt: '', width: 120, height: 300, loading: 'lazy' })))),
          h('p', { class: 'format__compo' }, tx.composition),
          h('h3', { class: 'format__name' }, h('i', null, SUITS[f.suit]), tx.name),
          h('p', { class: 'format__tag' }, tx.tagline),
          h('p', { class: 'format__text' }, tx.text));
      })),
      h('div', { class: 'formats__shot', 'data-reveal': '' }, device(S.media.formatsDevice, c.deviceAlt, 'device--flat'))));
}

/* ======================================================================
 * 06 · L'arène
 * ==================================================================== */
function arene(t, S, n, total, keep) {
  const c = t.chapters.arene;
  const stats = h('ul', { class: 'stats' }, c.stats.map((st) => {
    const b = h('b', null, '0');
    const li = h('li', { class: 'stat', 'data-reveal': '' }, b, h('span', null, st.label));
    whenVisible(li, () => countUp(b, st.value), { threshold: 0.6 });
    return li;
  }));
  return chapter('arene', null,
    h('div', { class: 'wrap' },
      head(t, 'arene', n, total),
      h('div', { class: 'arene' },
        keep(createBracket(c, S.bracket)),
        stats),
      h('div', { class: 'arene__bottom' },
        h('ul', { class: 'community' }, c.community.map((it, i) => h('li', { class: 'comm', style: { '--d': `${i * 80}ms` }, 'data-reveal': '' },
          h('span', { class: 'comm__icon' }, icon(it.icon)),
          h('h3', null, it.title),
          h('p', null, it.text)))),
        h('div', { class: 'arene__shot', 'data-reveal': '' }, device(S.media.arenePodium, c.podiumAlt, 'device--flat')))));
}

/* ======================================================================
 * 07 · La cagnotte
 * ==================================================================== */
function cagnotte(t, S, n, total) {
  const c = t.chapters.cagnotte;
  const amount = h('b', { class: 'daily__amount' }, `+${c.daily.amount}`);
  const claimBtn = h('button', { type: 'button', class: 'btn btn--success btn--block daily__claim' }, c.daily.claim);
  const daily = h('article', { class: 'wallet-card wallet-card--daily', 'data-reveal': '' },
    h('p', { class: 'wallet-card__label' }, c.daily.label, icon('gift')),
    h('p', { class: 'daily__value' }, amount, h('span', { class: 'coin-glyph' }, '◆')),
    h('div', { class: 'daily__streak' },
      h('span', null, c.daily.streak),
      h('span', { class: 'gauge', 'aria-hidden': 'true' }, Array.from({ length: 7 }, (_, i) => h('i', { class: i < 3 ? 'is-on' : null }))),
      h('b', null, `3 ${c.daily.days}`)),
    claimBtn);
  claimBtn.addEventListener('click', () => {
    if (claimBtn.disabled) return;
    claimBtn.disabled = true;
    claimBtn.textContent = c.daily.claimed;
    daily.classList.add('is-claimed');
    daily.querySelectorAll('.gauge i')[3].classList.add('is-on');
    burst(claimBtn);
  });

  const lv = c.level;
  const vip = h('article', { class: 'wallet-card wallet-card--vip', 'data-reveal': '' },
    h('p', { class: 'wallet-card__label' }, c.vip.label, icon('crown')),
    h('div', { class: 'vip__avatar' }, h('img', { src: 'assets/mascots/robot-champion-tete.svg', alt: '', width: 120, height: 132, loading: 'lazy' }), h('i', { class: 'vip__crown' }, icon('crown'))),
    h('h3', null, c.vip.title),
    h('ul', { class: 'vip__perks' }, c.vip.perks.map((p) => h('li', null, icon('check'), p))),
    h('p', { class: 'vip__note' }, c.vip.note));

  const level = h('article', { class: 'wallet-card wallet-card--level', 'data-reveal': '' },
    h('p', { class: 'wallet-card__label' }, `${lv.label} ${lv.value}`, h('span', { class: 'level__pts' }, `⚡ ${lv.current} / ${lv.target}`)),
    h('div', { class: 'level__ring', style: { '--p': Math.round((lv.current / lv.target) * 100) } }, h('b', null, String(lv.value))),
    h('div', { class: 'progress-seg', style: { '--v': Math.round((lv.current / lv.target) * 100) } }),
    h('p', { class: 'level__reward' }, lv.reward));

  return chapter('cagnotte', null,
    h('div', { class: 'wrap' },
      head(t, 'cagnotte', n, total),
      h('div', { class: 'cagnotte' },
        h('div', { class: 'coin3d', 'aria-hidden': 'true' },
          h('div', { class: 'coin3d__spin' }, h('span', { class: 'coin3d__face' }, '◆'), h('span', { class: 'coin3d__face coin3d__face--back' }, 'K'))),
        daily, vip, level),
      h('p', { class: 'disclaimer', 'data-reveal': '' }, icon('info'), c.disclaimer),
      h('div', { class: 'cagnotte__shot', 'data-reveal': '' }, device(S.media.cagnotteDevice, c.deviceAlt, 'device--tilt'))));
}

function burst(origin) {
  if (reducedMotion()) return;
  const r = origin.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  for (let i = 0; i < 18; i += 1) {
    const ang = (Math.PI * 2 * i) / 18 + Math.random() * 0.4;
    const dist = 70 + Math.random() * 90;
    const p = h('span', { class: 'coin-burst', 'aria-hidden': 'true', style: { left: `${cx}px`, top: `${cy}px` } }, '◆');
    document.body.append(p);
    p.animate([
      { transform: 'translate(-50%,-50%) scale(.4)', opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(ang) * dist}px), calc(-50% + ${Math.sin(ang) * dist - 40}px)) scale(1) rotate(${ang}rad)`, opacity: 0 }
    ], { duration: 900 + Math.random() * 400, easing: 'cubic-bezier(.2,.8,.3,1)' }).finished.then(() => p.remove()).catch(() => p.remove());
  }
}

/* ======================================================================
 * 08 · La vitrine
 * ==================================================================== */
function vitrine(t, S, n, total, keep) {
  const c = t.chapters.vitrine;
  return chapter('vitrine', null,
    h('div', { class: 'wrap' },
      head(t, 'vitrine', n, total),
      h('ul', { class: 'specs' }, c.specs.map((sp, i) => h('li', { class: 'spec', style: { '--d': `${i * 60}ms` }, 'data-reveal': '' }, h('b', null, sp.value), h('span', null, sp.label)))),
      keep(createGallery(c, S.gallery, t.ui))));
}

/* ======================================================================
 * La maison
 * ==================================================================== */
function maison(t) {
  const c = t.chapters.maison;
  return chapter('maison', null,
    h('div', { class: 'wrap' },
      head(t, 'maison', 0, 0),
      h('div', { class: 'studios' },
        c.studios.map((st, i) => h('article', { class: `studio studio--${st.id}`, style: { '--d': `${i * 120}ms` }, 'data-reveal': '' },
          h('p', { class: 'studio__seat' }, i === 0 ? 'A' : 'C'),
          h('h3', { class: 'studio__name' }, st.name),
          h('p', { class: 'studio__motto' }, st.motto),
          h('p', { class: 'studio__text' }, st.text),
          h('a', { class: 'studio__link', href: st.url, target: '_blank', rel: 'noopener noreferrer' }, st.domain, h('span', { class: 'sr-only' }, ` ${t.ui.external}`), icon('arrowR')))),
        h('span', { class: 'studios__amp', 'aria-hidden': 'true' }, '♥')),
      h('div', { class: 'stack', 'data-reveal': '' },
        h('p', { class: 'stack__title' }, c.stackTitle),
        h('ol', { class: 'stack__list' }, c.stack.map((it, i) => h('li', { style: { '--d': `${i * 60}ms` } },
          h('span', { class: 'stack__n' }, pad(i + 1)),
          h('b', null, it.title),
          h('span', null, it.text)))))));
}

/* ======================================================================
 * Capot !
 * ==================================================================== */
function capot(t, S) {
  const c = t.chapters.capot;
  const fan = h('div', { class: 'capot__fan', 'aria-hidden': 'true' },
    S.chapters.map((ch, i) => h('span', { class: 'capot__card', style: { '--i': i, '--n': S.chapters.length } },
      playingCard({ rank: t.ui.ranks[ch.card.rank] || ch.card.rank, suit: ch.card.suit, size: 'md' }))));
  const stores = h('ul', { class: 'stores' }, S.stores.map((st) => {
    const tx = c.stores[st.id] || { top: '', name: st.id };
    const inner = [
      h('span', { class: `store__logo store__logo--${st.platform}`, 'aria-hidden': 'true' }),
      h('span', { class: 'store__txt' }, h('small', null, tx.top), h('b', null, tx.name))
    ];
    return h('li', null, st.url
      ? h('a', { class: 'store', href: st.url, target: '_blank', rel: 'noopener noreferrer' }, inner)
      : h('span', { class: 'store store--soon' }, inner, h('em', { class: 'store__soon' }, t.ui.comingSoon)));
  }));
  return h('section', { class: 'chapter chapter--capot capot', id: 'capot', 'data-chapter': 'capot', 'aria-labelledby': 'capot-title' },
    h('div', { class: 'capot__rays', 'aria-hidden': 'true' }),
    h('div', { class: 'wrap capot__inner' },
      h('p', { class: 'ch-kicker', 'data-reveal': '' }, h('span', { class: 'ch-num' }, `${t.ui.capot} · ${S.capotPoints}`), h('span', null, c.kicker)),
      fan,
      h('h2', { class: 'capot__title', id: 'capot-title', 'data-text': c.title, 'data-reveal': '' }, c.title),
      h('p', { class: 'capot__lead', 'data-reveal': '' }, c.lead),
      h('p', { class: 'capot__avail', 'data-reveal': '' }, h('i', { class: 'pulse-dot' }), c.availability),
      h('div', { 'data-reveal': '' }, stores),
      h('div', { class: 'capot__contact', 'data-reveal': '' },
        h('p', null, c.contactTitle),
        h('div', { class: 'capot__actions' },
          h('a', { class: 'btn btn--primary btn--lg', href: `mailto:${S.contactEmail}` }, icon('mail'), c.contactCta),
          h('button', {
            type: 'button', class: 'btn btn--ghost btn--lg',
            onclick: () => {
              resetGame();
              document.querySelectorAll('.ch-flip.is-flipped').forEach((f) => f.classList.remove('is-flipped'));
              window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
            }
          }, icon('shuffle'), c.replay)),
        h('p', { class: 'capot__mail' }, rich(`[${S.contactEmail}](mailto:${S.contactEmail})`)))));
}

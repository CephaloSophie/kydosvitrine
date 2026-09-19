/* Tableau de tournoi animé : les vainqueurs avancent jusqu'au titre. */
import { h, s, icon, wait, reducedMotion } from '../dom.js';
import { whenVisible } from './fx.js';

// Déroulé scénarisé : indices des équipes et scores (vainqueur en premier).
const PLAN = {
  qf: [[0, 1, '2', '1'], [2, 3, '2', '0'], [5, 4, '2', '1'], [7, 6, '2', '1']],
  sf: [[2, 0, '2', '1'], [5, 7, '2', '0']],
  f: [[2, 5, '2', '1']]
};

export function createBracket(A, teams) {
  const matchEls = { qf: [], sf: [], f: [] };

  function match(round, i, a, b) {
    const el = h('div', { class: 'bm', 'data-round': round, 'data-i': i },
      h('div', { class: 'bm__row', 'data-team': a ?? '' }, h('span', { class: 'bm__name' }, a !== null ? teams[a] : '—'), h('b', { class: 'bm__score' }, '–')),
      h('div', { class: 'bm__row', 'data-team': b ?? '' }, h('span', { class: 'bm__name' }, b !== null ? teams[b] : '—'), h('b', { class: 'bm__score' }, '–')));
    matchEls[round].push(el);
    return el;
  }

  const cols = [
    h('div', { class: 'br__col' }, h('p', { class: 'br__round' }, A.bracketRounds[0]),
      h('div', { class: 'br__matches' }, [[0, 1], [2, 3], [4, 5], [6, 7]].map(([a, b], i) => match('qf', i, a, b)))),
    h('div', { class: 'br__col' }, h('p', { class: 'br__round' }, A.bracketRounds[1]),
      h('div', { class: 'br__matches' }, [0, 1].map((i) => match('sf', i, null, null)))),
    h('div', { class: 'br__col' }, h('p', { class: 'br__round' }, A.bracketRounds[2]),
      h('div', { class: 'br__matches' }, match('f', 0, null, null))),
    h('div', { class: 'br__col br__col--champ' }, h('p', { class: 'br__round' }, A.bracketRounds[3]),
      h('div', { class: 'br__matches' },
        h('div', { class: 'br__champ' }, icon('crown'), h('span', { class: 'br__champ-name' }, '—'))))
  ];

  const wires = s('svg', { class: 'br__wires', 'aria-hidden': 'true' });
  const board = h('div', { class: 'br__board' }, wires, ...cols);
  const spect = h('b', null, '0');
  const live = h('span', { class: 'live-chip' }, h('i'), A.live);
  const root = h('div', { class: 'bracket panel', 'data-reveal': '' },
    h('div', { class: 'bracket__head' },
      h('p', { class: 'bracket__title' }, A.bracketTitle),
      live,
      h('span', { class: 'bracket__spect' }, icon('eye'), spect, ' ', A.spectators)),
    h('div', { class: 'br__scroll' }, board));

  const links = []; // [fromEl, toEl, path]
  function link(from, to) {
    const p = s('path', { class: 'br__wire' });
    wires.append(p);
    links.push([from, to, p]);
  }
  matchEls.qf.forEach((m, i) => link(m, matchEls.sf[i >> 1]));
  matchEls.sf.forEach((m) => link(m, matchEls.f[0]));
  const champ = cols[3].querySelector('.br__champ');
  link(matchEls.f[0], champ);

  function layout() {
    const box = board.getBoundingClientRect();
    if (!box.width) return;
    wires.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    for (const [from, to, p] of links) {
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      const x1 = a.right - box.left; const y1 = a.top - box.top + a.height / 2;
      const x2 = b.left - box.left; const y2 = b.top - box.top + b.height / 2;
      const mx = x1 + (x2 - x1) / 2;
      p.setAttribute('d', `M${x1},${y1} H${mx} V${y2} H${x2}`);
    }
  }

  function setRow(el, idx, name, score, state) {
    const row = el.children[idx];
    if (name !== undefined) row.querySelector('.bm__name').textContent = name;
    if (score !== undefined) row.querySelector('.bm__score').textContent = score;
    if (state) row.classList.add(state);
  }

  async function resolve(round, i, fast) {
    const [w, l, sw, sl] = PLAN[round][i];
    const el = matchEls[round][i];
    el.classList.add('is-live');
    if (!fast) await wait(round === 'f' ? 1400 : 520);
    const rows = Array.from(el.children);
    const winIdx = rows.findIndex((r) => r.dataset.team === String(w));
    setRow(el, winIdx, undefined, sw, 'is-win');
    setRow(el, 1 - winIdx, undefined, sl, 'is-lose');
    el.classList.remove('is-live');
    el.classList.add('is-done');
    const lk = links.find(([from]) => from === el);
    if (lk) lk[2].classList.add('is-on');
    // Le vainqueur avance.
    if (round === 'qf') { const t = matchEls.sf[i >> 1]; const slot = i % 2; t.children[slot].dataset.team = String(w); setRow(t, slot, teams[w]); }
    if (round === 'sf') { const t = matchEls.f[0]; t.children[i].dataset.team = String(w); setRow(t, i, teams[w]); }
    if (round === 'f') { champ.querySelector('.br__champ-name').textContent = teams[w]; champ.classList.add('is-on'); live.classList.add('is-off'); }
    if (!fast) await wait(260);
  }

  let played = false;
  async function play() {
    if (played) return;
    played = true;
    const fast = reducedMotion();
    let n = 0;
    const target = 10;
    const spTimer = setInterval(() => { n = Math.min(target, n + 1); spect.textContent = String(n); if (n >= target) clearInterval(spTimer); }, fast ? 1 : 420);
    for (let i = 0; i < 4; i += 1) await resolve('qf', i, fast);
    for (let i = 0; i < 2; i += 1) await resolve('sf', i, fast);
    await resolve('f', 0, fast);
  }

  const ro = 'ResizeObserver' in window ? new ResizeObserver(layout) : null;
  requestAnimationFrame(() => { layout(); if (ro) ro.observe(board); });
  whenVisible(root, () => { layout(); play(); }, { threshold: 0.35 });
  root.destroy = () => { if (ro) ro.disconnect(); };
  return root;
}

/* Démo de l'éditeur de cerveau : des nœuds reliés, une décision qui se propage. */
import { h, s, icon, wait, reducedMotion } from '../dom.js';
import { whenVisible } from './fx.js';

const NODES = [
  { id: 'trigger', kind: 'trigger' },
  { id: 'jack', kind: 'condition' },
  { id: 'trumps', kind: 'condition' },
  { id: 'partner', kind: 'condition' },
  { id: 'score', kind: 'compute' },
  { id: 'bid', kind: 'action' }
];
const EDGES = [
  ['trigger', 'jack'], ['trigger', 'trumps'], ['trigger', 'partner'],
  ['jack', 'score'], ['trumps', 'score'], ['score', 'bid'], ['partner', 'bid']
];
const STEPS = [
  { nodes: ['trigger'], edges: [] },
  { nodes: ['jack', 'trumps', 'partner'], edges: [0, 1, 2] },
  { nodes: ['score'], edges: [3, 4] },
  { nodes: ['bid'], edges: [5, 6] }
];

export function createBrain(C, croupierHead) {
  const nodeEls = {};
  const grid = h('div', { class: 'brain__nodes' },
    NODES.map((n) => {
      const txt = C.nodes[n.id];
      const el = h('div', { class: ['bnode', `bnode--${n.kind}`, `bnode--${n.id}`], 'data-node': n.id },
        h('span', { class: 'bnode__kind' }, C.legend[n.kind]),
        h('span', { class: 'bnode__title' }, txt.title),
        h('span', { class: 'bnode__detail' }, txt.detail),
        h('span', { class: 'bnode__ok', 'aria-hidden': 'true' }, icon('check')),
        h('i', { class: 'bnode__port bnode__port--in' }),
        h('i', { class: 'bnode__port bnode__port--out' })
      );
      nodeEls[n.id] = el;
      return el;
    }));

  const wires = s('svg', { class: 'brain__wires', 'aria-hidden': 'true' });
  const edgeEls = EDGES.map(() => {
    const base = s('path', { class: 'wire' });
    const flow = s('path', { class: 'wire wire--flow' });
    wires.append(base, flow);
    return { base, flow };
  });

  const output = h('div', { class: 'brain__output', 'aria-live': 'polite' },
    h('img', { src: `assets/mascots/${croupierHead}.svg`, alt: '', width: 120, height: 132 }),
    h('p', null, h('span', { class: 'mono' }, '›'), ' ', C.output));

  const runBtn = h('button', { type: 'button', class: 'btn btn--primary brain__run', onclick: () => run() }, icon('play'), h('span', null, C.run));

  const canvas = h('div', { class: 'brain__canvas' }, wires, grid);
  const legend = h('ul', { class: 'brain__legend' },
    ['trigger', 'condition', 'compute', 'action'].map((k) => h('li', { class: `lg lg--${k}` }, h('i'), C.legend[k])));
  const presets = h('div', { class: 'brain__presets' },
    h('p', null, C.presets.title),
    h('div', { class: 'brain__chips', role: 'group', 'aria-label': C.presets.title },
      C.presets.items.map((p, i) => h('button', {
        type: 'button', class: ['chip-btn', i === 0 && 'is-on'], 'aria-pressed': String(i === 0),
        onclick: (e) => {
          presets.querySelectorAll('.chip-btn').forEach((b) => { b.classList.remove('is-on'); b.setAttribute('aria-pressed', 'false'); });
          e.currentTarget.classList.add('is-on');
          e.currentTarget.setAttribute('aria-pressed', 'true');
          run();
        }
      }, p))));

  const root = h('div', { class: 'brain panel', 'data-reveal': '' },
    h('div', { class: 'brain__bar' }, legend, runBtn),
    canvas,
    h('div', { class: 'brain__foot' }, presets, output)
  );

  function layout() {
    const box = canvas.getBoundingClientRect();
    if (!box.width) return;
    wires.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    const stacked = box.width < 640;
    EDGES.forEach(([a, b], i) => {
      const ra = nodeEls[a].getBoundingClientRect();
      const rb = nodeEls[b].getBoundingClientRect();
      let d;
      if (stacked) {
        const x1 = ra.left - box.left; const y1 = ra.top - box.top + ra.height / 2;
        const x2 = rb.left - box.left; const y2 = rb.top - box.top + rb.height / 2;
        const bend = Math.min(30, 10 + Math.abs(y2 - y1) * 0.08);
        d = `M${x1},${y1} C${x1 - bend},${y1} ${x2 - bend},${y2} ${x2},${y2}`;
      } else {
        const x1 = ra.right - box.left; const y1 = ra.top - box.top + ra.height / 2;
        const x2 = rb.left - box.left; const y2 = rb.top - box.top + rb.height / 2;
        const mid = (x2 - x1) * 0.5;
        d = `M${x1},${y1} C${x1 + mid},${y1} ${x2 - mid},${y2} ${x2},${y2}`;
      }
      edgeEls[i].base.setAttribute('d', d);
      edgeEls[i].flow.setAttribute('d', d);
      if (!running) {
        if (edgeEls[i].flow.getAnimations) edgeEls[i].flow.getAnimations().forEach((an) => an.cancel());
        edgeEls[i].flow.style.strokeDasharray = 'none';
      }
    });
    root.classList.toggle('is-stacked', stacked);
  }

  let running = false;
  async function run() {
    if (running) return;
    running = true;
    runBtn.disabled = true;
    runBtn.querySelector('span').textContent = C.running;
    root.classList.remove('is-done');
    Object.values(nodeEls).forEach((el) => el.classList.remove('is-on'));
    edgeEls.forEach((e) => e.flow.classList.remove('is-on'));
    const fast = reducedMotion();
    for (const step of STEPS) {
      step.edges.forEach((i) => pulse(edgeEls[i].flow, fast));
      if (step.edges.length && !fast) await wait(520);
      step.nodes.forEach((id) => nodeEls[id].classList.add('is-on'));
      if (!fast) await wait(380);
    }
    root.classList.add('is-done');
    runBtn.disabled = false;
    runBtn.querySelector('span').textContent = C.run;
    running = false;
  }

  function pulse(path, fast) {
    path.classList.add('is-on');
    if (fast || !path.getTotalLength) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len} ${len}`;
    path.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 560, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' });
  }

  const ro = 'ResizeObserver' in window ? new ResizeObserver(() => layout()) : null;
  requestAnimationFrame(() => {
    layout();
    if (ro) ro.observe(canvas);
    else window.addEventListener('resize', layout);
  });
  whenVisible(root, () => { layout(); run(); }, { threshold: 0.45 });

  root.destroy = () => { if (ro) ro.disconnect(); };
  return root;
}

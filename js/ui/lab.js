/* Laboratoire de l'écurie : trois curseurs de personnalité qui changent
 * la mascotte, son allure et son style de jeu. */
import { h, s, icon, clamp } from '../dom.js';

const GLOW = {
  champion: '#FFD23F', contreur: '#FF4D6D', stratege: '#22E1FF',
  eclair: '#FFE27A', prudent: '#FF8A3D', equilibre: '#3DFFA2'
};
const KEYS = ['aggression', 'focus', 'speed'];

export function classify({ aggression: a, focus: f, speed: v }) {
  if (a >= 78 && f >= 78 && v >= 78) return 'champion';
  if (a <= 28) return 'prudent';
  const vals = { contreur: a, stratege: f, eclair: v };
  const max = Math.max(a, f, v);
  const min = Math.min(a, f, v);
  if (max - min < 16) return 'equilibre';
  return Object.keys(vals).find((k) => vals[k] === max);
}

export function createLab(L, conf) {
  const state = { ...conf.defaults };
  const ids = { aggression: 'lab-a', focus: 'lab-f', speed: 'lab-v' };

  const mascot = h('img', { class: 'lab__bot', src: `assets/mascots/${conf.archetypes.equilibre.mascot}.svg`, alt: '', width: 120, height: 300 });
  const name = h('p', { class: 'lab__name' });
  const text = h('p', { class: 'lab__text' });
  const radarShape = s('polygon', { class: 'lab__radar-shape', points: '' });
  const radar = s('svg', { class: 'lab__radar', viewBox: '-60 -60 120 120', 'aria-hidden': 'true' },
    [1, 0.66, 0.33].map((k) => s('polygon', { class: 'lab__radar-grid', points: tri(k * 50) })),
    ...[0, 1, 2].map((i) => { const [x, y] = pt(i, 50); return s('line', { class: 'lab__radar-axis', x1: 0, y1: 0, x2: x, y2: y }); }),
    radarShape
  );

  const outputs = {};
  const inputs = {};
  const sliders = KEYS.map((k) => {
    const out = h('output', { class: 'lab__val', for: ids[k] }, String(state[k]));
    const input = h('input', {
      id: ids[k], class: 'lab__range', type: 'range', min: 0, max: 100, step: 1, value: state[k],
      'aria-describedby': `${ids[k]}-hint`,
      oninput: (e) => { state[k] = Number(e.target.value); update(); }
    });
    outputs[k] = out; inputs[k] = input;
    return h('div', { class: `lab__slider lab__slider--${k}` },
      h('div', { class: 'lab__slider-head' }, h('label', { for: ids[k] }, L.sliders[k].label), out),
      input,
      h('p', { class: 'lab__hint', id: `${ids[k]}-hint` }, L.sliders[k].hint)
    );
  });

  const stage = h('div', { class: 'lab__stage' },
    h('div', { class: 'lab__halo', 'aria-hidden': 'true' }),
    h('div', { class: 'lab__bob' }, mascot),
    h('div', { class: 'lab__pedestal', 'aria-hidden': 'true' }, h('i'), h('i'), h('i'))
  );

  const readout = h('div', { class: 'lab__readout', 'aria-live': 'polite' },
    h('span', { class: 'lab__style' }, L.styleLabel), name, text);

  const root = h('div', { class: 'lab panel', 'data-reveal': '' },
    h('div', { class: 'lab__head' },
      h('p', { class: 'lab__title' }, icon('robot'), L.title),
      h('p', { class: 'lab__subtitle' }, L.subtitle)
    ),
    h('div', { class: 'lab__grid' },
      h('div', { class: 'lab__left' }, stage, readout),
      h('div', { class: 'lab__right' },
        radar,
        h('div', { class: 'lab__sliders' }, sliders),
        h('button', { type: 'button', class: 'btn btn--ghost btn--sm lab__random', onclick: randomize }, icon('shuffle'), L.randomize)
      )
    )
  );

  let currentArch = null;
  function update() {
    for (const k of KEYS) {
      outputs[k].textContent = String(state[k]);
      inputs[k].style.setProperty('--v', String(state[k]));
    }
    root.style.setProperty('--a', String(state.aggression / 100));
    root.style.setProperty('--f', String(state.focus / 100));
    root.style.setProperty('--s', String(state.speed / 100));
    radarShape.setAttribute('points', [state.aggression, state.focus, state.speed].map((v, i) => pt(i, clamp(v, 4, 100) / 2).join(',')).join(' '));
    const arch = classify(state);
    root.style.setProperty('--glow', GLOW[arch]);
    if (arch !== currentArch) {
      currentArch = arch;
      name.textContent = L.archetypes[arch].name;
      text.textContent = L.archetypes[arch].text;
      stage.classList.remove('is-swap');
      void stage.offsetWidth;
      stage.classList.add('is-swap');
      mascot.src = `assets/mascots/${conf.archetypes[arch].mascot}.svg`;
    }
  }

  function randomize() {
    for (const k of KEYS) {
      state[k] = Math.round(Math.random() * 100);
      inputs[k].value = String(state[k]);
    }
    update();
  }

  // Précharge les autres mascottes pour des changements instantanés.
  Object.values(conf.archetypes).forEach((a) => { const im = new Image(); im.src = `assets/mascots/${a.mascot}.svg`; });
  update();
  return root;
}

function pt(i, r) {
  const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
  return [+(Math.cos(ang) * r).toFixed(2), +(Math.sin(ang) * r).toFixed(2)];
}
function tri(r) { return [0, 1, 2].map((i) => pt(i, r).join(',')).join(' '); }

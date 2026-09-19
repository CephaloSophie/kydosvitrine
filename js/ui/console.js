/* Console moteur : les pensées d'un robot s'écrivent en direct. */
import { h, wait, reducedMotion } from '../dom.js';
import { whenVisible } from './fx.js';

export function createConsole(title, lines) {
  const body = h('ol', { class: 'console__body' });
  const root = h('figure', { class: 'console', 'aria-label': title },
    h('div', { class: 'console__bar' },
      h('span', { class: 'console__dots', 'aria-hidden': 'true' }, h('i'), h('i'), h('i')),
      h('span', { class: 'console__title' }, title),
      h('span', { class: 'console__levels', 'aria-hidden': 'true' }, ['ERR', 'WRN', 'INF', 'DBG'].map((l) => h('i', { class: `lvl lvl--${l}` }, l)))
    ),
    body
  );

  let visible = false;
  let started = false;
  const time = (i) => {
    const sec = 22 + i * 2;
    return `21:23:${String(sec % 60).padStart(2, '0')}`;
  };

  function row(line, i) {
    return h('li', { class: 'console__line' },
      h('span', { class: 'console__time' }, time(i)),
      h('span', { class: `lvl lvl--${line.lvl}` }, line.lvl),
      h('span', { class: 'console__text' }));
  }

  async function play() {
    if (reducedMotion()) {
      lines.forEach((l, i) => { const r = row(l, i); r.lastChild.textContent = l.text; body.append(r); });
      return;
    }
    for (;;) {
      body.replaceChildren();
      for (let i = 0; i < lines.length; i += 1) {
        while (!visible) {
          await wait(400);
          if (!root.isConnected) return;
        }
        if (!root.isConnected) return;
        const r = row(lines[i], i);
        body.append(r);
        const txt = lines[i].text;
        const target = r.lastChild;
        for (let c = 1; c <= txt.length; c += 2) {
          target.textContent = txt.slice(0, c);
          await wait(14);
        }
        target.textContent = txt;
        while (body.children.length > 6) body.firstChild.remove();
        await wait(520);
      }
      await wait(2600);
    }
  }

  whenVisible(root, (v) => {
    visible = v;
    if (v && !started) { started = true; play(); }
  }, { threshold: 0.2, once: false });

  return root;
}

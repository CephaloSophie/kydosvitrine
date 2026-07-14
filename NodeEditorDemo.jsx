// Fake node editor demo — cosmic styled, with toolbox — illustrates robot strategy editing
function NodeEditorDemo({ lang }) {
  const fr = lang !== 'en';
  const [hovered, setHovered] = React.useState(null);
  const [pulse, setPulse] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setPulse(p => (p + 1) % 4), 1600);
    return () => clearInterval(t);
  }, []);

  const toolbox = [
    { icon: 'A♠', color: '#4a7dff', label: fr ? 'Compter cartes' : 'Count cards' },
    { icon: '?', color: '#ffab40', label: fr ? 'Condition' : 'Condition' },
    { icon: '×', color: '#b388ff', label: fr ? 'Calcul' : 'Math' },
    { icon: '♦', color: '#ff5c8a', label: fr ? 'Évaluer main' : 'Evaluate hand' },
    { icon: '▶', color: '#e2c66d', label: fr ? 'Action' : 'Action' },
    { icon: '🤝', color: '#40d47e', label: fr ? 'Partenaire' : 'Partner' },
  ];

  const nodes = [
    { id: 'aces', x: 30, y: 30, color: '#4a7dff', icon: 'A', title: fr ? 'Compter les As' : 'Count Aces', out: '→ 3', outs: [{ id: 'o1', y: 0.5 }], ins: [] },
    { id: 'partner', x: 30, y: 170, color: '#40d47e', icon: '🤝', title: fr ? 'Annonce partenaire' : 'Partner bid', out: '→ 110', outs: [{ id: 'o1', y: 0.5 }], ins: [] },
    { id: 'cond', x: 290, y: 90, color: '#ffab40', icon: '?', title: fr ? 'Si > 100' : 'If > 100', out: '✓', outs: [{ id: 'o1', y: 0.5 }], ins: [{ id: 'i1', y: 0.5 }] },
    { id: 'mult', x: 290, y: 230, color: '#b388ff', icon: '×', title: fr ? 'As × 10' : 'Aces × 10', out: '→ 30', outs: [{ id: 'o1', y: 0.5 }], ins: [{ id: 'i1', y: 0.5 }] },
    { id: 'act', x: 550, y: 150, color: '#e2c66d', icon: '▶', title: fr ? 'Mise + 30' : 'Bid + 30', out: '', outs: [], ins: [{ id: 'i1', y: 0.33 }, { id: 'i2', y: 0.67 }] },
  ];
  const conns = [
    { fn: 'partner', fp: 'o1', tn: 'cond', tp: 'i1', idx: 0 },
    { fn: 'aces', fp: 'o1', tn: 'mult', tp: 'i1', idx: 1 },
    { fn: 'cond', fp: 'o1', tn: 'act', tp: 'i1', idx: 2 },
    { fn: 'mult', fp: 'o1', tn: 'act', tp: 'i2', idx: 3 },
  ];
  const W = 200, H = 84;
  const port = (nid, pid, isIn) => {
    const n = nodes.find(n => n.id === nid);
    const p = (isIn ? n.ins : n.outs).find(p => p.id === pid);
    return { x: isIn ? n.x : n.x + W, y: n.y + H * p.y };
  };

  const e = React.createElement;
  return e('div', { style: { display: 'flex', background: 'linear-gradient(135deg,#0a0d18 0%,#101527 100%)', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(226,198,109,0.15)', boxShadow: '0 0 60px rgba(124,92,191,0.1) inset' } },
    // Toolbox
    e('div', { style: { width: 150, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)', padding: '12px 10px', background: 'rgba(0,0,0,0.25)' } },
      e('div', { style: { fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5e6a82', marginBottom: 10, fontWeight: 600 } }, fr ? 'Boîte à outils' : 'Toolbox'),
      ...toolbox.map((t, i) => e('div', {
        key: i,
        style: { display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 8, marginBottom: 4, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', cursor: 'grab', fontSize: 11, color: '#9ba3b5', transition: 'all 0.2s' },
        onMouseEnter: ev => { ev.currentTarget.style.borderColor = t.color; ev.currentTarget.style.color = '#e8eaf0'; },
        onMouseLeave: ev => { ev.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; ev.currentTarget.style.color = '#9ba3b5'; },
      },
        e('span', { style: { width: 20, height: 20, borderRadius: 5, background: t.color + '22', color: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 } }, t.icon),
        t.label
      )),
      e('div', { style: { marginTop: 14, fontSize: 9, color: '#5e6a82', lineHeight: 1.5, fontStyle: 'italic' } }, fr ? 'Glisse un bloc sur la grille…' : 'Drag a block onto the grid…')
    ),
    // Canvas
    e('svg', { viewBox: '0 0 790 360', style: { flex: 1, display: 'block', minWidth: 0 } },
      // grid
      ...Array.from({ length: 17 }, (_, i) => Array.from({ length: 8 }, (_, j) =>
        e('circle', { key: `d${i}-${j}`, cx: i * 48 + 20, cy: j * 48 + 20, r: 1, fill: 'rgba(226,198,109,0.08)' })
      )).flat(),
      // connections
      ...conns.map((c, i) => {
        const f = port(c.fn, c.fp, false), t = port(c.tn, c.tp, true);
        const mx = (f.x + t.x) / 2;
        const d = `M${f.x},${f.y} C${mx},${f.y} ${mx},${t.y} ${t.x},${t.y}`;
        const lit = pulse === c.idx || hovered === c.fn || hovered === c.tn;
        return e('g', { key: i },
          e('path', { d, fill: 'none', stroke: lit ? '#e2c66d' : 'rgba(255,255,255,0.15)', strokeWidth: lit ? 2 : 1.2, style: { transition: 'all 0.5s', filter: lit ? 'drop-shadow(0 0 4px rgba(226,198,109,0.6))' : 'none' } }),
          e('circle', { r: 2.5, fill: '#e2c66d', opacity: lit ? 1 : 0.25 },
            e('animateMotion', { dur: '1.6s', repeatCount: 'indefinite', path: d }))
        );
      }),
      // nodes
      ...nodes.map(n => {
        const lit = hovered === n.id;
        return e('g', { key: n.id, onMouseEnter: () => setHovered(n.id), onMouseLeave: () => setHovered(null), style: { cursor: 'pointer' } },
          e('rect', { x: n.x, y: n.y, width: W, height: H, rx: 12, fill: 'rgba(21,27,38,0.95)', stroke: lit ? n.color : 'rgba(255,255,255,0.12)', strokeWidth: lit ? 1.8 : 1, style: { transition: 'all 0.3s', filter: lit ? `drop-shadow(0 0 10px ${n.color}66)` : 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' } }),
          e('circle', { cx: n.x + 26, cy: n.y + 28, r: 13, fill: n.color + '22', stroke: n.color, strokeWidth: 1 }),
          e('text', { x: n.x + 26, y: n.y + 33, fontSize: 12, fill: n.color, textAnchor: 'middle', fontWeight: 700, style: { fontFamily: 'system-ui' } }, n.icon),
          e('text', { x: n.x + 48, y: n.y + 32, fontSize: 13, fill: '#e8eaf0', fontWeight: 600, style: { fontFamily: "'Space Grotesk',system-ui" } }, n.title),
          e('text', { x: n.x + 48, y: n.y + 62, fontSize: 11, fill: n.color, style: { fontFamily: "'JetBrains Mono',monospace", opacity: 0.85 } }, n.out),
          ...n.outs.map(p => e('circle', { key: 'o' + p.id, cx: n.x + W, cy: n.y + H * p.y, r: 5, fill: '#0a0d18', stroke: n.color, strokeWidth: 1.6 })),
          ...n.ins.map(p => e('circle', { key: 'i' + p.id, cx: n.x, cy: n.y + H * p.y, r: 5, fill: '#0a0d18', stroke: n.color, strokeWidth: 1.6 }))
        );
      })
    )
  );
}
window.NodeEditorDemo = NodeEditorDemo;

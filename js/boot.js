/* Écran de chargement inspiré de l'écran « Chargement » du jeu :
 * progression réelle, journal des robots, état d'erreur avec « Réessayer ». */
import { $, wait, reducedMotion } from './dom.js';

export function createBoot(texts) {
  const root = document.getElementById('boot');
  const q = (name) => $(`[data-boot="${name}"]`, root);
  const label = q('label');
  const pct = q('pct');
  const bar = q('bar');
  const log = q('log');
  const errorBox = q('error');
  let value = 0;
  let shown = 0;
  let raf = 0;
  const started = performance.now();

  root.classList.add('is-on');
  label.textContent = texts.loading;

  // Anime la valeur affichée vers la valeur réelle (lissage).
  function tick() {
    shown += (value - shown) * 0.18;
    if (Math.abs(value - shown) < 0.4) shown = value;
    const v = Math.round(shown);
    pct.textContent = `${v} %`;
    bar.style.width = `${shown}%`;
    raf = shown !== value ? requestAnimationFrame(tick) : 0;
  }

  return {
    started,
    progress(v, text) {
      value = Math.max(value, Math.min(100, v));
      if (text) label.textContent = text;
      if (!raf) raf = requestAnimationFrame(tick);
    },
    log(text) { log.textContent = text || ' '; },
    error(t, detail, onRetry) {
      root.classList.add('is-error');
      root.setAttribute('aria-busy', 'false');
      q('error-title').textContent = t.errorTitle;
      q('error-text').textContent = t.errorText;
      q('error-detail').textContent = detail || '';
      const btn = q('retry');
      btn.textContent = t.retry;
      errorBox.hidden = false;
      btn.onclick = () => {
        root.classList.remove('is-error');
        errorBox.hidden = true;
        value = 5; shown = 5;
        onRetry();
      };
      btn.focus();
    },
    async done(minMs) {
      const elapsed = performance.now() - started;
      if (minMs && elapsed < minMs && !reducedMotion()) await wait(minMs - elapsed);
      this.progress(100);
      await wait(reducedMotion() ? 50 : 380);
    },
    async exit() {
      root.setAttribute('aria-busy', 'false');
      root.classList.add('is-leaving');
      await wait(reducedMotion() ? 120 : 950);
      root.remove();
    }
  };
}

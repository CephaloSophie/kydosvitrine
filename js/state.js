/* La « partie » du visiteur : plis ramassés en parcourant les chapitres. */
import { site } from './i18n.js';

const listeners = new Set();
export const game = { collected: [], score: 0, capot: false, last: null };

function emit(evt) { listeners.forEach((fn) => fn(game, evt)); }
export function onGame(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export function chapterDef(id) {
  return site().chapters.find((c) => c.id === id);
}

/** Ramasse le pli d'un chapitre. Retourne l'évènement ou null s'il est déjà pris. */
export function collect(id) {
  const def = chapterDef(id);
  if (!def || game.collected.includes(id)) return null;
  game.collected.push(id);
  let gained = Number(def.card && def.card.points) || 0;
  const bonus = def.card && def.card.bonus;
  if (bonus === 'rebelote') gained += 20;
  if (def.card && def.card.lastTrick) gained += Number(def.card.lastTrick) || 0;
  game.score += gained;
  const evt = { type: 'collect', id, gained, bonus, lastTrick: !!(def.card && def.card.lastTrick) };
  game.last = evt;
  emit(evt);
  return evt;
}

export function reachCapot() {
  if (game.capot) return;
  // Un capot suppose tous les plis : on ramasse ceux qui manquent.
  site().chapters.forEach((c) => { if (!game.collected.includes(c.id)) collect(c.id); });
  game.capot = true;
  emit({ type: 'capot' });
}

export function resetGame() {
  game.collected = [];
  game.score = 0;
  game.capot = false;
  game.last = null;
  emit({ type: 'reset' });
}

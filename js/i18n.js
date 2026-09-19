/* Langue courante : ?lang= > choix mémorisé > langue du navigateur > défaut. */
import { store } from './dom.js';

const KEY = 'kydos.lang';
let data = null;
let lang = 'fr';

function pick(candidates, available) {
  for (const c of candidates) {
    if (!c) continue;
    const short = String(c).toLowerCase().slice(0, 2);
    if (available.includes(short)) return short;
  }
  return null;
}

function candidates() {
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  const nav = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
  return { fromUrl, stored: store.get(KEY), nav };
}

/** Langue à utiliser avant que le contenu soit chargé (écran de chargement). */
export function detectBootLang() {
  const cfg = window.KYDOS_CONFIG || {};
  const available = Object.keys(cfg.bootTexts || { fr: 1, en: 1 });
  const c = candidates();
  return pick([c.fromUrl, c.stored, ...c.nav, cfg.defaultLang], available) || available[0] || 'fr';
}

export function initI18n(content) {
  data = content;
  const cfg = window.KYDOS_CONFIG || {};
  const c = candidates();
  lang = pick([c.fromUrl, c.stored, ...c.nav, cfg.defaultLang, data.defaultLocale], data.locales) || data.locales[0];
  if (c.fromUrl && lang === c.fromUrl.slice(0, 2)) store.set(KEY, lang);
  document.documentElement.lang = lang;
  return lang;
}

export const getLang = () => lang;
export const locales = () => data.locales;
export const T = () => data.i18n[lang];
export const site = () => data.site;

export function setLang(next) {
  if (!data.locales.includes(next) || next === lang) return false;
  lang = next;
  store.set(KEY, lang);
  document.documentElement.lang = lang;
  // Nettoie un éventuel ?lang= pour que l'URL reste partageable proprement.
  const url = new URL(window.location.href);
  if (url.searchParams.has('lang')) {
    url.searchParams.delete('lang');
    history.replaceState(history.state, '', url.pathname + url.search + url.hash);
  }
  document.dispatchEvent(new CustomEvent('kydos:lang', { detail: { lang } }));
  return true;
}

export function nextLang() {
  const list = data.locales;
  return list[(list.indexOf(lang) + 1) % list.length];
}

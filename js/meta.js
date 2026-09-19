/* Balises title / description / Open Graph selon la route et la langue. */
import { T, site } from './i18n.js';
import { hrefFor } from './router.js';

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector);
  if (el && value) el.setAttribute(attr, value);
}

export function applyMeta(route) {
  const t = T();
  const m = t.meta[route] || t.meta.home;
  document.title = m.title;
  setMeta('meta[name="description"]', 'content', m.description);
  setMeta('meta[property="og:title"]', 'content', m.title);
  setMeta('meta[property="og:description"]', 'content', m.description);
  setMeta('meta[name="twitter:title"]', 'content', m.title);
  setMeta('meta[name="twitter:description"]', 'content', m.description);
  setMeta('meta[property="og:locale"]', 'content', t.meta.ogLocale);
  if (route !== 'notfound') {
    const url = new URL(hrefFor(route), site().url.replace(/\/?$/, '/')).toString();
    setMeta('link[rel="canonical"]', 'href', url);
    setMeta('meta[property="og:url"]', 'content', url);
  }
}

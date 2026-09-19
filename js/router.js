/* Routeur History API : /, /cgu/, /confidentialite/ et page introuvable.
 * Aucune route ne recharge le contenu : tout est déjà en mémoire. */
import { h, wait, reducedMotion } from './dom.js';

const ROUTES = { '': 'home', cgu: 'cgu', confidentialite: 'confidentialite' };
let renderFn = null;
let busy = false;
let veil = null;

/** Chemin de base du site, déduit de <base href> (par défaut « / »). */
export function basePath() {
  return new URL(document.baseURI).pathname.replace(/[^/]*$/, '');
}

export function routeFromPath(pathname = window.location.pathname) {
  const base = basePath();
  let p = pathname.startsWith(base) ? pathname.slice(base.length) : pathname.replace(/^\//, '');
  p = p.replace(/index\.html$/, '').replace(/^\/+|\/+$/g, '');
  if (p === '404.html') return 'notfound';
  return Object.prototype.hasOwnProperty.call(ROUTES, p) ? ROUTES[p] : 'notfound';
}

export function hrefFor(route, hash) {
  const slug = Object.keys(ROUTES).find((k) => ROUTES[k] === route) ?? '';
  return basePath() + (slug ? `${slug}/` : '') + (hash ? `#${hash}` : '');
}

export function initRouter(render) {
  renderFn = render;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, document.baseURI);
    if (url.origin !== window.location.origin) return;
    const route = routeFromPath(url.pathname);
    const hash = url.hash.slice(1);
    // Ancre dans la page courante : défilement doux, sans transition.
    if (route === currentRoute() && url.pathname === window.location.pathname) {
      e.preventDefault();
      if (hash) {
        scrollToId(hash);
        history.replaceState(history.state, '', url.pathname + url.search + url.hash);
      } else {
        window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
      }
      return;
    }
    if (route === 'notfound') return; // lien inconnu : navigation classique
    e.preventDefault();
    navigate(url.pathname + url.search + url.hash);
  });

  window.addEventListener('popstate', () => {
    transition(() => renderFn(currentRoute(), window.location.hash.slice(1)));
  });
}

let current = null;
export const currentRoute = () => current || routeFromPath();
export function setCurrent(route) { current = route; }

export async function navigate(path) {
  if (busy) return;
  history.pushState({}, '', path);
  const url = new URL(path, window.location.href);
  await transition(() => renderFn(routeFromPath(url.pathname), url.hash.slice(1)));
}

export function scrollToId(id, smooth = true) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: smooth && !reducedMotion() ? 'smooth' : 'auto', block: 'start' });
  return true;
}

/** Transition entre pages : un rideau de cartes se retourne. */
async function transition(swap) {
  busy = true;
  if (reducedMotion()) {
    await swap();
    busy = false;
    return;
  }
  if (!veil) {
    veil = h('div', { class: 'veil', 'aria-hidden': 'true' },
      Array.from({ length: 6 }, (_, i) => h('span', { class: 'veil__card', style: { '--i': i } }, h('i'))));
    document.body.append(veil);
  }
  veil.classList.remove('is-out');
  veil.classList.add('is-in');
  await wait(560);
  await swap();
  veil.classList.remove('is-in');
  veil.classList.add('is-out');
  await wait(620);
  veil.classList.remove('is-out');
  busy = false;
}

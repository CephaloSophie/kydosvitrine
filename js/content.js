/* Chargement UNIQUE du contenu du site : fichier JSON local ou API,
 * selon js/config.js. Le résultat est mémorisé : aucun second appel. */

export class ContentError extends Error {
  constructor(message, detail) {
    super(message);
    this.name = 'ContentError';
    this.detail = detail || '';
  }
}

let pending = null;

/** Retourne { data, source }. Un seul appel réseau par chargement de page. */
export function loadContent(onProgress = () => {}) {
  if (!pending) {
    pending = doLoad(onProgress).catch((err) => {
      pending = null; // autorise « Réessayer »
      throw err;
    });
  }
  return pending;
}

async function doLoad(onProgress) {
  const cfg = window.KYDOS_CONFIG || {};
  const source = cfg.content && cfg.content.source === 'api' ? 'api' : 'json';
  const jsonUrl = (cfg.content && cfg.content.jsonUrl) || 'data/content.json';

  if (source === 'api') {
    try {
      const raw = await fetchJson(buildApiRequest(cfg.api || {}), onProgress);
      const map = typeof cfg.mapApiResponse === 'function' ? cfg.mapApiResponse : (x) => x;
      const data = map(raw);
      validate(data);
      return { data, source: 'api' };
    } catch (err) {
      if (cfg.fallbackToJsonOnApiError === true) {
        console.warn('[Kýdos] API indisponible, repli sur le JSON local :', err);
        const data = await fetchJson({ url: jsonUrl, init: {}, timeoutMs: 10000 }, onProgress);
        validate(data);
        return { data, source: 'json-fallback' };
      }
      throw err;
    }
  }

  const data = await fetchJson({ url: jsonUrl, init: { cache: 'no-cache' }, timeoutMs: 15000 }, onProgress);
  validate(data);
  return { data, source: 'json' };
}

function buildApiRequest(api) {
  const base = String(api.baseUrl || '').replace(/\/+$/, '');
  const path = String(api.endpoint || '').replace(/^\/*/, '/');
  const url = new URL(base + path, window.location.href);
  for (const [k, v] of Object.entries(api.query || {})) url.searchParams.set(k, String(v));
  const method = String(api.method || 'GET').toUpperCase();
  const headers = { Accept: 'application/json', ...(api.headers || {}) };
  const init = { method, headers, credentials: api.credentials || 'omit', mode: 'cors' };
  if (api.body !== null && api.body !== undefined && method !== 'GET' && method !== 'HEAD') {
    init.body = typeof api.body === 'string' ? api.body : JSON.stringify(api.body);
    if (!Object.keys(headers).some((h) => h.toLowerCase() === 'content-type')) headers['Content-Type'] = 'application/json';
  }
  return { url: url.toString(), init, timeoutMs: api.timeoutMs || 8000 };
}

async function fetchJson({ url, init, timeoutMs }, onProgress) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs || 10000);
  let res;
  try {
    res = await fetch(url, { ...init, signal: ctrl.signal });
  } catch (err) {
    clearTimeout(timer);
    const reason = err && err.name === 'AbortError' ? `délai dépassé (${timeoutMs} ms)` : (err && err.message) || 'erreur réseau';
    throw new ContentError('network', `${url} : ${reason}`);
  }
  if (!res.ok) {
    clearTimeout(timer);
    throw new ContentError('http', `${url} : HTTP ${res.status}`);
  }
  try {
    const text = await readWithProgress(res, onProgress);
    clearTimeout(timer);
    return JSON.parse(text);
  } catch (err) {
    clearTimeout(timer);
    throw new ContentError('parse', `${url} : réponse illisible (${(err && err.message) || err})`);
  }
}

async function readWithProgress(res, onProgress) {
  const total = Number(res.headers.get('content-length')) || 0;
  if (!res.body || !res.body.getReader) {
    const t = await res.text();
    onProgress(1);
    return t;
  }
  const reader = res.body.getReader();
  const chunks = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    // content-length peut être la taille compressée : on borne à 95 %.
    onProgress(total ? Math.min(0.95, received / total) : Math.min(0.9, received / 150000));
  }
  onProgress(1);
  const buf = new Uint8Array(received);
  let offset = 0;
  for (const c of chunks) { buf.set(c, offset); offset += c.length; }
  return new TextDecoder('utf-8').decode(buf);
}

/** Vérification minimale de la forme attendue (voir README). */
export function validate(d) {
  const errs = [];
  if (!d || typeof d !== 'object' || Array.isArray(d)) throw new ContentError('shape', 'La réponse n’est pas un objet JSON.');
  if (!Array.isArray(d.locales) || d.locales.length === 0) errs.push('« locales » doit être un tableau non vide');
  if (!d.site || typeof d.site !== 'object') errs.push('« site » manquant');
  else {
    if (!Array.isArray(d.site.chapters)) errs.push('« site.chapters » doit être un tableau');
    if (!Array.isArray(d.site.gallery)) errs.push('« site.gallery » doit être un tableau');
  }
  if (!d.i18n || typeof d.i18n !== 'object') errs.push('« i18n » manquant');
  else if (Array.isArray(d.locales)) {
    for (const l of d.locales) {
      const t = d.i18n[l];
      if (!t) { errs.push(`« i18n.${l} » manquant`); continue; }
      for (const k of ['meta', 'ui', 'loader', 'nav', 'croupier', 'hero', 'chapters', 'footer', 'notfound', 'legal']) {
        if (!t[k]) errs.push(`« i18n.${l}.${k} » manquant`);
      }
    }
  }
  if (errs.length) throw new ContentError('shape', errs.join(' · '));
}

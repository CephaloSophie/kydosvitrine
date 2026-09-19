/* =============================================================================
 * KÝDOS BELOTE · SITE VITRINE — CONFIGURATION
 * -----------------------------------------------------------------------------
 * C'est le SEUL fichier à modifier pour choisir d'où vient le contenu du site.
 *
 *   content.source = "json"  →  le site lit data/content.json (par défaut).
 *   content.source = "api"   →  le site appelle UNIQUEMENT l'API décrite dans
 *                               `api` et ne lit JAMAIS data/content.json
 *                               (sauf si fallbackToJsonOnApiError vaut true).
 *
 * Dans les deux cas, le contenu est chargé UNE SEULE FOIS, au chargement de la
 * page. Le changement de langue et la navigation entre /, /cgu et
 * /confidentialite ne refont aucun appel : tout reste en mémoire.
 *
 * La réponse attendue de l'API a EXACTEMENT la même forme que
 * data/content.json. Si votre API renvoie une autre forme, adaptez-la dans
 * `mapApiResponse` ci-dessous (une seule fonction, aucun autre fichier à
 * toucher).
 * ========================================================================== */
window.KYDOS_CONFIG = {

  content: {
    // "json" ou "api"
    source: "json",

    // Chemin du fichier JSON local (relatif à la racine du site).
    jsonUrl: "data/content.json"
  },

  api: {
    // Adresse de l'API et route qui renvoie tout le contenu du site.
    baseUrl: "https://api.kydosbelote.com",
    endpoint: "/v1/site/content",

    // Méthode HTTP. Avec "POST", `body` est envoyé en JSON.
    method: "GET",

    // En-têtes supplémentaires, ex. { "Authorization": "Bearer xxx" }.
    // Attention : ce fichier est public, n'y mettez jamais de secret.
    headers: {},

    // Paramètres ajoutés à l'URL, ex. { site: "kydos", v: "1" }.
    query: {},

    // Corps de la requête (uniquement pour POST/PUT), ex. { site: "kydos" }.
    body: null,

    // Délai maximum avant d'abandonner (millisecondes).
    timeoutMs: 8000,

    // "omit" (recommandé), "same-origin" ou "include" (cookies de l'API).
    credentials: "omit"
  },

  // Si l'API échoue : false = écran d'erreur avec bouton « Réessayer »,
  // true = on se rabat sur data/content.json.
  fallbackToJsonOnApiError: false,

  // Adapte la réponse brute de l'API au format de data/content.json.
  // Exemples : (raw) => raw.data   ou   (raw) => raw.payload.content
  mapApiResponse: function (raw) {
    return raw;
  },

  // Langue utilisée si ni ?lang=, ni le choix mémorisé, ni la langue du
  // navigateur ne correspondent à une langue disponible.
  defaultLang: "fr",

  // Durée minimale d'affichage de l'écran de chargement (millisecondes),
  // pour laisser les robots s'allumer. 0 pour la désactiver.
  minLoaderMs: 1600,

  // Textes affichés AVANT que le contenu soit disponible, ou si son
  // chargement échoue (ils ne peuvent donc pas venir du JSON ni de l'API).
  bootTexts: {
    fr: {
      loading: "Initialisation des IA…",
      content: "Chargement du contenu…",
      errorTitle: "Connexion perdue",
      errorText: "Impossible de charger le contenu du site. Vérifiez votre connexion puis réessayez.",
      retry: "Réessayer"
    },
    en: {
      loading: "Booting the AIs…",
      content: "Loading content…",
      errorTitle: "Connection lost",
      errorText: "The site content could not be loaded. Check your connection and try again.",
      retry: "Try again"
    }
  }
};

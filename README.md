# Kýdos Belote — site vitrine

Site statique bilingue, sans dépendance externe ni étape de compilation. GitHub Pages sert directement `index.html` depuis la racine du dépôt.

## Lancer le site localement

Un serveur HTTP est nécessaire, car le contenu est chargé avec `fetch` :

```bash
python3 -m http.server 4173
```

Puis ouvrir `http://localhost:4173/`.

## Modifier le contenu

Tous les textes français et anglais, les informations produit, les pages légales, la galerie et les liens sont regroupés dans `data/content.json`.

Organisation principale :

- `site` : marque, société, stores, chapitres, formats, écrans et médias ;
- `i18n.fr` : contenu français ;
- `i18n.en` : contenu anglais.

Les identifiants techniques (`id`) doivent rester identiques entre les langues. Après une modification, vérifier la syntaxe avec :

```bash
python3 -m json.tool data/content.json > /dev/null
```

## Utiliser une API à la place du JSON

Le seul fichier de configuration est `js/config.js`.

```js
content: {
  source: "api", // "json" pour data/content.json
  jsonUrl: "data/content.json"
},
api: {
  baseUrl: "https://api.example.com",
  endpoint: "/v1/site/content",
  method: "GET",
  headers: {},
  query: {},
  body: null,
  timeoutMs: 8000,
  credentials: "omit"
}
```

En mode `api`, le site n’ouvre pas `data/content.json`. L’API est appelée une seule fois au chargement de la page ; la navigation et le changement de langue réutilisent ensuite les données en mémoire. La réponse doit avoir exactement la même structure que `data/content.json`. Si l’API utilise une enveloppe, adapter uniquement `mapApiResponse` dans `js/config.js`.

Ne jamais placer de clé secrète dans cette configuration : tout JavaScript côté navigateur est public.

## Pages et déploiement

- `/` : site principal ;
- `/cgu/` : conditions générales d’utilisation ;
- `/confidentialite/` : politique de confidentialité ;
- `404.html` : page introuvable GitHub Pages.

Le dépôt contient `.nojekyll` et le domaine personnalisé `kydosbelote.com` dans `CNAME`. Pour utiliser un autre domaine, modifier `CNAME`, les URL de `data/content.json`, `robots.txt`, `sitemap.xml` et les balises canoniques des pages HTML.

Avant publication juridique, compléter dans `data/content.json` les informations réelles encore inconnues (`site.company`) : forme juridique, immatriculation, TVA, adresse, directeur de publication, hébergeur du serveur de jeu et médiateur de la consommation. Les textes fournis doivent être relus selon le fonctionnement réel du jeu et de ses services tiers.

# SEO & metafields — notes

État constaté le 16/09/2026. Complète la Phase 3 du [Roadmap](Roadmap.md).

## Le partage admin / code

En thème Liquid, l'Online Store génère seul les `<title>`, meta descriptions,
canonical, JSON-LD et sitemap. **En Hydrogen, c'est nous le thème** : rien n'est
généré, l'admin ne fournit que le contenu.

| | Admin Shopify | Code |
|---|---|---|
| Metafields | Définir + saisir + **cocher l'accès Storefront API** | Query GraphQL + affichage |
| SEO | Champ « Search engine listing » (`seo { title description }`) | `meta` par route, canonical, `og:`, JSON-LD, sitemap |

⚠️ Une définition de metafield **n'est pas exposée à la Storefront API par
défaut**. Activer l'accès « Storefronts » sur la définition, sinon la query
renvoie `null`. À faire avant d'écrire du code.

## État actuel

- `seo { title description }` est **déjà interrogé** dans `products.$handle` et
  `pages.$handle`, et **jamais utilisé**. La donnée descend et part à la poubelle.
- Les 12 exports `meta` disent tous `Hydrogen | …`. Rendu vérifié :
  `<title>Hydrogen | Swimmers</title>`.
- Canonical PDP cassé, deux fois : `<meta rel="canonical" href="/products/swimmers"/>`
  — c'est un `<meta>` au lieu d'un `<link>`, et le `href` est relatif au lieu
  d'absolu. Google l'ignore.
- Aucune meta description, aucun `og:`, aucun JSON-LD (donc pas de rich results).
- Aucun metafield interrogé.

## Duplicate content

Le segment `($locale)` sert le même contenu sur `/products/x` et
`/en-us/products/x`. C'est au canonical de trancher — celui qui est cassé. Les
deux sujets se règlent ensemble.

## Ordre

1. **Réparer le canonical** — `{tagName: 'link', rel: 'canonical', href: <URL absolue>}`
   dans le `meta`. C'est un bug, pas une feature.
2. **Brancher le `seo {}` déjà interrogé** dans les `meta`, supprimer les `Hydrogen | `.
3. **Meta description + `og:`** — réutiliser `seo.description` et `featuredImage`.
4. **JSON-LD Product** sur la PDP (`name`, `image`, `offers.price`,
   `offers.availability`). Le plus visible en démo.
5. **Metafields Année / Lieu** — définition + accès Storefront d'abord, query ensuite.

Les points 1 et 2 prennent une demi-heure et couvrent l'essentiel.

## Vérifier

- `curl -s <url> | grep -oE "<title>[^<]*</title>|<link[^>]*canonical[^>]*>"`
- Rich Results Test de Google pour le JSON-LD
- `/sitemap.xml` et `/robots.txt` répondent déjà 200

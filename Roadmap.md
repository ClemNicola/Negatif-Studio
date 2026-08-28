# Negatif Studio — Roadmap

Boutique de tirages argentiques sur Shopify Hydrogen.
**Objectif réel :** apprendre Hydrogen de A à Z + pièce de portfolio pour Numbered / Polaroid.
**Pas** l'argent, pas un CMS pour un client. Sandbox maîtrisé.

## Principes qui gouvernent tout

1. **Fonctionnel avant craft.** Un flow commerce qui marche prime sur toute anim ou polish.
2. **Un front à la fois.** Ne jamais se battre sur deux chantiers en parallèle (ex : apprendre le framework *et* produire des assets).
3. **Time-box les assets.** La prod de mockups/photos ne doit jamais repousser le code. C'est ce qui a tué Eden.
4. **FR d'abord.** Le i18n est une feature de phase tardive, pas une fondation.
5. **Ne pas sur-construire.** Pas de Stripe custom, pas de blog, pas de newsletter. Hors scope, définitivement.

---

## Phase 0 — Data & setup

Objectif : environnement vivant, tes vraies données qui remontent en local.

- [x] Dev store créé (negatif-studio)
- [x] 5 collections créées (Cold, Others, Strange Cities, Hike, Lost in South) — en **manuel**
- [x] App Hydrogen sales channel installée
- [x] Projet Hydrogen scaffoldé
- [x] Import du CSV produits → vérifier que les 5 collections se peuplent
- [x] Connexion Storefront API (`.env` : store domain + token) → `npm run dev` affiche les produits
- [x] (Optionnel maintenant) Repo GitHub + connexion Oxygen — peut attendre la Phase 2

**Règle d'or :** aucune feature ici. Juste : les données existent, le dev server tourne, les produits remontent.
**Fini quand :** `npm run dev` et je vois mes tirages + mes collections dans la console/une page test.

---

## Phase 1 — Le corps fonctionnel (LE cœur)

En français, zéro animation, design brutaliste déjà défini. C'est 80% de la valeur.

### 1.1 — Layout global
- [ ] Header : nav (Prints / Studio / Contact) + logo centré + Search + Cart(n)
- [ ] Footer sobre
- [ ] Styles de base (typo, couleurs, la grille brutaliste)

### 1.2 — Page Prints (listing)
- [ ] Query d'une collection → grille de tirages
- [ ] Filtres par série (Transit / Water / Archive… = tes collections ou tags)
- [ ] Tri (Newest / Price ↑ / Price ↓)
- [ ] Chaque carte → lien vers la PDP

### 1.3 — Route dynamique `collections/$handle`
- [ ] Une seule route affiche n'importe laquelle de tes 5 séries
- [ ] C'est LE skill Hydrogen qui compte pour Numbered — routing dynamique propre

### 1.4 — PDP / Fiche produit (le gros morceau)
- [ ] Query produit avec `options` + `variants`
- [ ] Sélecteur Format (4) × Finition (2) — boucler sur `product.options`, pas de câblage en dur
- [ ] Prix réactif : se met à jour à la sélection du variant
- [ ] Total + bouton Add to cart
- [ ] Galerie image (photo brute pour l'instant, mockup encadré = phase 3)

### 1.5 — Panier
- [ ] Drawer/aside cart (cart API, `CartForm`)
- [ ] UI optimiste (`useOptimisticCart`)
- [ ] Bouton checkout → **redirect natif Shopify** (rien à coder côté paiement)

### 1.6 — Pages statiques
- [ ] Studio (histoire de la marque) — hardcodée, verrouillée
- [ ] Contact — simple

**Règle d'or :** tout en FR, tout en dur pour le narratif, aucune anim. Debugger sur une base sobre.
**Fini quand :** je navigue → je choisis un tirage → je règle format + finition → le prix est juste → j'ajoute au panier → j'arrive au checkout Shopify. De bout en bout.

---

## Phase 2 — Déploiement

Objectif : le site est en ligne, versionné, redéployé au push.

- [ ] Repo GitHub (privé) créé + poussé
- [ ] Connexion Oxygen (l'écran GitHub App qu'on a vu)
- [ ] Premier deploy, vérif du site en prod
- [ ] Le CI/CD tourne (push → redeploy auto)

**Règle d'or :** on déploie du fonctionnel, pas du parfait. Un site brut en ligne > un site parfait en local.
**Fini quand :** l'URL Oxygen affiche mon site et un `git push` le met à jour tout seul.

---

## Phase 3 — Craft & polish

Objectif : ça devient premium. Toujours zéro anim JS ici.

- [ ] Responsive complet (mobile / tablette / desktop) — si pas déjà fait au fil de l'eau
- [ ] Composant `<Image>` de Hydrogen (optimisation, srcset, lazy)
- [ ] SEO : meta par page, structured data produit, sitemap
- [ ] Perf (Lighthouse, poids images, LCP)
- [ ] 1-2 metafields custom (Année, Lieu) affichés sur la PDP → apprendre le pattern metafield → query
- [ ] Mockups encadrés : image par variant (Framed). **Batch Photopea, en UNE session.**

**Règle d'or sur les mockups :** ne PAS les produire avant d'en être là. 2-3 suffisent pour la démo ; le reste en une session groupée, pas photo par photo étalé sur des soirées.
**Fini quand :** Lighthouse correct, responsive propre, la PDP montre les infos metafield + le mockup encadré au bon variant.

---

## Phase 4 — Animations

Objectif : la cerise. Dans l'ordre, du sûr au risqué.

- [ ] **GSAP** — micro-anims : reveals au scroll, hover, le total qui s'anime. (Outil que je maîtrise déjà.)
- [ ] **View Transitions API** sur les `<Link>` (natif, s'intègre au routing Remix) — transitions de page
- [ ] Si besoin de plus de contrôle : **Motion / Framer Motion** (`AnimatePresence`)
- [ ] ~~Barba / Swup~~ → **abandonnés** : conçus pour du MPA, ils se battent avec le routing Remix.

**Règle d'or :** rien ici tant que le corps n'est pas debout et déployé. GSAP avant les transitions de page.
**Fini quand :** les anims enrichissent sans casser ; je peux tout désactiver et le site marche toujours.

---

## Phase 5 — i18n FR/EN (feature portfolio, optionnelle)

Objectif : montrer du i18n propre. Seulement si le reste est solide.

- [ ] `npx shopify hydrogen setup markets` → structure **Subfolders** (`/fr/`, `/en/`)
- [ ] Sélecteur de langue
- [ ] Traduction des textes hardcodés (fr/en)
- [ ] 1 marché Europe, 1 devise (€). Pas de multi-devise.

**Règle d'or :** on traduit du contenu qui existe déjà, jamais du vide. C'est la dernière couche.
**Fini quand :** je bascule FR ↔ EN, les URLs sont propres, les prix restent en €.

---

## Ce qu'on ne fait PAS (pour mémoire)

- Barba.js / Swup (conflit routing)
- Paiement custom / Stripe (checkout Shopify natif suffit)
- Blog, newsletter, comptes clients avancés
- Multi-devise
- Produire les 26 mockups avant d'avoir codé le flow
- Un système de metaobjects/CMS élaboré (c'est mon site, pas besoin)

## Argument d'entretien à préparer

« J'ai construit un storefront headless complet sur Hydrogen/Oxygen — collections dynamiques, variants couleur×taille avec prix au variant, cart, i18n, View Transitions. Le produit c'est mes tirages argentiques, mais l'archi se transpose telle quelle à n'importe quel catalogue. »
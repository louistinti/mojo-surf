# Mojo Surf refonte, plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer le site actuel par la page « Carte postale » validée : Saint-Gilles toute l'année, un seul bouton Contacter, cours collectif, vrais avis Google.

**Architecture:** Site statique servi par GitHub Pages. `index.html` porte le contenu ; le style est dans une feuille ; la logique est découpée en petits modules ES (prix saisonnier, montage vidéo, avis) chargés par un `main.js`. La logique pure (prix, mise en forme des avis) est testée avec le lanceur de tests intégré de Node, sans dépendance.

**Tech Stack:** HTML, CSS, JavaScript modules ES, police Outfit (Google Fonts), Maps JavaScript API (classe `Place`) pour les avis, `node --test`, Playwright CLI pour la vérification visuelle.

**Spec:** `docs/superpowers/specs/2026-10-17-mojo-surf-refonte-design.md`. Maquette de référence : `docs/superpowers/mockups/2026-10-17-maquette-refonte.html`.

## Global Constraints

- Tutoiement partout ; Stéphane dit « je » ; jamais « nous », « notre », « nos ».
- Police Outfit uniquement. Aucune typo manuscrite ou fantaisie.
- Couleurs du mode clair : texte `#1f2a55`, lagon `#cfeaea`, sable `#fbf6e6`, soleil `#fbf1c9`, rouge camion `#a8333f` réservé au bouton d'action.
- Un seul libellé d'action : « Contacter » (bandeau et ouverture).
- Mobile : marge latérale 16 px pour tous les blocs ; aucun débordement horizontal.
- Zones cliquables ≥ 44 px de haut.
- Pas de tiret cadratin `—` ni demi-cadratin `–` ; espaces insécables avant `?`, `:`, `€` ; apostrophes typographiques `’`.
- Pas de contour orange de focus ni de fond sur une croix de fermeture.
- Mode sombre automatique (`prefers-color-scheme: dark`), adouci.
- Aucun avis, note ou nombre d'avis inventé. Aucune donnée Google stockée dans le dépôt.
- Contacts : `06 14 26 36 42` (`tel:+33614263642`), `mojosurf360@gmail.com`.
- Lien fiche Google : `https://maps.app.goo.gl/wCiQ2QshkwwX46Ug9`.

## Review Focus

1. **Bascule de prix aux dates charnières** (31 mars 23 h 59, 1er avril, 31 décembre, 1er janvier) : le prix suit le calendrier local du visiteur. Tests dans la tâche 1.
2. **Avis indisponibles** (pas de clé, quota atteint, script Google bloqué par un bloqueur de pub, réponse sans avis) : la section montre le titre et le lien, sans erreur console visible ni carte vide. Tests dans la tâche 4.
3. **Avis longs ou sans texte** (un avis de 900 caractères, un avis « 5 étoiles » sans commentaire) : le carrousel garde des cartes de même hauteur, texte tronqué proprement, cartes sans texte ignorées. Tests dans la tâche 4.
4. **Vidéo qui ne joue pas** (connexion lente, mode économie de données, autoplay refusé, `prefers-reduced-motion`) : l'image du camion reste affichée, le texte reste lisible. Vérification dans la tâche 3.
5. **Écran desktop bas** (1536 × 760, 1280 × 720) : chaque section atteinte par le bandeau tient dans l'écran, l'ouverture garde son bouton visible. Vérification dans la tâche 6.

---

## Fichiers

- Modify (remplacé en entier) : `index.html` — contenu et structure de la page.
- Create : `assets/css/style.css` — design clair + sombre + mobile.
- Create : `assets/js/config.js` — seul fichier à éditer à la main : prix, clips vidéo, clé Google, Place ID, lien de la fiche.
- Create : `assets/js/pricing.js` — logique de prix saisonnier (pure).
- Create : `assets/js/hero.js` — montage vidéo de l'ouverture.
- Create : `assets/js/reviews.js` — normalisation et rendu des avis (pur) + chargement Google.
- Create : `assets/js/main.js` — branche tout sur la page (prix, menu mobile, carrousel, hero, avis).
- Move : `truck_boards.jpeg`, `truck_board_side.jpeg`, `mojo_logo_truck.jpeg`, `Mojo_logo.jpeg` → `assets/img/` ; Create : `assets/img/mojo-logo.png` (copie de `docs/superpowers/mockups/mojo-logo.png`).
- Create : `package.json` (`{"type":"module","private":true,"scripts":{"test":"node --test tests/"}}`), `tests/pricing.test.js`, `tests/reviews.test.js`.
- Modify : `README.md`.

## Interfaces partagées (`assets/js/config.js`)

```js
export const CONFIG = {
  pricing: { offSeason: 20, season: 25, seasonStartMonth: 4, seasonEndMonth: 12 }, // 25 € d'avril à décembre inclus
  heroClips: [ /* 4 URL mp4, ~4 s chacune */ ],
  heroClipSeconds: 4,
  google: { apiKey: '', placeId: '', mapsUrl: 'https://maps.app.goo.gl/wCiQ2QshkwwX46Ug9' },
};
```

---

### Task 1 : Socle, images rangées, prix saisonnier testé

**Files:** `package.json`, `assets/js/config.js`, `assets/js/pricing.js`, `tests/pricing.test.js`, déplacement des images.

**Interfaces:**
- Produces: `collectifPrice(date: Date, pricing = CONFIG.pricing) -> { price: number, other: number, season: 'saison'|'hors-saison', label: string, otherLabel: string }` où `label` vaut `"Tarif d’avril à décembre"` ou `"Tarif de janvier à mars"` et `otherLabel` `"20 € de janvier à mars"` / `"25 € d’avril à décembre"` (espaces insécables avant €).

- [ ] **Step 1: Tests** dans `tests/pricing.test.js` (`node:test`, `node:assert/strict`) :
  - `new Date(2026, 2, 31, 23, 59)` → `price === 20`, `season === 'hors-saison'`
  - `new Date(2026, 3, 1, 0, 0)` → `price === 25`, `other === 20`
  - `new Date(2026, 11, 31, 12)` → `price === 25`
  - `new Date(2027, 0, 1, 0, 0)` → `price === 20`
  - pricing personnalisé `{offSeason:18, season:22, seasonStartMonth:5, seasonEndMonth:9}` au 1er octobre → `18`
- [ ] **Step 2:** `npm test` → échec (module absent).
- [ ] **Step 3:** Écrire `config.js` et `pricing.js` ; `git mv` des quatre images vers `assets/img/`, copier `mojo-logo.png`.
- [ ] **Step 4:** `npm test` → 5 tests verts.
- [ ] **Step 5:** Commit `Set up assets, config and tested seasonal pricing`.

### Task 2 : Page et design (clair + mobile), fidèles à la maquette

**Files:** `index.html` (remplacé), `assets/css/style.css`, `assets/js/main.js` (prix + menu mobile uniquement à ce stade).

**Interfaces:**
- Consumes: `collectifPrice` (tâche 1).
- Produces (ids et classes que les tâches 3 à 5 utilisent) : `#hero` contenant `.hero-media` (img poster `assets/img/truck_boards.jpeg`) et `.hero-progress` (4 `<i>`) ; `#avis` contenant `.reviews-rating`, `.reviews-track`, `.reviews-prev`, `.reviews-next`, `a.reviews-link` ; `#contact` (bloc téléphone + mail) ; éléments `[data-price]`, `[data-price-label]`, `[data-price-other]`.

- [ ] **Step 1:** Reproduire la maquette (`docs/superpowers/mockups/2026-10-17-maquette-refonte.html`) en vrai HTML sémantique : `header`/`nav`, `main` avec sections `#mojo`, `#cours`, `#avis`, `#faq`, `footer`. Textes exactement ceux de la spec et de la maquette, en tutoiement. FAQ en `<details>` avec réponses rédigées (âge : dès 10 ans ; apporter : maillot, serviette, eau, crème solaire, la planche est fournie et la combinaison se loue 5 € ; rendez-vous : Grande Plage pendant les vacances, sinon Stéphane confirme le spot la veille ; pas de vagues : séance reportée sans frais).
- [ ] **Step 2:** Menu mobile plein écran (bouton « Menu », fermeture au clic sur un lien, touche Échap, `aria-expanded`, focus piégé), `[id]{scroll-margin-top}` égal à la hauteur du bandeau.
- [ ] **Step 3:** `main.js` remplit `[data-price*]` avec `collectifPrice(new Date())`. Le HTML contient 20 € par défaut (sans JS).
- [ ] **Step 4: Vérifier** avec Playwright à 1855 × 910, 1280 × 800 et iPhone 15 : aucun `scrollWidth > clientWidth` ; sur mobile, chaque bloc à 16 px des bords (mesure `getBoundingClientRect`) ; zones cliquables ≥ 44 px ; « Contacter » amène `#contact` sous le bandeau ; aucun `—`/`–`, aucun « nous » (`grep -Ei "\bnous\b|\bnotre\b|\bnos\b|—|–" index.html` vide) ; console sans erreur. Capture comparée à la maquette.
- [ ] **Step 5:** Commit `Build the redesigned page from the approved mockup`.

### Task 3 : Montage vidéo de l'ouverture

**Files:** `assets/js/hero.js`, `assets/js/config.js` (clips), `assets/js/main.js`.

**Interfaces:**
- Produces: `startHeroMontage(root: HTMLElement, clips: string[], seconds: number) -> void`.

- [ ] **Step 1:** Choisir 4 extraits de surf libres de droits (Mixkit ou Pexels, licence autorisant l'usage commercial sans attribution), 720p, liés directement. Vérifier chaque URL : `curl -sI` → `200` et `content-type: video/mp4`.
- [ ] **Step 2:** `hero.js` : une balise `<video muted playsinline preload="metadata">` par clip empilées, fondu enchaîné ~600 ms toutes les `seconds` s, segment de progression animé en CSS pour le clip actif, boucle infinie. Ne démarre pas si `matchMedia('(prefers-reduced-motion: reduce)')`, si `navigator.connection?.saveData`, ou si la première lecture est refusée : le poster reste. Pause quand l'onglet est caché (`visibilitychange`). Le format accepte aussi `clips.length === 1` (un montage unique de Stéphane) : lecture en boucle simple, segments animés sur `seconds × 4`.
- [ ] **Step 3: Vérifier** : en conditions normales le clip actif change toutes les 4 s (lire `currentSrc` à t=1 s et t=5 s) ; avec `set-reduced-motion reduce`, aucune vidéo ne joue et l'image reste ; avec les URL bloquées (`playwright-cli route "**/*.mp4" --status=404`), l'image reste et la console n'a pas d'erreur non interceptée.
- [ ] **Step 4:** Commit `Add the hero video montage with photo fallback`.

### Task 4 : Avis Google en direct, carrousel et repli

**Files:** `assets/js/reviews.js`, `tests/reviews.test.js`, `assets/js/main.js`.

**Interfaces:**
- Produces:
  - `normalizePlace(place: object) -> { rating: number, count: number, url: string, reviews: Array<{ author: string, authorUrl: string, photo: string, stars: number, text: string, when: string }> } | null` — accepte l'objet `Place` de la Maps JS API (`rating`, `userRatingCount`, `googleMapsURI`, `reviews[].authorAttribution.displayName|uri|photoURI`, `reviews[].rating`, `reviews[].text`, `reviews[].relativePublishTimeDescription`). Ignore les avis sans texte. Renvoie `null` si aucune note.
  - `reviewsMarkup(data) -> string` (cartes HTML, texte échappé, coupé à 280 caractères sur une limite de mot avec « … »).
  - `loadReviews(config) -> Promise<object|null>` : si `apiKey` ou `placeId` vide → `null` sans requête ; sinon charge la Maps JS API (`https://maps.googleapis.com/maps/api/js?key=…&v=weekly&libraries=places&language=fr`) puis `new Place({ id: placeId }).fetchFields({ fields: ['rating','userRatingCount','reviews','googleMapsURI'] })` ; toute erreur → `null`.
- [ ] **Step 1: Tests** dans `tests/reviews.test.js` :
  - une `Place` factice à 2 avis dont un sans texte → `reviews.length === 1`, `rating === 4.9`, `count === 27`
  - `normalizePlace({})` → `null`
  - un texte de 900 caractères → markup contient « … » et aucun mot coupé
  - un texte contenant `<script>` → échappé dans le markup
  - `await loadReviews({ apiKey: '', placeId: 'x' })` → `null`
- [ ] **Step 2:** `npm test` → échec ; **Step 3:** implémenter ; **Step 4:** `npm test` → vert.
- [ ] **Step 5:** `main.js` : sans données, la section affiche titre + `a.reviews-link` vers `CONFIG.google.mapsUrl`, sans note ni piste ; avec données, note « 4,9 / 5 · 27 avis Google » (virgule décimale française), carrousel `scroll-snap` avec flèches desktop, glisser au doigt mobile, mention « Avis Google », lien vers `data.url || mapsUrl`.
- [ ] **Step 6: Vérifier** dans le navigateur : sans clé, section réduite propre ; avec une `Place` simulée injectée (`window.__mockPlace`, chemin de test réservé à `localhost`), 5 cartes, flèches fonctionnelles, hauteur égale.
- [ ] **Step 7:** Commit `Load real Google reviews live with a link-only fallback`.

### Task 5 : Mode sombre adouci et logo lisible

**Files:** `assets/css/style.css`, `assets/img/mojo-logo.png` si une variante est nécessaire.

- [ ] **Step 1:** Jetons sombres sous `@media (prefers-color-scheme: dark)` : fond bleu nuit doux, bandes lagon et sable assombries, texte crème, rouge camion conservé sur le bouton. Contraste AA mesuré sur texte courant et texte secondaire.
- [ ] **Step 2:** Logo en sombre : posé sur une pastille claire arrondie dans le bandeau et le pied de page, pour que l'écume reste blanche.
- [ ] **Step 3: Vérifier** avec `set-color-scheme dark` à 1855 × 910 et iPhone : captures de chaque section, contraste, aucun élément illisible.
- [ ] **Step 4:** Commit `Add a soft automatic dark mode`.

### Task 6 : Finitions, référencement, README, audit et mise en ligne

**Files:** `index.html`, `README.md`.

- [ ] **Step 1:** `<title>`, meta description, Open Graph (image `assets/img/truck_boards.jpeg`), favicon, données structurées JSON-LD `SportsActivityLocation` (nom, téléphone, mail, ville Saint-Gilles-Croix-de-Vie, `sameAs` lien de la fiche). Apparitions au défilement discrètes, coupées sous `prefers-reduced-motion`.
- [ ] **Step 2:** README : à quoi sert `config.js` ; remplacer les vidéos (4 extraits ou un montage) ; pas à pas clé Google (projet Google Cloud, activer Maps JavaScript API et Places API (New), clé restreinte aux référents `https://louistinti.github.io/*` et `http://localhost:*/*`, restreinte à ces deux API, quota journalier plafonné, trouver le Place ID avec Place ID Finder et vérifier les coordonnées 46.68974, -1.93832) ; commande locale `npx http-server . -p 5179 -c-1` ; liste de relecture pour Stéphane (textes FAQ, présentation).
- [ ] **Step 3: Audit** : `npm test` vert ; Playwright à 1855 × 910, 1536 × 760, 1280 × 720, iPhone 15, clair et sombre ; chaque ancre du bandeau tient dans l'écran desktop ; marges mobiles 16 px ; zéro erreur console ; grep tirets et « nous » vide.
- [ ] **Step 4:** Commit `Polish, SEO and README for the redesign`, push sur `main`, attendre la publication Pages (`gh api repos/louistinti/mojo-surf/pages/builds/latest` → `built`), puis vérifier la version en ligne.

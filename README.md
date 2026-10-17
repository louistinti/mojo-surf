# Mojo Surf, cours de surf à Saint-Gilles-Croix-de-Vie

Site one-page de Mojo Surf, l'école de surf de Stéphane à Saint-Gilles-Croix-de-Vie : cours collectifs de 2 h toute l'année, dès 10 ans, débutants et intermédiaires.

En ligne : https://louistinti.github.io/mojo-surf/ (GitHub Pages, publié depuis la branche `main`, mis à jour en une minute environ après chaque push).

Conception et maquette : `docs/superpowers/specs/2026-10-17-mojo-surf-refonte-design.md` et `docs/superpowers/mockups/2026-10-17-maquette-refonte.html`.

## Organisation

| Fichier | Rôle |
|---|---|
| `index.html` | Contenu et structure de la page |
| `assets/css/style.css` | Design, mode sombre automatique, version mobile |
| `assets/js/config.js` | **Le seul fichier à modifier à la main** : prix, vidéos, avis Google |
| `assets/js/pricing.js` | Prix du cours collectif selon la date |
| `assets/js/hero.js` | Montage vidéo de l'ouverture |
| `assets/js/reviews.js` | Avis Google en direct |
| `assets/js/main.js` | Branche le tout sur la page |
| `assets/img/` | Logo et photos du camion |
| `tests/` | Tests automatiques |

## Voir en local

```bash
npx http-server . -p 5179 -c-1
```

Puis ouvrir http://localhost:5179/

## Tests

```bash
npm test
```

Les vérifications visuelles (marges mobiles, contrastes, mode sombre) sont dans `tests/browser/` et se lancent avec `playwright-cli run-code --filename=...` sur la page ouverte.

## Changer les prix

Dans `assets/js/config.js`, bloc `pricing`. Par défaut : 25 € d'avril à décembre, 20 € de janvier à mars. Le prix affiché change tout seul selon la date du jour du visiteur. Les options matériel (combinaison, chaussons, gants, cagoule) sont écrites dans `index.html`, section « Le cours collectif » et FAQ.

## Remplacer les vidéos de l'ouverture

Les quatre extraits actuels sont provisoires (banque Mixkit, licence gratuite). Pour mettre les vidéos de Stéphane :

1. Exporter chaque extrait en MP4 (H.264), 1280 × 720, environ 4 secondes, sans son, idéalement moins de 4 Mo. Une version légère en 640 × 360 pour le mobile est conseillée.
2. Les déposer dans `assets/video/`.
3. Dans `config.js`, remplacer `heroClips` :

```js
heroClips: [
  { src: 'assets/video/clip1-720.mp4', small: 'assets/video/clip1-360.mp4' },
  { src: 'assets/video/clip2-720.mp4', small: 'assets/video/clip2-360.mp4' },
  { src: 'assets/video/clip3-720.mp4', small: 'assets/video/clip3-360.mp4' },
  { src: 'assets/video/clip4-720.mp4', small: 'assets/video/clip4-360.mp4' },
],
```

Un seul montage de 16 secondes fonctionne aussi : mettre une seule ligne dans `heroClips`. La photo du camion reste affichée si la vidéo ne peut pas jouer (connexion lente, économie de données, préférence « réduire les animations »).

## Activer les vrais avis Google

Sans clé, la section « Leurs expériences » affiche seulement le bouton « Voir tous les avis sur Google ». Pour afficher le carrousel des vrais avis :

1. **Créer un projet** sur https://console.cloud.google.com/ (un compte de facturation est demandé par Google, l'usage de ce site reste dans le quota gratuit).
2. **Activer deux API** dans « API et services » : *Maps JavaScript API* et *Places API (New)*.
3. **Créer une clé** dans « Identifiants » > « Créer des identifiants » > « Clé API ».
4. **Restreindre la clé**, indispensable puisqu'elle est visible dans le code :
   - Restrictions d'application : « Sites web », avec `https://louistinti.github.io/*` et `http://localhost:*/*`.
   - Restrictions d'API : uniquement *Maps JavaScript API* et *Places API (New)*.
5. **Plafonner l'usage** : dans « Quotas » de *Places API (New)*, limiter les requêtes par jour (par exemple 300) pour ne jamais dépasser le quota gratuit.
6. **Trouver l'identifiant de la fiche** (Place ID) avec https://developers.google.com/maps/documentation/places/web-service/place-id : chercher « Mojo Surf Saint-Gilles-Croix-de-Vie » et vérifier que le point est bien au 46.68974, -1.93832 (au sud du port, près de la Grande Plage). L'identifiant ressemble à `ChIJ…`.
7. **Renseigner** `apiKey` et `placeId` dans `config.js`, bloc `google`, puis pousser sur `main`.

Les avis ne sont jamais stockés : la page les demande à Google à chaque visite, comme l'exigent les règles de Google. L'API renvoie au maximum 5 avis. Le lien de la fiche (`mapsUrl`) est déjà renseigné.

## À faire relire par Stéphane

- La présentation « Mojo Surf, c'est quoi ? ».
- Les réponses de la FAQ, en particulier le report de séance sans frais et la confirmation du lieu la veille.
- Les niveaux décrits dans « Le cours collectif ».

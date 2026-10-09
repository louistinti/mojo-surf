# Mojo Surf, école de surf itinérante

Site one-page pour Mojo Surf, école de surf itinérante en Vendée (Saint-Gilles-Croix-de-Vie, La Sauzaie et les Dunes à Bretignolles-sur-Mer, Les Sables-d'Olonne).

- Un seul fichier, `index.html` : HTML, CSS et JS sans dépendance, polices Outfit et Nunito via Google Fonts.
- Carte illustrée en SVG avec un camion rouge qui se déplace de spot en spot, synchronisée avec le carrousel.
- Prix du cours collectif affiché selon la saison (20 € hors saison, 25 € du 1er avril au 30 septembre), calculé à partir de la date du jour.
- Mode clair et sombre selon le réglage du système, version mobile dédiée (menu plein écran, barre « Réserver » fixe en bas, balayage dans le carrousel).

## Voir en local

```bash
npx http-server mojo-surf -p 5179
```

## Modifier les données

Tout ce qui change est en tête du `<script>` dans `index.html` :

- `PRICING` : les deux prix du cours collectif et les bornes de la haute saison.
- `SPOTS` : nom, lieu, position sur la carte (`x`, `y` dans le repère du SVG), description et photos de chaque spot.

Pour tester le prix saisonnier depuis la console du navigateur : `mojoApplySeasonPrice(new Date(2026, 6, 1))` affiche le tarif été, `mojoApplySeasonPrice(new Date(2026, 10, 1))` le tarif hors saison.

## Remplacer la carte par un dessin

Le trait de côte et la route sont les deux `<path>` (classes `coast` et `road`) dans le `<svg id="map">`. On peut les remplacer par n'importe quel dessin dans le même `viewBox` (`0 0 400 600`), puis ajuster les coordonnées `x` et `y` de chaque spot dans `SPOTS`. Les points, les étiquettes et le camion sont générés et positionnés par le script.

## Avant une mise en ligne

- **Le formulaire n'envoie rien.** Pour le brancher sur Formspree : créer un formulaire sur formspree.io, ajouter `action="https://formspree.io/f/XXXX" method="POST"` sur la balise `<form>`, et retirer la ligne `e.preventDefault()` dans le gestionnaire `submit` du script (la validation côté client reste).
- **Les photos sont des images Unsplash temporaires**, y compris le van de l'ouverture. À remplacer par les vraies photos de l'école et des spots.
- **Contacts à vérifier** : le téléphone `06 14 26 36 42` et l'email `mojosurf360@gmail.com` viennent de la page Facebook de l'école.
- **Textes à faire relire par le moniteur** : descriptions des spots, âge minimum (8 ans), condition de nage (25 m), modalités de paiement (sur place, sans acompte) et délai de réponse (24 h) ont été rédigés pour la maquette.

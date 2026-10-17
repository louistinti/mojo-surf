# Mojo Surf, refonte du site

Date : 2026-10-17
Dépôt : `louistinti/mojo-surf`, publié par GitHub Pages depuis `main` sur https://louistinti.github.io/mojo-surf/
Maquette validée : `docs/superpowers/mockups/2026-10-17-maquette-refonte.html` (s'ouvre directement dans un navigateur depuis le dépôt cloné).

## Intention

Mojo Surf est l'école de surf de Stéphane, moniteur seul, à Saint-Gilles-Croix-de-Vie. Le site actuel a été construit autour de l'itinérance (carte animée, camion qui se déplace de spot en spot). Les notes de Stéphane et de Louis demandent l'inverse : l'itinérance passe au second plan, Saint-Gilles devient le cœur du message.

Ce qu'un visiteur doit comprendre en quelques secondes :

- on peut prendre un cours de surf à Saint-Gilles **toute l'année** ;
- c'est un cours de 2 h, pour débutants et intermédiaires, dès 10 ans ;
- combien ça coûte ;
- comment contacter Stéphane.

Ce qui doit le rassurer ensuite : 15 ans d'expérience sur Saint-Gilles et Les Dunes, des sessions uniquement par bonnes conditions (spot et marée choisis), des conseils personnalisés, et les vrais avis Google.

### Publics

Vacanciers, adultes de 25 à 50 ans, enfants (avec leurs parents qui décident). La plupart arriveront sur téléphone.

### Ton

Cool, accueillant, à l'aise. **Tutoiement partout.** Stéphane parle en « je » quand il se présente. **Jamais de « nous »** : il est seul. Le reste du site parle de « Stéphane » ou s'adresse au visiteur.

## Objectifs

1. Faire passer à l'action avec un seul bouton, « Contacter ».
2. Mettre en avant « toute l'année » et Saint-Gilles.
3. Afficher le bon prix automatiquement selon la date.
4. Montrer de vrais avis Google, mis à jour sans intervention.
5. Un design propre et professionnel, doux et pastel, irréprochable sur mobile.

## Hors périmètre

- Réservation ou paiement en ligne.
- Formulaire de contact (on réserve par téléphone ou par mail).
- Les formules perfectionnement et cours privé + vidéo : seul le cours collectif est présenté.
- La carte animée avec le camion, le carrousel de spots et les fiches de cours en pop-up du site actuel.
- Multilingue.

## Ce qui ferait échouer le projet, même si tout fonctionne

- Une typo fantaisie, manuscrite ou enfantine. Le titre de la maquette « carte postale » en écriture manuscrite a été refusé pour cette raison.
- Des couleurs électriques, flashy ou saturées.
- Un « nous » qui laisse croire à une équipe.
- Des avis, une note ou un nombre d'avis inventés affichés comme réels.
- Un contour orange autour des croix ou des icônes, ou un fond sur une croix de fermeture (préférences fermes de Louis).
- Une section qui ne tient pas dans l'écran quand on y arrive depuis le menu, sur l'écran de Louis (1855 × 910) ; sur mobile, un débordement horizontal.

## Contraintes

- Site statique servi par GitHub Pages : HTML, CSS, JavaScript, sans framework ni étape de construction côté site. Une seule page `index.html` à la racine, avec des fichiers d'images et de vidéos à côté.
- Les avis Google sont chargés par la page elle-même depuis l'API Google (voir plus bas). Pas de tâche planifiée ni de serveur.
- Police **Outfit** (Google Fonts), choisie par Louis parmi trois propositions sobres.
- Thème clair par défaut, avec un **mode sombre automatique** adouci quand le téléphone du visiteur est en sombre (demande explicite de Louis, à garder).
- Mobile : marge latérale de **16 px** pour tous les blocs, y compris la photo d'ouverture.
- Tous les éléments cliquables font au moins 44 px de haut.
- Pas de tiret cadratin ni demi-cadratin dans les textes. Typographie française : espaces insécables avant `?`, `:`, `€`, apostrophes typographiques.

## Direction artistique (décidée)

Direction « Carte postale » validée par Louis, avec une typo sobre :

- fond blanc, bandes pastel qui séparent les sections, séparées par des vagues dessinées comme sur le logo ;
- couleurs issues du logo et du camion : bleu nuit pour le texte (`#1f2a55`), bleu vague, lagon (`#cfeaea`), sable (`#fbf6e6`), jaune soleil pâle (`#fbf1c9`), et le rouge du camion (`#a8333f`) réservé au bouton d'action ;
- coins arrondis doux, ombres très légères, beaucoup d'air ;
- la maquette fait foi pour les proportions, les espacements et les couleurs du mode clair.

## Structure de la page (décidée)

Dans cet ordre, comme dans la maquette :

### 1. Bandeau

- Logo Mojo Surf à gauche, **détouré** (sans fond blanc). Version détourée fournie : `docs/superpowers/mockups/mojo-logo.png`.
- Liens vers **toutes les sections** : Mojo Surf, Le cours, Avis, FAQ.
- Un seul bouton : **Contacter**.
- Collant en haut de l'écran au défilement.
- Mobile : le logo, un bouton **Menu** qui ouvre un menu plein écran avec les quatre sections, et le bouton Contacter.

### 2. Ouverture

- Grand bloc arrondi presque plein écran (hauteur de l'écran moins le bandeau).
- Fond : **montage vidéo en boucle de 4 extraits de 4 secondes**. Stéphane fera ses vidéos plus tard. En attendant, extraits de surf provisoires. Une petite barre de progression en 4 segments en haut à gauche montre l'extrait en cours.
- Titre : « Viens surfer à Saint-Gilles, toute l'année. » (« Saint-Gilles » ne se coupe jamais en fin de ligne).
- Sous-titre : « Cours de surf de 2 h pour débutants et intermédiaires, petits et grands. »
- Un seul bouton : **Contacter**.

### 3. Trois infos clés

Sur une bande lagon, dans cet ordre :

1. **Toute l'année** : été comme hiver, dès que les conditions sont bonnes.
2. **Tous les âges** : dès 10 ans, débutants et intermédiaires, 8 personnes maximum.
3. **Cours de 2 h** : planche incluse, combinaison en option.

### 4. Mojo Surf, c'est quoi ?

- Stéphane se présente en « je » : 15 ans à surfer et enseigner à Saint-Gilles et aux Dunes, cours uniquement quand les conditions sont bonnes, spot et marée choisis pour que tu progresses.
- Trois points : conseils personnalisés pendant toute la session ; pendant les vacances, rendez-vous fixe **Grande Plage de Saint-Gilles** ; le reste de l'année, il peut bouger pour aller chercher les meilleures vagues.
- Version simplifiée des spots : « Mon spot principal » Saint-Gilles-Croix-de-Vie, puis « Et parfois, selon les conditions » Les Dunes, Bretignolles, Les Sables-d'Olonne, Saint-Jean-de-Monts.
- Photo : le camion avec les planches de côté (`truck_board_side.jpeg`).
- Pas de photo de Stéphane, juste son prénom.

### 5. Le cours collectif

- Prix affiché en grand, **calculé selon la date du jour** :
  - **25 €** du 1er avril au 31 décembre ;
  - **20 €** du 1er janvier au 31 mars.
  - Une mention indique la saison et l'autre tarif.
  - Prix par personne, pour 2 h, planche incluse.
- Niveaux : débutant (premiers pas, mousses, apprendre à se lever) et intermédiaire (vagues vertes, placement, lecture de vague).
- 8 personnes maximum. Planche incluse.
- Options, **dans cet ordre** : combinaison +5 €, chaussons +3 €, gants +2 €, cagoule offerte.
- **Bloc contact** (cible du bouton Contacter) : téléphone `06 14 26 36 42` (lien d'appel) et mail `mojosurf360@gmail.com` (lien mail). Les deux sont confirmés.

### 6. Avis Google, titre « Leurs expériences »

- Carrousel des vrais avis Google : étoiles, texte, prénom ou nom affiché par Google, date relative.
- Note moyenne et nombre d'avis réels, issus de Google.
- Lien « Voir tous les avis sur Google ».
- Desktop : trois avis visibles et des flèches. Mobile : un avis à la fois, glissé au doigt, le bord du suivant visible.

### 7. FAQ

Questions dépliables, réponses courtes en tutoiement :

- À partir de quel âge ? Dès 10 ans.
- Qu'est-ce que j'apporte ?
- Comment je sais où est le rendez-vous ? Pendant les vacances, Grande Plage de Saint-Gilles ; le reste de l'année, Stéphane confirme le spot selon les conditions.
- Et s'il n'y a pas de vagues ?

« Faut-il savoir nager ? » a été retirée à la demande de Louis.

### 8. Pied de page

Mojo Surf, école de surf à Saint-Gilles-Croix-de-Vie, téléphone et mail.

## Avis Google (approche décidée)

Louis veut les vrais avis via l'API Google, en carrousel, avec un lien vers tous les avis. Stéphane a une fiche Google Business.

Les conditions de Google Maps Platform interdisent de stocker les avis et la note (seul l'identifiant de la fiche peut être conservé). L'idée d'une tâche planifiée qui enregistre les avis dans le dépôt est donc **abandonnée**. Louis a choisi l'option suivante :

- **La page interroge Google directement à chaque visite**, pour la fiche de Stéphane identifiée par son identifiant de lieu (Place ID), et affiche note, nombre d'avis, avis et lien de la fiche tels que Google les renvoie (l'API en renvoie au plus 5).
- La clé est une **clé navigateur restreinte** : utilisable uniquement depuis l'adresse du site (et `localhost` pour les tests), limitée à l'API Places. Elle est visible dans le code, c'est l'usage prévu par Google.
- Un **plafond de requêtes par jour** est fixé dans Google Cloud pour rester dans le quota gratuit et éviter toute facture.
- Aucune tâche GitHub Actions, aucun fichier d'avis dans le dépôt, aucun cache des avis dans le navigateur au-delà de ce que Google autorise.
- **Sans clé, ou si l'appel échoue** (quota atteint, réseau, clé invalide) : la section affiche uniquement le titre « Leurs expériences » et le bouton « Voir tous les avis sur Google », sans note ni avis. Jamais de contenu inventé.
- Le lien de la fiche est **écrit en dur dans la page** pour fonctionner dès le lancement, sans clé : `https://maps.app.goo.gl/wCiQ2QshkwwX46Ug9` (lien de partage fourni par Louis, vérifié : fiche « mojo surf » à Saint-Gilles-Croix-de-Vie, coordonnées 46.68974, -1.93832).
- Le Place ID n'est pas encore connu : on l'obtiendra au moment de créer la clé (outil Place ID Finder de Google ou recherche par texte via l'API), en vérifiant qu'il correspond à ces coordonnées. Le README décrit cette étape.
- La clé et le Place ID sont regroupés dans un petit bloc de configuration en tête du script, avec le lien de la fiche.
- Le README explique pas à pas comment créer la clé, la restreindre, fixer le plafond et trouver le Place ID.
- Respecter les règles d'affichage de Google pour les avis : attribution « Avis Google », nom de l'auteur tel que fourni, texte non modifié.

## Ce qui a été retiré du site actuel

Carte animée et carrousel de spots, fiches de cours en pop-up, formules perfectionnement et privé, formulaire de réservation, double bouton Appeler / Écrire un mail, section Tarifs séparée, mention de douche chaude.

## Points laissés au constructeur

- Les extraits vidéo provisoires (source libre de droits, hébergés dans le dépôt ou liés) et la façon de les enchaîner. Prévoir qu'on remplace facilement par les vidéos de Stéphane, qu'il livre 4 extraits ou un seul montage de 16 s. La photo `truck_boards.jpeg` sert d'image d'attente et d'image fixe quand la vidéo ne peut pas jouer (connexion lente, mouvement réduit).
- La palette du mode sombre, dans le même esprit doux, et la façon de garder le logo lisible en sombre (l'écume blanche du logo devient transparente au détourage).
- Le comportement exact de « Contacter » : par défaut, il amène au bloc contact de la section du cours.
- Le texte exact des réponses de la FAQ et des petits textes, en tutoiement, à faire relire par Stéphane.
- Les animations : discrètes, justifiées, désactivées si le visiteur préfère réduire les mouvements.
- Le référencement local (titre, description, données structurées d'entreprise locale).
- Les anciennes images du dépôt non utilisées par la nouvelle page peuvent rester ou être rangées.

## Vérification attendue

- Écran de Louis 1855 × 910, 1280 × 800, iPhone 393 × 659, en clair et en sombre.
- Chaque section atteinte depuis le bandeau tient dans l'écran desktop ; aucun débordement horizontal sur mobile ; marge de 16 px partout sur mobile.
- Prix correct aux dates charnières : 31 mars (20 €), 1er avril (25 €), 31 décembre (25 €), 1er janvier (20 €).
- Section avis correcte avec une clé valide, sans clé, et quand l'appel à Google échoue.
- Aucune erreur dans la console, aucun « nous », aucun tiret cadratin.

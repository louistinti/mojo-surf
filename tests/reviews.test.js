import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizePlace, reviewsMarkup, ratingLabel, loadReviews } from '../assets/js/reviews.js';

const review = (over = {}) => ({
  rating: 5,
  text: 'Super cours avec Stéphane, on a pris plein de vagues.',
  relativePublishTimeDescription: 'il y a 2 mois',
  authorAttribution: { displayName: 'Camille R.', uri: 'https://maps.google.com/u/1', photoURI: 'https://lh3.googleusercontent.com/a.png' },
  ...over,
});

test('normalise une fiche Google et ignore les avis sans texte', () => {
  const data = normalizePlace({ rating: 4.9, userRatingCount: 27, googleMapsURI: 'https://maps.google.com/?cid=1', reviews: [review(), review({ text: '' })] });
  assert.equal(data.rating, 4.9);
  assert.equal(data.count, 27);
  assert.equal(data.url, 'https://maps.google.com/?cid=1');
  assert.equal(data.reviews.length, 1);
  assert.deepEqual(data.reviews[0], { author: 'Camille R.', authorUrl: 'https://maps.google.com/u/1', photo: 'https://lh3.googleusercontent.com/a.png', stars: 5, text: 'Super cours avec Stéphane, on a pris plein de vagues.', link: '', when: 'il y a 2 mois' });
});

test('une fiche sans note donne null', () => {
  assert.equal(normalizePlace({}), null);
  assert.equal(normalizePlace(null), null);
});

test('un avis long est affiché en entier, sans coupure ni points de suspension ajoutés', () => {
  const words = Array.from({ length: 150 }, (_, i) => `mot${i}`).join(' ');
  const html = reviewsMarkup({ rating: 5, count: 1, url: 'https://maps.google.com/?cid=1', reviews: [{ author: 'Léa', authorUrl: '', photo: '', stars: 5, text: words, when: 'hier', link: '' }] });
  assert.ok(html.includes(words), 'texte complet présent');
  assert.ok(!html.includes('…'));
});

test('le texte original est préféré à la traduction automatique', () => {
  const data = normalizePlace({ rating: 5, reviews: [review({ text: 'Great lesson', originalText: 'Super cours' })] });
  assert.equal(data.reviews[0].text, 'Super cours');
});

test('lien « Lire sur Google » vers l’avis, sinon vers la fiche', () => {
  const html = reviewsMarkup({ rating: 5, count: 1, url: 'https://maps.google.com/?cid=1', reviews: [{ author: 'Léa', authorUrl: '', photo: '', stars: 5, text: 'Top', when: '', link: '' }] });
  assert.match(html, /<a class="review-more" href="https:\/\/maps\.google\.com\/\?cid=1"/);
});

test('le texte et le nom sont échappés', () => {
  const html = reviewsMarkup({ rating: 5, count: 1, url: '', reviews: [{ author: '<b>Zoé</b>', authorUrl: '', photo: '', stars: 5, text: '<script>alert(1)</script>', when: 'hier' }] });
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.includes('&lt;b&gt;Zoé&lt;/b&gt;'));
});

test('en-tête de note façon Google : note, étoiles accessibles, nombre d’avis', () => {
  assert.equal(ratingLabel({ rating: 4.9, count: 27 }),
    '<span class="g-score">4,9</span><span class="g-stars" role="img" aria-label="Note de 4,9 sur 5">★★★★★</span><span class="g-count">(27 avis)</span>');
  assert.match(ratingLabel({ rating: 5, count: 1 }), /aria-label="Note de 5,0 sur 5".*\(1 avis\)/);
});

const one = (over = {}) => ({ author: 'Camille R.', authorUrl: '', photo: '', stars: 5, text: 'Top', when: 'il y a 2 mois', link: '', ...over });

test('accord de l’étoile au singulier', () => {
  assert.match(reviewsMarkup({ rating: 1, count: 1, url: 'u', reviews: [one({ stars: 1 })] }), /aria-label="1 étoile sur 5"/);
  assert.match(reviewsMarkup({ rating: 5, count: 1, url: 'u', reviews: [one()] }), /aria-label="5 étoiles sur 5"/);
});

test('auteur sans nom : libellé de Google, pas de faux nom', () => {
  const data = normalizePlace({ rating: 5, reviews: [review({ authorAttribution: {} })] });
  assert.equal(data.reviews[0].author, 'Utilisateur Google');
});

test('sans photo, une pastille avec l’initiale, cachée aux lecteurs d’écran', () => {
  assert.match(reviewsMarkup({ rating: 5, count: 1, url: 'u', reviews: [one()] }), /<span class="review-avatar" aria-hidden="true">C<\/span>/);
});

test('« Lire la suite » dit de quel avis il s’agit pour les lecteurs d’écran', () => {
  const html = reviewsMarkup({ rating: 5, count: 1, url: 'https://g/1', reviews: [one()] });
  assert.match(html, /<a class="review-more" href="https:\/\/g\/1" target="_blank" rel="noopener" aria-label="Lire l’avis de Camille R\. sur Google">Lire la suite<\/a>/);
});

test('sans clé ni identifiant, aucun appel et null', async () => {
  assert.equal(await loadReviews({ apiKey: '', placeId: 'x' }), null);
  assert.equal(await loadReviews({ apiKey: 'k', placeId: '' }), null);
});

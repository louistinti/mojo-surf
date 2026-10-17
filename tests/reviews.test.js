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

test('note au format français', () => {
  assert.equal(ratingLabel({ rating: 4.9, count: 27 }), '<b>4,9</b> / 5 · 27 avis Google');
  assert.equal(ratingLabel({ rating: 5, count: 1 }), '<b>5,0</b> / 5 · 1 avis Google');
});

test('sans clé ni identifiant, aucun appel et null', async () => {
  assert.equal(await loadReviews({ apiKey: '', placeId: 'x' }), null);
  assert.equal(await loadReviews({ apiKey: 'k', placeId: '' }), null);
});

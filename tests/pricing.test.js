import { test } from 'node:test';
import assert from 'node:assert/strict';
import { collectifPrice } from '../assets/js/pricing.js';

test('31 mars 23 h 59 : tarif hors saison à 20 €', () => {
  const r = collectifPrice(new Date(2026, 2, 31, 23, 59));
  assert.equal(r.price, 20);
  assert.equal(r.season, 'hors-saison');
  assert.equal(r.label, 'Tarif de janvier à mars');
  assert.equal(r.otherLabel, '25\u00a0€ d’avril à décembre');
});

test('1er avril minuit : tarif saison à 25 €, autre tarif 20 €', () => {
  const r = collectifPrice(new Date(2026, 3, 1, 0, 0));
  assert.equal(r.price, 25);
  assert.equal(r.other, 20);
  assert.equal(r.season, 'saison');
  assert.equal(r.label, 'Tarif d’avril à décembre');
  assert.equal(r.otherLabel, '20\u00a0€ de janvier à mars');
});

test('31 décembre : encore 25 €', () => {
  assert.equal(collectifPrice(new Date(2026, 11, 31, 12)).price, 25);
});

test('1er janvier minuit : retour à 20 €', () => {
  assert.equal(collectifPrice(new Date(2027, 0, 1, 0, 0)).price, 20);
});

test('grille personnalisée : saison de mai à septembre, 1er octobre à 18 €', () => {
  const pricing = { offSeason: 18, season: 22, seasonStartMonth: 5, seasonEndMonth: 9 };
  assert.equal(collectifPrice(new Date(2026, 9, 1), pricing).price, 18);
});

test('mention des deux tarifs avec leurs périodes, dans l’ordre de l’année', () => {
  assert.equal(collectifPrice(new Date(2026, 9, 22)).schedule, '25\u00a0€ d’avril à décembre, 20\u00a0€ de janvier à mars');
  assert.equal(collectifPrice(new Date(2027, 1, 10)).schedule, '25\u00a0€ d’avril à décembre, 20\u00a0€ de janvier à mars');
});

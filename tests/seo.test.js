import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('balises de partage Open Graph présentes', () => {
  assert.match(html, /<meta property="og:title" content="[^"]+">/);
  assert.match(html, /<meta property="og:image" content="https:\/\/louistinti\.github\.io\/mojo-surf\/assets\/img\/truck_boards\.jpeg">/);
});

test('données structurées : école de surf locale avec téléphone, mail et fiche Google', () => {
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(m, 'bloc JSON-LD absent');
  const data = JSON.parse(m[1]);
  assert.equal(data['@type'], 'SportsActivityLocation');
  assert.equal(data.telephone, '+33614263642');
  assert.equal(data.email, 'mojosurf360@gmail.com');
  assert.equal(data.address.addressLocality, 'Saint-Gilles-Croix-de-Vie');
  assert.ok(data.sameAs.includes('https://maps.app.goo.gl/wCiQ2QshkwwX46Ug9'));
});

test('aucun « nous » ni tiret cadratin dans la page', () => {
  const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  assert.doesNotMatch(text, /\b(nous|notre|nos)\b/i);
  assert.doesNotMatch(text, /[—–]/);
});

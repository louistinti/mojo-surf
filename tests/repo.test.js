import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = p => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

test('la maquette publique n’affiche aucune note inventée et n’est pas indexée', () => {
  const m = read('docs/superpowers/mockups/2026-10-17-maquette-refonte.html');
  assert.doesNotMatch(m, /4,9/);
  assert.match(m, /<meta name="robots" content="noindex">/);
});

test('le README plafonne les appels Google sous le quota gratuit (≤ 33 par jour)', () => {
  const r = read('README.md');
  assert.doesNotMatch(r, /par exemple 300/);
  const cap = Number((r.match(/limiter les requêtes par jour \(par exemple (\d+)\)/) || [])[1]);
  assert.ok(cap > 0 && cap <= 33, `plafond trouvé : ${cap}`);
});

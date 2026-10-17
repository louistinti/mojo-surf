import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clipSources, canPlayMontage } from '../assets/js/hero.js';

test('chaîne simple : même source sur grand et petit écran', () => {
  assert.deepEqual(clipSources(['a.mp4'], false), ['a.mp4']);
  assert.deepEqual(clipSources(['a.mp4'], true), ['a.mp4']);
});

test('objet {src, small} : la version légère sur petit écran', () => {
  const clips = [{ src: 'a-720.mp4', small: 'a-360.mp4' }, { src: 'b-720.mp4' }];
  assert.deepEqual(clipSources(clips, true), ['a-360.mp4', 'b-720.mp4']);
  assert.deepEqual(clipSources(clips, false), ['a-720.mp4', 'b-720.mp4']);
});

test('pas de montage sans clip, en mouvement réduit ou en économie de données', () => {
  assert.equal(canPlayMontage({ count: 0, reducedMotion: false, saveData: false }), false);
  assert.equal(canPlayMontage({ count: 4, reducedMotion: true, saveData: false }), false);
  assert.equal(canPlayMontage({ count: 4, reducedMotion: false, saveData: true }), false);
  assert.equal(canPlayMontage({ count: 4, reducedMotion: false, saveData: false }), true);
});

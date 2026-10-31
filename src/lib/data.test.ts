import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const quran = JSON.parse(readFileSync(new URL('../data/quran.json', import.meta.url), 'utf8'));
const dhikr = JSON.parse(readFileSync(new URL('../data/dhikr.json', import.meta.url), 'utf8'));

test('al-Fatiha and juz 30 are complete', () => {
  const nums = quran.surahs.map((s: { number: number }) => s.number);
  assert.deepEqual(nums, [1, ...Array.from({ length: 37 }, (_, i) => 78 + i)]);
  assert.equal(quran.surahs[0].ayahs.length, 7);
  const juz30 = quran.surahs.slice(1).reduce((n: number, s: { ayahs: unknown[] }) => n + s.ayahs.length, 0);
  assert.equal(juz30, 564);
});

test('every ayah has Arabic and all three translations', () => {
  for (const s of quran.surahs)
    for (const a of s.ayahs) for (const k of ['arabic', 'ky', 'ru', 'en']) assert.ok(a[k]?.trim(), `${s.number}:${a.n} ${k}`);
});

test('dhikr items come from HadeethEnc with Arabic and a meaning', () => {
  assert.equal(dhikr.source, 'https://hadeethenc.com');
  for (const d of dhikr.items) {
    assert.ok(d.hadith > 0 && d.source.ar?.attribution, d.id);
    for (const s of d.steps) {
      assert.ok(s.arabic.trim(), d.id);
      assert.ok(s.meaning.ru || s.meaning.en || s.meaning.ky, d.id);
    }
  }
});

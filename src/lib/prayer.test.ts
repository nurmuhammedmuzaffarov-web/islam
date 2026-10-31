import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CITIES, ZERO_ADJUSTMENTS, nextSalah, qiblaBearing, timesFor } from './prayer.ts';

const bishkek = CITIES[0];
const settings = { method: 'kyrgyzstan' as const, madhhab: 'hanafi' as const, adjustments: ZERO_ADJUSTMENTS };

test('times are in order through the day', () => {
  const t = timesFor(bishkek.lat, bishkek.lng, new Date('2026-10-29T12:00:00+06:00'), settings);
  const order = [t.fajr, t.sunrise, t.dhuhr, t.asr, t.maghrib, t.isha].map((d) => d.getTime());
  assert.deepEqual([...order].sort((a, b) => a - b), order);
});

test('hanafi asr is later than shafi asr', () => {
  const day = new Date('2026-10-29T12:00:00+06:00');
  const h = timesFor(bishkek.lat, bishkek.lng, day, settings).asr;
  const s = timesFor(bishkek.lat, bishkek.lng, day, { ...settings, madhhab: 'shafi' }).asr;
  assert.ok(h > s);
});

test('adjustments shift by whole minutes', () => {
  const day = new Date('2026-10-29T12:00:00+06:00');
  const base = timesFor(bishkek.lat, bishkek.lng, day, settings).fajr;
  const moved = timesFor(bishkek.lat, bishkek.lng, day, { ...settings, adjustments: { ...ZERO_ADJUSTMENTS, fajr: 5 } }).fajr;
  assert.equal(moved.getTime() - base.getTime(), 5 * 60_000);
});

test('after isha the next salah is tomorrow fajr', () => {
  const late = new Date('2026-10-29T23:30:00+06:00');
  const n = nextSalah(bishkek.lat, bishkek.lng, late, settings);
  assert.equal(n.key, 'fajr');
  assert.equal(n.current, 'isha');
  assert.ok(n.at > late);
});

test('qibla from Bishkek points roughly south-west', () => {
  const b = qiblaBearing(bishkek.lat, bishkek.lng);
  assert.ok(b > 230 && b < 250, `bearing ${b}`);
});

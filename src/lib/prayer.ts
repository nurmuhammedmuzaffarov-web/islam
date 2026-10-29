import { CalculationMethod, Coordinates, Madhab, PrayerTimes, Qibla } from 'adhan';

export type PrayerKey = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
export const PRAYER_KEYS: PrayerKey[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
// Восход — не намаз: показываем в списке, но не считаем «следующим намазом» и не будим азаном.
export const SALAH_KEYS: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export type MethodId =
  | 'kyrgyzstan'
  | 'MuslimWorldLeague'
  | 'Karachi'
  | 'UmmAlQura'
  | 'Egyptian'
  | 'Turkey'
  | 'NorthAmerica'
  | 'Dubai';

// «Кыргызстан» — ПРЕДВАРИТЕЛЬНЫЙ пресет: углы MWL (18° / 17°) и ханафитский аср.
// Официальные параметры ДУМК не подтверждены — сверить с расписанием муфтията
// и при необходимости подогнать углы или поправки по умолчанию.
export const METHODS: { id: MethodId; label: string; preliminary?: boolean }[] = [
  { id: 'kyrgyzstan', label: 'Кыргызстан', preliminary: true },
  { id: 'MuslimWorldLeague', label: 'Muslim World League' },
  { id: 'Karachi', label: 'Karachi' },
  { id: 'UmmAlQura', label: 'Umm al-Qura' },
  { id: 'Egyptian', label: 'Egyptian' },
  { id: 'Turkey', label: 'Diyanet (Türkiye)' },
  { id: 'NorthAmerica', label: 'ISNA' },
  { id: 'Dubai', label: 'Dubai' },
];

export type Madhhab = 'hanafi' | 'shafi';
export type Adjustments = Record<PrayerKey, number>;
export const ZERO_ADJUSTMENTS: Adjustments = { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 };

export type CalcSettings = { method: MethodId; madhhab: Madhhab; adjustments: Adjustments };

export type City = { id: string; name: string; lat: number; lng: number };
export const CITIES: City[] = [
  { id: 'bishkek', name: 'Бишкек', lat: 42.8746, lng: 74.5698 },
  { id: 'osh', name: 'Ош', lat: 40.5283, lng: 72.7985 },
  { id: 'jalal-abad', name: 'Жалал-Абад', lat: 40.9333, lng: 73.0 },
  { id: 'karakol', name: 'Каракол', lat: 42.4907, lng: 78.3936 },
  { id: 'tokmok', name: 'Токмок', lat: 42.8421, lng: 75.3015 },
  { id: 'naryn', name: 'Нарын', lat: 41.4287, lng: 75.9911 },
  { id: 'talas', name: 'Талас', lat: 42.5228, lng: 72.2427 },
  { id: 'batken', name: 'Баткен', lat: 40.0628, lng: 70.8194 },
];

function params(s: CalcSettings) {
  const p = s.method === 'kyrgyzstan' ? CalculationMethod.MuslimWorldLeague() : CalculationMethod[s.method]();
  p.madhab = s.madhhab === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi;
  p.adjustments = { ...s.adjustments };
  return p;
}

export type DayTimes = Record<PrayerKey, Date>;

export function timesFor(lat: number, lng: number, date: Date, s: CalcSettings): DayTimes {
  const t = new PrayerTimes(new Coordinates(lat, lng), date, params(s));
  return { fajr: t.fajr, sunrise: t.sunrise, dhuhr: t.dhuhr, asr: t.asr, maghrib: t.maghrib, isha: t.isha };
}

export type Upcoming = { key: PrayerKey; at: Date; current: PrayerKey | null };

// Следующий намаз после `now`; после иша — фаджр завтрашнего дня.
export function nextSalah(lat: number, lng: number, now: Date, s: CalcSettings): Upcoming {
  const today = timesFor(lat, lng, now, s);
  let current: PrayerKey | null = null;
  for (const k of SALAH_KEYS) {
    if (today[k] > now) return { key: k, at: today[k], current };
    current = k;
  }
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return { key: 'fajr', at: timesFor(lat, lng, tomorrow, s).fajr, current: 'isha' };
}

export function qiblaBearing(lat: number, lng: number): number {
  return Qibla(new Coordinates(lat, lng));
}

export function formatTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

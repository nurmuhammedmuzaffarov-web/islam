import type { Lang } from '@/i18n/strings';
import data from './quran.json';

// Данные собираются скриптом scripts/fetch-quran.mjs:
// арабский текст и переводы ky/en — QuranEnc, перевод ru — Quran.com (Кулиев).

export type Ayah = { n: number; arabic: string; ky: string; ru: string; en: string; kyNote?: string; enNote?: string };
export type Surah = {
  id: string;
  number: number;
  nameArabic: string;
  nameSimple: string;
  nameRu: string;
  nameEn: string;
  place: 'makkah' | 'madinah';
  bismillah: boolean;
  ayahs: Ayah[];
};
export type SingleAyah = Omit<Ayah, 'n'> & { id: string; sura: number; aya: number };

export const SURAHS = data.surahs as Surah[];
export const AYAHS = data.ayahs as SingleAyah[];
export const QURAN_SOURCES = data.sources;

// Басмала — первый аят аль-Фатихи, берём из тех же данных, а не набираем вручную.
export const BASMALA = SURAHS.find((s) => s.number === 1)!.ayahs[0].arabic;

export function surahName(s: Surah, lang: Lang) {
  if (lang === 'ru') return `${s.nameSimple} · ${s.nameRu}`;
  if (lang === 'en') return `${s.nameSimple} · ${s.nameEn}`;
  return s.nameSimple;
}

export function noteFor(a: Pick<Ayah, 'kyNote' | 'enNote'>, lang: Lang) {
  return lang === 'ky' ? a.kyNote : lang === 'en' ? a.enNote : undefined;
}

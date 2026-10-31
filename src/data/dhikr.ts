import type { Lang } from '@/i18n/strings';
import data from './dhikr.json';

// Данные собираются скриптом scripts/build-dhikr.mjs из HadeethEnc (hadeethenc.com).
// Арабский текст, переводы смысла и кыргызская транскрипция — дословно из источника;
// транскрипция с translitOfficial = false составлена вручную (официальной нет).

export type Category = 'istighfar' | 'dhikr' | 'dua';

export type DhikrStep = {
  arabic: string;
  translit: string;
  translitOfficial: boolean;
  meaning: Partial<Record<Lang, string>>;
  count: number | null; // null — число в хадисе не указано, счёт без цели
};

export type Dhikr = {
  id: string;
  category: Category;
  hadith: number;
  source: Partial<Record<Lang | 'ar', { attribution: string; grade: string }>>;
  steps: DhikrStep[];
};

export const DHIKR = data.items as Dhikr[];
export const CATEGORIES: Category[] = ['istighfar', 'dhikr', 'dua'];

export const hadithUrl = (d: Dhikr, lang: Lang) => `https://hadeethenc.com/${lang}/browse/hadith/${d.hadith}`;

// Перевод на нужном языке; если на HadeethEnc его нет — русский, затем английский.
export function meaningFor(step: DhikrStep, lang: Lang): { text: string; lang: Lang } | null {
  for (const l of [lang, 'ru', 'en'] as Lang[]) {
    const text = step.meaning[l];
    if (text) return { text, lang: l };
  }
  return null;
}

export function sourceFor(d: Dhikr, lang: Lang) {
  return d.source[lang] ?? d.source.ru ?? d.source.en!;
}

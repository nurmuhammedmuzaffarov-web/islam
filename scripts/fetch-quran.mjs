// Скачивает суры для приложения из официальных источников и сохраняет в src/data/quran.json.
//   Арабский текст + кыргызский перевод (Шамсуддин Хакимов): QuranEnc
//   Английский перевод (Saheeh International / Noor International Center): QuranEnc
//   Русский перевод (Эльмир Кулиев): Quran.com
// Запуск: npm run fetch:quran
import { writeFileSync } from 'node:fs';

const SURAHS = [1, ...Array.from({ length: 37 }, (_, i) => 78 + i)]; // аль-Фатиха и 30-й джуз (78–114)
const EXTRA_AYAHS = [{ id: 'ayat-al-kursi', sura: 2, aya: 255 }];

const QE = 'https://quranenc.com/api/v1';
const QC = 'https://api.quran.com/api/v4';
const KY = 'kyrgyz_hakimov';
const EN = 'english_saheeh';
const RU = 45; // Quran.com resource id: Elmir Kuliev

async function json(url) {
  for (let i = 0; i < 4; i++) {
    const r = await fetch(url);
    if (r.ok) return r.json();
    await new Promise((res) => setTimeout(res, 1000 * 2 ** i));
  }
  throw new Error(`fetch failed: ${url}`);
}

const clean = (s) => s.replace(/<sup[^>]*>.*?<\/sup>/g, '').replace(/<[^>]+>/g, '').trim();

function assertSameArabic(a, b, where) {
  if (a !== b) throw new Error(`Arabic text differs between QuranEnc translations at ${where}`);
}

async function surah(n) {
  const [ky, en, ru, chRu, chEn] = await Promise.all([
    json(`${QE}/translation/sura/${KY}/${n}`),
    json(`${QE}/translation/sura/${EN}/${n}`),
    json(`${QC}/quran/translations/${RU}?chapter_number=${n}`),
    json(`${QC}/chapters/${n}?language=ru`),
    json(`${QC}/chapters/${n}?language=en`),
  ]);
  const count = chEn.chapter.verses_count;
  for (const [name, list] of [['ky', ky.result], ['en', en.result], ['ru', ru.translations]]) {
    if (list.length !== count) throw new Error(`surah ${n}: ${name} has ${list.length} ayahs, expected ${count}`);
  }
  const ayahs = ky.result.map((a, i) => {
    assertSameArabic(a.arabic_text, en.result[i].arabic_text, `${n}:${a.aya}`);
    if (Number(a.aya) !== i + 1 || Number(en.result[i].aya) !== i + 1) throw new Error(`ayah order ${n}:${i + 1}`);
    return {
      n: i + 1,
      arabic: a.arabic_text,
      ky: a.translation.trim(),
      ru: clean(ru.translations[i].text),
      en: en.result[i].translation.trim(),
      ...(a.footnotes?.trim() ? { kyNote: a.footnotes.trim() } : {}),
      ...(en.result[i].footnotes?.trim() ? { enNote: en.result[i].footnotes.trim() } : {}),
    };
  });
  return {
    id: String(n),
    number: n,
    nameArabic: chEn.chapter.name_arabic,
    nameSimple: chEn.chapter.name_simple,
    nameRu: chRu.chapter.translated_name.name,
    nameEn: chEn.chapter.translated_name.name,
    place: chEn.chapter.revelation_place,
    bismillah: chEn.chapter.bismillah_pre,
    ayahs,
  };
}

async function single({ id, sura, aya }) {
  const [ky, en, ru] = await Promise.all([
    json(`${QE}/translation/aya/${KY}/${sura}/${aya}`),
    json(`${QE}/translation/aya/${EN}/${sura}/${aya}`),
    json(`${QC}/quran/translations/${RU}?verse_key=${sura}:${aya}`),
  ]);
  assertSameArabic(ky.result.arabic_text, en.result.arabic_text, `${sura}:${aya}`);
  return {
    id,
    sura,
    aya,
    arabic: ky.result.arabic_text,
    ky: ky.result.translation.trim(),
    ru: clean(ru.translations[0].text),
    en: en.result.translation.trim(),
    ...(ky.result.footnotes?.trim() ? { kyNote: ky.result.footnotes.trim() } : {}),
    ...(en.result.footnotes?.trim() ? { enNote: en.result.footnotes.trim() } : {}),
  };
}

const list = await json(`${QE}/translations/list`);
const version = (k) => list.translations.find((t) => t.key === k)?.version;

const surahs = [];
for (const n of SURAHS) {
  surahs.push(await surah(n));
  process.stdout.write(`${n} `);
}
const ayahs = [];
for (const a of EXTRA_AYAHS) ayahs.push(await single(a));

const out = {
  fetchedAt: new Date().toISOString().slice(0, 10),
  sources: {
    arabic: { name: 'QuranEnc (Mushaf al-Madinah, King Fahd Complex)', url: 'https://quranenc.com' },
    ky: { name: 'Шамсуддин Хакимов', key: KY, version: version(KY), url: `https://quranenc.com/en/browse/${KY}` },
    en: { name: 'Saheeh International (Noor International Center)', key: EN, version: version(EN), url: `https://quranenc.com/en/browse/${EN}` },
    ru: { name: 'Эльмир Кулиев', resourceId: RU, url: 'https://quran.com' },
  },
  surahs,
  ayahs,
};
writeFileSync(new URL('../src/data/quran.json', import.meta.url), JSON.stringify(out) + '\n');
console.log(`\nsaved ${surahs.length} surahs, ${surahs.reduce((s, x) => s + x.ayahs.length, 0)} ayahs`);

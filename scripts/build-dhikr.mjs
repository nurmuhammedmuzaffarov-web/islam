// Собирает зикры из HadeethEnc (hadeethenc.com) в src/data/dhikr.json.
// Каждая строка ниже — дословный фрагмент официального текста хадиса (арабского или перевода).
// Скрипт падает, если хоть один фрагмент не найден в источнике, поэтому опечатки невозможны.
// Транскрипция без `from` (own) — составлена вручную, официальной кыргызской нет; помечается в приложении.
// Запуск: npm run build:dhikr
import { writeFileSync } from 'node:fs';

const API = 'https://hadeethenc.com/api/v1/hadeeths/one/';
const LANGS = ['ky', 'ru', 'en'];

// Поле `ky`/`ru`/`en` — фрагменты официального перевода (массив склеивается через «, »).
// `from` у шага — id хадиса, из которого взяты фрагменты (по умолчанию — id зикра).
const SPEC = [
  {
    id: 'istighfar-after-salah',
    category: 'istighfar',
    hadith: 10947,
    steps: [
      { count: 3, arabic: 'أَسْتَغْفِرُ اللهَ', translit: 'Астагфируллох', ru: 'Прошу Аллаха о прощении', en: 'I seek forgiveness from Allah' },
      {
        count: 1,
        arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، تَبَارَكْتَ ذَا الْجَلَالِ وَالْإِكْرَامِ',
        translit: 'Аллахумма антас-салам, ва минкас-салам, табааракта зал жалаали вал икрам',
        ru: 'О Аллах, Ты — Мир и от Тебя — мир, благословен Ты, о Обладатель величия и щедрости!',
        en: 'O Allah, You are As-Salām (peace, perfection), and as-salām comes from You. Blessed are You, O Possessor of Glory and Honor',
      },
    ],
  },
  {
    id: 'astaghfirullah-wa-atubu',
    category: 'istighfar',
    hadith: 4808,
    steps: [
      {
        count: 70,
        arabic: 'أَسْتَغْفِرُ اللهَ وأَتُوبُ إليهِ',
        own: 'Астагфируллаха ва атуубу илайх',
        ru: 'испрашиваю у Аллаха прощения и приношу Ему покаяние',
        en: 'I ask Allah for forgiveness and repent to Him',
      },
    ],
  },
  {
    id: 'astaghfirullah-al-hayy',
    category: 'istighfar',
    hadith: 10576,
    steps: [
      {
        count: 1,
        arabic: 'أَسْتَغْفِرُ الله الذي لا إله إلا هو الحَيَّ القيَّومَ وأتوب إليه',
        own: 'Астагфируллаахал-лазии ла илааха илла хуал-хаййал-каййуума ва атуубу илайх',
        ru: 'Прошу прощения у Аллаха, помимо Которого нет иного истинного бога, Живого, Поддерживающего жизнь, и приношу Ему свое покаяние!',
        en: 'I ask forgiveness from Allah, there is no deity except Him, the Ever-Living, the Sustainer of existence, and I turn to Him in repentance',
      },
    ],
  },
  {
    id: 'sayyid-al-istighfar',
    category: 'istighfar',
    hadith: 5503,
    steps: [
      {
        count: 1,
        arabic:
          'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
        own: 'Аллахумма анта рабби, ла илааха илла ант, халактании ва ана абдук, ва ана ала ахдика ва ваъдика мастатаът, аъуузу бика мин шарри ма санаът, абуу-у лака би ниъматика алаййа, ва абуу-у лака би занбии, фагфир лии, фа иннаху ла йагфируз-зунууба илла ант',
        ky: 'Аллахым, Сен менин - Раббимсиң, Сенден башка ибадатка татыктуу кудай жок. Сен мени жараттың, мен Сенин кулуңмун. Мен чолом жетишинче Сага берген убада, шартымды сактаймын. Жасаган иштеримдин жамандыгынан сактоону Сенден суранам. Мага берген нээмат-жакшылыктарыңды жана күнөөлөрүмдү мойнума алам. Мени кечир, Сенден башка күнөөлөрдү кечирүүчү эч ким жок',
        ru: 'О Аллах, Ты — Господь мой, нет бога, кроме Тебя; Ты сотворил меня, и я Твой раб, и я буду верен завету с Тобой и буду полагаться на обещанное Тобой, насколько смогу. Прошу у Тебя защиты от зла того, что я сделал, признаю милости, оказанные Тобой, и признаю грех свой. Прости же меня, ибо, поистине, никто не прощает грехов, кроме Тебя!',
        en: 'O Allah, You are my Lord. You created me, and I am Your slave. I will remain faithful to Your covenant and promise as much as possible. I seek refuge with You from the evil of what I have done. I acknowledge Your favor upon me, and I admit my sin. So, forgive me. Indeed, none can forgive sins but You',
      },
    ],
  },
  {
    id: 'tasbih-after-salah',
    category: 'dhikr',
    hadith: 10948,
    steps: [
      { from: 5475, count: 33, arabic: 'سُبْحَانَ اللهِ', translit: 'Субханаллах', ru: 'Пречист Аллах', en: 'glory be Allah' },
      { from: 5475, count: 33, arabic: 'الْحَمْدُ لِلهِ', translit: 'Алхамдулиллах', ru: 'Хвала Аллаху', en: 'praise be to Allah' },
      { from: 5475, count: 33, arabic: 'اللهُ أَكْبَرُ', translit: 'Аллаху Акбар', ru: 'Аллах велик', en: 'Allah is the Most Great' },
      {
        count: 1,
        arabic: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        translit: 'Лаа илаха иллаллааху вахдаху лаа шарикалах, лахул мулку, ва лахул хамду, ва хува алаа кулли шайин кодиир',
        ru: 'Нет бога, кроме одного лишь Аллаха, у Которого нет сотоварища. Ему принадлежит владычество, и Ему — хвала, и Он всё может',
        en: 'There is no god except Allah. He is One and has no partner with Him. To Him belongs sovereignty and to Him belongs praise, and He is Omnipotent over everything',
      },
    ],
  },
  {
    id: 'tahlil-100',
    category: 'dhikr',
    hadith: 65905,
    steps: [
      {
        count: 100,
        arabic: 'لاَ إِلَهَ إِلَّا اللَّهُ، وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        translit: { from: 10948, text: 'Лаа илаха иллаллааху вахдаху лаа шарикалах, лахул мулку, ва лахул хамду, ва хува алаа кулли шайин кодиир' },
        ru: 'Нет божества, кроме Аллаха, Единого, у Которого нет сотоварища. Ему принадлежит власть, Ему причитается хвала, и Ему под силу всякая вещь',
        en: 'There is no god but Allah. He is One, and He has no partner with Him; to Him belong the sovereignty and praise, and He is competent over all things',
      },
    ],
  },
  {
    id: 'subhanallahi-wa-bihamdihi',
    category: 'dhikr',
    hadith: 5516,
    steps: [
      { count: 100, arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ', translit: 'Субханаллоохи ва бихамдихи', ru: 'Пречист Аллах и хвала Ему', en: 'glory be to Allah, and praise be to Him' },
    ],
  },
  {
    id: 'two-light-words',
    category: 'dhikr',
    hadith: 5507,
    steps: [
      {
        count: null,
        arabic: 'سُبْحَانَ اللهِ الْعَظِيمِ، سُبْحَانَ اللهِ وَبِحَمْدِهِ',
        translit: 'Субханаллахиль-азыими, Субханаллахи уа бихамдих',
        ru: 'Пречист Великий Аллах, Пречист Аллах и хвала Ему',
        en: ['glory be to Allah, the Majestic', 'glory and praise be to Allah'],
      },
    ],
  },
  {
    id: 'four-beloved-words',
    category: 'dhikr',
    hadith: 5475,
    steps: [
      {
        count: null,
        arabic: 'سُبْحَانَ اللهِ، وَالْحَمْدُ لِلهِ، وَلَا إِلَهَ إِلَّا اللهُ، وَاللهُ أَكْبَرُ',
        translit: ['Субханаллах, Алхамдулиллах, Лаа илааха иллаллах', 'Аллаху Акбар'],
        ru: ['Пречист Аллах', 'Хвала Аллаху', 'Нет божества, достойного поклонения, кроме Аллаха', 'Аллах велик'],
        en: ['glory be Allah', 'praise be to Allah', 'there is no god but Allah', 'Allah is the Most Great'],
      },
    ],
  },
  {
    id: 'salawat-ibrahimiya',
    category: 'dhikr',
    hadith: 5377,
    steps: [
      {
        count: null,
        arabic:
          'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
        translit:
          'Аллахумма солли алаа Мухаммад, ва алаа аали Мухаммад. Камаа соллайта алаа Иброхима, ва алаа аали Иброхим. Иннака хамидум-мажиид.  Аллахумма баарик алаа Мухаммад, ва алаа аали Мухаммад. Камаа бааракта алаа Иброхима, ва алаа аали Иброхим. Иннака хамидум-мажиид',
        ru: 'О Аллах, благослови Мухаммада и семейство Мухаммада, как благословил Ты семейство Ибрахима, поистине, Ты — Достойный хвалы, Славный! О Аллах, пошли благодать Мухаммаду и семейству Мухаммада, как послал Ты ее семейству Ибрахима, поистине, Ты — Достойный хвалы, Славный!',
        en: 'O Allah, bestow Your grace upon Muhammad and the family of Muhammad just as You bestowed Your grace upon the family of Abraham. Verily, You are Praiseworthy, All-Glorious. O Allah, bless Muhammad and the family of Muhammad just as You blessed the family of Abraham. Verily, You are Praiseworthy, All-Glorious',
      },
    ],
  },
  {
    id: 'rabbana-atina',
    category: 'dua',
    hadith: 5502,
    steps: [
      {
        count: 1,
        arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً، وَفِي الآخِرَةِ حَسَنَةً، وَقِنَا عَذَابَ النَّارِ',
        translit: 'Роббана аатинаа фид-дуня хасана, ва фил аахироти хасана, ва кынаа азаабан-наар',
        ru: 'наш Господь, даруй нам в этом мире благо и в мире вечном благо и упаси нас от мук Огня',
        en: 'our Lord, give us in this world that which is good and in the Hereafter that which is good and protect us from the torment of the Fire',
      },
    ],
  },
  {
    id: 'allahumma-ainni',
    category: 'dua',
    hadith: 3518,
    steps: [
      {
        count: 1,
        arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
        translit: 'Аллахумма аъинни ъалаа зикрика ва шукрика ва хусни ъибадатика',
        ru: 'О Аллах, помоги мне поминать Тебя, благодарить Тебя и поклоняться Тебе должным образом',
        en: 'O Allah, help me remember You, thank You, and excellently worship You',
      },
    ],
  },
];

const cache = new Map();
async function hadith(id, lang) {
  const key = `${id}.${lang}`;
  if (cache.has(key)) return cache.get(key);
  let data = null;
  for (let i = 0; i < 4 && data === null; i++) {
    const r = await fetch(`${API}?language=${lang}&id=${id}`);
    if (r.ok) {
      const text = await r.text();
      data = text.trim() ? JSON.parse(text) : false; // пустой ответ — перевода на этот язык нет
    } else if (r.status === 404) data = false; // перевода на этот язык нет
    else await new Promise((res) => setTimeout(res, 1000 * 2 ** i));
  }
  if (data === null) throw new Error(`fetch failed: hadith ${id} (${lang})`);
  cache.set(key, data || null);
  return data || null;
}

const parts = (v) => (Array.isArray(v) ? v : [v]);
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Ищет фрагмент в официальном тексте и возвращает его В ВИДЕ ИСТОЧНИКА.
// Сравнение идёт после NFC: так порядок огласовок (шадда+фатха / фатха+шадда) не мешает поиску,
// но в приложение попадает ровно то, что опубликовано.
function extract(haystack, needle, where) {
  const h = haystack ?? '';
  const hn = h.normalize('NFC');
  const nn = needle.normalize('NFC');
  const idx = hn.indexOf(nn);
  if (idx < 0) throw new Error(`NOT FOUND in ${where}: «${needle}»`);
  if (hn.length !== h.length) throw new Error(`cannot map normalized text back to source in ${where}`);
  return h.slice(idx, idx + nn.length);
}

const out = [];
for (const d of SPEC) {
  const meta = {};
  for (const l of LANGS) {
    const h = await hadith(d.hadith, l);
    if (h) meta[l] = { attribution: h.attribution, grade: h.grade };
  }
  const ar = await hadith(d.hadith, 'ru');
  meta.ar = { attribution: ar.attribution_ar, grade: ar.grade_ar };

  const steps = [];
  for (const s of d.steps) {
    const from = s.from ?? d.hadith;
    const src = { ky: await hadith(from, 'ky'), ru: await hadith(from, 'ru'), en: await hadith(from, 'en') };
    const arabic = extract(src.ru.hadeeth_ar, s.arabic, `${from} ar`);

    let translit;
    let translitOfficial = true;
    if (s.own) {
      translit = s.own;
      translitOfficial = false;
    } else {
      const t = typeof s.translit === 'object' && !Array.isArray(s.translit) ? s.translit : { from, text: s.translit };
      const tSrc = await hadith(t.from, 'ky');
      translit = parts(t.text).map((p) => extract(tSrc?.hadeeth, p, `${t.from} ky translit`)).join(', ');
    }

    const meaning = {};
    for (const l of LANGS) {
      if (!s[l]) continue;
      meaning[l] = capitalize(parts(s[l]).map((p) => extract(src[l]?.hadeeth, p, `${from} ${l}`)).join(', '));
    }
    steps.push({ arabic, translit, translitOfficial, meaning, count: s.count });
  }
  out.push({ id: d.id, category: d.category, hadith: d.hadith, source: meta, steps });
  process.stdout.write(`${d.id} ✓\n`);
}

writeFileSync(
  new URL('../src/data/dhikr.json', import.meta.url),
  JSON.stringify({ fetchedAt: new Date().toISOString().slice(0, 10), source: 'https://hadeethenc.com', items: out }, null, 1) + '\n',
);
console.log(`saved ${out.length} items`);

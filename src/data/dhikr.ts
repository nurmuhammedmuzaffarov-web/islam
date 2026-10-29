import type { Lang } from '@/i18n/strings';

// ВАЖНО: тексты набраны по сборникам хадисов (указаны в `source`), но перед выпуском
// арабский текст, кыргызскую транскрипцию и переводы должен проверить знающий человек.

export type Category = 'istighfar' | 'dhikr' | 'dua';

export type DhikrStep = {
  arabic: string;
  translit: string; // транскрипция кириллицей для кыргызского читателя
  meaning: Record<Lang, string>;
  count: number;
};

export type Dhikr = {
  id: string;
  category: Category;
  steps: DhikrStep[]; // обычно один шаг; тасбих после намаза — несколько подряд
  source: string;
};

export const DHIKR: Dhikr[] = [
  // — Истигфар —
  {
    id: 'astaghfirullah',
    category: 'istighfar',
    source: 'Муслим, 2702',
    steps: [
      {
        arabic: 'أَسْتَغْفِرُ اللَّهَ',
        translit: 'Астагфируллах',
        meaning: {
          ky: 'Аллахтан кечирим сурайм.',
          ru: 'Прошу прощения у Аллаха.',
          en: 'I seek forgiveness from Allah.',
        },
        count: 100,
      },
    ],
  },
  {
    id: 'astaghfirullah-wa-atubu',
    category: 'istighfar',
    source: 'Бухари, 6307',
    steps: [
      {
        arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
        translit: 'Астагфируллаха ва атуубу илайх',
        meaning: {
          ky: 'Аллахтан кечирим сурайм жана Ага тообо кылам.',
          ru: 'Прошу прощения у Аллаха и каюсь перед Ним.',
          en: 'I seek forgiveness from Allah and repent to Him.',
        },
        count: 70,
      },
    ],
  },
  {
    id: 'astaghfirullah-al-azim',
    category: 'istighfar',
    source: 'Абу Дауд, 1517; Тирмизи, 3577',
    steps: [
      {
        arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
        translit: 'Астагфируллахал-азыймал-лазии ла илааха илла хуал-хаййул-каййуму ва атуубу илайх',
        meaning: {
          ky: 'Өзүнөн башка кудай жок, Тирүү жана Түбөлүк Турган Улуу Аллахтан кечирим сурайм жана Ага тообо кылам.',
          ru: 'Прошу прощения у Аллаха Великого, нет божества, кроме Него, Живого, Вечносущего, и каюсь перед Ним.',
          en: 'I seek forgiveness from Allah the Mighty, there is no god but Him, the Living, the Sustainer, and I repent to Him.',
        },
        count: 1,
      },
    ],
  },
  {
    id: 'rabbighfirli',
    category: 'istighfar',
    source: 'Абу Дауд, 1516',
    steps: [
      {
        arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
        translit: 'Раббиг-фирлии ва туб алаййа иннака антат-таввабур-рахиим',
        meaning: {
          ky: 'Раббим, мени кечир жана тообомду кабыл ал. Чындыгында Сен тообону кабыл алуучу, Мээримдүүсүң.',
          ru: 'Господи, прости меня и прими моё покаяние, ведь Ты — Принимающий покаяние, Милосердный.',
          en: 'My Lord, forgive me and accept my repentance; You are the Accepter of repentance, the Merciful.',
        },
        count: 100,
      },
    ],
  },
  {
    id: 'sayyid-al-istighfar',
    category: 'istighfar',
    source: 'Бухари, 6306',
    steps: [
      {
        arabic:
          'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
        translit:
          'Аллахумма анта рабби, ла илааха илла ант, халактании ва ана абдук, ва ана ала ахдика ва ваъдика мастатаът, аъуузу бика мин шарри ма санаът, абуу-у лака би ниъматика алаййа, ва абуу-у би занбии, фагфир лии, фа иннаху ла йагфируз-зунууба илла ант',
        meaning: {
          ky: 'Оо Аллах, Сен менин Раббимсиң, Сенден башка кудай жок. Мени Сен жараттың, мен Сенин пендеңмин. Күчүм жеткенче Сага берген убадамда турам. Кылган жамандыгымдан Сага сыйынам. Мага берген нээматыңды мойнума алам, күнөөмдү да мойнума алам — мени кечир, анткени күнөөлөрдү Сенден башка эч ким кечирбейт.',
          ru: 'О Аллах, Ты — мой Господь, нет божества, кроме Тебя. Ты создал меня, и я — Твой раб. Я верен клятве и обещанию Тебе, насколько могу. Прибегаю к Тебе от зла того, что я сделал. Признаю Твою милость ко мне и признаю свой грех — прости меня, ведь никто не прощает грехи, кроме Тебя.',
          en: 'O Allah, You are my Lord, there is no god but You. You created me and I am Your servant. I keep my covenant and promise to You as much as I can. I seek refuge in You from the evil I have done. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me, for none forgives sins but You.',
        },
        count: 1,
      },
    ],
  },

  // — Зикры —
  {
    id: 'tasbih-after-salah',
    category: 'dhikr',
    source: 'Муслим, 597',
    steps: [
      {
        arabic: 'سُبْحَانَ اللَّهِ',
        translit: 'Субханаллах',
        meaning: { ky: 'Аллах бардык кемчиликтен таза.', ru: 'Пречист Аллах.', en: 'Glory be to Allah.' },
        count: 33,
      },
      {
        arabic: 'الْحَمْدُ لِلَّهِ',
        translit: 'Алхамдулиллах',
        meaning: { ky: 'Бардык мактоо Аллахка.', ru: 'Хвала Аллаху.', en: 'Praise be to Allah.' },
        count: 33,
      },
      {
        arabic: 'اللَّهُ أَكْبَرُ',
        translit: 'Аллаху акбар',
        meaning: { ky: 'Аллах эң Улуу.', ru: 'Аллах велик.', en: 'Allah is the Greatest.' },
        count: 33,
      },
      {
        arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
        translit: 'Ла илааха иллаллаху вахдаху ла шариика лах, лахул-мулку ва лахул-хамду ва хува ала кулли шай-ин кадиир',
        meaning: {
          ky: 'Жалгыз Аллахтан башка кудай жок, Анын шериги жок. Мүлк да, мактоо да Ага таандык, Ал бардык нерсеге кудуреттүү.',
          ru: 'Нет божества, кроме одного Аллаха, у Него нет сотоварища. Ему принадлежит власть и хвала, и Он всё может.',
          en: 'There is no god but Allah alone, without partner. His is the dominion and His is the praise, and He has power over all things.',
        },
        count: 1,
      },
    ],
  },
  {
    id: 'tahlil-100',
    category: 'dhikr',
    source: 'Бухари, 3293; Муслим, 2691',
    steps: [
      {
        arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
        translit: 'Ла илааха иллаллаху вахдаху ла шариика лах, лахул-мулку ва лахул-хамду ва хува ала кулли шай-ин кадиир',
        meaning: {
          ky: 'Жалгыз Аллахтан башка кудай жок, Анын шериги жок. Мүлк да, мактоо да Ага таандык, Ал бардык нерсеге кудуреттүү.',
          ru: 'Нет божества, кроме одного Аллаха, у Него нет сотоварища. Ему принадлежит власть и хвала, и Он всё может.',
          en: 'There is no god but Allah alone, without partner. His is the dominion and His is the praise, and He has power over all things.',
        },
        count: 100,
      },
    ],
  },
  {
    id: 'subhanallahi-wa-bihamdihi',
    category: 'dhikr',
    source: 'Бухари, 6405',
    steps: [
      {
        arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
        translit: 'Субханаллахи ва бихамдих',
        meaning: {
          ky: 'Аллахты мактоо менен даңктайм.',
          ru: 'Пречист Аллах и хвала Ему.',
          en: 'Glory be to Allah and praise be to Him.',
        },
        count: 100,
      },
    ],
  },
  {
    id: 'subhanallahil-azim',
    category: 'dhikr',
    source: 'Бухари, 6406',
    steps: [
      {
        arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
        translit: 'Субханаллахи ва бихамдихи, субханаллахил-азыйм',
        meaning: {
          ky: 'Аллахты мактоо менен даңктайм, Улуу Аллахты даңктайм.',
          ru: 'Пречист Аллах и хвала Ему, пречист Аллах Великий.',
          en: 'Glory be to Allah and praise be to Him; glory be to Allah the Mighty.',
        },
        count: 33,
      },
    ],
  },
  {
    id: 'baqiyat',
    category: 'dhikr',
    source: 'Муслим, 2137',
    steps: [
      {
        arabic: 'سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَٰهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ',
        translit: 'Субханаллах, вал-хамдулиллах, ва ла илааха иллаллах, валлаху акбар',
        meaning: {
          ky: 'Аллах таза, мактоо Аллахка, Аллахтан башка кудай жок, Аллах эң Улуу.',
          ru: 'Пречист Аллах, хвала Аллаху, нет божества, кроме Аллаха, Аллах велик.',
          en: 'Glory be to Allah, praise be to Allah, there is no god but Allah, Allah is the Greatest.',
        },
        count: 33,
      },
    ],
  },
  {
    id: 'hawqala',
    category: 'dhikr',
    source: 'Бухари, 6384',
    steps: [
      {
        arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
        translit: 'Ла хаула ва ла куввата илла биллах',
        meaning: {
          ky: 'Аллахтын жардамысыз эч бир күч да, кубат да жок.',
          ru: 'Нет мощи и силы, кроме как у Аллаха.',
          en: 'There is no might nor power except with Allah.',
        },
        count: 33,
      },
    ],
  },
  {
    id: 'salawat',
    category: 'dhikr',
    source: 'Муслим, 408',
    steps: [
      {
        arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ',
        translit: 'Аллахумма салли ала Мухаммадин ва ала аали Мухаммад',
        meaning: {
          ky: 'Оо Аллах, Мухаммадга жана анын үй-бүлөсүнө салават айт.',
          ru: 'О Аллах, благослови Мухаммада и семью Мухаммада.',
          en: 'O Allah, send blessings upon Muhammad and the family of Muhammad.',
        },
        count: 10,
      },
    ],
  },

  // — Дуа —
  {
    id: 'rabbana-atina',
    category: 'dua',
    source: 'Куран, 2:201',
    steps: [
      {
        arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        translit: 'Раббанаа аатинаа фид-дунйаа хасанатан ва фил-аахирати хасанатан ва кынаа азаабан-наар',
        meaning: {
          ky: 'Раббибиз, бизге дүйнөдө да, акыретте да жакшылык бер жана бизди тозок азабынан сакта.',
          ru: 'Господь наш, даруй нам благо в этом мире и благо в Последней жизни и защити нас от мучений Огня.',
          en: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
        },
        count: 1,
      },
    ],
  },
  {
    id: 'ainni',
    category: 'dua',
    source: 'Абу Дауд, 1522',
    steps: [
      {
        arabic: 'اللَّهُمَّ أَعِنِّي عَلَىٰ ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
        translit: 'Аллахумма аъиннии ала зикрика ва шукрика ва хусни ибаадатик',
        meaning: {
          ky: 'Оо Аллах, Сени зикир кылууга, Сага шүгүр кылууга жана Сага жакшы ибадат кылууга жардам бер.',
          ru: 'О Аллах, помоги мне поминать Тебя, благодарить Тебя и наилучшим образом поклоняться Тебе.',
          en: 'O Allah, help me to remember You, to thank You, and to worship You well.',
        },
        count: 1,
      },
    ],
  },
];

export const CATEGORIES: Category[] = ['istighfar', 'dhikr', 'dua'];

export const totalCount = (d: Dhikr) => d.steps.reduce((n, s) => n + s.count, 0);

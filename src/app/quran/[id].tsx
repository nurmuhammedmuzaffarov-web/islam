import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Arabic, FadeIn, Txt } from '@/components/ui';
import { AYAHS, BASMALA, QURAN_SOURCES, SURAHS, noteFor, surahName, type Ayah } from '@/data/quran';
import type { Lang } from '@/i18n/strings';
import { useSettings } from '@/lib/settings';
import { colors, fonts, radius, space } from '@/theme';

type Row = Ayah & { key: string; label: string };

function AyahView({ a, lang, showNotes }: { a: Row; lang: Lang; showNotes: boolean }) {
  const note = noteFor(a, lang);
  return (
    <View style={styles.ayah}>
      <View style={styles.ayahHead}>
        <View style={styles.badge}>
          <Txt style={styles.badgeText}>{a.label}</Txt>
        </View>
      </View>
      <Arabic quran size={26} style={styles.arabic}>
        {a.arabic}
      </Arabic>
      <Txt style={styles.translation}>{a[lang]}</Txt>
      {showNotes && note && (
        <Txt variant="caption" style={styles.note}>
          {note}
        </Txt>
      )}
    </View>
  );
}

export default function SurahScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { settings, t } = useSettings();
  const insets = useSafeAreaInsets();
  const [showNotes, setShowNotes] = useState(false);
  const lang = settings.lang;

  const surah = SURAHS.find((s) => s.id === id);
  const single = AYAHS.find((a) => a.id === id);
  if (!surah && !single) return null;

  const rows: Row[] = surah
    ? surah.ayahs.map((a) => ({ ...a, key: String(a.n), label: String(a.n) }))
    : [{ ...single!, n: single!.aya, key: single!.id, label: `${single!.sura}:${single!.aya}` }];
  const hasNotes = lang !== 'ru' && rows.some((r) => noteFor(r, lang));
  const translationSource = QURAN_SOURCES[lang];

  const header = (
    <FadeIn style={styles.header}>
      {surah && (
        <Arabic quran size={34}>
          {surah.nameArabic}
        </Arabic>
      )}
      <Txt variant="title" style={{ textAlign: 'center' }}>
        {surah ? surahName(surah, lang) : t.ayatAlKursi}
      </Txt>
      {!surah && (
        <Txt variant="caption" style={{ marginTop: space.xs }}>
          {single!.sura}:{single!.aya}
        </Txt>
      )}
      {surah && (
        <Txt variant="caption" style={{ marginTop: space.xs }}>
          {surah.number} · {surah.place === 'makkah' ? t.makkah : t.madinah} · {surah.ayahs.length} {t.ayahsCount}
        </Txt>
      )}
      {surah?.bismillah && (
        <Arabic quran size={26} style={{ marginTop: space.lg }}>
          {BASMALA}
        </Arabic>
      )}
    </FadeIn>
  );

  const footer = (
    <View style={styles.footer}>
      <Txt variant="caption">
        {t.arabicSource}: {QURAN_SOURCES.arabic.name}
      </Txt>
      <Txt variant="caption">
        {t.translationBy}: {translationSource.name}
      </Txt>
    </View>
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top + space.sm }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Txt style={styles.back}>←</Txt>
        </Pressable>
        {hasNotes && (
          <Pressable onPress={() => setShowNotes((v) => !v)} style={[styles.toggle, showNotes && styles.toggleOn]}>
            <Txt style={[styles.toggleText, showNotes && { color: colors.onAccent }]}>{t.showNotes}</Txt>
          </Pressable>
        )}
      </View>
      <FlatList
        data={rows}
        keyExtractor={(r) => r.key}
        renderItem={({ item }) => <AyahView a={item} lang={lang} showNotes={showNotes} />}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        contentContainerStyle={{ paddingHorizontal: space.lg, paddingBottom: insets.bottom + space.xxl }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space.lg, minHeight: 40 },
  back: { fontFamily: fonts.medium, fontSize: 24, color: colors.inkMuted },
  toggle: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, backgroundColor: colors.surface },
  toggleOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  toggleText: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink },
  header: { alignItems: 'center', paddingTop: space.md, paddingBottom: space.lg },
  ayah: { paddingVertical: space.lg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  ayahHead: { flexDirection: 'row' },
  badge: { minWidth: 30, height: 26, paddingHorizontal: 8, borderRadius: radius.pill, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontFamily: fonts.semibold, fontSize: 12, color: colors.accent, fontVariant: ['tabular-nums'] },
  arabic: { textAlign: 'right', marginTop: space.sm },
  translation: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 25, color: colors.ink, marginTop: space.sm },
  note: { marginTop: space.sm, padding: space.md, backgroundColor: colors.surface, borderRadius: radius.sm, overflow: 'hidden' },
  footer: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line, paddingTop: space.lg, gap: space.xs },
});

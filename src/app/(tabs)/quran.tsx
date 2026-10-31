import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronIcon } from '@/components/icons';
import { Arabic, Card, FadeIn, Screen, Txt } from '@/components/ui';
import { AYAHS, SURAHS, surahName } from '@/data/quran';
import { useSettings } from '@/lib/settings';
import { colors, fonts, radius, space } from '@/theme';

export default function QuranListScreen() {
  const { settings, t } = useSettings();
  const kursi = AYAHS.find((a) => a.id === 'ayat-al-kursi')!;
  const open = (id: string) => router.push({ pathname: '/quran/[id]', params: { id } });

  return (
    <Screen>
      <FadeIn index={0}>
        <Txt variant="title">{t.quranTitle}</Txt>
      </FadeIn>

      <FadeIn index={1} style={{ marginTop: space.md }}>
        <Card onPress={() => open(kursi.id)}>
          <View style={styles.kursiHead}>
            <Txt variant="heading">{t.ayatAlKursi}</Txt>
            <Txt variant="caption">
              {kursi.sura}:{kursi.aya}
            </Txt>
          </View>
          <Arabic quran size={22} numberOfLines={2} style={{ marginTop: space.sm }}>
            {kursi.arabic}
          </Arabic>
        </Card>
      </FadeIn>

      <FadeIn index={2} style={{ marginTop: space.md }}>
        <Card style={{ paddingVertical: space.xs }}>
          {SURAHS.map((s, i) => (
            <Pressable key={s.id} onPress={() => open(s.id)} style={({ pressed }) => [styles.row, i > 0 && styles.divider, pressed && { opacity: 0.6 }]}>
              <View style={styles.num}>
                <Txt style={styles.numText}>{s.number}</Txt>
              </View>
              <View style={{ flex: 1 }}>
                <Txt style={styles.name} numberOfLines={1}>
                  {surahName(s, settings.lang)}
                </Txt>
                <Txt variant="caption">
                  {s.place === 'makkah' ? t.makkah : t.madinah} · {s.ayahs.length} {t.ayahsCount}
                </Txt>
              </View>
              <Arabic quran size={20} style={styles.arabicName}>
                {s.nameArabic}
              </Arabic>
              <ChevronIcon color={colors.inkMuted} />
            </Pressable>
          ))}
        </Card>
      </FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kursiHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: 12, paddingHorizontal: space.xs },
  divider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  num: { width: 34, height: 34, borderRadius: radius.sm, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  numText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.inkMuted, fontVariant: ['tabular-nums'] },
  name: { fontFamily: fonts.semibold, fontSize: 16, color: colors.ink },
  arabicName: { lineHeight: 34, textAlign: 'right' },
});

import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ChevronIcon } from '@/components/icons';
import { Arabic, Card, FadeIn, Screen, Segmented, Txt } from '@/components/ui';
import { CATEGORIES, DHIKR, sourceFor, type Category } from '@/data/dhikr';
import { useSettings } from '@/lib/settings';
import { colors, fonts, space } from '@/theme';

export default function DhikrListScreen() {
  const { settings, t } = useSettings();
  const [cat, setCat] = useState<Category>('istighfar');
  const label: Record<Category, string> = { istighfar: t.catIstighfar, dhikr: t.catDhikr, dua: t.catDua };
  const items = DHIKR.filter((d) => d.category === cat);

  return (
    <Screen>
      <FadeIn index={0}>
        <Txt variant="title">{t.dhikrTitle}</Txt>
      </FadeIn>
      <FadeIn index={1} style={{ marginTop: space.md }}>
        <Segmented options={CATEGORIES.map((c) => ({ value: c, label: label[c] }))} value={cat} onChange={setCat} />
      </FadeIn>

      <View key={cat} style={{ marginTop: space.md, gap: space.md }}>
        {items.map((d, i) => {
          const first = d.steps[0];
          const multi = d.steps.length > 1;
          return (
            <FadeIn key={d.id} index={i + 2}>
              <Card onPress={() => router.push({ pathname: '/dhikr/[id]', params: { id: d.id } })}>
                <Arabic size={multi ? 24 : 26} numberOfLines={2} style={{ marginBottom: space.xs }}>
                  {multi ? d.steps.slice(0, 3).map((s) => s.arabic).join(' · ') : first.arabic}
                </Arabic>
                <Txt numberOfLines={2} style={styles.translit}>{multi ? d.steps.map((s) => s.translit).slice(0, 3).join(' · ') : first.translit}</Txt>
                <View style={styles.footer}>
                  <Txt variant="caption">
                    {first.count === null ? t.freeCount : `${d.steps.map((s) => s.count).join(' + ')} ${t.times}`} · {sourceFor(d, settings.lang).attribution}
                  </Txt>
                  <ChevronIcon color={colors.inkMuted} />
                </View>
              </Card>
            </FadeIn>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  translit: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 21, color: colors.ink, textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: space.md, paddingTop: space.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
});

import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { Card, FadeIn, Screen, Segmented, Txt } from '@/components/ui';
import { langNames, type Lang } from '@/i18n/strings';
import { enableNotifications } from '@/lib/notifications';
import { CITIES, METHODS, PRAYER_KEYS, type Madhhab } from '@/lib/prayer';
import { useSettings } from '@/lib/settings';
import { colors, fonts, radius, space } from '@/theme';

function Section({ title, children, index, hint }: { title: string; children: React.ReactNode; index: number; hint?: string }) {
  return (
    <FadeIn index={index} style={{ marginTop: space.lg }}>
      <Txt variant="label" style={{ marginBottom: space.sm }}>
        {title}
      </Txt>
      {children}
      {hint && (
        <Txt variant="caption" style={{ marginTop: space.sm }}>
          {hint}
        </Txt>
      )}
    </FadeIn>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Txt style={[styles.chipText, active && { color: colors.onAccent }]}>{label}</Txt>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { settings, update, t } = useSettings();

  const toggleNotifications = async (on: boolean) => {
    if (on && !(await enableNotifications())) return;
    update({ notifications: on });
  };

  const adjust = (k: (typeof PRAYER_KEYS)[number], d: number) =>
    update({ adjustments: { ...settings.adjustments, [k]: Math.max(-30, Math.min(30, settings.adjustments[k] + d)) } });

  return (
    <Screen>
      <FadeIn index={0}>
        <Txt variant="title">{t.settingsTitle}</Txt>
      </FadeIn>

      <Section title={t.language} index={1}>
        <Segmented<Lang>
          options={(Object.keys(langNames) as Lang[]).map((l) => ({ value: l, label: langNames[l] }))}
          value={settings.lang}
          onChange={(lang) => update({ lang })}
        />
      </Section>

      <Section title={t.location} index={2}>
        <View style={styles.chips}>
          <Chip label={t.useGps} active={settings.cityId === null} onPress={() => update({ cityId: null })} />
          {CITIES.map((c) => (
            <Chip key={c.id} label={c.name} active={settings.cityId === c.id} onPress={() => update({ cityId: c.id })} />
          ))}
        </View>
      </Section>

      <Section title={t.method} index={3}>
        <Card style={{ paddingVertical: space.xs }}>
          {METHODS.map((m, i) => {
            const active = settings.method === m.id;
            return (
              <Pressable key={m.id} onPress={() => update({ method: m.id })} style={[styles.methodRow, i > 0 && styles.divider]}>
                <Txt style={[styles.methodText, active && { color: colors.accent, fontFamily: fonts.semibold }]}>
                  {m.label}
                  {m.preliminary ? ` (${t.preliminary})` : ''}
                </Txt>
                <View style={[styles.radio, active && styles.radioActive]} />
              </Pressable>
            );
          })}
        </Card>
      </Section>

      <Section title={t.asrMadhab} index={4}>
        <Segmented<Madhhab>
          options={[
            { value: 'hanafi', label: t.hanafi },
            { value: 'shafi', label: t.shafi },
          ]}
          value={settings.madhhab}
          onChange={(madhhab) => update({ madhhab })}
        />
      </Section>

      <Section title={t.adjustments} index={5} hint={t.adjustmentsHint}>
        <Card style={{ paddingVertical: space.xs }}>
          {PRAYER_KEYS.map((k, i) => (
            <View key={k} style={[styles.adjRow, i > 0 && styles.divider]}>
              <Txt style={styles.methodText}>{t[k]}</Txt>
              <View style={styles.stepper}>
                <Pressable onPress={() => adjust(k, -1)} hitSlop={8} style={styles.stepBtn}>
                  <Txt style={styles.stepBtnText}>−</Txt>
                </Pressable>
                <Txt style={styles.stepValue}>{settings.adjustments[k] > 0 ? `+${settings.adjustments[k]}` : settings.adjustments[k]}</Txt>
                <Pressable onPress={() => adjust(k, 1)} hitSlop={8} style={styles.stepBtn}>
                  <Txt style={styles.stepBtnText}>+</Txt>
                </Pressable>
              </View>
            </View>
          ))}
        </Card>
      </Section>

      <Section title={t.notifications} index={6}>
        <Card style={styles.switchRow}>
          <Txt style={styles.methodText}>{settings.notifications ? t.notificationsOn : t.notificationsOff}</Txt>
          <Switch
            value={settings.notifications}
            onValueChange={toggleNotifications}
            trackColor={{ true: colors.accent, false: colors.line }}
            thumbColor={colors.surface}
          />
        </Card>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { fontFamily: fonts.medium, fontSize: 14, color: colors.ink },
  methodRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 13, paddingHorizontal: space.xs },
  divider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  methodText: { fontFamily: fonts.medium, fontSize: 16, color: colors.ink },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: colors.line },
  radioActive: { borderColor: colors.accent, borderWidth: 5 },
  adjRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: space.xs },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  stepBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  stepBtnText: { fontFamily: fonts.medium, fontSize: 18, color: colors.ink, lineHeight: 22 },
  stepValue: { fontFamily: fonts.semibold, fontSize: 16, color: colors.ink, minWidth: 32, textAlign: 'center', fontVariant: ['tabular-nums'] },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.sm },
});

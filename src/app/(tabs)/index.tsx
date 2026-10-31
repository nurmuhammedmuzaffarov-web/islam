import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, FadeIn, Screen, Txt } from '@/components/ui';
import { usePlace } from '@/lib/location';
import { rescheduleAdhan } from '@/lib/notifications';
import { METHODS, PRAYER_KEYS, formatTime, nextSalah, timesFor } from '@/lib/prayer';
import { useSettings } from '@/lib/settings';
import { colors, fonts, radius, space } from '@/theme';

function useNow(intervalMs: number) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export default function PrayerScreen() {
  const { settings, t } = useSettings();
  const { place, status } = usePlace();
  const now = useNow(30_000);
  const calc = useMemo(
    () => ({ method: settings.method, madhhab: settings.madhhab, adjustments: settings.adjustments }),
    [settings.method, settings.madhhab, settings.adjustments],
  );

  useEffect(() => {
    if (place) rescheduleAdhan(place.lat, place.lng, calc, t, settings.notifications).catch(() => {});
  }, [place, calc, t, settings.notifications]);

  // Intl на устройствах часто не знает кыргызский, поэтому дату собираем сами.
  const day = now.getDate();
  const month = t.months[now.getMonth()];
  const dateLabel = `${t.weekdays[now.getDay()]}, ${settings.lang === 'en' ? `${month} ${day}` : `${day} ${month}`}`;

  if (!place) {
    return (
      <Screen>
        <Txt variant="caption">{t.locating}</Txt>
      </Screen>
    );
  }

  const times = timesFor(place.lat, place.lng, now, calc);
  const next = nextSalah(place.lat, place.lng, now, calc);
  const mins = Math.max(0, Math.ceil((next.at.getTime() - now.getTime()) / 60_000));
  const countdown = mins >= 60 ? `${Math.floor(mins / 60)} ${t.hoursShort} ${mins % 60} ${t.minutesShort}` : `${mins} ${t.minutesShort}`;
  const method = METHODS.find((m) => m.id === settings.method);

  return (
    <Screen>
      <FadeIn index={0}>
        <Txt variant="label">{dateLabel}</Txt>
        <Txt variant="title" style={{ marginTop: space.xs }}>
          {place.name ?? `${place.lat.toFixed(2)}, ${place.lng.toFixed(2)}`}
        </Txt>
        {status === 'denied' && (
          <Txt variant="caption" style={{ marginTop: space.sm }}>
            {t.locationDenied}
          </Txt>
        )}
      </FadeIn>

      <FadeIn index={1} style={{ marginTop: space.lg }}>
        <View style={styles.hero}>
          <Txt variant="label" style={{ color: colors.onAccent, opacity: 0.8 }}>
            {t.nextPrayer}
          </Txt>
          <Txt style={styles.heroName}>{t[next.key]}</Txt>
          <View style={styles.heroRow}>
            <Txt variant="display" style={{ color: colors.onAccent }}>
              {formatTime(next.at)}
            </Txt>
            <Txt style={styles.heroCountdown}>
              {settings.lang === 'ky' ? `${countdown} ${t.inTime}` : `${t.inTime} ${countdown}`}
            </Txt>
          </View>
        </View>
      </FadeIn>

      <FadeIn index={2} style={{ marginTop: space.lg }}>
        <Card style={{ paddingVertical: space.xs }}>
          {PRAYER_KEYS.map((k, i) => {
            const active = k === next.current && k !== 'sunrise';
            return (
              <View key={k}>
                {i > 0 && <View style={[styles.divider, (active || PRAYER_KEYS[i - 1] === next.current) && { opacity: 0 }]} />}
                <View style={[styles.row, active && styles.rowActive]}>
                <Txt style={[styles.rowName, active && { color: colors.accent }, k === 'sunrise' && { color: colors.inkMuted }]}>{t[k]}</Txt>
                <Txt style={[styles.rowTime, active && { color: colors.accent }, k === 'sunrise' && { color: colors.inkMuted }]}>
                  {formatTime(times[k])}
                </Txt>
                </View>
              </View>
            );
          })}
        </Card>
      </FadeIn>

      <FadeIn index={3}>
        <Txt variant="caption" style={{ marginTop: space.md, textAlign: 'center' }}>
          {method?.label}
          {method?.preliminary ? ` (${t.preliminary})` : ''} · {settings.madhhab === 'hanafi' ? t.hanafi : t.shafi}
        </Txt>
      </FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.accent, borderRadius: radius.lg, padding: space.lg },
  heroName: { fontFamily: fonts.semibold, fontSize: 22, color: colors.onAccent, marginTop: space.sm },
  heroRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: space.xs },
  heroCountdown: { fontFamily: fonts.medium, fontSize: 15, color: colors.onAccent, opacity: 0.85, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: space.sm, borderRadius: radius.sm },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.line, marginHorizontal: space.sm },
  rowActive: { backgroundColor: colors.accentSoft },
  rowName: { fontFamily: fonts.medium, fontSize: 17, color: colors.ink },
  rowTime: { fontFamily: fonts.semibold, fontSize: 17, color: colors.ink, fontVariant: ['tabular-nums'] },
});

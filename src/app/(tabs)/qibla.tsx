import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { FadeIn, Screen, Txt } from '@/components/ui';
import { usePlace } from '@/lib/location';
import { qiblaBearing } from '@/lib/prayer';
import { useSettings } from '@/lib/settings';
import { colors, fonts, space } from '@/theme';

const SIZE = 300;
const C = SIZE / 2;
const ALIGN_TOLERANCE = 4;

function useHeading() {
  const [heading, setHeading] = useState<number | null>(null);
  useEffect(() => {
    if (Platform.OS === 'web') return;
    let sub: Location.LocationSubscription | null = null;
    let cancelled = false;
    Location.watchHeadingAsync((h) => {
      const v = h.trueHeading >= 0 ? h.trueHeading : h.magHeading;
      if (!cancelled) setHeading(v);
    })
      .then((s) => (cancelled ? s.remove() : (sub = s)))
      .catch(() => {});
    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, []);
  return heading;
}

// Разница углов в диапазоне (-180, 180]
const delta = (a: number, b: number) => ((a - b + 540) % 360) - 180;

function Dial({ bearing }: { bearing: number }) {
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  const rad = ((bearing - 90) * Math.PI) / 180;
  const kx = C + Math.cos(rad) * (C - 46);
  const ky = C + Math.sin(rad) * (C - 46);
  return (
    <Svg width={SIZE} height={SIZE}>
      <Circle cx={C} cy={C} r={C - 2} fill={colors.surface} stroke={colors.line} strokeWidth={1} />
      {ticks.map((d) => {
        const major = d % 90 === 0;
        const r1 = C - 10;
        const r2 = major ? C - 24 : d % 30 === 0 ? C - 18 : C - 14;
        const a = ((d - 90) * Math.PI) / 180;
        return (
          <Line
            key={d}
            x1={C + Math.cos(a) * r1}
            y1={C + Math.sin(a) * r1}
            x2={C + Math.cos(a) * r2}
            y2={C + Math.sin(a) * r2}
            stroke={major ? colors.ink : colors.inkMuted}
            strokeWidth={major ? 2 : 1}
            strokeLinecap="round"
          />
        );
      })}
      {(['N', 'E', 'S', 'W'] as const).map((l, i) => {
        const a = ((i * 90 - 90) * Math.PI) / 180;
        return (
          <SvgText key={l} x={C + Math.cos(a) * (C - 40)} y={C + Math.sin(a) * (C - 40) + 5} fontSize={14} fontFamily={fonts.semibold} fill={colors.inkMuted} textAnchor="middle">
            {l}
          </SvgText>
        );
      })}
      <Line x1={C} y1={C} x2={kx} y2={ky} stroke={colors.accent} strokeWidth={2} strokeDasharray="2 5" strokeLinecap="round" />
      {/* Кааба */}
      <G transform={`translate(${kx - 13}, ${ky - 13})`}>
        <Rect width={26} height={26} rx={4} fill={colors.ink} />
        <Rect y={7} width={26} height={4} fill={colors.accent} />
      </G>
      <Circle cx={C} cy={C} r={5} fill={colors.accent} />
    </Svg>
  );
}

export default function QiblaScreen() {
  const { t } = useSettings();
  const { place } = usePlace();
  const heading = useHeading();
  const bearing = place ? qiblaBearing(place.lat, place.lng) : null;

  // Непрерывный угол, чтобы на переходе 359° → 0° циферблат не крутился через весь круг.
  const rotation = useRef(new Animated.Value(0)).current;
  const lastAngle = useRef(0);
  useEffect(() => {
    if (heading == null) return;
    const target = lastAngle.current + delta(-heading, lastAngle.current);
    lastAngle.current = target;
    Animated.timing(rotation, { toValue: target, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, [heading, rotation]);

  const aligned = heading != null && bearing != null && Math.abs(delta(bearing, heading)) <= ALIGN_TOLERANCE;
  const wasAligned = useRef(false);
  useEffect(() => {
    if (aligned && !wasAligned.current) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    wasAligned.current = aligned;
  }, [aligned]);

  const spin = rotation.interpolate({ inputRange: [-360, 360], outputRange: ['-360deg', '360deg'], extrapolate: 'extend' });

  return (
    <Screen>
      <FadeIn index={0}>
        <Txt variant="label">{place?.name ?? ''}</Txt>
        <Txt variant="title" style={{ marginTop: space.xs }}>
          {t.qiblaTitle}
        </Txt>
      </FadeIn>

      <FadeIn index={1} style={styles.center}>
        <View style={styles.pointer}>
          <Svg width={20} height={14}>
            <Path d="M10 14 0 0h20Z" fill={aligned ? colors.accent : colors.ink} />
          </Svg>
        </View>
        <Animated.View style={{ transform: [{ rotate: heading == null ? '0deg' : spin }] }}>
          {bearing != null && <Dial bearing={bearing} />}
        </Animated.View>
      </FadeIn>

      <FadeIn index={2} style={{ alignItems: 'center' }}>
        {bearing != null && (
          <Txt variant="display" style={{ color: aligned ? colors.accent : colors.ink }}>
            {Math.round(bearing)}
            {t.degrees}
          </Txt>
        )}
        <Txt variant="caption" style={{ textAlign: 'center', marginTop: space.xs, maxWidth: 300 }}>
          {heading == null ? t.qiblaNoSensor : aligned ? t.qiblaAligned : t.qiblaHint}
        </Txt>
      </FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', marginVertical: space.xl },
  pointer: { marginBottom: space.sm },
});

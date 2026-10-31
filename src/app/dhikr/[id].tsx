import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { Arabic, FadeIn, Txt } from '@/components/ui';
import { DHIKR, hadithUrl, meaningFor, sourceFor } from '@/data/dhikr';
import { langNames } from '@/i18n/strings';
import { useSettings } from '@/lib/settings';
import { colors, fonts, motion, radius, space } from '@/theme';

const RING = 220;
const STROKE = 6;
const R = (RING - STROKE) / 2;
const CIRC = 2 * Math.PI * R;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function DhikrCounterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { settings, t } = useSettings();
  const insets = useSafeAreaInsets();
  const dhikr = DHIKR.find((d) => d.id === id);

  const [stepIdx, setStepIdx] = useState(0);
  const [count, setCount] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const press = useRef(new Animated.Value(1)).current;

  const step = dhikr?.steps[stepIdx];
  const isLastStep = !!dhikr && stepIdx === dhikr.steps.length - 1;
  const target = step?.count ?? null; // null — счёт без цели
  const finished = !!step && target !== null && isLastStep && count >= target;

  useEffect(() => {
    if (!step) return;
    if (target === null) return;
    Animated.timing(progress, { toValue: count / target, duration: motion.exit, easing: motion.easeOut, useNativeDriver: false }).start();
  }, [count, step, target, progress]);

  if (!dhikr || !step) return null;

  const onTap = () => {
    if (finished) return;
    const next = count + 1;
    Animated.sequence([
      Animated.timing(press, { toValue: 0.96, duration: 60, easing: motion.easeIn, useNativeDriver: true }),
      Animated.timing(press, { toValue: 1, duration: 180, easing: motion.easeOut, useNativeDriver: true }),
    ]).start();
    if (target === null || next < target) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      setCount(next);
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setCount(next);
    if (!isLastStep) {
      setTimeout(() => {
        progress.setValue(0);
        setStepIdx((i) => i + 1);
        setCount(0);
      }, 450);
    }
  };

  const reset = () => {
    progress.setValue(0);
    setStepIdx(0);
    setCount(0);
  };

  const long = step.arabic.length > 120;
  const meaning = meaningFor(step, settings.lang);
  const src = sourceFor(dhikr, settings.lang);
  const dashoffset = progress.interpolate({ inputRange: [0, 1], outputRange: [CIRC, 0] });

  return (
    <View style={[styles.screen, { paddingTop: insets.top + space.md, paddingBottom: insets.bottom + space.lg }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Txt style={styles.topAction}>✕</Txt>
        </Pressable>
        {dhikr.steps.length > 1 && (
          <Txt variant="label">
            {t.step} {stepIdx + 1} / {dhikr.steps.length}
          </Txt>
        )}
        <Pressable onPress={reset} hitSlop={12}>
          <Txt style={[styles.topAction, { fontSize: 15 }]}>{t.reset}</Txt>
        </Pressable>
      </View>

      {/* Длинные дуа прокручиваются, счётчик всегда остаётся на месте */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.textScroll} showsVerticalScrollIndicator={false}>
        <FadeIn key={stepIdx} style={{ alignItems: 'center' }}>
          <Arabic size={long ? 24 : step.arabic.length > 50 ? 28 : 40}>{step.arabic}</Arabic>
          <Txt style={[styles.translit, long && styles.translitLong]}>{step.translit}</Txt>
          {!step.translitOfficial && (
            <Txt variant="caption" style={styles.flag}>
              {t.translitUnofficial}
            </Txt>
          )}
          {meaning && (
            <Txt variant="caption" style={styles.meaning}>
              {meaning.lang !== settings.lang && `${t.meaningFallback} ${langNames[meaning.lang]}\n`}
              {meaning.text}
            </Txt>
          )}
        </FadeIn>
      </ScrollView>

      <Pressable onPress={onTap} style={styles.tapArea}>
        <Animated.View style={{ transform: [{ scale: press }] }}>
          <View style={styles.ringWrap}>
            <Svg width={RING} height={RING} style={StyleSheet.absoluteFill}>
              <Circle cx={RING / 2} cy={RING / 2} r={R} stroke={colors.line} strokeWidth={STROKE} fill={colors.surface} />
              <AnimatedCircle
                cx={RING / 2}
                cy={RING / 2}
                r={R}
                stroke={colors.accent}
                strokeWidth={STROKE}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${CIRC} ${CIRC}`}
                strokeDashoffset={dashoffset}
                transform={`rotate(-90 ${RING / 2} ${RING / 2})`}
              />
            </Svg>
            <Txt style={[styles.count, finished && { color: colors.accent }]}>{finished ? t.done : count}</Txt>
            {!finished && (
              <Txt variant="caption">
                {target === null ? t.freeCount : `/ ${target} ${t.times}`}
              </Txt>
            )}
          </View>
        </Animated.View>
        <Txt variant="caption" style={{ marginTop: space.md }}>
          {finished ? t.done : t.tapToCount}
        </Txt>
      </Pressable>
      <Pressable onPress={() => Linking.openURL(hadithUrl(dhikr, settings.lang))} hitSlop={8}>
        <Txt variant="caption" style={styles.source}>
          {t.source}: {src.attribution} · {src.grade} · HadeethEnc №{dhikr.hadith}
        </Txt>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: space.lg },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 32 },
  topAction: { fontFamily: fonts.medium, fontSize: 20, color: colors.inkMuted },
  textScroll: { flexGrow: 1, justifyContent: 'center', paddingVertical: space.lg },
  translit: { fontFamily: fonts.semibold, fontSize: 18, lineHeight: 26, color: colors.ink, textAlign: 'center', marginTop: space.sm },
  translitLong: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 24 },
  meaning: { textAlign: 'center', marginTop: space.sm, maxWidth: 340 },
  flag: { textAlign: 'center', marginTop: space.xs, fontSize: 11, opacity: 0.8 },
  source: { textAlign: 'center', marginTop: space.md, fontSize: 11, textDecorationLine: 'underline' },
  tapArea: { alignItems: 'center', justifyContent: 'center', borderRadius: radius.lg, paddingTop: space.md },
  ringWrap: { width: RING, height: RING, alignItems: 'center', justifyContent: 'center' },
  count: { fontFamily: fonts.bold, fontSize: 64, lineHeight: 72, color: colors.ink, fontVariant: ['tabular-nums'], letterSpacing: -1.5 },
});

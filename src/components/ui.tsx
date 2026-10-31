import { useEffect, useRef, type ReactNode } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextProps,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, motion, radius, space } from '@/theme';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'label' | 'caption';

const variants = StyleSheet.create({
  display: { fontFamily: fonts.bold, fontSize: 56, lineHeight: 60, letterSpacing: -1.5, color: colors.ink },
  title: { fontFamily: fonts.bold, fontSize: 30, lineHeight: 36, letterSpacing: -0.6, color: colors.ink },
  heading: { fontFamily: fonts.semibold, fontSize: 18, lineHeight: 24, color: colors.ink },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 23, color: colors.ink },
  label: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, letterSpacing: 0.6, textTransform: 'uppercase', color: colors.inkMuted },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: colors.inkMuted },
});

export function Txt({ variant = 'body', style, ...rest }: TextProps & { variant?: Variant }) {
  return <Text {...rest} style={[variants[variant], style]} />;
}

// quran — шрифт Комплекса короля Фахда: он рисует все знаки Мединского мусхафа из данных QuranEnc
export function Arabic({
  children,
  size = 30,
  style,
  quran = false,
  numberOfLines,
}: {
  children: string;
  size?: number;
  style?: StyleProp<any>;
  quran?: boolean;
  numberOfLines?: number;
}) {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        { fontFamily: quran ? fonts.quran : fonts.arabic, fontSize: size, lineHeight: size * (quran ? 2.1 : 1.9), color: colors.ink, textAlign: 'center', writingDirection: 'rtl' },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  const insets = useSafeAreaInsets();
  const pad = { paddingTop: insets.top + space.lg, paddingHorizontal: space.lg, paddingBottom: space.xxl };
  if (!scroll) return <View style={[styles.screen, pad]}>{children}</View>;
  return (
    <ScrollView style={styles.screen} contentContainerStyle={pad} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}

// Вход: торможение с длинным хвостом, сдвиг снизу + проявление. Без пружин.
export function FadeIn({ children, index = 0, style }: { children: ReactNode; index?: number; style?: StyleProp<ViewStyle> }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: motion.enter, delay: index * motion.stagger, easing: motion.easeOut, useNativeDriver: true }).start();
  }, [v, index]);
  const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });
  return <Animated.View style={[{ opacity: v, transform: [{ translateY }] }, style]}>{children}</Animated.View>;
}

export function Card({ children, style, onPress }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  if (!onPress) return <View style={[styles.card, style]}>{children}</View>;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }, style]}>
      {children}
    </Pressable>
  );
}

export function Segmented<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <View style={styles.segmented}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable key={o.value} onPress={() => onChange(o.value)} style={[styles.segment, active && styles.segmentActive]}>
            <Txt style={[styles.segmentText, active && { color: colors.onAccent }]}>{o.label}</Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, padding: space.md },
  segmented: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.pill, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, padding: 4 },
  segment: { flex: 1, paddingVertical: 9, borderRadius: radius.pill, alignItems: 'center' },
  segmentActive: { backgroundColor: colors.accent },
  segmentText: { fontFamily: fonts.medium, fontSize: 14, color: colors.ink },
});

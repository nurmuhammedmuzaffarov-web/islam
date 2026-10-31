import { Easing } from 'react-native';

// Палитра: светлый песочный + изумруд. Один акцентный цвет на экран — изумрудный.
export const colors = {
  bg: '#F5EFE4',
  surface: '#FBF8F1',
  ink: '#1E1B16',
  inkMuted: '#6E665A',
  line: '#E4DACA',
  accent: '#1F7A5C',
  accentSoft: '#DDEBE3',
  onAccent: '#FBF8F1',
} as const;

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  arabic: 'Amiri_400Regular',
  arabicBold: 'Amiri_700Bold',
  quran: 'UthmanicHafs',
} as const;

export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;
export const radius = { sm: 10, md: 16, lg: 24, pill: 999 } as const;

// Движение: быстро вошло, мягко дотянуло, без пружин. Уход всегда короче входа.
export const motion = {
  enter: 280,
  exit: 200,
  stagger: 60,
  easeOut: Easing.out(Easing.exp),
  easeIn: Easing.in(Easing.cubic),
} as const;

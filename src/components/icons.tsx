import Svg, { Circle, Path } from 'react-native-svg';

type P = { color: string; size?: number };
const stroke = (color: string) => ({ stroke: color, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' });

// Полумесяц — намаз
export const PrayerIcon = ({ color, size = 24 }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" {...stroke(color)} />
  </Svg>
);

// Компас — кибла
export const QiblaIcon = ({ color, size = 24 }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx={12} cy={12} r={9} {...stroke(color)} />
    <Path d="M15.5 8.5 13.4 13.4 8.5 15.5 10.6 10.6Z" {...stroke(color)} />
  </Svg>
);

// Чётки — зикр
export const DhikrIcon = ({ color, size = 24 }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx={12} cy={4.5} r={1.6} {...stroke(color)} />
    <Circle cx={17.5} cy={7.5} r={1.6} {...stroke(color)} />
    <Circle cx={18.5} cy={13.5} r={1.6} {...stroke(color)} />
    <Circle cx={6.5} cy={7.5} r={1.6} {...stroke(color)} />
    <Circle cx={5.5} cy={13.5} r={1.6} {...stroke(color)} />
    <Path d="M15.5 17.5 12 21l-3.5-3.5M12 21v-3" {...stroke(color)} />
  </Svg>
);

// Ползунки — настройки
export const SettingsIcon = ({ color, size = 24 }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M4 7h10M18 7h2M4 17h4M12 17h8" {...stroke(color)} />
    <Circle cx={16} cy={7} r={2} {...stroke(color)} />
    <Circle cx={10} cy={17} r={2} {...stroke(color)} />
  </Svg>
);

export const ChevronIcon = ({ color, size = 18 }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="m9 6 6 6-6 6" {...stroke(color)} />
  </Svg>
);

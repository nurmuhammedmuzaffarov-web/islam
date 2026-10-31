import { Tabs } from 'expo-router/js-tabs';
import { DhikrIcon, PrayerIcon, QiblaIcon, QuranIcon, SettingsIcon } from '@/components/icons';
import { useSettings } from '@/lib/settings';
import { colors, fonts } from '@/theme';

export default function TabsLayout() {
  const { t } = useSettings();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.bg },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.inkMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.line, minHeight: 60 },
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 14 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t.tabPrayer, tabBarIcon: ({ color }) => <PrayerIcon color={String(color)} /> }} />
      <Tabs.Screen name="qibla" options={{ title: t.tabQibla, tabBarIcon: ({ color }) => <QiblaIcon color={String(color)} /> }} />
      <Tabs.Screen name="quran" options={{ title: t.tabQuran, tabBarIcon: ({ color }) => <QuranIcon color={String(color)} /> }} />
      <Tabs.Screen name="dhikr" options={{ title: t.tabDhikr, tabBarIcon: ({ color }) => <DhikrIcon color={String(color)} /> }} />
      <Tabs.Screen name="settings" options={{ title: t.tabSettings, tabBarIcon: ({ color }) => <SettingsIcon color={String(color)} /> }} />
    </Tabs>
  );
}

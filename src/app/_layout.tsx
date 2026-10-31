import { Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingsProvider, useSettings } from '@/lib/settings';
import { colors } from '@/theme';

// Шрифт Комплекса короля Фахда для текста Корана (лицензия: assets/fonts/KFGQPC-LICENSE.txt)
const UthmanicHafs = require('../../assets/fonts/UthmanicHafs.ttf');

SplashScreen.preventAutoHideAsync().catch(() => {});

function Root() {
  const { ready } = useSettings();
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Amiri_400Regular, Amiri_700Bold, UthmanicHafs });
  const loaded = ready && fontsLoaded;

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync().catch(() => {});
  }, [loaded]);

  if (!loaded) return null;
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'fade' }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="dhikr/[id]" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="quran/[id]" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <Root />
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

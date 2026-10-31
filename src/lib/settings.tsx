import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { strings, type Lang, type Strings } from '@/i18n/strings';
import { ZERO_ADJUSTMENTS, type Adjustments, type Madhhab, type MethodId } from './prayer';

export type Settings = {
  lang: Lang;
  method: MethodId;
  madhhab: Madhhab;
  adjustments: Adjustments;
  cityId: string | null; // null — брать координаты с GPS
  notifications: boolean;
};

const KEY = 'settings.v1';

function defaultLang(): Lang {
  const code = getLocales()[0]?.languageCode;
  return code === 'ru' || code === 'en' ? code : 'ky';
}

const defaults = (): Settings => ({
  lang: defaultLang(),
  method: 'kyrgyzstan',
  madhhab: 'hanafi',
  adjustments: ZERO_ADJUSTMENTS,
  cityId: null,
  notifications: false,
});

type Ctx = { settings: Settings; ready: boolean; update: (patch: Partial<Settings>) => void; t: Strings };
const SettingsContext = createContext<Ctx | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaults);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => raw && setSettings((s) => ({ ...s, ...JSON.parse(raw) })))
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      settings,
      ready,
      t: strings[settings.lang],
      update: (patch) =>
        setSettings((s) => {
          const next = { ...s, ...patch };
          AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
          return next;
        }),
    }),
    [settings, ready],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings outside SettingsProvider');
  return ctx;
}

import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { CITIES } from './prayer';
import { useSettings } from './settings';

export type Place = { lat: number; lng: number; name: string | null };
export type PlaceState = { place: Place | null; status: 'loading' | 'ready' | 'denied' };

// Ближайший город из списка в радиусе ~30 км — если обратное геокодирование ничего не дало.
function nearestCity(lat: number, lng: number): string | null {
  let best: { name: string; d: number } | null = null;
  for (const c of CITIES) {
    const d = Math.hypot(c.lat - lat, (c.lng - lng) * Math.cos((lat * Math.PI) / 180));
    if (!best || d < best.d) best = { name: c.name, d };
  }
  return best && best.d < 0.27 ? best.name : null;
}

// Выбранный город или GPS. Без разрешения падаем на Бишкек, чтобы экран не был пустым.
export function usePlace(): PlaceState {
  const { settings } = useSettings();
  const [state, setState] = useState<PlaceState>({ place: null, status: 'loading' });

  useEffect(() => {
    const city = CITIES.find((c) => c.id === settings.cityId);
    if (city) {
      setState({ place: { lat: city.lat, lng: city.lng, name: city.name }, status: 'ready' });
      return;
    }
    let cancelled = false;
    setState((s) => ({ ...s, status: 'loading' }));
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') throw new Error('denied');
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      let name: string | null = null;
      try {
        const [geo] = await Location.reverseGeocodeAsync(pos.coords);
        name = geo?.city ?? geo?.region ?? null;
      } catch {}
      name ??= nearestCity(pos.coords.latitude, pos.coords.longitude);
      if (!cancelled) setState({ place: { lat: pos.coords.latitude, lng: pos.coords.longitude, name }, status: 'ready' });
    })().catch(() => {
      const b = CITIES[0];
      if (!cancelled) setState({ place: { lat: b.lat, lng: b.lng, name: b.name }, status: 'denied' });
    });
    return () => {
      cancelled = true;
    };
  }, [settings.cityId]);

  return state;
}

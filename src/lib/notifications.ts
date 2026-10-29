import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Strings } from '@/i18n/strings';
import { SALAH_KEYS, timesFor, type CalcSettings } from './prayer';

const CHANNEL = 'adhan';
// iOS держит не больше 64 запланированных уведомлений: 5 намазов × 12 дней = 60.
const DAYS_AHEAD = 12;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function enableNotifications(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'Азан',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  return (await Notifications.requestPermissionsAsync()).granted;
}

// Пересоздаёт расписание целиком: проще и надёжнее, чем сверять старые уведомления с новыми.
export async function rescheduleAdhan(lat: number, lng: number, s: CalcSettings, t: Strings, on: boolean) {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!on) return;
  const now = new Date();
  for (let d = 0; d < DAYS_AHEAD; d++) {
    const day = new Date(now);
    day.setDate(now.getDate() + d);
    const times = timesFor(lat, lng, day, s);
    for (const key of SALAH_KEYS) {
      if (times[key] <= now) continue;
      await Notifications.scheduleNotificationAsync({
        content: { title: t[key], body: `${t[key]} ${t.notifBody}`, sound: 'default' },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: times[key], channelId: CHANNEL },
      });
    }
  }
}

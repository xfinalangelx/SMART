import { Platform } from 'react-native';
import { AppData } from '@/lib/supabase';

/**
 * Local reminder notifications for vaccinations, blood tests (including
 * fasting reminders) and appointments.
 *
 * expo-notifications is loaded lazily and every call is guarded so the app
 * keeps working on web (where the module is unsupported) and in
 * environments where notifications are unavailable.
 */

let Notifications: typeof import('expo-notifications') | null = null;

const getNotifications = () => {
  if (Platform.OS === 'web') return null;
  if (!Notifications) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      Notifications = require('expo-notifications');
      Notifications!.setNotificationHandler({
        handleNotification: async () => ({
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    } catch (error) {
      console.warn('expo-notifications unavailable:', error);
      return null;
    }
  }
  return Notifications;
};

/** Ask the user for notification permission. Returns true when granted. */
export const requestNotificationPermission = async (): Promise<boolean> => {
  const notifications = getNotifications();
  if (!notifications) return false;
  try {
    const existing = await notifications.getPermissionsAsync();
    if (existing.granted) return true;
    const requested = await notifications.requestPermissionsAsync();
    return requested.granted;
  } catch (error) {
    console.warn('Notification permission request failed:', error);
    return false;
  }
};

/** Parse the app's `YYYY/MM/DD` / `YYYY-MM-DD` strings; null for placeholders. */
const parseAppDate = (value?: string): Date | null => {
  if (!value || value.includes('X')) return null;
  const normalized = value.replace(/\//g, '-');
  const date = new Date(normalized);
  return isNaN(date.getTime()) ? null : date;
};

const atHour = (date: Date, hour: number): Date => {
  const result = new Date(date);
  result.setHours(hour, 0, 0, 0);
  return result;
};

const daysBefore = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

type PendingReminder = { title: string; body: string; fireAt: Date };

const collectReminders = (appData: AppData): PendingReminder[] => {
  const bm = appData.settings.language === 'bm';
  const now = new Date();
  const reminders: PendingReminder[] = [];

  const pushReminder = (title: string, body: string, fireAt: Date) => {
    if (fireAt.getTime() > now.getTime()) reminders.push({ title, body, fireAt });
  };

  // Vaccinations: remind 1 day before and on the day (9am)
  const vaccineEntries = [
    ...Object.values(appData.checkList.vaccine || {}),
    ...(appData.checkList.customVaccines || []),
  ];
  vaccineEntries.forEach((vaccine) => {
    const due = parseAppDate(vaccine.dateSecond);
    if (!due) return;
    pushReminder(
      bm ? 'Peringatan Vaksin' : 'Vaccination Reminder',
      bm
        ? `${vaccine.title} anda dijadualkan esok.`
        : `Your ${vaccine.title} is scheduled for tomorrow.`,
      atHour(daysBefore(due, 1), 9)
    );
    pushReminder(
      bm ? 'Peringatan Vaksin' : 'Vaccination Reminder',
      bm ? `${vaccine.title} anda dijadualkan hari ini.` : `Your ${vaccine.title} is due today.`,
      atHour(due, 9)
    );
  });

  // Blood tests: remind 1 day before (9am) + optional fasting reminder (8pm the night before)
  Object.values(appData.checkList.bloodTest || {}).forEach((test) => {
    const due = parseAppDate(test.dateSecond);
    if (!due) return;
    pushReminder(
      bm ? 'Peringatan Ujian Darah' : 'Blood Test Reminder',
      bm
        ? `Ujian ${test.title} anda dijadualkan esok.`
        : `Your ${test.title} test is scheduled for tomorrow.`,
      atHour(daysBefore(due, 1), 9)
    );
    if (test.fastingReminder) {
      pushReminder(
        bm ? 'Peringatan Berpuasa' : 'Fasting Reminder',
        bm
          ? `Mula berpuasa malam ini (8-10 jam) untuk ujian ${test.title} anda esok. Anda boleh minum air kosong.`
          : `Start fasting tonight (8-10 hours) for your ${test.title} test tomorrow. Plain water is allowed.`,
        atHour(daysBefore(due, 1), 20)
      );
    }
  });

  // Appointments: remind 1 day before (9am) and 1 hour before
  (appData.checkList.appointment || []).forEach((appointment) => {
    const dateTime = new Date(`${appointment.date}T${appointment.time || '09:00'}:00`);
    if (isNaN(dateTime.getTime())) return;
    pushReminder(
      bm ? 'Peringatan Temu Janji' : 'Appointment Reminder',
      bm
        ? `${appointment.title} pada ${appointment.time} esok.`
        : `${appointment.title} at ${appointment.time} tomorrow.`,
      atHour(daysBefore(dateTime, 1), 9)
    );
    pushReminder(
      bm ? 'Peringatan Temu Janji' : 'Appointment Reminder',
      bm
        ? `${appointment.title} dalam masa 1 jam.`
        : `${appointment.title} in 1 hour.`,
      new Date(dateTime.getTime() - 60 * 60 * 1000)
    );
  });

  return reminders;
};

/**
 * Re-schedule every reminder from the current app data. Cancels previously
 * scheduled notifications first so edits and deletions are reflected.
 */
export const syncNotifications = async (appData: AppData): Promise<void> => {
  const notifications = getNotifications();
  if (!notifications) return;

  try {
    await notifications.cancelAllScheduledNotificationsAsync();
    if (!appData.settings.notificationsEnabled) return;

    const permissions = await notifications.getPermissionsAsync();
    if (!permissions.granted) return;

    if (Platform.OS === 'android') {
      await notifications.setNotificationChannelAsync('reminders', {
        name: 'Reminders',
        importance: notifications.AndroidImportance.HIGH,
      });
    }

    const reminders = collectReminders(appData);
    await Promise.all(
      reminders.map((reminder) =>
        notifications!.scheduleNotificationAsync({
          content: { title: reminder.title, body: reminder.body, sound: true },
          trigger: {
            type: notifications!.SchedulableTriggerInputTypes.DATE,
            date: reminder.fireAt,
            channelId: Platform.OS === 'android' ? 'reminders' : undefined,
          },
        })
      )
    );
  } catch (error) {
    console.warn('Failed to sync notifications:', error);
  }
};

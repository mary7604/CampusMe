import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const notificationService = {

  // Récupère le Push Token et le retourne
  getPushToken: async () => {
    if (!Device.isDevice) return null;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return null;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'CampusMe',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: 'e72b066d-0b7b-46f0-a4d2-ca46c14ef315',
    });

    return token.data;
  },

  // Notification locale immédiate
  sendLocalNotification: async (title, body) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: { title, body, sound: true },
        trigger: null,
      });
    } catch (e) {
      console.log('Notif locale erreur:', e);
    }
  },

  // Notification programmée
  scheduleNotification: async (title, body, date) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: { title, body, sound: true },
        trigger: { date },
      });
    } catch (e) {
      console.log('Notif programmée erreur:', e);
    }
  },

  cancelAll: async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (e) {
      console.log(e);
    }
  },
};

export default notificationService;
import { Injectable } from '@nestjs/common';
const { Expo } = require('expo-server-sdk');

@Injectable()
export class NotificationsService {
  private expo = new Expo();

  async sendPushNotification(pushToken: string, title: string, body: string) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.log(`Token invalide: ${pushToken}`);
      return;
    }

    const message = {
      to: pushToken,
      sound: 'default',
      title,
      body,
    };

    try {
      const chunks = this.expo.chunkPushNotifications([message]);
      for (const chunk of chunks) {
        await this.expo.sendPushNotificationsAsync(chunk);
      }
      console.log(`Notification envoyée à ${pushToken}`);
    } catch (e) {
      console.log('Erreur envoi notification:', e);
    }
  }

  async sendToMultiple(pushTokens: string[], title: string, body: string) {
    for (const token of pushTokens) {
      await this.sendPushNotification(token, title, body);
    }
  }
}
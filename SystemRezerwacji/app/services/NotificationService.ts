import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

class NotificationService {
  static async initialize() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return true;
  }

  static async scheduleBookingNotification(bookingDetails: {
    checkIn: Date;
    propertyName: string;
  }) {
    const trigger = new Date(bookingDetails.checkIn);
    trigger.setDate(trigger.getDate() - 1); // Notify 1 day before check-in
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Upcoming Stay Tomorrow!',
        body: `Your stay at ${bookingDetails.propertyName} begins tomorrow. Get ready!`,
      },
      trigger,
    });
  }

  static async sendBookingConfirmation() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Booking Confirmed!',
        body: 'Your booking has been confirmed. Check your email for details.',
      },
      trigger: null, // Send immediately
    });
  }
}

export default NotificationService; 
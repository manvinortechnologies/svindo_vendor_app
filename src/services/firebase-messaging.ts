import messaging from "@react-native-firebase/messaging";
import { Platform, Alert } from "react-native";
import { StorageUtils } from "../utils/storage";
import api from "./api/api";
import { API_ROUTES } from "../constants/api-routes.constants";

class FirebaseMessagingService {
  private fcmToken: string | null = null;

  // Request permission for notifications
  async requestPermission(): Promise<boolean> {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error requesting permission:", error);
      return false;
    }
  }

  // Get FCM token
  async getToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      this.fcmToken = token;

      // Store token in storage for API calls
      StorageUtils.setFCMToken(token);

      return token;
    } catch (error) {
      console.error("Error getting FCM token:", error);
      return null;
    }
  }

  // Initialize FCM
  async initialize(): Promise<void> {
    try {
      // Request permission
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        return;
      }

      // Get token
      await this.getToken();

      // Send token to server
      await this.sendTokenToServer();

      // Listen for token refresh
      messaging().onTokenRefresh(async (token) => {
        this.fcmToken = token;
        StorageUtils.setFCMToken(token);
        // Send updated token to server
        await this.sendTokenToServer();
      });

      // Handle background messages
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        // Handle background message here
      });

      // Handle foreground messages
      // NOTE: This handler is disabled to prevent duplicate notifications
      // NotificationService handles all foreground notifications
      // messaging().onMessage(async (remoteMessage) => {
      //   console.log("A new FCM message arrived!", remoteMessage);
      //   // NotificationService handles all foreground notifications
      // });

      // Handle notification press when app is in background/closed
      messaging().onNotificationOpenedApp((remoteMessage) => {
        this.handleNotificationPress(remoteMessage);
      });

      // Check if app was opened from a notification
      messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
          if (remoteMessage) {
            // this.handleNotificationPress(remoteMessage);
          }
        });
    } catch (error) {
      console.error("Error initializing FCM:", error);
    }
  }

  // Handle notification press
  private handleNotificationPress(remoteMessage: any): void {
    // Handle different notification types based on data
    const data = remoteMessage.data;

    if (data?.type) {
      switch (data.type) {
        case "order":
          // Navigate to orders screen
          break;
        case "payment":
          // Navigate to payments screen
          break;
        case "expense":
          // Navigate to expenses screen  
          break;
        default:
      }
    }
  }

  // Send token to server
  async sendTokenToServer(): Promise<void> {
    try {
      // Only send token if user is authenticated
      if (!StorageUtils.isAuthenticated()) {
        return;
      }

      const token = this.fcmToken || (await this.getToken());
      if (!token) {
        return;
      }


      // Send token to server with the correct payload format
      await api.post(API_ROUTES.registerDeviceToken, {
        token: token,
      });

    } catch (error) {
      console.error("Error sending token to server:", error);
    }
  }

  // Subscribe to topic
  async subscribeToTopic(topic: string): Promise<void> {
    try {
      await messaging().subscribeToTopic(topic);
    } catch (error) {
      console.error(`Error subscribing to topic ${topic}:`, error);
    }
  }

  // Unsubscribe from topic
  async unsubscribeFromTopic(topic: string): Promise<void> {
    try {
      await messaging().unsubscribeFromTopic(topic);
    } catch (error) {
      console.error(`Error unsubscribing from topic ${topic}:`, error);
    }
  }

  // Get current token
  getCurrentToken(): string | null {
    return this.fcmToken;
  }
}

export default new FirebaseMessagingService();

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
        console.log("Authorization status:", authStatus);
        return true;
      } else {
        console.log("Permission denied");
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
      console.log("FCM Token:", token);

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
        console.log("Notification permission denied");
        return;
      }

      // Get token
      await this.getToken();

      // Send token to server
      await this.sendTokenToServer();

      // Listen for token refresh
      messaging().onTokenRefresh(async (token) => {
        console.log("FCM Token refreshed:", token);
        this.fcmToken = token;
        StorageUtils.setFCMToken(token);
        // Send updated token to server
        await this.sendTokenToServer();
      });

      // Handle background messages
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log("Message handled in the background!", remoteMessage);
        // Handle background message here
      });

      // Handle foreground messages
      messaging().onMessage(async (remoteMessage) => {
        console.log("A new FCM message arrived!", remoteMessage);

        // Show local notification for foreground messages
        if (Platform.OS === "android") {
          Alert.alert(
            remoteMessage.notification?.title || "New Message",
            remoteMessage.notification?.body || "You have a new message",
            [
              {
                text: "OK",
                onPress: () => {
                  // Handle notification tap
                  this.handleNotificationPress(remoteMessage);
                },
              },
            ]
          );
        }
      });

      // Handle notification press when app is in background/closed
      messaging().onNotificationOpenedApp((remoteMessage) => {
        console.log(
          "Notification caused app to open from background state:",
          remoteMessage
        );
        this.handleNotificationPress(remoteMessage);
      });

      // Check if app was opened from a notification
      messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
          if (remoteMessage) {
            console.log(
              "Notification caused app to open from quit state:",
              remoteMessage
            );
            this.handleNotificationPress(remoteMessage);
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
          console.log("Navigate to orders:", data.orderId);
          break;
        case "payment":
          // Navigate to payments screen
          console.log("Navigate to payments:", data.paymentId);
          break;
        case "expense":
          // Navigate to expenses screen
          console.log("Navigate to expenses:", data.expenseId);
          break;
        default:
          console.log("Unknown notification type:", data.type);
      }
    }
  }

  // Send token to server
  async sendTokenToServer(): Promise<void> {
    try {
      const token = this.fcmToken || (await this.getToken());
      if (!token) {
        console.log("No FCM token available");
        return;
      }

      console.log("Sending FCM token to server:", token);

      // Send token to server with the correct payload format
      await api.post(API_ROUTES.registerDeviceToken, {
        token: token,
      });

      console.log("FCM token sent to server successfully");
    } catch (error) {
      console.error("Error sending token to server:", error);
    }
  }

  // Subscribe to topic
  async subscribeToTopic(topic: string): Promise<void> {
    try {
      await messaging().subscribeToTopic(topic);
      console.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      console.error(`Error subscribing to topic ${topic}:`, error);
    }
  }

  // Unsubscribe from topic
  async unsubscribeFromTopic(topic: string): Promise<void> {
    try {
      await messaging().unsubscribeFromTopic(topic);
      console.log(`Unsubscribed from topic: ${topic}`);
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

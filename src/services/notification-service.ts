import { Platform, Alert, Linking } from "react-native";
import messaging from "@react-native-firebase/messaging";
// @ts-ignore
import PushNotification from "react-native-push-notification";
import { NavigationContainerRef } from "@react-navigation/native";

// Notification types
export enum NotificationType {
  ORDER = "order",
  PAYMENT = "payment",
  EXPENSE = "expense",
  DELIVERY = "delivery",
  GENERAL = "general",
  PROMOTION = "promotion",
}

// Notification data interface
export interface NotificationData {
  type: NotificationType;
  title: string;
  body: string;
  data?: any;
  imageUrl?: string;
  actionUrl?: string;
}

class NotificationService {
  private navigationRef: NavigationContainerRef<any> | null = null;

  // Set navigation reference
  setNavigationRef(ref: NavigationContainerRef<any>) {
    this.navigationRef = ref;
  }

  // Initialize push notifications
  async initialize(): Promise<void> {
    try {
      // Configure push notifications
      this.configurePushNotifications();

      // Request permission
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.log("Notification permission denied");
        return;
      }

      // Get FCM token
      const token = await this.getToken();
      if (token) {
        console.log("FCM Token:", token);
        // Send token to server
        await this.sendTokenToServer(token);
      }

      // Set up message handlers
      this.setupMessageHandlers();
    } catch (error) {
      console.error("Error initializing notifications:", error);
    }
  }

  // Configure push notifications
  private configurePushNotifications(): void {
    PushNotification.configure({
      // Called when token is generated
      onRegister: function (token: any) {
        console.log("TOKEN:", token);
      },

      // Called when a remote or local notification is opened or received
      onNotification: function (notification: any) {
        console.log("NOTIFICATION:", notification);

        // Handle notification based on platform
        if (Platform.OS === "ios") {
          // iOS specific handling
          if (notification.userInteraction) {
            // User tapped the notification
            console.log("User tapped notification on iOS");
          }
        } else {
          // Android specific handling
          if (notification.foreground) {
            // Show local notification for foreground messages
            PushNotification.localNotification({
              title: notification.title,
              message: notification.message,
              playSound: true,
              soundName: "default",
            });
          }
        }
      },

      // Should the initial notification be popped automatically
      popInitialNotification: true,

      // Request permissions on init
      requestPermissions: Platform.OS === "ios",
    });

    // Create default channel for Android
    if (Platform.OS === "android") {
      PushNotification.createChannel(
        {
          channelId: "default-channel-id",
          channelName: "Default Channel",
          channelDescription: "A default channel for notifications",
          playSound: true,
          soundName: "default",
          importance: 4,
          vibrate: true,
        },
        (created: any) => console.log(`createChannel returned '${created}'`)
      );
    }
  }

  // Request notification permission
  private async requestPermission(): Promise<boolean> {
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
  private async getToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      return token;
    } catch (error) {
      console.error("Error getting FCM token:", error);
      return null;
    }
  }

  // Send token to server
  private async sendTokenToServer(token: string): Promise<void> {
    try {
      // Import API here to avoid circular dependency
      const { default: api } = await import("./api/api");
      const { API_ROUTES } = await import("../constants/api-routes.constants");

      await api.post(API_ROUTES.registerDeviceToken, {
        token: token,
        platform: Platform.OS,
        app_version: "1.0.0", // You can get this from package.json
      });

      console.log("FCM token sent to server successfully");
    } catch (error) {
      console.error("Error sending token to server:", error);
    }
  }

  // Set up message handlers
  private setupMessageHandlers(): void {
    // Handle background messages
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
      // Handle background message processing here
    });

    // Handle foreground messages
    messaging().onMessage(async (remoteMessage) => {
      console.log("A new FCM message arrived!", remoteMessage);
      this.handleForegroundMessage(remoteMessage);
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
  }

  // Handle foreground messages
  private handleForegroundMessage(remoteMessage: any): void {
    const notification = remoteMessage.notification;
    const data = remoteMessage.data;

    if (Platform.OS === "android") {
      // Show local notification for Android
      PushNotification.localNotification({
        title: notification?.title || "New Notification",
        message: notification?.body || "You have a new message",
        channelId: "default-channel-id",
        playSound: true,
        soundName: "default",
        actions: ["View", "Dismiss"],
        userInfo: data,
      });
    } else {
      // Show alert for iOS
      Alert.alert(
        notification?.title || "New Notification",
        notification?.body || "You have a new message",
        [
          {
            text: "Dismiss",
            style: "cancel",
          },
          {
            text: "View",
            onPress: () => this.handleNotificationPress(remoteMessage),
          },
        ]
      );
    }
  }

  // Handle notification press
  private handleNotificationPress(remoteMessage: any): void {
    const data = remoteMessage.data;
    const notification = remoteMessage.notification;

    if (data?.type) {
      this.navigateToScreen(data.type, data);
    } else if (notification?.clickAction) {
      // Handle click action from notification
      this.handleClickAction(notification.clickAction, data);
    }
  }

  // Navigate to specific screen based on notification type
  private navigateToScreen(type: string, data: any): void {
    if (!this.navigationRef) {
      console.log("Navigation ref not set");
      return;
    }

    try {
      switch (type) {
        case NotificationType.ORDER:
          this.navigationRef.navigate("Orders", { orderId: data.orderId });
          break;
        case NotificationType.PAYMENT:
          this.navigationRef.navigate("Payments", {
            paymentId: data.paymentId,
          });
          break;
        case NotificationType.EXPENSE:
          this.navigationRef.navigate("Expenses", {
            expenseId: data.expenseId,
          });
          break;
        case NotificationType.DELIVERY:
          this.navigationRef.navigate("DeliveryBoys", {
            deliveryId: data.deliveryId,
          });
          break;
        case NotificationType.PROMOTION:
          this.navigationRef.navigate("Promotions", {
            promotionId: data.promotionId,
          });
          break;
        default:
          // Navigate to home or a general notifications screen
          this.navigationRef.navigate("Home");
      }
    } catch (error) {
      console.error("Error navigating to screen:", error);
    }
  }

  // Handle click action
  private handleClickAction(action: string, data: any): void {
    switch (action) {
      case "OPEN_URL":
        if (data.url) {
          Linking.openURL(data.url);
        }
        break;
      case "OPEN_APP":
        // App is already open, just navigate
        this.navigateToScreen(data.type, data);
        break;
      default:
        console.log("Unknown click action:", action);
    }
  }

  // Send local notification
  public sendLocalNotification(notification: NotificationData): void {
    PushNotification.localNotification({
      title: notification.title,
      message: notification.body,
      channelId: "default-channel-id",
      playSound: true,
      soundName: "default",
      userInfo: {
        type: notification.type,
        data: notification.data,
      },
    });
  }

  // Schedule local notification
  public scheduleLocalNotification(
    notification: NotificationData,
    date: Date
  ): void {
    PushNotification.localNotificationSchedule({
      title: notification.title,
      message: notification.body,
      date: date,
      channelId: "default-channel-id",
      playSound: true,
      soundName: "default",
      userInfo: {
        type: notification.type,
        data: notification.data,
      },
    });
  }

  // Cancel all notifications
  public cancelAllNotifications(): void {
    PushNotification.cancelAllLocalNotifications();
  }

  // Cancel specific notification
  public cancelNotification(id: string): void {
    PushNotification.cancelLocalNotifications({ id });
  }

  // Subscribe to topic
  public async subscribeToTopic(topic: string): Promise<void> {
    try {
      await messaging().subscribeToTopic(topic);
      console.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      console.error(`Error subscribing to topic ${topic}:`, error);
    }
  }

  // Unsubscribe from topic
  public async unsubscribeFromTopic(topic: string): Promise<void> {
    try {
      await messaging().unsubscribeFromTopic(topic);
      console.log(`Unsubscribed from topic: ${topic}`);
    } catch (error) {
      console.error(`Error unsubscribing from topic ${topic}:`, error);
    }
  }

  // Get notification permission status
  public async getPermissionStatus(): Promise<boolean> {
    try {
      const authStatus = await messaging().hasPermission();
      return authStatus === messaging.AuthorizationStatus.AUTHORIZED;
    } catch (error) {
      console.error("Error checking permission status:", error);
      return false;
    }
  }

  // Request notification permission with custom message
  public async requestPermissionWithMessage(): Promise<boolean> {
    try {
      const authStatus = await messaging().requestPermission({
        alert: true,
        badge: true,
        sound: true,
        announcement: true,
        carPlay: true,
        criticalAlert: true,
        provisional: false,
      });

      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      return enabled;
    } catch (error) {
      console.error("Error requesting permission:", error);
      return false;
    }
  }
}

export default new NotificationService();

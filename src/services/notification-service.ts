import { Platform, Alert, Linking, PermissionsAndroid } from "react-native";
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
  private notificationIds: Set<string> = new Set(); // Track shown notifications to prevent duplicates
  private processingMessages: Set<string> = new Set(); // Track messages currently being processed

  // Set navigation reference
  setNavigationRef(ref: NavigationContainerRef<any>) {
    this.navigationRef = ref;
  }

  // Initialize push notifications
  async initialize(): Promise<void> {
    try {
      // Wait a bit to ensure Firebase is fully initialized
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Configure push notifications
      this.configurePushNotifications();

      // Request permission with error handling
      try {
        const hasPermission = await this.requestPermission();
        if (!hasPermission) {
          // Continue without permission - don't crash
          return;
        }
      } catch (permissionError: any) {
        console.error("Error during permission request:", permissionError);
        // Continue without permission - don't crash the app
        return;
      }

      // Get FCM token
      try {
        const token = await this.getToken();
        if (token) {
          // Send token to server
          await this.sendTokenToServer(token);
        }
      } catch (tokenError: any) {
        console.error("Error getting FCM token:", tokenError);
        // Continue without token - don't crash
      }

      // Set up message handlers
      try {
        this.setupMessageHandlers();
      } catch (handlerError: any) {
        console.error("Error setting up message handlers:", handlerError);
        // Continue without handlers - don't crash
      }
    } catch (error: any) {
      console.error("Error initializing notifications:", error);
      // Don't throw - just log the error to prevent app crash
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
      onNotification: (notification: any) => {
        console.log("Notification received:", notification);

        // Only handle notification press if it's a user-initiated tap
        // Skip if this is triggered by our own local notification creation
        if (notification.userInfo?.isLocalNotification) {
          // This is a local notification we created, handle the press
          if (notification.userInfo?.remoteMessage) {
            this.handleNotificationPress(notification.userInfo.remoteMessage);
          }
          return;
        }

        // Handle notification press for remote notifications
        if (notification.userInfo?.remoteMessage) {
          this.handleNotificationPress(notification.userInfo.remoteMessage);
        } else if (notification.data) {
          // Handle local notification with data
          const remoteMessage = {
            notification: {
              title: notification.title,
              body: notification.message,
            },
            data: notification.userInfo?.data || notification.data,
          };
          this.handleNotificationPress(remoteMessage);
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
      // Check if Firebase messaging is available
      if (!messaging || !messaging().requestPermission) {
        console.log("Firebase messaging not available");
        return false;
      }

      // On Android 13+ (API level 33+), request POST_NOTIFICATIONS permission first
      if (Platform.OS === "android" && Platform.Version >= 33) {
        try {
          const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );

          if (!hasPermission) {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
              {
                title: "Notification Permission",
                message:
                  "This app needs notification permission to send you important updates.",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK",
              }
            );

            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
              console.log("Android POST_NOTIFICATIONS permission denied");
              return false;
            }
          }
        } catch (androidError: any) {
          console.error(
            "Error requesting Android notification permission:",
            androidError
          );
          // Continue to try Firebase permission even if Android permission fails
        }
      }

      // On Android, check if Firebase permission is already granted first
      if (Platform.OS === "android") {
        try {
          const hasPermission = await messaging().hasPermission();
          if (hasPermission === messaging.AuthorizationStatus.AUTHORIZED) {
            return true;
          }
        } catch (checkError: any) {
        }
      }

      // Request permission with a small delay to ensure Firebase is initialized
      await new Promise((resolve) => setTimeout(resolve, 500));

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
    } catch (error: any) {
      console.error("Error requesting permission:", error);
      // Don't crash the app if permission request fails
      // Just log and return false
      if (error?.code) {
        console.error("Permission error code:", error.code);
      }
      if (error?.message) {
        console.error("Permission error message:", error.message);
      }
      return false;
    }
  }

  // Get FCM token
  private async getToken(): Promise<string | null> {
    try {
      // Check if Firebase messaging is available
      if (!messaging || !messaging().getToken) {
        return null;
      }

      const token = await messaging().getToken();
      return token;
    } catch (error: any) {
      console.error("Error getting FCM token:", error);
      // Don't throw - just return null
      return null;
    }
  }

  // Send token to server
  private async sendTokenToServer(token: string): Promise<void> {
    try {
      // Import dependencies here to avoid circular dependency
      const { default: api } = await import("./api/api");
      const { API_ROUTES } = await import("../constants/api-routes.constants");
      const { StorageUtils } = await import("../utils/storage");

      // Only send token if user is authenticated
      if (!StorageUtils.isAuthenticated()) {
        console.log(
          "User not authenticated, skipping device token registration"
        );
        return;
      }

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
    try {
      // Check if Firebase messaging is available
      if (!messaging || !messaging().setBackgroundMessageHandler) {
        console.log("Firebase messaging not available for handlers");
        return;
      }

      // Handle background messages
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log("Message handled in the background!", remoteMessage);
        // Handle background message processing here
      });

      // Handle foreground messages
      // Note: onMessage is only called when app is in foreground
      // Firebase automatically shows notifications when app is in background/closed
      messaging().onMessage(async (remoteMessage) => {
        console.log("A new FCM message arrived (foreground)!", remoteMessage);
        // Only show notification manually in foreground
        // Firebase handles background notifications automatically
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
        })
        .catch((error: any) => {
          console.error("Error getting initial notification:", error);
        });
    } catch (error: any) {
      console.error("Error setting up message handlers:", error);
      // Don't throw - just log
    }
  }

  // Handle foreground messages
  private handleForegroundMessage(remoteMessage: any): void {
    const notification = remoteMessage.notification;
    const data = remoteMessage.data;

    // Generate a unique notification ID to prevent duplicates
    // Use a combination of messageId, timestamp, and data to ensure uniqueness
    const messageId =
      remoteMessage.messageId ||
      data?.messageId ||
      data?.id ||
      `${remoteMessage.sentTime || Date.now()}_${JSON.stringify(data || {})}`;

    // Create a more unique key by combining messageId with title/body hash
    const title = notification?.title || data?.title || "";
    const body = notification?.body || data?.body || data?.message || "";
    const uniqueKey = `${messageId}_${title}_${body}`.substring(0, 200); // Limit length

    // Check if we're already processing this message
    if (this.processingMessages.has(uniqueKey)) {
      console.log(
        "Notification already being processed, skipping duplicate:",
        uniqueKey
      );
      return;
    }

    // Check if we've already shown this notification
    if (this.notificationIds.has(uniqueKey)) {
      console.log("Notification already shown, skipping duplicate:", uniqueKey);
      return;
    }

    // Mark as processing
    this.processingMessages.add(uniqueKey);

    // Mark this notification as shown
    this.notificationIds.add(uniqueKey);

    // Clean up old IDs (keep only last 100)
    if (this.notificationIds.size > 100) {
      const idsArray = Array.from(this.notificationIds);
      idsArray
        .slice(0, idsArray.length - 100)
        .forEach((id) => this.notificationIds.delete(id));
    }

    if (Platform.OS === "android") {
      // Show local notification for Android in foreground
      const notificationData: NotificationData = {
        type: (data?.type as NotificationType) || NotificationType.GENERAL,
        title: notification?.title || data?.title || "New Notification",
        body:
          notification?.body ||
          data?.body ||
          data?.message ||
          "You have a new message",
        data: data,
        imageUrl: notification?.android?.imageUrl || data?.imageUrl,
        actionUrl: data?.actionUrl,
      };

      // Show local notification
      PushNotification.localNotification({
        id: uniqueKey.substring(0, 50), // Use unique key as notification ID to prevent duplicates
        title: notificationData.title,
        message: notificationData.body,
        channelId: "default-channel-id",
        playSound: true,
        soundName: "default",
        smallIcon: "ic_notification",
        largeIcon: "ic_notification_large",
        color: "#FCA311",
        priority: "high",
        visibility: "public",
        importance: "high",
        vibrate: true,
        userInfo: {
          type: notificationData.type,
          data: notificationData.data,
          messageId: messageId,
          remoteMessage: remoteMessage,
          isLocalNotification: true, // Flag to identify our local notifications
        },
      });

      // Remove from processing set after a short delay
      setTimeout(() => {
        this.processingMessages.delete(uniqueKey);
      }, 1000);
    } else {
      // Show alert for iOS
      Alert.alert(
        notification?.title || data?.title || "New Notification",
        notification?.body ||
          data?.body ||
          data?.message ||
          "You have a new message",
        [
          {
            text: "Dismiss",
            style: "cancel",
            onPress: () => {
              // Remove from processing set
              setTimeout(() => {
                this.processingMessages.delete(uniqueKey);
              }, 100);
            },
          },
          {
            text: "View",
            onPress: () => {
              this.handleNotificationPress(remoteMessage);
              // Remove from processing set
              setTimeout(() => {
                this.processingMessages.delete(uniqueKey);
              }, 100);
            },
          },
        ]
      );
    }
  }

  // Handle notification press
  private handleNotificationPress(remoteMessage: any): void {
    const data = remoteMessage.data;
    const notification = remoteMessage.notification;

    if (!this.navigationRef) {
      console.log("Navigation ref not set");
      return;
    }

    try {
      // Check for store_id in data
      if (data?.store_id && data.store_id.trim() !== "") {
        // Navigate to store screen
        // StoreScreen is in a nested navigator (StoreStackNavigator) inside BottomTabNavigator
        // Navigate to BottomNavigation tab, then to StoreStack
        this.navigationRef.navigate("BottomNavigation" as any, {
          screen: "Storescreen",
          params: {
            screen: "Storescreen",
            params: { storeId: data.store_id },
          },
        });
        return;
      }

      // Check for product_id in data
      if (data?.product_id && data.product_id.trim() !== "") {
        // Navigate to product screen (AddProductScreen for editing/viewing)
        this.navigationRef.navigate("AddProductScreen" as any, {
          productId: data.product_id,
          isEdit: false, // Set to true if you want edit mode
        });
        return;
      }

      // Fallback to type-based navigation
      if (data?.type) {
        this.navigateToScreen(data.type, data);
      } else if (notification?.clickAction) {
        // Handle click action from notification
        this.handleClickAction(notification.clickAction, data);
      } else {
        // Default navigation to home
        this.navigationRef.navigate("BottomNavigation");
      }
    } catch (error) {
      console.error("Error handling notification press:", error);
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
      smallIcon: "ic_notification", // Small icon (drawable resource)
      largeIcon: "ic_notification_large", // Large icon (drawable resource) - shows app logo
      color: "#FCA311", // Notification color
      userInfo: {
        type: notification.type,
        data: notification.data,
      },
      ...(Platform.OS === "android" && {
        // Android specific options
        priority: "high",
        visibility: "public",
        importance: "high",
      }),
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
      smallIcon: "ic_notification", // Small icon (drawable resource)
      largeIcon: "ic_notification_large", // Large icon (drawable resource) - shows app logo
      color: "#FCA311", // Notification color
      userInfo: {
        type: notification.type,
        data: notification.data,
      },
      ...(Platform.OS === "android" && {
        // Android specific options
        priority: "high",
        visibility: "public",
        importance: "high",
      }),
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

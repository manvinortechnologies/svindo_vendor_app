import { useState, useEffect } from "react";
import { Alert } from "react-native";
import NotificationService, {
  NotificationData,
} from "../services/notification-service";

interface UseNotificationsReturn {
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
  sendNotification: (notification: NotificationData) => void;
  subscribeToTopic: (topic: string) => Promise<void>;
  unsubscribeFromTopic: (topic: string) => Promise<void>;
  isLoading: boolean;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    try {
      const permission = await NotificationService.getPermissionStatus();
      setHasPermission(permission);
    } catch (error) {
      console.error("Error checking permission status:", error);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const permission =
        await NotificationService.requestPermissionWithMessage();
      setHasPermission(permission);

      if (!permission) {
        Alert.alert(
          "Permission Required",
          "Push notifications are disabled. Please enable them in your device settings to receive important updates.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Settings",
              onPress: () => {
                // You can add logic to open device settings here
              },
            },
          ]
        );
      }

      return permission;
    } catch (error) {
      console.error("Error requesting permission:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendNotification = (notification: NotificationData) => {
    try {
      NotificationService.sendLocalNotification(notification);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const subscribeToTopic = async (topic: string): Promise<void> => {
    try {
      await NotificationService.subscribeToTopic(topic);
    } catch (error) {
      console.error("Error subscribing to topic:", error);
    }
  };

  const unsubscribeFromTopic = async (topic: string): Promise<void> => {
    try {
      await NotificationService.unsubscribeFromTopic(topic);
    } catch (error) {
      console.error("Error unsubscribing from topic:", error);
    }
  };

  return {
    hasPermission,
    requestPermission,
    sendNotification,
    subscribeToTopic,
    unsubscribeFromTopic,
    isLoading,
  };
};

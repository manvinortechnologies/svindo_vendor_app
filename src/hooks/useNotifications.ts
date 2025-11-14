import { useState, useEffect } from "react";
import { Alert } from "react-native";
import NotificationService, {
  NotificationType,
  NotificationData,
} from "../services/notification-service";

interface UseNotificationsReturn {
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
  sendNotification: (notification: NotificationData) => void;
  scheduleNotification: (notification: NotificationData, date: Date) => void;
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

  const scheduleNotification = (notification: NotificationData, date: Date) => {
    try {
      NotificationService.scheduleLocalNotification(notification, date);
    } catch (error) {
      console.error("Error scheduling notification:", error);
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
    scheduleNotification,
    subscribeToTopic,
    unsubscribeFromTopic,
    isLoading,
  };
};

// Hook for specific notification types
export const useOrderNotifications = () => {
  const { sendNotification, scheduleNotification } = useNotifications();

  const sendOrderNotification = (orderId: string, message: string) => {
    sendNotification({
      type: NotificationType.ORDER,
      title: "New Order",
      body: message,
      data: { orderId },
    });
  };

  const sendOrderUpdateNotification = (orderId: string, status: string) => {
    sendNotification({
      type: NotificationType.ORDER,
      title: "Order Update",
      body: `Order #${orderId} status updated to ${status}`,
      data: { orderId, status },
    });
  };

  return {
    sendOrderNotification,
    sendOrderUpdateNotification,
  };
};

export const usePaymentNotifications = () => {
  const { sendNotification } = useNotifications();

  const sendPaymentNotification = (amount: number, type: string) => {
    sendNotification({
      type: NotificationType.PAYMENT,
      title: "Payment Received",
      body: `Payment of ₹${amount} received via ${type}`,
      data: { amount, type },
    });
  };

  const sendPaymentReminder = (amount: number, dueDate: string) => {
    sendNotification({
      type: NotificationType.PAYMENT,
      title: "Payment Reminder",
      body: `Payment of ₹${amount} is due on ${dueDate}`,
      data: { amount, dueDate },
    });
  };

  return {
    sendPaymentNotification,
    sendPaymentReminder,
  };
};

export const useExpenseNotifications = () => {
  const { sendNotification } = useNotifications();

  const sendExpenseNotification = (amount: number, category: string) => {
    sendNotification({
      type: NotificationType.EXPENSE,
      title: "Expense Added",
      body: `Expense of ₹${amount} added in ${category}`,
      data: { amount, category },
    });
  };

  const sendExpenseReminder = (category: string) => {
    sendNotification({
      type: NotificationType.EXPENSE,
      title: "Expense Reminder",
      body: `Don't forget to record your ${category} expenses`,
      data: { category },
    });
  };

  return {
    sendExpenseNotification,
    sendExpenseReminder,
  };
};

export const useDeliveryNotifications = () => {
  const { sendNotification } = useNotifications();

  const sendDeliveryNotification = (
    deliveryBoyName: string,
    status: string
  ) => {
    sendNotification({
      type: NotificationType.DELIVERY,
      title: "Delivery Update",
      body: `${deliveryBoyName} - ${status}`,
      data: { deliveryBoyName, status },
    });
  };

  const sendDeliveryAssignedNotification = (
    orderId: string,
    deliveryBoyName: string
  ) => {
    sendNotification({
      type: NotificationType.DELIVERY,
      title: "Delivery Assigned",
      body: `Order #${orderId} assigned to ${deliveryBoyName}`,
      data: { orderId, deliveryBoyName },
    });
  };

  return {
    sendDeliveryNotification,
    sendDeliveryAssignedNotification,
  };
};

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import NotificationBanner from "../CommonComponent/NotificationBanner";
import { useNotifications } from "../hooks/useNotifications";

interface NotificationContextType {
  showNotification: (notification: NotificationData) => void;
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
  hideNotification: () => void;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
}

interface NotificationData {
  title: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onPress?: () => void;
  actionText?: string;
  onActionPress?: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [currentNotification, setCurrentNotification] =
    useState<NotificationData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { hasPermission, requestPermission: requestNotificationPermission } =
    useNotifications();

  const showNotification = useCallback((notification: NotificationData) => {
    setCurrentNotification(notification);
    setIsVisible(true);
  }, []);

  const hideNotification = useCallback(() => {
    setIsVisible(false);
    setCurrentNotification(null);
  }, []);

  const showSuccess = useCallback(
    (title: string, message: string) => {
      showNotification({
        title,
        message,
        type: "success",
        duration: 3000,
      });
    },
    [showNotification]
  );

  const showError = useCallback(
    (title: string, message: string) => {
      showNotification({
        title,
        message,
        type: "error",
        duration: 5000,
      });
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (title: string, message: string) => {
      showNotification({
        title,
        message,
        type: "warning",
        duration: 4000,
      });
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (title: string, message: string) => {
      showNotification({
        title,
        message,
        type: "info",
        duration: 4000,
      });
    },
    [showNotification]
  );

  const requestPermission = useCallback(async (): Promise<boolean> => {
    return await requestNotificationPermission();
  }, [requestNotificationPermission]);

  const contextValue: NotificationContextType = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification,
    hasPermission,
    requestPermission,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      {currentNotification && (
        <NotificationBanner
          visible={isVisible}
          title={currentNotification.title}
          message={currentNotification.message}
          type={currentNotification.type}
          duration={currentNotification.duration}
          onPress={currentNotification.onPress}
          onDismiss={hideNotification}
          actionText={currentNotification.actionText}
          onActionPress={currentNotification.onActionPress}
        />
      )}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  }
  return context;
};

export default NotificationContext;

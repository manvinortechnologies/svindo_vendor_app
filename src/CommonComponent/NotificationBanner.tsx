import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface NotificationBannerProps {
  visible: boolean;
  title: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onPress?: () => void;
  onDismiss?: () => void;
  actionText?: string;
  onActionPress?: () => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  visible,
  title,
  message,
  type = "info",
  duration = 4000,
  onPress,
  onDismiss,
  actionText,
  onActionPress,
}) => {
  const [animation] = useState(new Animated.Value(0));
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();

      if (duration > 0) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      handleDismiss();
    }
  }, [visible, duration]);

  const handleDismiss = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
      onDismiss?.();
    });
  };

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          backgroundColor: "#4CAF50",
          icon: "check-circle",
          iconColor: "#fff",
        };
      case "error":
        return {
          backgroundColor: "#F44336",
          icon: "alert-circle",
          iconColor: "#fff",
        };
      case "warning":
        return {
          backgroundColor: "#FF9800",
          icon: "alert",
          iconColor: "#fff",
        };
      default:
        return {
          backgroundColor: "#2196F3",
          icon: "information",
          iconColor: "#fff",
        };
    }
  };

  const typeStyles = getTypeStyles();

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
          ],
          opacity: animation,
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.banner, { backgroundColor: typeStyles.backgroundColor }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          <View style={styles.leftContent}>
            <Icon
              name={typeStyles.icon}
              size={24}
              color={typeStyles.iconColor}
            />
            <View style={styles.textContent}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
            </View>
          </View>

          <View style={styles.rightContent}>
            {actionText && onActionPress && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onActionPress}
              >
                <Text style={styles.actionText}>{actionText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={handleDismiss}
            >
              <Icon name="close" size={20} color={typeStyles.iconColor} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
    paddingTop: 50, // Account for status bar
  },
  banner: {
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  textContent: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  actionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  dismissButton: {
    padding: 4,
  },
});

export default NotificationBanner;

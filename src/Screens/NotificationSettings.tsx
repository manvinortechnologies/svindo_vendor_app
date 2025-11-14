import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Headerwithback from "./Headerwithback";
import MainContainer from "../CommonComponent/MainContainer";
import NotificationService from "../services/notification-service";
import Toast from "react-native-toast-message";

interface NotificationSettings {
  pushNotifications: boolean;
  orderNotifications: boolean;
  paymentNotifications: boolean;
  expenseNotifications: boolean;
  deliveryNotifications: boolean;
  promotionNotifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

const NotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    pushNotifications: true,
    orderNotifications: true,
    paymentNotifications: true,
    expenseNotifications: true,
    deliveryNotifications: true,
    promotionNotifications: false,
    soundEnabled: true,
    vibrationEnabled: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      // Check if notifications are enabled
      const hasPermission = await NotificationService.getPermissionStatus();
      setSettings((prev) => ({
        ...prev,
        pushNotifications: hasPermission,
      }));
    } catch (error) {
      console.error("Error loading notification settings:", error);
    }
  };

  const handleToggle = async (key: keyof NotificationSettings) => {
    if (key === "pushNotifications") {
      // Handle push notification permission
      const hasPermission =
        await NotificationService.requestPermissionWithMessage();
      if (hasPermission) {
        setSettings((prev) => ({ ...prev, [key]: true }));
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Push notifications enabled successfully!",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2:
            "Push notifications are disabled. Please enable them in your device settings.",
        });
      }
    } else {
      setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);

      // Save settings to local storage or send to server
      // You can implement this based on your backend API

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Notification settings saved successfully!",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to save notification settings",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestNotification = () => {
    NotificationService.sendLocalNotification({
      type: "general" as any,
      title: "Test Notification",
      body: "This is a test notification to verify your settings are working correctly.",
    });
  };

  const renderSettingItem = (
    key: keyof NotificationSettings,
    title: string,
    description: string,
    icon: string
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Icon name={icon} size={24} color="#FCA311" />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={settings[key]}
        onValueChange={() => handleToggle(key)}
        trackColor={{ false: "#767577", true: "#FCA311" }}
        thumbColor={settings[key] ? "#fff" : "#f4f3f4"}
      />
    </View>
  );

  return (
    <MainContainer>
      <Headerwithback title="Notification Settings" />
      <ScrollView style={styles.container}>
        {/* Push Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Push Notifications</Text>
          {renderSettingItem(
            "pushNotifications",
            "Enable Push Notifications",
            "Receive notifications from the app",
            "bell-outline"
          )}
        </View>

        {/* Notification Types Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Types</Text>
          {renderSettingItem(
            "orderNotifications",
            "Order Notifications",
            "Get notified about new orders and order updates",
            "shopping-outline"
          )}
          {renderSettingItem(
            "paymentNotifications",
            "Payment Notifications",
            "Receive alerts about payments and transactions",
            "credit-card-outline"
          )}
          {renderSettingItem(
            "expenseNotifications",
            "Expense Notifications",
            "Get notified about expense updates",
            "receipt-outline"
          )}
          {renderSettingItem(
            "deliveryNotifications",
            "Delivery Notifications",
            "Receive updates about delivery status",
            "truck-delivery-outline"
          )}
          {renderSettingItem(
            "promotionNotifications",
            "Promotion Notifications",
            "Get notified about offers and promotions",
            "tag-outline"
          )}
        </View>

        {/* Notification Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>
          {renderSettingItem(
            "soundEnabled",
            "Sound",
            "Play sound for notifications",
            "volume-high"
          )}
          {renderSettingItem(
            "vibrationEnabled",
            "Vibration",
            "Vibrate for notifications",
            "vibrate"
          )}
        </View>

        {/* Test Notification */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.testButton}
            onPress={handleTestNotification}
          >
            <Icon name="bell-ring-outline" size={20} color="#fff" />
            <Text style={styles.testButtonText}>Send Test Notification</Text>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveSettings}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? "Saving..." : "Save Settings"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </MainContainer>
  );
};

export default NotificationSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FCA311",
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  testButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCA311",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 15,
  },
  testButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: "#169729",
    paddingVertical: 15,
    marginHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

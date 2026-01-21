import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import CustomHeader from "../CommonComponent/CustomHeader";
import Loading from "../CommonComponent/Loading";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import { useNotificationContext } from "../contexts/NotificationContext";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { HomeNavigation } from "../constants/app-routes.constants";
import { s } from "react-native-size-matters";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "chat" | "order" | "like" | "rating" | "visit" | "reminder" | "general" | "product_like" | "store_visit" | "follow";
  date?: string;
  time?: string;
  amount?: string;
  image?: any;
  color?: string;
  isRead?: boolean;
  created_at?: string;
  updated_at?: string;
  user?: any;
}

const NotificationScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"Other" | "Reminder">("Other");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showError } = useNotificationContext();

  useEffect(() => {
    if (activeTab === "Other") {
      fetchNotifications();
    } else {
      fetchReminders();
    }
  }, [activeTab]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get(API_ROUTES.activityFeed);

      if (response.data && response.data.activities && Array.isArray(response.data.activities)) {
        // Transform activity feed data to match our interface
        const transformedNotifications = response.data.activities.map((item: any) => {
          // Map activity types to notification types
          let notificationType: NotificationItem["type"] = item.type;



          // Get user name for title
          const userName = item.user
            ? `${item.user.first_name || ""} ${item.user.last_name || ""}`.trim() || item.user.email || `User #${item.user.id}`
            : "Unknown User";

          // Get product image if available (for product_like)
          let imageSource = require("../assets/product/storelogo.png");
          if (item.product && item.product.image) {
            imageSource = { uri: item.product.image };
          } else if (item.user) {
            // Could use user avatar if available in future
            imageSource = require("../assets/product/storelogo.png");
          }

          return {
            id: `${item.type}_${item.user?.id || 'unknown'}_${item.created_at || Math.random()}`,
            title: item.message || `${userName} - ${item.type}`,
            user: item.user,
            message: item.message || "Store activity",
            type: notificationType,
            date: item.created_at
              ? new Date(item.created_at).toLocaleDateString()
              : new Date().toLocaleDateString(),
            time: item.created_at
              ? new Date(item.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
              : new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            amount: undefined,
            image: imageSource,
            color: getDefaultColor(notificationType),
            isRead: false,
            created_at: item.created_at,
            updated_at: item.created_at,
          };
        });

        setNotifications(transformedNotifications);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching activity feed:", error);
      setError("Failed to load store activity");
      showError("Error", "Failed to load store activity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReminders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get(API_ROUTES.reminders);
      if (response.data && Array.isArray(response.data)) {
        setReminders(response.data);
      } else {
        setReminders([]);
      }
    } catch (error) {
      console.error("Error fetching reminders:", error);
      setError("Failed to load reminders");
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(true);
    if (activeTab === "Other") {
      await fetchNotifications();
    } else {
      await fetchReminders();
    }
    setRefreshing(false);
  };

  const getDefaultColor = (type: string) => {
    switch (type) {
      case "like":
        return "#A74040";
      case "rating":
        return "#40A75B";
      case "visit":
        return "#4081A7";
      case "reminder":
        return "#E97171";
      case "order":
        return "#FF9800";
      // case "chat":
      //   return "#2196F3";
      default:
        return "#757575";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return "heart";
      case "rating":
        return "star";
      case "visit":
        return "eye";
      case "reminder":
        return "notifications";
      case "order":
        return "receipt";
      // case "chat":
      //   return "chatbubble";
      default:
        return "information-circle";
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );

      // You can add API call here to mark notification as read on server
      // await api.put(`${API_ROUTES.notificationCampaign}${notificationId}/mark-read/`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleReminderPress = (reminder: any) => {
    // Mark as read if not already read
    // if (!reminder.is_read) {
    //   markReminderAsRead(reminder.id);
    // }

    // Navigate based on reminder type and associated IDs
    if (reminder.purchase) {
      // Navigate to Purchase Ledger with purchase ID
      navigation.navigate(HomeNavigation.PURCHASE_LEDGER, {
        purchaseId: reminder.purchase,
      });
    } else if (reminder.sale) {
      // Navigate to Bill Details with sale ID
      navigation.navigate(HomeNavigation.SALES_LEDGER, {
        saleId: reminder.sale,
      });
    } else if (reminder.product) {
      // Navigate to Product Details or Stock Screen
      navigation.navigate(HomeNavigation.STOCK_SCREEN, {
        productId: reminder.product,
      });
    } else {
      // Default: show reminder details modal or stay on screen
      navigation.navigate(HomeNavigation.MODEL_REMINDER_SCREEN, {
        reminder: reminder,
      });
    }
  };

  const handleNotificationPress = (notification: NotificationItem) => {
    // Mark as read if not already read
    // if (!notification.isRead) {
    //   markAsRead(notification.id);
    // }

    console.log("notification-->", notification);
    // Handle different notification types
    switch (notification.type) {
      case "reminder":
        navigation.navigate("ModelReminderScreen", {
          reminder: notification,
        });
        break;
      case "order":
        navigation.navigate("Orders", { orderId: notification.id });
        break;
      case "product_like":
      case "store_visit":
      case "follow":
        navigation.navigate(HomeNavigation.CREATECOUPON, { customer: notification.user });
        break;
      default:
        // Handle general notifications
        break;
    }
  };

  // Group notifications by type
  // const chats = notifications.filter((n) => n.type === "chat");
  const orders = notifications.filter((n) => n.type === "order");
  const moreNotifications = notifications.filter(
    (n) => !["chat", "order", "store_visit", "like", "visit"].includes(n.type)
  );

  if (error && notifications.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <CustomHeader title="Notifications" />
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={48} color="#F44336" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchNotifications}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Loading visible={isLoading} />
      {/* Header */}
      <CustomHeader
        title="Notifications"
        rightIcon={
          <TouchableOpacity
            onPress={() => navigation.navigate(HomeNavigation.SENDNOTIFICATION)}
          >
            <Icon name="add-circle" size={s(28)} color="#FCA311" />
          </TouchableOpacity>
        }
      />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {["Other", "Reminder"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab as "Other" | "Reminder")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={
          activeTab === "Reminder"
            ? reminders
            : [...orders, ...moreNotifications]
        }
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => {
          // Render Reminder items
          if (activeTab === "Reminder") {
            return (
              <TouchableOpacity
                onPress={() => handleReminderPress(item)}
                style={styles.listItemContainer}
              >
                <View style={styles.moreItem}>
                  {/* Left Side */}
                  <View style={styles.reminderCircle}>
                    <Icon name="notifications" size={18} color="#fff" />
                  </View>

                  {/* Middle */}
                  <View style={styles.moreMiddle}>
                    <Text style={styles.moreTitle}>
                      {item.reminder_type_display}
                    </Text>
                    <Text style={styles.moreMsg}>
                      {item.title || item.message}
                    </Text>
                  </View>

                  {/* Right Side */}
                  <Text style={styles.moreTime}>
                    {item.created_at
                      ? new Date(item.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      : ""}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }

          // Render Order items
          if (item.type === "order") {
            return (
              <TouchableOpacity
                style={[
                  styles.card,
                  !item.isRead && styles.unreadCard,
                  styles.listItemContainer,
                ]}
                onPress={() => handleNotificationPress(item)}
              >
                <View style={styles.cardLeft}>
                  <Image
                    source={
                      item.image || require("../assets/product/storelogo.png")
                    }
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                  />
                </View>
                <View style={styles.cardMiddle}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardMsg}>{item.message}</Text>
                </View>
                <View style={styles.cardRight}>
                  <Text style={styles.cardDate}>{item.date}</Text>
                  <Text style={styles.cardTime}>{item.time}</Text>
                  {item.amount && (
                    <Text style={styles.amount}>{item.amount}</Text>
                  )}
                  {/* {!item.isRead && <View style={styles.unreadDot} />} */}
                </View>
              </TouchableOpacity>
            );
          }

          // Render More notifications items
          return (
            <TouchableOpacity
              onPress={() => handleNotificationPress(item)}
              style={styles.listItemContainer}
            >
              <View
                style={[styles.moreItem]}
              >
                {/* Left Side */}
                {item.type === "reminder" ? (
                  <View style={styles.reminderCircle}>
                    <Icon
                      name={getNotificationIcon(item.type)}
                      size={18}
                      color="#fff"
                    />
                  </View>
                ) : (
                  <View style={styles.iconContainer}>
                    <Icon
                      name={getNotificationIcon(item.type)}
                      size={20}
                      color={item.color || "#757575"}
                    />
                  </View>
                )}

                {/* Middle */}
                <View style={styles.moreMiddle}>
                  <Text style={styles.moreTitle}>{item.title}</Text>
                  <Text style={styles.moreMsg}>{item.message}</Text>
                </View>

                <Text style={styles.moreTime}>{item.time}</Text>

                {/* Right Side */}
                {/* <View style={styles.rightSide}>
                  {item.type !== "reminder" && item.color && (
                    <View
                      style={[
                        styles.colorSquare,
                        { backgroundColor: item.color },
                      ]}
                    />
                  )}
                </View> */}
              </View>
            </TouchableOpacity>
          );
        }}
        ListHeaderComponent={() => {
          if (activeTab === "Other" && orders.length > 0) {
            return (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Orders ({orders.length})
                </Text>
                <TouchableOpacity style={{ flexDirection: "row", gap: 5 }}>
                  <Text style={styles.viewAll}>View All</Text>
                  <Icon name="chevron-forward" size={16} />
                </TouchableOpacity>
              </View>
            );
          }
          if (activeTab === "Other" && moreNotifications.length > 0) {
            return (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  More ({moreNotifications.length})
                </Text>
              </View>
            );
          }
          return null;
        }}
        ListEmptyComponent={() => {
          if (isLoading) return null;
          return (
            <View style={styles.emptyContainer}>
              <Icon name="notifications-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>
                {activeTab === "Reminder"
                  ? "No reminders yet"
                  : "No notifications yet"}
              </Text>
              {activeTab === "Other" && (
                <Text style={styles.emptySubText}>
                  You'll see notifications here when you receive them
                </Text>
              )}
            </View>
          );
        }}
        contentContainerStyle={{
          paddingBottom: 30,
          paddingHorizontal: 15,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  section: {
    marginTop: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 15,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold" },
  viewAll: {
    fontSize: 12,
    color: "#000",
    fontWeight: "500",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFF8E1",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF9800",
  },
  cardLeft: { marginRight: 12 },
  cardMiddle: { flex: 1 },
  cardTitle: { fontWeight: "bold", fontSize: 14 },
  cardMsg: { fontSize: 12, color: "gray" },
  cardRight: { alignItems: "flex-end" },
  cardDate: { fontSize: 12, color: "gray" },
  cardTime: { fontSize: 12, color: "gray" },
  amount: { fontSize: 13, color: "#000", fontWeight: "600", marginTop: 3 },

  moreItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  userImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  reminderCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E97171",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  moreMiddle: {
    flex: 1,
  },
  moreTitle: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#000",
  },
  moreMsg: {
    fontSize: 12,
    color: "gray",
  },
  rightSide: {
    alignItems: "flex-end",
  },
  moreTime: {
    fontSize: 12,
    color: "#515151",
    fontWeight: "500",
    marginBottom: 3,
    marginRight: 25,
  },
  colorSquare: {
    width: 32,
    height: 32,
    borderRadius: 3,
  },
  // New styles for dynamic content
  unreadCard: {
    backgroundColor: "#E3F2FD",
    borderColor: "#2196F3",
  },
  unreadMoreItem: {
    backgroundColor: "#F5F5F5",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FCA311",
    marginTop: 4,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#F44336",
    textAlign: "center",
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: "#FCA311",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    marginTop: 100,
    minHeight: 300,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginTop: 10,
  },
  tabButton: {
    marginRight: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabButton: {
    borderBottomColor: "#FCA311",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#757575",
  },
  activeTabText: {
    color: "#FCA311",
    fontWeight: "600",
  },
  listItemContainer: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
});

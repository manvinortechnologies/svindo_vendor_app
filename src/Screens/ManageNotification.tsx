import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  RefreshControl,
  Alert,
} from "react-native";
import CustomHeader from "../CommonComponent/CustomHeader";
import Loading from "../CommonComponent/Loading";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import { useNotificationContext } from "../contexts/NotificationContext";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationType } from "../services/notification-service";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface NotificationCampaign {
  id: string;
  title: string;
  message: string;
  status: "Active" | "Ended" | "Pending" | "Rejected";
  statusColor: string;
  boxColor: string;
  campaignName: string;
  views?: number | null;
  clicks?: number | null;
  start?: string | null;
  end?: string | null;
  reason?: string | null;
  budget?: string | null;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

const ManageNotification = ({ navigation }: any) => {
  const [notifications, setNotifications] = useState<NotificationCampaign[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showError } = useNotificationContext();
  const { sendNotification } = useNotifications();
  useEffect(() => {
    fetchNotifications();
    // sendNotification({
    //   title: "Manage Notification",
    //   body: "Manage Notification",
    //   type: NotificationType.GENERAL,
    //   data: {
    //     notification: "Manage Notification",
    //   },
    // });
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get(API_ROUTES.notificationCampaign);

      if (response.data && Array.isArray(response.data)) {
        // Transform API data to match our interface
        const transformedNotifications = response.data.map((item: any) => ({
          id: item.id?.toString() || Math.random().toString(),
          title: item.title || item.subject || "Notification Campaign",
          message:
            item.message || item.body || item.description || "No message",
          status: getStatusFromApi(item.status || item.state || "pending"),
          statusColor: getStatusColor(item.status || item.state || "pending"),
          boxColor: getBoxColor(item.status || item.state || "pending"),
          campaignName:
            item.campaign_name ||
            item.title ||
            item.id?.toString() ||
            "Campaign",
          views: item.views || item.view_count || null,
          clicks: item.clicks || item.click_count || null,
          start:
            item.start_date || item.created_at
              ? new Date(
                  item.start_date || item.created_at
                ).toLocaleDateString() +
                ", " +
                new Date(item.start_date || item.created_at).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )
              : null,
          end: item.end_date
            ? new Date(item.end_date).toLocaleDateString() +
              ", " +
              new Date(item.end_date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : null,
          reason: item.reason || item.rejection_reason || null,
          budget: item.budget ? `₹${item.budget}` : null,
          image_url: item.image_url,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));

        setNotifications(transformedNotifications);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching notification campaigns:", error);
      setError("Failed to load notification campaigns");
      showError(
        "Error",
        "Failed to load notification campaigns. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const handleDeleteCampaign = (id: string) => {
    Alert.alert("Delete", "Are you sure you want to delete this campaign?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`${API_ROUTES.notificationCampaign}${id}/`);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
          } catch (e) {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "Failed to delete campaign",
            });
          }
        },
      },
    ]);
  };

  const getStatusFromApi = (
    apiStatus: string
  ): "Active" | "Ended" | "Pending" | "Rejected" => {
    switch (apiStatus.toLowerCase()) {
      case "active":
      case "running":
      case "live":
        return "Active";
      case "ended":
      case "completed":
      case "finished":
        return "Ended";
      case "rejected":
      case "denied":
      case "declined":
        return "Rejected";
      case "pending":
      case "waiting":
      case "draft":
      default:
        return "Pending";
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "active":
      case "running":
      case "live":
        return "#C8FACC";
      case "ended":
      case "completed":
      case "finished":
        return "#E1D4F9";
      case "rejected":
      case "denied":
      case "declined":
        return "#FF9F9F";
      case "pending":
      case "waiting":
      case "draft":
      default:
        return "#FFE9C6";
    }
  };

  const getBoxColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "active":
      case "running":
      case "live":
        return "#E8FDEB";
      case "ended":
      case "completed":
      case "finished":
        return "#F2EAFE";
      case "rejected":
      case "denied":
      case "declined":
        return "#FF9494";
      case "pending":
      case "waiting":
      case "draft":
      default:
        return "#FFF3E0";
    }
  };

  const renderCard = ({ item }: { item: NotificationCampaign }) => (
    <View style={[styles.card, { backgroundColor: item.boxColor }]}>
      {/* Image with floating status */}
      <View style={styles.imageWrapper}>
        <Image
          source={
            item.image_url
              ? { uri: item.image_url }
              : require("../assets/notification_img.png")
          }
          style={styles.image}
          resizeMode="cover"
        />
        <View style={[styles.statusTag, { backgroundColor: item.statusColor }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDeleteCampaign(item.id)}
        >
          <Icon name="delete-outline" size={20} color="#FF0000" />
        </TouchableOpacity>
      </View>

      {/* Details */}
      <View style={styles.details}>
        <View style={{ flex: 1 }}>
          <Text style={styles.campaignName}>
            Campaign name: {item.campaignName}
          </Text>
          {item.views !== null && (
            <Text style={styles.detailText}>views - {item.views}</Text>
          )}
          {item.clicks !== null && (
            <Text style={styles.detailText}>clicks - {item.clicks}</Text>
          )}
          {/* {item.budget && (
            <Text style={styles.detailText}>Budget - {item.budget}</Text>
          )} */}
          {item.reason && (
            <Text style={styles.reasonText}>
              Reason: {item.reason}
              {"\n"}
              <Text style={{ color: "#FF0000" }}>terms & conditions</Text>
            </Text>
          )}
        </View>

        {/* Dates always at bottom-right */}
        <View style={styles.dateWrapper}>
          {item.start && (
            <Text style={styles.dateText}>Start: {item.start}</Text>
          )}
          {item.end && <Text style={styles.dateText}>End: {item.end}</Text>}
        </View>
      </View>
    </View>
  );

  // Calculate summary statistics
  const activeNotifications = notifications.filter(
    (n) => n.status === "Active"
  ).length;
  const totalNotifications = notifications.length;
  const availableNotifications = Math.max(0, 3 - totalNotifications); // Assuming 3 notifications per month limit

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader title="Manage Notifications" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchNotifications}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <CustomHeader title="Manage Notifications" />

      {/* Top Summary */}
      <View style={styles.headerRow}>
        <View style={styles.headerBox}>
          <View style={{ flexDirection: "row", gap: 5 }}>
            <Text style={styles.headerTitle}>Sent</Text>
            <Text style={styles.headerSubtitle}>this month</Text>
          </View>
          <Text style={styles.headerValue}>
            {totalNotifications} notification
            {totalNotifications !== 1 ? "s" : ""}
          </Text>
        </View>
        <View style={styles.headerBox}>
          <View style={{ flexDirection: "row", gap: 5 }}>
            <Text style={styles.headerTitle}>Available</Text>
            <Text style={styles.headerSubtitle}>per month</Text>
          </View>
          <Text style={styles.headerValue}>{availableNotifications} more</Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FCA311"]}
            tintColor="#FCA311"
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No notification campaigns yet
              </Text>
              <Text style={styles.emptySubText}>
                Create your first notification campaign to get started
              </Text>
            </View>
          ) : null
        }
      />

      {/* Bottom Button */}
      <TouchableOpacity
        style={styles.sendBtn}
        onPress={() => navigation.navigate("SendNotifications")}
      >
        <Text style={styles.sendText}>Send Notification</Text>
      </TouchableOpacity>

      <Loading visible={isLoading} />
    </SafeAreaView>
  );
};

export default ManageNotification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
    marginHorizontal: 10,
  },
  headerBox: {
    flex: 1,
    backgroundColor: "#FFE9C6",
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 8,
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 10,
    color: "#000",
    fontWeight: "500",
    marginTop: 5,
  },
  headerValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    marginTop: 5,
  },
  card: {
    width: width * 0.92,
    borderRadius: 10,
    marginVertical: 8,
    alignSelf: "center",
    padding: 2,
    overflow: "hidden",
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: 120,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  statusTag: {
    position: "absolute",
    top: 8,
    left: 8,
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  campaignName: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 3,
    color: "#000",
  },
  detailText: {
    fontSize: 12,
    color: "#000",
    fontWeight: "500",
  },
  reasonText: {
    fontSize: 12,
    color: "#000",
    marginTop: 5,
    fontWeight: "500",
    maxWidth: width * 0.9,
  },
  dateWrapper: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 11,
    color: "#000",
    fontWeight: "500",
  },
  sendBtn: {
    position: "absolute",
    bottom: 15,
    right: width * 0.05,
    width: width * 0.4,
    backgroundColor: "#169729",
    paddingVertical: 8,
    borderRadius: 30,
    alignItems: "center",
  },
  sendText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
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
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#FCA311",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "500",
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },
  deleteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 4,
    elevation: 5,
  },
});

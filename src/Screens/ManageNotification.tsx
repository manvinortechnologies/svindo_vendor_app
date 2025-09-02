import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  SafeAreaView,
} from "react-native";
import CustomHeader from "../CommonComponent/CustomHeader";

const { width } = Dimensions.get("window");

const notifications = [
  {
    id: "1",
    status: "Active",
    statusColor: "#C8FACC",
    boxColor: "#E8FDEB",
    campaignName: "12345",
    views: 100,
    clicks: 10,
    start: "4/27/2025, 11:00 AM",
    end: null,
    reason: null,
    budget: null,
  },
  {
    id: "2",
    status: "Ended",
    statusColor: "#E1D4F9",
    boxColor: "#F2EAFE",
    campaignName: "12345",
    views: 100,
    clicks: 10,
    start: "4/27/2025, 11:00 AM",
    end: "4/27/2025, 11:00 AM",
    reason: null,
    budget: null,
  },
  {
    id: "3",
    status: "Pending",
    statusColor: "#FFE9C6",
    boxColor: "#FFF3E0",
    campaignName: "12345",
    views: null,
    clicks: null,
    start: null,
    end: null,
    reason: null,
    budget: null,
  },
  {
    id: "4",
    status: "Rejected",
    statusColor: "#FF9F9F",
    boxColor: "#FF9494",
    campaignName: "12345",
    views: null,
    clicks: null,
    start: null,
    end: null,
    reason: "Content opposes our platform policy read",
    budget: "₹1000.00",
  },
];

const ManageNotification = ({ navigation }: any) => {
  const renderCard = ({ item }: any) => (
    <View style={[styles.card, { backgroundColor: item.boxColor }]}>
      {/* Image with floating status */}
      <View style={styles.imageWrapper}>
        <Image
          source={require("../assets/notification_img.png")}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={[styles.statusTag, { backgroundColor: item.statusColor }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
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
          {item.budget && (
            <Text style={styles.detailText}>Budget - {item.budget}</Text>
          )}
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <CustomHeader title="Notifications" />

      {/* Top Summary */}
      <View style={styles.headerRow}>
        <View style={styles.headerBox}>
          <View style={{ flexDirection: "row", gap: 5 }}>
            <Text style={styles.headerTitle}>Sent</Text>
            <Text style={styles.headerSubtitle}>this month</Text>
          </View>
          <Text style={styles.headerValue}>1 notification</Text>
        </View>
        <View style={styles.headerBox}>
          <View style={{ flexDirection: "row", gap: 5 }}>
            <Text style={styles.headerTitle}>Available</Text>
            <Text style={styles.headerSubtitle}>per month</Text>
          </View>
          <Text style={styles.headerValue}>3 more</Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Bottom Button */}
      <TouchableOpacity
        style={styles.sendBtn}
        onPress={() => navigation.navigate("SendNotifications")}
      >
        <Text style={styles.sendText}>Send Notification</Text>
      </TouchableOpacity>
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
});

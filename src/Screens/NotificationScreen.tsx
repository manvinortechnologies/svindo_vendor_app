import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import CustomHeader from "../CommonComponent/CustomHeader";

const NotificationScreen = ({ navigation }: any) => {
  const chats = [
    {
      id: "1",
      title: "Customer name",
      message: "Hi, You have a coupon....",
      date: "1/15/2025",
      time: "1:23 PM",
    },
  ];

  const orders = [
    {
      id: "1",
      title: "Order Id",
      message: "Order received",
      amount: "$200.00",
      date: "1/15/2025",
      time: "1:23 PM",
    },
  ];

  const moreNotifications = [
    {
      id: "1",
      type: "like",
      title: "user Id",
      message: "Liked your post",
      time: "1:23 PM",
      image: require("../assets/product/storelogo.png"),
      color: "#A74040",
    },
    {
      id: "2",
      type: "rating",
      title: "user id",
      message: "Rated your product / Order",
      time: "1:23 PM",
      image: require("../assets/product/storelogo.png"),
      color: "#40A75B",
    },
    {
      id: "3",
      type: "visit",
      title: "user id",
      message: "Visited your store",
      time: "1:23 PM",
      image: require("../assets/product/storelogo.png"),
      color: "#4081A7",
    },
    {
      id: "4",
      type: "reminder",
      title: "Reminder",
      message: "Low stock",
      time: "1:23 PM",
    },
    {
      id: "5",
      type: "reminder",
      title: "Reminder",
      message: "expiry coming soon",
      time: "1:23 PM",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <CustomHeader title="Notifications" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Chats Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chats</Text>
            <TouchableOpacity style={{ flexDirection: "row", gap: 5 }}>
              <Text style={styles.viewAll}>View All</Text>
              <Icon name="chevron-forward" size={16} />
            </TouchableOpacity>
          </View>
          {chats.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardLeft}>
                <Image
                  source={require("../assets/product/storelogo.png")}
                  style={{ width: 40, height: 40 }}
                />
              </View>
              <View style={styles.cardMiddle}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardMsg}>{item.message}</Text>
              </View>
              <View style={styles.cardRight}>
                <Text style={styles.cardDate}>{item.date}</Text>
                <Text style={styles.cardDate}>{item.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Order Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Orders</Text>
            <TouchableOpacity style={{ flexDirection: "row", gap: 5 }}>
              <Text style={styles.viewAll}>View All</Text>
              <Icon name="chevron-forward" size={16} />
            </TouchableOpacity>
          </View>
          {orders.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardLeft}>
                <Image
                  source={require("../assets/product/storelogo.png")}
                  style={{ width: 40, height: 40 }}
                />
              </View>
              <View style={styles.cardMiddle}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardMsg}>{item.message}</Text>
              </View>
              <View style={styles.cardRight}>
                <Text style={styles.cardDate}>{item.date}</Text>
                <Text style={styles.cardTime}>{item.time}</Text>
                <Text style={styles.amount}>{item.amount}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* More Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More</Text>
          <FlatList
            data={moreNotifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  if (item.type === "reminder") {
                    navigation.navigate("ModelReminderScreen", {
                      reminder: item,
                    });
                  }
                }}
              >
                <View style={styles.moreItem}>
                  {/* Left Side */}
                  {item.type === "reminder" ? (
                    <View style={styles.reminderCircle}>
                      <Icon name="notifications" size={18} color="#fff" />
                    </View>
                  ) : (
                    <Image source={item.image} style={styles.userImage} />
                  )}

                  {/* Middle */}
                  <View style={styles.moreMiddle}>
                    <Text style={styles.moreTitle}>{item.title}</Text>
                    <Text style={styles.moreMsg}>{item.message}</Text>
                  </View>

                  <Text style={styles.moreTime}>{item.time}</Text>

                  {/* Right Side */}
                  <View style={styles.rightSide}>
                    {item.type !== "reminder" && (
                      <View
                        style={[
                          styles.colorSquare,
                          { backgroundColor: item.color },
                        ]}
                      />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
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
});

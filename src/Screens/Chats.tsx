import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Header from "./Header";
import Bottomnavigation from "./Bottomnavigation";
import { Text } from "react-native-gesture-handler";
import SearchHeader from "./SearchHeader";

const tabs = ["All", "Unread", "Favourites"];
const chatData = [
  {
    id: 1,
    name: "Rahul Singhania",
    message: "Need to exchange product",
    time: "Yesterday",
    unread: 2,
    favourite: true,
  },
  {
    id: 2,
    name: "Rahul Singhania",
    message: "Need to exchange product",
    time: "Yesterday",
    unread: 2,
    favourite: true,
  },
  {
    id: 3,
    name: "Rahul Singhania",
    message: "Need to exchange product",
    time: "Yesterday",
    unread: 0,
    favourite: false,
  },
  {
    id: 4,
    name: "Rahul Singhania",
    message: "Need to exchange product",
    time: "Yesterday",
    unread: 0,
    favourite: false,
  },
  {
    id: 5,
    name: "Rahul Singhania",
    message: "Need to exchange product",
    time: "Yesterday",
    unread: 0,
    favourite: false,
  },
];

const Chats = () => {
  const [activeTab, setActiveTab] = useState("All");

  const renderTab = (tab: string) => (
    <TouchableOpacity
      key={tab}
      onPress={() => setActiveTab(tab)}
      style={[styles.tab, activeTab === tab && styles.activeTab]}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {tab}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: any) => (
    <View style={[styles.chatItem, item.unread > 0 && styles.highlight]}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")}
        </Text>
      </View>
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.chatMessage}>{item.message}</Text>
      </View>
      <View style={styles.chatMeta}>
        <Text style={[styles.chatTime, item.unread === 0 && styles.readTime]}>
          {item.time}
        </Text>
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Chats"
        backgroundColor="#FCA311"
        textColor="#fff"
        borderBottomColor="#ccc"
        paddingTop={50}
      />
      <ScrollView>
        <SearchHeader title="Search Products" draftName="" paddingTop={10} />
        <View style={styles.tabRow}>{tabs.map(renderTab)}</View>

        <FlatList
          data={
            activeTab === "Unread"
              ? chatData.filter((chat) => chat.unread > 0)
              : activeTab === "Favourites"
              ? chatData.filter((chat) => chat.favourite)
              : chatData
          }
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 80 }} // Add padding for bottom nav
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F2F2F2",
  },
  activeTab: {
    backgroundColor: "#FCA311",
  },
  tabText: {
    color: "#888",
    fontWeight: "bold",
  },
  activeTabText: {
    color: "#fff",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  highlight: {
    backgroundColor: "#F6F6F6",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E8EF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontWeight: "bold",
    color: "#000",
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000",
  },
  chatMessage: {
    color: "#666",
    fontSize: 12,
    marginTop: 2,
  },
  chatMeta: {
    alignItems: "flex-end",
  },
  readTime: {
    color: "#000",
  },
  chatTime: {
    fontSize: 12,
    color: "#FCA311",
  },
  unreadBadge: {
    backgroundColor: "#FCA311",
    borderRadius: 20,
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  unreadText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default Chats;

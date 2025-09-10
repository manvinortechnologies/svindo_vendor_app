import React from "react";
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  Text,
  ScrollView,
} from "react-native";
import Header from "./Header";
import Bottomnavigation from "./Bottomnavigation";
import SearchHeader from "./SearchHeader";

const emailData = [
  {
    id: "1",
    name: "Rahul Singhania",
    productId: "#123456",
    subject: "Regarding exchange of product",
    message: "This is to inform you...",
    date: "2 Feb, 2025",
  },
  // Add more as needed
];

const Emails = () => {
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image
          source={require("../assets/user.png")} // Replace with your avatar icon
          style={styles.avatar}
        />
        <View style={styles.messageContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
          <Text style={styles.productId}>
            <Text style={{ fontWeight: "bold" }}>Product ID: </Text>
            {item.productId}
          </Text>
          <Text style={styles.subject}>{item.subject}</Text>
          <Text style={styles.preview}>
            {item.message}.......................
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Emails Message"
        backgroundColor="#FCA311"
        textColor="#fff"
        borderBottomColor="#ccc"
        paddingTop={50}
      />
      <ScrollView>
        <SearchHeader title="Search Products" draftName="" paddingTop={10} />

        <FlatList
          data={emailData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#ddd",
    marginRight: 12,
  },
  messageContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000",
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  productId: {
    fontSize: 12,
    color: "#444",
    marginTop: 2,
  },
  subject: {
    fontSize: 13,
    color: "#222",
    fontWeight: "500",
    marginTop: 4,
  },
  preview: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});

export default Emails;

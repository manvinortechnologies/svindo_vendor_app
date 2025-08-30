import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  Platform,
  Image,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Header from "./Header";
import { StatusBar } from "react-native";
import Bottomnavigation from "./Bottomnavigation";
import NavigationButton from "./NavigationButton";
import { useNavigation } from "@react-navigation/native";
import OrderProductDetails from "./OrderProductDetails";

const Orders = ({ navigation }: any) => {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedType, setSelectedType] = useState("On Shop");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("None");

  const statuses = [
    "All",
    "Pending",
    "Accepted",
    "Shipped",
    "Delivered",
    "Returned",
    "Exchage",
    "Cancle",
  ];
  const orderTypes = ["On Shop", "Self Pickup", "Instant", "General"];
  const filters = [
    "Price: Low to High",
    "Price: High to Low",
    "Newest First",
    "Oldest First",
  ];

  const orders = [
    {
      id: "SVIND0123456",
      customer: "Customer Name",
      date: "20 Jan 2025",
      time: "1:15 PM",
      items: 5,
      type: "On-Shop Order",
      amount: "$ 500.00",
      status: "Order Accepted",
      payment: "Unpaid",
    },
  ];

  return (
    <View style={styles.container}>
      <Header
        title="Orders/Sales"
        backgroundColor="#FFF"
        textColor="#333"
        borderBottomColor="#ccc"
      />

      <ScrollView style={styles.midcontent}>
        <View style={styles.header}>
          <View style={styles.searchBar}>
            <Image
              source={require("../assets/search.png")}
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#006EB2"
              style={styles.searchInput}
            />
            <TouchableOpacity>
              <Image
                source={require("../assets/mic.png")}
                style={styles.micIcon}
              />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setFilterModalVisible(true)}
            >
              <Text style={styles.filterText}>
                {selectedFilter === "None" ? "Filters" : selectedFilter}
              </Text>
              <Icon name="chevron-down-outline" size={16} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Modal */}
        <Modal visible={filterModalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select a Filter</Text>
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterOption,
                    selectedFilter === filter && styles.selectedFilter,
                  ]}
                  onPress={() => {
                    setSelectedFilter(filter);
                    setFilterModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedFilter === filter && styles.selectedFilterText,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={() => setFilterModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* 🔄 Scrollable Status Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statusScroll}
        >
          {statuses.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                selectedStatus === status && styles.selectedStatus,
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text
                style={[
                  styles.statusText,
                  selectedStatus === status && styles.selectedStatusText,
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 📦 Order List */}
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.orderCard}
              onPress={() => navigation.navigate("OrderProductDetails")}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.customerName}>{item.customer}</Text>
                <Text style={styles.orderDate}>
                  {item.date}
                  {"\n"}
                  {item.time}
                </Text>
              </View>
              <Text style={styles.orderDetails}>
                <Text style={styles.boldText}>Order #{item.id}</Text>
                {"\n"}
                {item.items} Item
              </Text>
              <View style={styles.onshop}>
                <Text style={styles.orderDetails}>{item.type}</Text>
                <Text style={styles.orderAmount}>{item.amount}</Text>
              </View>

              <View style={styles.statusRow}>
                <Text style={styles.orderStatus}>{item.status}</Text>
                <Text style={styles.paymentStatus}>{item.payment} ➜</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>

      {/* 🔽 Order Types Bottom Menu */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bottomtypeScroll}
        >
          <View style={styles.typeButtonContainer}>
            {orderTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  selectedType === type && styles.selectedType,
                ]}
                onPress={() => setSelectedType(type)}
              >
                <Text
                  style={[
                    styles.typeText,
                    selectedType === type && styles.selectedTypeText,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <Bottomnavigation />
    </View>
  );
};

export default Orders;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 40 : 0,
  },
  midcontent: {
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    borderBottomWidth: 2,
    borderColor: "#ECECEC",

    marginVertical: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    borderRadius: 25,
    marginHorizontal: 1,
    marginBottom: 10,
    height: 40,
    borderWidth: 1,
    borderColor: "#eee",
    elevation: 5,
    flex: 1,
  },

  searchIcon: {
    width: 18,
    height: 18,
    tintColor: "#006EB2",
    marginRight: 5,
  },

  searchInput: {
    flex: 1,
    color: "#000",
    fontSize: 14,
  },

  micIcon: {
    width: 18,
    height: 18,
    tintColor: "red",
    marginLeft: 5,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
  filterText: {
    marginRight: 5,
  },
  statusScroll: {
    marginBottom: 10,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginRight: 8,
    borderWidth: 1,
  },
  selectedStatus: {
    backgroundColor: "#ffb347",
    borderWidth: 0,
  },
  statusText: {
    color: "#333",
    fontWeight: "bold",
  },
  selectedStatusText: {
    fontWeight: "bold",
    color: "#fff",
  },
  orderCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  customerName: {
    fontWeight: "bold",
  },
  orderDate: {
    color: "#888",
    fontSize: 12,
    textAlign: "right",
  },
  orderDetails: {
    fontSize: 14,
    color: "#555",
  },
  boldText: {
    fontWeight: "bold",
  },
  orderAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginVertical: 5,
  },
  onshop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    backgroundColor: "#FFF7DD",
    paddingVertical: 10,
  },
  orderStatus: {
    color: "#163881",
    padding: 5,
    borderRadius: 5,
    fontWeight: "bold",
  },
  paymentStatus: {
    color: "red",
    fontWeight: "bold",
  },
  typeScroll: {
    marginTop: 10,
  },
  typeButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    width: "100%", // helps center inside horizontal ScrollView
  },
  bottomtypeScroll: {
    marginVertical: 20,
    marginHorizontal: 10,
    textAlign: "center",
    padding: 15,
    borderColor: "#C3C3C3",
    elevation: 2,
    alignSelf: "center",
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginHorizontal: 6,
  },
  selectedType: {
    backgroundColor: "#ffb347",
  },
  typeText: {
    color: "#333",
    fontWeight: "bold",
  },
  selectedTypeText: {
    fontWeight: "bold",
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  filterOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  selectedFilter: { backgroundColor: "#ffb347" },
  filterOptionText: { fontSize: 16, color: "#333" },
  selectedFilterText: { fontWeight: "bold", color: "#fff" },
  closeButton: {
    padding: 10,
    backgroundColor: "red",
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: { color: "#fff", fontWeight: "bold" },
});

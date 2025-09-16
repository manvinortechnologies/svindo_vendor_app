import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import Loading from "../CommonComponent/Loading";
import { formatOrderDate } from "../utils/dateandTime";
import { ScaledSheet } from "react-native-size-matters";

const Orders = ({ navigation }: any) => {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedType, setSelectedType] = useState("");
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
    "Cancel",
  ];
  const orderTypes = ["On Shop", "Self Pickup", "Instant", "General"];
  const filters = [
    "Price: Low to High",
    "Price: High to Low",
    "Newest First",
    "Oldest First",
  ];

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get(API_ROUTES.orders);
        setOrders(response.data);
        setFilteredOrders(response.data); // Initially set filtered orders to all orders
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = [...orders];

    // Status filter
    if (selectedStatus !== "All") {
      filtered = filtered.filter(
        (order: any) =>
          order.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    // Type filter
    if (selectedType && selectedType !== "") {
      filtered = filtered.filter(
        (order: any) => order.delivery_type === selectedType
      );
    }

    // Sorting filter
    if (selectedFilter === "Price: Low to High") {
      filtered.sort(
        (a: any, b: any) => (a.total_amount ?? 0) - (b.total_amount ?? 0)
      );
    } else if (selectedFilter === "Price: High to Low") {
      filtered.sort(
        (a: any, b: any) => (b.total_amount ?? 0) - (a.total_amount ?? 0)
      );
    } else if (selectedFilter === "Newest First") {
      filtered.sort(
        (a: any, b: any) =>
          new Date(b.created_at ?? 0).getTime() -
          new Date(a.created_at ?? 0).getTime()
      );
    } else if (selectedFilter === "Oldest First") {
      filtered.sort(
        (a: any, b: any) =>
          new Date(a.created_at ?? 0).getTime() -
          new Date(b.created_at ?? 0).getTime()
      );
    }

    setFilteredOrders(filtered);
  }, [selectedStatus, selectedType, selectedFilter, orders]);

  return (
    <SafeAreaView style={styles.container}>
      <Loading visible={loading} />
      <ScrollView style={styles.midcontent}>
        <View style={styles.header}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#000" }}>
            Orders/Sales
          </Text>
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
          data={filteredOrders}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }: { item: any }) => (
            <TouchableOpacity
              style={styles.orderCard}
              onPress={() =>
                navigation.navigate("OrderProductDetails", { orderId: item.id })
              }
            >
              <View style={styles.orderHeaderContainer}>
                <View style={styles.orderHeader}>
                  <Text style={styles.customerName}>{item.customer_name}</Text>
                  <Text style={styles.orderDate}>
                    {formatOrderDate(item.created_at)}
                  </Text>
                </View>
                <Text style={styles.orderDetails}>
                  <Text style={styles.boldText}>Order #{item.order_id}</Text>
                  {"\n"}
                  <Text style={styles.orderDetails}>
                    {item.items.length} Item
                  </Text>
                </Text>
                <View style={styles.onshop}>
                  <Text style={styles.orderDetails}>{item.delivery_type}</Text>
                  <Text style={styles.orderAmount}>$ {item.total_amount}</Text>
                </View>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.orderStatus}>
                  {item.status.charAt(0).toUpperCase() +
                    item.status.slice(1).toLowerCase()}
                </Text>
                <Text style={styles.paymentStatus}>
                  {item.is_paid ? "Paid" : "Unpaid"} ➜
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>

      {/* 🔽 Order Types Bottom Menu */}
      <View>
        <View style={styles.typeButtonContainer}>
          {orderTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                selectedType === type && styles.selectedType,
              ]}
              onPress={() => {
                // If clicking on the already selected type, unselect it
                if (selectedType === type) {
                  setSelectedType("");
                } else {
                  setSelectedType(type);
                }
              }}
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
      </View>
    </SafeAreaView>
  );
};

export default Orders;

const styles = ScaledSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  midcontent: {
    paddingVertical: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    borderBottomWidth: 2,
    borderColor: "#ECECEC",
    paddingBottom: 10,
    marginVertical: 10,
    marginHorizontal: 10,
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
    color: "#000",
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
    // padding: 12,
    overflow: "hidden",
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  orderHeaderContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  customerName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
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
    paddingTop: 10,
    paddingHorizontal: 10,
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
    marginBottom: "15@s",
    marginHorizontal: "10@s",
    textAlign: "center",
    padding: "8@s",
    borderRadius: "10@s",
    backgroundColor: "#fff",
    borderColor: "#C3C3C3",
    elevation: 2,
    // alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // width: "100%", // helps center inside horizontal ScrollView
  },
  bottomtypeScroll: {},
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    // marginHorizontal: 3,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
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

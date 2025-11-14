import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import Loading from "../CommonComponent/Loading";
import { formatOrderDate } from "../utils/dateandTime";
import { ScaledSheet } from "react-native-size-matters";
import CustomHeader from "../CommonComponent/CustomHeader";
import { s } from "react-native-size-matters";
import CalendarModal from "../Modals/CalendarModal";

const Orders = ({ navigation }: any) => {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedType, setSelectedType] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("None");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [calendarModel, setCalendarModel] = useState("");
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const statuses = [
    "All",
    "Pending",
    "Accepted",
    // "Shipped",
    "Completed",
    "Return/Exchange",
    // "Cancelled",
  ];
  const orderTypes = [
    { key: "on_shop_order", label: "On Shop" },
    { key: "self_pickup", label: "Self Pickup" },
    { key: "instant_delivery", label: "Instant" },
    { key: "general_delivery", label: "General" },
  ];
  const filters = [
    "Price: Low to High",
    "Price: High to Low",
    "Newest First",
    "Oldest First",
  ];

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
  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = [...orders];

    // Status filter
    if (selectedStatus !== "All") {
      if (selectedStatus === "Return/Exchange") {
        filtered = filtered.filter(
          (order: any) =>
            !!order.items.find(
              (item: any) =>
                item.status.toLowerCase() === "returned/replaced_requested"
            )
        );
      } else {
        filtered = filtered.filter(
          (order: any) =>
            order.status.toLowerCase() ===
            (selectedStatus === "Pending"
              ? "not_accepted"
              : selectedStatus.toLowerCase())
        );
      }
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

    // Date range filter:
    if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);
      filtered = filtered.filter((order: any) => {
        const orderDate = new Date(order.created_at);
        return orderDate >= startDateObj && orderDate <= endDateObj;
      });
    }
    setFilteredOrders(filtered);
  }, [
    selectedStatus,
    selectedType,
    selectedFilter,
    orders,
    startDate,
    endDate,
  ]);

  const getDiliveryType = (type: string) => {
    if (type === "on_shop_order") {
      return "On Shop Orders";
    } else if (type === "self_pickup") {
      return "Self Pickup";
    } else if (type === "instant_delivery") {
      return "Instant Delivery";
    } else if (type === "general_delivery") {
      return "General Delivery";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loading visible={loading} />
      <View style={styles.midcontent}>
        <CustomHeader
          title="Orders"
          titleStyle={{ textAlign: "left" }}
          showBackButton={false}
          rightIcon={
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
          }
        />

        {/* Filter Modal */}
        <Modal visible={filterModalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select a Filter</Text>
              <View>
                <Text style={{ color: "#666", marginBottom: 6 }}>
                  Start Date
                </Text>
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: "#E0E0E0",
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 16,
                  }}
                  onPress={() => setCalendarModel("start")}
                >
                  <Text style={{ color: startDate ? "#000" : "#999" }}>
                    {startDate || "YYYY-MM-DD"}
                  </Text>
                </TouchableOpacity>
                <Text style={{ color: "#666", marginBottom: 6 }}>End Date</Text>
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: "#E0E0E0",
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 20,
                  }}
                  onPress={() => setCalendarModel("end")}
                >
                  <Text style={{ color: endDate ? "#000" : "#999" }}>
                    {endDate || "YYYY-MM-DD"}
                  </Text>
                </TouchableOpacity>
              </View>
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
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedFilter("None");
                    setFilterModalVisible(false);
                  }}
                  style={styles.clearButton}
                >
                  <Text style={styles.clearButtonText}>Clear Filter</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFilterModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <CalendarModal
          visible={!!calendarModel}
          initialDate={calendarModel === "start" ? startDate : endDate}
          onClose={() => setCalendarModel("")}
          onSelect={(e) => {
            if (calendarModel === "start") setStartDate(e);
            else setEndDate(e);
            setCalendarModel("");
          }}
          maxDate={new Date().toISOString().slice(0, 10)}
        />

        {/* 🔄 Scrollable Status Buttons */}
        <View>
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
        </View>

        {/* 📦 Order List */}
        <FlatList
          data={filteredOrders}
          contentContainerStyle={{
            paddingBottom: s(80),
          }}
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
                  <Text style={styles.customerName}>
                    {item?.user_details?.first_name || item.customer_name}
                  </Text>
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
                  <Text style={styles.orderDetails}>
                    {getDiliveryType(item.delivery_type)}
                  </Text>
                  <Text style={styles.orderAmount}>$ {item.total_amount}</Text>
                </View>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.orderStatus}>
                  {(
                    item.status.charAt(0).toUpperCase() +
                    item.status.slice(1).toLowerCase()
                  )
                    .split("_")
                    .join(" ")}
                </Text>
                <Text style={styles.paymentStatus}>
                  {item.is_paid ? "Paid" : "Unpaid"} ➜
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No orders found</Text>
              <Text style={styles.emptySubText}>
                Pull down to refresh or add a new order
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchOrders} />
          }
        />
      </View>

      {/* 🔽 Order Types Bottom Menu */}
      <View style={styles.typeButtonContainer}>
        {orderTypes.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.typeButton,
              selectedType === key && styles.selectedType,
            ]}
            onPress={() => {
              // If clicking on the already selected type, unselect it
              if (selectedType === key) {
                setSelectedType("");
              } else {
                setSelectedType(key);
              }
            }}
          >
            <Text
              style={[
                styles.typeText,
                selectedType === key && styles.selectedTypeText,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
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
    marginVertical: 10,
    paddingHorizontal: 10,
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    marginBottom: "8@s",
    marginHorizontal: "10@s",
    textAlign: "center",
    padding: "8@s",
    borderRadius: "10@s",
    backgroundColor: "#fff",
    borderWidth: 1,
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
  modalButtons: {
    flexDirection: "row",
    // justifyContent: "space-between",
    marginTop: "10@s",
    gap: "10@s",
  },
  clearButton: {
    flex: 1,
    padding: "10@s",
    backgroundColor: "#ffb347",
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  clearButtonText: { color: "#fff", fontWeight: "bold" },
  closeButton: {
    flex: 1,
    padding: "10@s",
    backgroundColor: "red",
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: { color: "#fff", fontWeight: "bold" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { fontSize: 16, color: "#333" },
  emptySubText: { fontSize: 12, color: "#666" },
});

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  FlatList,
  Dimensions,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Headerwithback from "./Headerwithback";
import CustomSwitch from "./CustomSwitch";
import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { ScaledSheet } from "react-native-size-matters";
import Toast from "react-native-toast-message";
import { API_ROUTES } from "../constants/api-routes.constants";

const { width } = Dimensions.get("window");

interface Transaction {
  id: string | number;
  amount: string | number;
  date: string;
  time: string;
  order: string | number | null;
  type: "spent" | "added";
}

const AutoAssignDelivery = () => {
  const insets = useSafeAreaInsets();
  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [tillDate, setTillDate] = useState<Date>(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [totalDiscountAmount, setTotalDiscountAmount] = useState(0);
  const [totalDeliveryAmount, setTotalDeliveryAmount] = useState(0);
  const toggleSwitch = async () => {
    setLoading(true);
    try {
      await api.post("/vendor/deliverymode/", {
        is_auto_assign_enabled: !isEnabled,
        is_self_delivery_enabled: isEnabled,
      });
      setIsEnabled((previousState) => !previousState);
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: error?.response?.data?.detail || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const getValues = async () => {
    try {
      const res = await api.get("/vendor/deliverymode/");
      const value = res.data?.delivery_mode?.is_auto_assign_enabled;
      setIsEnabled(value);
    } catch (error) {
      console.log(error, "getValues");
    } finally {
      setLoading(false);
    }
  };

  const fetchAutoDeliveryHistory = async () => {
    try {
      setLoadingTransactions(true);
      const dateParam = moment(tillDate).format("YYYY-MM-DD");
      const res = await api.get(API_ROUTES.autoDeliveryBoysHistory, {
        params: { date: dateParam },
      });
      const data = res.data || {};

      // Extract summary data
      const discountAmount = data.total_discount_amount || 0;
      const deliveryAmount = data.total_delivery_amount || 0;

      // Extract delivery history array
      const deliveryHistory = data.delivery_history || data.results || [];
      const allTransactions: Transaction[] = deliveryHistory.map(
        (item: any) => {
          const dateTime =
            item.order_date ||
            item.created_at ||
            item.assigned_at ||
            new Date().toISOString();
          const momentDate = moment(dateTime);

          return {
            id: item.id || item.order_id || Math.random().toString(),
            amount: item.delivery_fee || item.shipping_fee || item.amount || 0,
            date: momentDate.format("MM/DD/YYYY"),
            time: momentDate.format("hh:mm A"),
            order: item.order_id || item.order?.id || null,
            type: "spent" as const,
          };
        }
      );

      // Sort transactions by date (newest first)
      allTransactions.sort((a, b) => {
        const dateA = moment(a.date + " " + a.time, "MM/DD/YYYY hh:mm A");
        const dateB = moment(b.date + " " + b.time, "MM/DD/YYYY hh:mm A");
        return dateB.valueOf() - dateA.valueOf();
      });

      setTransactions(allTransactions);
      setTotalDiscountAmount(discountAmount);
      setTotalDeliveryAmount(deliveryAmount);
    } catch (error: any) {
      console.error("Failed to fetch auto delivery history:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error?.response?.data?.detail || "Failed to load delivery history",
      });
      setTransactions([]);
      setTotalDiscountAmount(0);
      setTotalDeliveryAmount(0);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([getValues(), fetchAutoDeliveryHistory()]);
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getValues();
    fetchAutoDeliveryHistory();
  }, []);

  useEffect(() => {
    fetchAutoDeliveryHistory();
  }, [tillDate]);

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const handleDateConfirm = (date: Date) => {
    setTillDate(date);
    setDatePickerVisible(false);
  };

  const handleDateCancel = () => {
    setDatePickerVisible(false);
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Headerwithback title="Auto Assign Delivery Partner" />
      <Loading visible={loading} />
      {/* Assign Delivery Partner */}
      <View style={styles.box}>
        <View style={styles.rowSpace}>
          <Text style={{ color: "#5A5A5A", fontWeight: "600", fontSize: 16 }}>
            Assign Delivery Partner
          </Text>
          <CustomSwitch onValueChange={toggleSwitch} value={isEnabled} />
        </View>
        <Text style={styles.description}>
          Enabling this setting will automatically assign a delivery partner to
          your orders through svindo app. The fare charges are calculated by
          delivery partner API and deducted from your wallet.
        </Text>
        <Text style={styles.description}>
          Delivery boy is automatically assigned 15 minutes before the order is
          ready to pickup based on your order preparation time.
        </Text>
      </View>

      {/* Delivery Details */}
      <View
        style={{
          borderWidth: 1,
          borderColor: "#C7C7C7",
          padding: 10,
          borderRadius: 8,
          marginHorizontal: 16,
        }}
      >
        <View style={styles.rowSpace}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          {/* <TouchableOpacity
            style={styles.filterButton}
            onPress={showDatePicker}
          >
            <Text style={styles.filterButtonText}>
              {moment(tillDate).format("DD/MM/YYYY")}
            </Text>
            <Icon
              name="calendar-month-outline"
              size={20}
              color="#FCA311"
              style={{ marginLeft: 5 }}
            />
          </TouchableOpacity> */}
        </View>

        <View style={styles.summaryBox}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Discount Amount</Text>
            <Text style={styles.summaryAmount}>
              {loadingTransactions
                ? "..."
                : `Rs.${Number(totalDiscountAmount).toFixed(2)}`}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Delivery Amount</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.summaryAmount}>
                {loadingTransactions
                  ? "..."
                  : `Rs.${Number(totalDeliveryAmount).toFixed(2)}`}
              </Text>
              <Icon
                name="wallet"
                size={20}
                color="#FCA311"
                style={{ marginLeft: 4 }}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Transactions */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.transactionCard}>
            <View>
              <Text
                style={[
                  styles.amountText,
                  { color: item.type === "spent" ? "#005120" : "#492F99" },
                ]}
              >
                Rs.{" "}
                {typeof item.amount === "number"
                  ? item.amount.toFixed(2)
                  : item.amount}
              </Text>
              {item.order ? (
                <Text style={styles.orderText}>Order no: {item.order}</Text>
              ) : (
                <Text style={styles.orderText}>Auto assigned delivery</Text>
              )}
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.dateText}>Date: {item.date}</Text>
              <Text style={styles.dateText}>Time: {item.time}</Text>
            </View>
            <Icon
              name={item.type === "spent" ? "arrow-down" : "arrow-up"}
              size={20}
              color={item.type === "spent" ? "#005120" : "#492F99"}
            />
          </View>
        )}
        style={{ marginTop: 12, marginHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FCA311"]}
            tintColor="#FCA311"
          />
        }
        ListEmptyComponent={
          !loadingTransactions ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No delivery history found</Text>
            </View>
          ) : null
        }
      />

      {/* Add Amount Button */}
      {/* <TouchableOpacity style={styles.addBtn}>
        <Text style={styles.addBtnText}>Add Amount</Text>
      </TouchableOpacity> */}

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={handleDateCancel}
        date={tillDate}
        maximumDate={new Date()}
      />
    </View>
  );
};

export default AutoAssignDelivery;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  box: {
    backgroundColor: "#FFF",
    // borderWidth: 1,
    // borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  rowSpace: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#FCA311",
  },
  description: {
    fontSize: 12,
    color: "#5A5A5A",
    marginTop: 4,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C7C7C7",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 6,
  },
  filterButtonText: {
    fontSize: 12,
    color: "#000",
  },
  summaryBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  summaryItem: {
    flex: 0.48,
    backgroundColor: "#FFF1D6",
    borderRadius: 8,
    padding: 12,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#000",
  },
  summaryAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginTop: 4,
  },
  transactionCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  amountText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  orderText: {
    fontSize: 12,
    color: "#000",
    marginTop: 4,
    fontWeight: "600",
  },
  dateText: {
    fontSize: 12,
    color: "#000",
    fontWeight: "600",
  },
  addBtn: {
    position: "absolute",
    bottom: 20,
    right: 20,
    // width: "40%",
    // alignSelf: "flex-end",
    backgroundColor: "#169729",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 12,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
});

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  FlatList,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Headerwithback from "./Headerwithback";
import CustomSwitch from "./CustomSwitch";
import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

const { width } = Dimensions.get("window");

const AutoAssignDelivery = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [tillDate, setTillDate] = useState<Date>(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const toggleSwitch = async () => {
    setLoading(true);
    try {
      await api.post("/vendor/deliverymode/", {
        is_auto_assign_enabled: !isEnabled,
        is_self_delivery_enabled: isEnabled,
      });
      setIsEnabled((previousState) => !previousState);
    } catch (error) {
      console.log(error);
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

  useEffect(() => {
    getValues();
  }, []);

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

  const transactions = [
    {
      id: "1",
      amount: "500",
      date: "4/27/2025",
      time: "11:00 AM",
      type: "spent",
      order: "12345",
    },
    {
      id: "2",
      amount: "1000",
      date: "4/27/2025",
      time: "11:00 AM",
      type: "added",
      order: null,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
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
          <TouchableOpacity
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
          </TouchableOpacity>
        </View>

        <View style={styles.summaryBox}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Discount Amount</Text>
            <Text style={styles.summaryAmount}>Rs.2000.00</Text>
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
              <Text style={styles.summaryAmount}>Rs.1000.00</Text>
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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionCard}>
            <View>
              <Text
                style={[
                  styles.amountText,
                  { color: item.type === "spent" ? "#005120" : "#492F99" },
                ]}
              >
                Rs. {item.amount}
              </Text>
              {item.order ? (
                <Text style={styles.orderText}>Order no: {item.order}</Text>
              ) : (
                <Text style={styles.orderText}>Added to wallet</Text>
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
    </SafeAreaView>
  );
};

export default AutoAssignDelivery;

const styles = StyleSheet.create({
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
});

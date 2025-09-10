import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  FlatList,
  Dimensions,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

import ReportHeader from "./ReportHeader";
import Bottomnavigation from "./Bottomnavigation";

const { width } = Dimensions.get("window");

const summaryData = [
  { label: "Sales", value: "123455", color: "#DEF7EC", borderColor: "#004A0B" },
  {
    label: "Purchase",
    value: "123455",
    color: "#E0F2FE",
    borderColor: "#163881",
  },
  { label: "Stock", value: "123455", color: "#E0F2FE", borderColor: "#163881" },
  {
    label: "Receipts",
    value: "123455",
    color: "#FEF3C7",
    borderColor: "#FCA311",
  },
  {
    label: "Payments",
    value: "123455",
    color: "#FEE2E2",
    borderColor: "#FF0000",
  },
  {
    label: "Expenses",
    value: "123455",
    color: "#FEE2E2",
    borderColor: "#FF0000",
  },
];

const balances = [
  { label: "Cash in hand", opening: "123455", closing: "123456" },
  { label: "Bank Balance", opening: "123455", closing: "123456" },
];

const transactions = [
  {
    type: "Sales",
    detail: "INV-1234",
    medium: "Cash",
    debit: "10000.00",
    credit: "10000.00",
  },
  {
    type: "Receipts",
    detail: "Customer name",
    medium: "Cash",
    debit: "10000.00",
    credit: "9500.00",
  },
  {
    type: "Expense",
    detail: "Category",
    medium: "UPI",
    debit: "10000.00",
    credit: "9500.00",
  },
  {
    type: "Payment",
    detail: "Vendor name",
    medium: "UPI",
    debit: "10000.00",
    credit: "9500.00",
  },
];

const DayBookScreen = () => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date("2025-02-01"));
  const [endDate, setEndDate] = useState(new Date("2025-02-28"));
  const [selectingStart, setSelectingStart] = useState(true);
  const [monthModalVisible, setMonthModalVisible] = useState(false);

  const showDatePicker = (start: boolean) => {
    setSelectingStart(start);
    setDatePickerVisible(true);
  };

  const handleConfirm = (date: Date) => {
    if (selectingStart) {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    setDatePickerVisible(false);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ReportHeader
          title="Day Book "
          onBack={() => console.log("Back pressed")}
          // onPdfPress={() => console.log('Download PDF')}
          // onXlsPress={() => console.log('Download XLS')}
        />

        {/* Date Selector */}
        <View style={styles.dateContainer}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => showDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {moment(startDate).format("DD/MM/YYYY")}
            </Text>
            <Icon
              name="calendar"
              size={18}
              color="#F59E0B"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        </View>

        {/* All Content */}
        <FlatList
          data={transactions}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={
            <>
              {/* Summary Cards */}
              <View style={styles.summaryContainer}>
                {summaryData.map((item) => (
                  <View
                    key={item.label}
                    style={[
                      styles.summaryCard,
                      {
                        backgroundColor: item.color,
                        borderWidth: 1,
                        borderColor: item.borderColor,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.summaryLabel, { color: item.borderColor }]}
                    >
                      {item.label}
                    </Text>
                    <Text style={styles.summaryValue}>{item.value}</Text>
                  </View>
                ))}
              </View>

              {/* Balances */}
              <View style={styles.balanceContainer}>
                <View style={styles.balanceRow}>
                  <Text style={styles.balanceHeader}>Account</Text>
                  <Text style={styles.balanceHeader}>Opening</Text>
                  <Text style={styles.balanceHeader}>Closing</Text>
                </View>
                {balances.map((bal) => (
                  <View style={styles.balanceRow} key={bal.label}>
                    <Text style={styles.balanceLabel}>{bal.label}</Text>
                    <Text style={styles.balanceValue}>{bal.opening}</Text>
                    <Text style={styles.balanceValue}>{bal.closing}</Text>
                  </View>
                ))}
              </View>
              {/* Transaction Header */}
              <View style={styles.transHeader}>
                <Text style={styles.transHeaderText}>Type</Text>
                <Text style={styles.transHeaderText}>Medium</Text>
                <Text style={styles.transHeaderText}>Debit</Text>
                <Text style={styles.transHeaderText}>Credit</Text>
              </View>
            </>
          }
          renderItem={({ item }) => (
            <View style={styles.transItem}>
              <Text style={styles.transTime}>Time HH:MM:SS</Text>
              <View style={{ padding: 6, backgroundColor: "#FFF8ED" }}>
                <View style={styles.transTopRow}>
                  <Text style={styles.transType}>{item.type}</Text>
                </View>
                <View style={styles.transBottomRow}>
                  <Text style={styles.transDetail}>{item.detail}</Text>
                  <Text style={styles.transMedium}>{item.medium}</Text>
                  <Text style={styles.transAmount}>₹{item.debit}</Text>
                  <Text style={styles.transAmount}>₹{item.credit}</Text>
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </SafeAreaView>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisible(false)}
        date={selectingStart ? startDate : endDate}
        maximumDate={new Date()}
      />
    </View>
  );
};

export default DayBookScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  dateText: {
    fontSize: 13,
    color: "#000",
  },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  summaryCard: {
    width: width / 3 - 12,
    marginVertical: 6,
    padding: 10,
    borderRadius: 6,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#000",
    fontWeight: "600",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
  },
  balanceContainer: {
    marginTop: 12,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#008BE1",
    backgroundColor: "#F1F8FC",
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
    paddingVertical: 6,
  },
  balanceHeader: {
    fontWeight: "700",
    fontSize: 13,
    color: "#008BE1",
  },
  balanceLabel: {
    fontSize: 13,
    color: "#000",
    fontWeight: "500",
  },
  balanceValue: {
    fontSize: 13,
    color: "#000",
  },
  transHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFECCD",
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 10,
    borderColor: "#FCA311",
    borderWidth: 1,
  },
  transHeaderText: {
    fontWeight: "600",
    fontSize: 13,
    color: "#000",
  },
  transItem: {
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  transTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  transType: {
    fontWeight: "600",
    color: "#000",
  },
  transTime: {
    textAlign: "center",
    fontSize: 12,
    color: "#000",
    marginVertical: 5,
    marginBottom: 10,
  },
  transBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    backgroundColor: "#FFF8ED",
  },
  transLeft: {
    flex: 1,
  },
  transDetail: {
    fontSize: 13,
    color: "#000",
  },
  transMedium: {
    fontSize: 12,
    color: "#000",
    fontWeight: "500",
  },
  transRight: {
    alignItems: "flex-end",
  },
  transAmount: {
    fontSize: 13,
    color: "#000",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalOption: {
    fontSize: 16,
    paddingVertical: 10,
    color: "#333",
  },
  modalClose: {
    marginTop: 10,
    color: "red",
  },
});

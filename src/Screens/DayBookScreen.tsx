import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";

import ReportHeader from "./ReportHeader";
import CalendarModal from "../Modals/CalendarModal";

const { width } = Dimensions.get("window");

interface DayBookData {
  date: string;
  tiles: {
    sales: { total: number };
    purchases: { total: number };
    stock: { count: number };
    receipts: { total: number };
    payments: { total: number };
    expenses: { total: number };
  };
  accounts: {
    cash_in_hand: { opening: number; closing: number };
    bank_balance: { opening: number; closing: number };
  };
  entries: any[];
}

const DayBookScreen = () => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [daybookData, setDaybookData] = useState<DayBookData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [calendarModel, setCalendarModel] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(
    moment().format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState<string>(moment().format("YYYY-MM-DD"));
  useEffect(() => {
    fetchDaybookData();
  }, [selectedDate]);

  const fetchDaybookData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const dateString = moment(selectedDate).format("YYYY-MM-DD");
      const response = await api.get(`/vendor/daybook/?date=${dateString}`);

      if (response.data) {
        setDaybookData(response.data);
      }
    } catch (err: any) {
      console.error("Error fetching daybook data:", err);
      setError("Failed to load daybook data");
      setDaybookData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    setDatePickerVisible(false);
  };

  // Format number for display
  const formatValue = (value: number) => {
    return (
      value?.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) || "0.00"
    );
  };

  // Transform API data to summary cards
  const getSummaryData = () => {
    if (!daybookData) return [];
    const { tiles } = daybookData;
    return [
      {
        label: "Sales",
        value: formatValue(tiles.sales?.total || 0),
        color: "#DEF7EC",
        borderColor: "#004A0B",
      },
      {
        label: "Purchase",
        value: formatValue(tiles.purchases?.total || 0),
        color: "#E0F2FE",
        borderColor: "#163881",
      },
      {
        label: "Stock",
        value: (tiles.stock?.count || 0).toString(),
        color: "#E0F2FE",
        borderColor: "#163881",
      },
      {
        label: "Receipts",
        value: formatValue(tiles.receipts?.total || 0),
        color: "#FEF3C7",
        borderColor: "#FCA311",
      },
      {
        label: "Payments",
        value: formatValue(tiles.payments?.total || 0),
        color: "#FEE2E2",
        borderColor: "#FF0000",
      },
      {
        label: "Expenses",
        value: formatValue(tiles.expenses?.total || 0),
        color: "#FEE2E2",
        borderColor: "#FF0000",
      },
    ];
  };

  // Transform API data to balances
  const getBalances = () => {
    if (!daybookData) return [];
    const { accounts } = daybookData;
    return [
      {
        label: "Cash in hand",
        opening: formatValue(accounts.cash_in_hand?.opening || 0),
        closing: formatValue(accounts.cash_in_hand?.closing || 0),
      },
      {
        label: "Bank Balance",
        opening: formatValue(accounts.bank_balance?.opening || 0),
        closing: formatValue(accounts.bank_balance?.closing || 0),
      },
    ];
  };

  // Transform entries to transactions
  const getTransactions = () => {
    if (!daybookData?.entries || !Array.isArray(daybookData.entries)) {
      return [];
    }
    return daybookData.entries.map((entry: any) => ({
      type: entry.type || entry.entry_type || "Transaction",
      detail: entry.detail || entry.description || entry.reference || "-",
      medium: entry.medium || entry.payment_mode || "Cash",
      debit: formatValue(entry.debit || 0),
      credit: formatValue(entry.credit || 0),
      time: entry.time || entry.created_at || "",
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ReportHeader
        title="Day Book "
        onBack={() => console.log("Back pressed")}
        // onPdfPress={() => console.log('Download PDF')}
        // onXlsPress={() => console.log('Download XLS')}
      />

      {/* Date Selector */}
      <View style={styles.dateContainer}>
        <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
          <Text style={styles.dateText}>
            {moment(selectedDate).format("DD/MM/YYYY")}
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
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Loading visible={isLoading} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchDaybookData}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={getTransactions()}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={
            <>
              {/* Summary Cards */}
              <View style={styles.summaryContainer}>
                {getSummaryData().map((item) => (
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
                {getBalances().map((bal) => (
                  <View style={styles.balanceRow} key={bal.label}>
                    <Text style={styles.balanceLabel}>{bal.label}</Text>
                    <Text style={styles.balanceValue}>₹{bal.opening}</Text>
                    <Text style={styles.balanceValue}>₹{bal.closing}</Text>
                  </View>
                ))}
              </View>
              {/* Transaction Header */}
              {/* <View style={styles.transHeader}>
                <Text style={styles.transHeaderText}>Type</Text>
                <Text style={styles.transHeaderText}>Medium</Text>
                <Text style={styles.transHeaderText}>Amount</Text>
              </View> */}
            </>
          }
          renderItem={({ item }) => {
            const amount = Number(item.debit) > 0 ? item.debit : item.credit;

            return (
              <View style={styles.transItem}>
                {item.time && (
                  <Text style={styles.transTime}>
                    {moment(item.time).format("HH:mm:ss")}
                  </Text>
                )}
                <View style={{ padding: 6, backgroundColor: "#FFF8ED" }}>
                  <View style={styles.transTopRow}>
                    <Text style={styles.transType}>{item.type}</Text>
                    <Text style={styles.transAmount}>₹{amount}</Text>
                  </View>
                  <View style={styles.transBottomRow}>
                    <Text style={styles.transDetail}>{item.detail}</Text>
                    <Text style={styles.transMedium}>{item.medium}</Text>
                  </View>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No transactions found</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
      <CalendarModal
        visible={isDatePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        onSelect={(e) => setSelectedDate(new Date(e))}
        maxDate={moment().format("YYYY-MM-DD")}
        initialDate={moment(selectedDate).format("YYYY-MM-DD")}
      />
    </SafeAreaView>
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
    fontWeight: "500",
    marginTop: 4,
    color: "#000",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#FF0000",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#FCA311",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
  },
});

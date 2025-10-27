import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MainContainer from "../CommonComponent/MainContainer";
import { Expense } from "../type/common";
import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";
import { useIsFocused } from "@react-navigation/native";
import { API_ROUTES } from "../constants/api-routes.constants";
import { ScaledSheet } from "react-native-size-matters";
import CustomHeader from "../CommonComponent/CustomHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import CalendarModal from "../Modals/CalendarModal";
import moment from "moment";

const ExpensesScreen = ({ navigation }: any) => {
  const isFocused = useIsFocused();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expensesList, setExpenseseList] = useState<Expense[]>([]);
  const [groupedExpenses, setGroupedExpenses] = useState<{
    [key: string]: Expense[];
  }>({});
  const [total, setTotal] = useState<number>(0);

  // Calendar modal states
  const [showCalendarModal, setShowCalendarModal] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [callenderModel, setCallenderModel] = useState<string>("");

  useEffect(() => {
    getAllExpenses();
  }, [isFocused]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  };

  const groupExpensesByDate = (expenses: Expense[]) => {
    const grouped: { [key: string]: Expense[] } = {};

    expenses.forEach((expense) => {
      const date = expense.expense_date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(expense);
    });

    // Sort dates in descending order (newest first)
    const sortedDates = Object.keys(grouped).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    const sortedGrouped: { [key: string]: Expense[] } = {};
    sortedDates.forEach((date) => {
      sortedGrouped[date] = grouped[date];
    });

    return sortedGrouped;
  };

  // Date filtering functions
  const filterExpensesByDateRange = (start: string, end: string) => {
    if (!start || !end) return expensesList;

    const startDateObj = new Date(start);
    const endDateObj = new Date(end);

    return expensesList.filter((expense) => {
      const expenseDate = new Date(expense.expense_date);
      return expenseDate >= startDateObj && expenseDate <= endDateObj;
    });
  };

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      const filtered = filterExpensesByDateRange(startDate, endDate);
      setFilteredExpenses(filtered);
      setGroupedExpenses(groupExpensesByDate(filtered));
      setIsFiltered(true);
      setShowCalendarModal(false);
    }
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setFilteredExpenses([]);
    setGroupedExpenses(groupExpensesByDate(expensesList));
    setIsFiltered(false);
    setShowCalendarModal(false);
  };

  const getAllExpenses = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(API_ROUTES.expense);
      if (res.data.length > 0) {
        setExpenseseList(res.data);
        const grouped = groupExpensesByDate(res.data);
        setGroupedExpenses(grouped);

        let temptotal = 0;
        res.data.map((item: Expense) => {
          temptotal = temptotal + parseInt(item.amount);
        });
        setTotal(temptotal);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  const renderExpenseItem = (item: Expense) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.expenseCard}
        onPress={() => {
          navigation.navigate("ExpensesDetailScreen", { expenseData: item });
        }}
      >
        <View style={styles.expenseHeader}>
          <Text style={styles.cellText}>
            {(item as any).category_details?.name || "Category"}
          </Text>
          <Text style={styles.cellText}>
            {(item as any).payment_method?.toUpperCase() ||
              item.payment_type?.toUpperCase() ||
              "CASH"}
          </Text>
          <Text style={styles.cellText}>{item.payment_date}</Text>
          <Text style={styles.pendingText}>
            {item.is_paid ? "Paid" : "Pending"}
          </Text>
        </View>

        <View style={styles.expenseRow}>
          {item.description && (
            <Text style={styles.descText} numberOfLines={2}>
              {item.description}
            </Text>
          )}
          <Text style={styles.descText} numberOfLines={2}>
            {item.amount}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDateSection = (date: string, expenses: Expense[]) => {
    return (
      <View key={date} style={styles.dateSection}>
        <Text style={styles.dateText}>{formatDate(date)}</Text>
        {expenses.map((expense) => renderExpenseItem(expense))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <CustomHeader
        title="Expenses"
        rightIcon={
          <TouchableOpacity onPress={() => setShowCalendarModal(true)}>
            <Icon name="calendar-outline" size={22} color="#FCA311" />
          </TouchableOpacity>
        }
      />

      {/* Ledger */}
      <View style={styles.ledger}>
        <Text style={styles.ledgerText}></Text>
        <Text style={[styles.ledgerText]}>Ledger</Text>
        <Text style={styles.ledgerAmount}>{total}</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {Object.entries(groupedExpenses).map(([date, expenses]) =>
          renderDateSection(date, expenses)
        )}
      </ScrollView>

      {/* Add Expense Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          navigation.navigate("Expenses");
        }}
      >
        <Text style={styles.addText}>Add Expenses</Text>
      </TouchableOpacity>

      {/* Calendar Modal */}
      <CalendarModal
        initialDate={callenderModel === "start" ? startDate : endDate}
        visible={callenderModel !== ""}
        onClose={() => setCallenderModel("")}
        onSelect={(e) =>
          callenderModel === "start" ? setStartDate(e) : setEndDate(e)
        }
        maxDate={moment().format("YYYY-MM-DD")}
      />
      <Modal
        visible={showCalendarModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCalendarModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter by Date Range</Text>
              <TouchableOpacity
                onPress={() => setShowCalendarModal(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <View style={styles.dateInputContainer}>
                <Text style={styles.dateLabel}>Start Date</Text>
                <TouchableOpacity onPress={() => setCallenderModel("start")}>
                  <TextInput
                    style={styles.dateInput}
                    value={startDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#999"
                    editable={false}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.dateInputContainer}>
                <Text style={styles.dateLabel}>End Date</Text>
                <TouchableOpacity onPress={() => setCallenderModel("end")}>
                  <TextInput
                    style={styles.dateInput}
                    value={endDate}
                    editable={false}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#999"
                  />
                </TouchableOpacity>
              </View>

              {isFiltered && (
                <View style={styles.filterStatus}>
                  <Text style={styles.filterStatusText}>
                    Filtered by date range
                  </Text>
                  <TouchableOpacity
                    onPress={handleClearFilter}
                    style={styles.clearFilterButton}
                  >
                    <Text style={styles.clearFilterText}>Clear Filter</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowCalendarModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.applyButton]}
                  onPress={handleApplyFilter}
                  disabled={!startDate || !endDate}
                >
                  <Text style={styles.applyButtonText}>Apply Filter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Loading visible={isLoading} />
    </SafeAreaView>
  );
};

export default ExpensesScreen;
const { width, height } = Dimensions.get("window");

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    paddingTop: 0,
  },
  backButton: {
    backgroundColor: "#FCA311",
    padding: 6,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  calendarButton: {
    padding: 6,
    borderRadius: 20,
  },
  ledger: {
    backgroundColor: "#FFEBCB",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  ledgerText: {
    fontWeight: "bold",
    fontSize: "12@s",
    color: "#000",
  },
  ledgerAmount: {
    color: "green",
    fontWeight: "bold",
  },
  scrollContainer: {
    paddingHorizontal: 15,
    // paddingBottom: 80,
  },
  dateSection: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  dateText: {
    marginTop: "8@s",
    // marginBottom: 8,
    fontSize: "12@s",
    fontWeight: "600",
    color: "#000",
    alignSelf: "center",
    // backgroundColor: "#F5F5F5",
    // paddingHorizontal: 12,
    // paddingVertical: 6,
    borderRadius: 12,
  },
  expenseCard: {
    backgroundColor: "#FFF6EF",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  expenseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    height: height / 30,
  },
  cellText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
  },
  expenseRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  descText: {
    flex: 1,
    fontSize: 13,
    color: "#555",
    width: "33%",
  },
  pendingText: {
    color: "red",
    fontWeight: "600",
    fontSize: 13,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#FCA311",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addText: {
    color: "#fff",
    fontWeight: "bold",
  },
  // Calendar Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: width * 0.9,
    maxHeight: height * 0.6,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  dateInputContainer: {
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
  },
  filterStatus: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  filterStatusText: {
    fontSize: 14,
    color: "#2196F3",
    fontWeight: "500",
  },
  clearFilterButton: {
    backgroundColor: "#FF5722",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearFilterText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  applyButton: {
    backgroundColor: "#FCA311",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

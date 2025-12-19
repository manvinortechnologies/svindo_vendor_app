import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // For icons
import CustomHeader from "../CommonComponent/CustomHeader";
import { API_ROUTES } from "../constants/api-routes.constants";
import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";
import CalendarModal from "../Modals/CalendarModal";
import moment from "moment";
import { SafeAreaView } from "react-native-safe-area-context";

interface BankTransaction {
  id: number;
  date: string;
  dateFormatted: string;
  type: string;
  detail: string;
  amount: number;
  balance: number;
  isCredit: boolean;
}

interface BankInfo {
  name: string;
  balance: number;
  openingBalance?: number;
}

const BankNameScreen = ({ navigation, route }: any) => {
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [groupedTransactions, setGroupedTransactions] = useState<{
    [key: string]: BankTransaction[];
  }>({});
  const [bankInfo, setBankInfo] = useState<BankInfo>({
    name: "Bank Name",
    balance: 0,
    openingBalance: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [calendarModel, setCalendarModel] = useState<string>("");
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [allTransactions, setAllTransactions] = useState<BankTransaction[]>([]);

  const bankId = route?.params?.bankId;
  const bankName = route?.params?.bank?.bank_name || "Bank Name";

  useEffect(() => {
    if (bankId) {
      fetchBankLedgerData();
    }
  }, [bankId]);

  const fetchBankLedgerData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get(
        API_ROUTES.bankLedger.replace(":id", bankId.toString())
      );

      if (response.data) {
        // Transform API data to match component structure
        const transformedData = transformBankLedgerData(response.data);
        setAllTransactions(transformedData);
        setTransactions(transformedData);
        const grouped = groupTransactionsByDate(transformedData);
        setGroupedTransactions(grouped);

        // Calculate opening balance
        let openingBalance = response.data.opening_balance || 0;
        if (!openingBalance && transformedData.length > 0) {
          // If opening balance is not provided, calculate from oldest transaction
          // Sort transactions by date ascending to get the oldest
          const sortedTransactions = [...transformedData].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          if (sortedTransactions.length > 0) {
            const oldestTransaction = sortedTransactions[0];
            // Opening balance = oldest balance - oldest transaction amount (considering credit/debit)
            openingBalance = oldestTransaction.isCredit
              ? oldestTransaction.balance - oldestTransaction.amount
              : oldestTransaction.balance + oldestTransaction.amount;
          }
        }

        // Update bank info from API response
        setBankInfo({
          name: response.data.bank_name,
          balance: response.data.balance || 0,
          openingBalance: response.data.opening || 0,
        });
      }
    } catch (error: any) {
      console.error("Error fetching bank ledger data:", error);
      setError("Failed to load bank ledger data");
    } finally {
      setIsLoading(false);
    }
  };

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

  const groupTransactionsByDate = (transactions: BankTransaction[]) => {
    const grouped: { [key: string]: BankTransaction[] } = {};

    transactions.forEach((transaction) => {
      const date = transaction.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    });

    // Sort dates in descending order (newest first)
    const sortedDates = Object.keys(grouped).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    const sortedGrouped: { [key: string]: BankTransaction[] } = {};
    sortedDates.forEach((date) => {
      sortedGrouped[date] = grouped[date];
    });

    return sortedGrouped;
  };

  const transformBankLedgerData = (apiData: any): BankTransaction[] => {
    // Transform API response to match component's expected data structure
    if (apiData.ledger && Array.isArray(apiData.ledger)) {
      return apiData.ledger.map((txn: any, index: number) => {
        const transactionDate = new Date(txn.created_at);
        const dateKey = transactionDate.toISOString().split("T")[0]; // YYYY-MM-DD for grouping
        const dateFormatted = transactionDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        return {
          id: txn.id || index + 1,
          date: dateKey,
          dateFormatted: dateFormatted,
          type: txn.transaction_type || txn.type || "Transaction",
          detail: txn.description || txn.detail || "N/A",
          amount: Math.abs(txn.amount || 0),
          balance: txn.balance_after || 0,
          isCredit: (txn.amount || 0) > 0,
        };
      });
    }

    // Fallback transformation if API structure is different
    return [];
  };

  const renderTransactionItem = (item: BankTransaction) => {
    return (
      <View key={item.id} style={styles.transactionCard}>
        {/* Transaction Row */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Transaction</Text>
            <Text style={{ color: "#000", textAlign: "center" }}>
              {item.type
                .split("_")
                .join(" ")
                .replaceAll("out", "")
                .replaceAll("in", "")
                .toLocaleUpperCase()}
            </Text>
          </View>

          <View style={styles.col}>
            <Text style={styles.label}>Amount</Text>
            <Text
              style={[
                styles.amount,
                { color: item.isCredit ? "#163881" : "#FF0000" },
              ]}
            >
              {item.amount.toFixed(2)}
            </Text>
          </View>

          <View style={styles.col}>
            <Text style={styles.label}>Balance</Text>
            <Text style={{ color: "#000" }}>{item.balance.toFixed(2)}</Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginTop: 10,
          }}
        >
          <Text style={styles.label}>Detail : </Text>
          <Text style={{ color: "#000" }}>{item.detail}</Text>
        </View>
      </View>
    );
  };

  // Filter transactions by date range
  const filterTransactionsByDateRange = (
    start: string,
    end: string
  ): BankTransaction[] => {
    if (!start || !end) return allTransactions;

    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    // Set end date to end of day
    endDateObj.setHours(23, 59, 59, 999);

    return allTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDateObj && transactionDate <= endDateObj;
    });
  };

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      const filtered = filterTransactionsByDateRange(startDate, endDate);
      setTransactions(filtered);
      const grouped = groupTransactionsByDate(filtered);
      setGroupedTransactions(grouped);
      setIsFiltered(true);
      setShowFilterModal(false);
    }
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setTransactions(allTransactions);
    const grouped = groupTransactionsByDate(allTransactions);
    setGroupedTransactions(grouped);
    setIsFiltered(false);
    setShowFilterModal(false);
  };

  const renderDateSection = (date: string, transactions: BankTransaction[]) => {
    return (
      <View key={date} style={styles.dateSection}>
        <Text style={styles.dateText}>{formatDate(date)}</Text>
        {transactions.map((transaction) => renderTransactionItem(transaction))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader title={bankName} />
        <Loading visible={isLoading} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <CustomHeader
        title={bankInfo.name}
        rightIcon={
          <TouchableOpacity onPress={() => setShowFilterModal(true)}>
            <Icon name="calendar" size={22} color="#FCA311" />
          </TouchableOpacity>
        }
      />

      {/* Ledger */}
      <View style={styles.ledger}>
        <View style={styles.ledgerItem}>
          <Text style={styles.ledgerText}>Opening Balance</Text>
          <Text
            style={[
              styles.balanceText,
              { color: (bankInfo.openingBalance || 0) >= 0 ? "green" : "red" },
            ]}
          >
            ₹{(bankInfo.openingBalance || 0).toFixed(2)}
          </Text>
        </View>
        <View style={styles.ledgerItem}>
          <Text style={styles.ledgerText}>Current Balance</Text>
          <Text
            style={[
              styles.balanceText,
              { color: bankInfo.balance >= 0 ? "green" : "red" },
            ]}
          >
            ₹{bankInfo.balance.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={fetchBankLedgerData}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {Object.entries(groupedTransactions).map(([date, transactions]) =>
          renderDateSection(date, transactions)
        )}
      </ScrollView>

      {/* Calendar Modal */}
      <CalendarModal
        initialDate={calendarModel === "start" ? startDate : endDate}
        visible={calendarModel !== ""}
        onClose={() => setCalendarModel("")}
        onSelect={(e) =>
          calendarModel === "start" ? setStartDate(e) : setEndDate(e)
        }
        maxDate={moment().format("YYYY-MM-DD")}
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter by Date Range</Text>
              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <View style={styles.dateInputContainer}>
                <Text style={styles.dateLabel}>Start Date</Text>
                <TouchableOpacity onPress={() => setCalendarModel("start")}>
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
                <TouchableOpacity onPress={() => setCalendarModel("end")}>
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
                  <Text style={styles.filterStatusText}>Filters applied</Text>
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
                  onPress={() => setShowFilterModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.applyButton,
                    (!startDate || !endDate) && styles.disabledButton,
                  ]}
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
    </SafeAreaView>
  );
};

export default BankNameScreen;

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  // Ledger section
  ledger: {
    backgroundColor: "#FFE9C7",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#FCA311",
  },
  ledgerItem: {
    flex: 1,
    alignItems: "center",
  },
  ledgerText: {
    fontWeight: "600",
    fontSize: 12,
    color: "#000",
    marginBottom: 4,
  },
  balanceText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "green",
  },

  // Date Section
  dateSection: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  dateText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
    alignSelf: "center",
    borderRadius: 12,
    marginBottom: 8,
  },
  // Transaction Card
  transactionCard: {
    backgroundColor: "#FFF8ED",
    marginTop: 8,
    borderRadius: 8,
    elevation: 2,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  col: { flex: 1, alignItems: "center" },
  label: { fontSize: 12, fontWeight: "bold", marginBottom: 3, color: "#000" },
  amount: { fontWeight: "bold", color: "#000" },
  errorContainer: {
    backgroundColor: "#ffebee",
    borderColor: "#f44336",
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    margin: 10,
    alignItems: "center",
  },
  errorText: {
    color: "#f44336",
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#f44336",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  // Filter Modal Styles
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
  disabledButton: {
    opacity: 0.5,
  },
});

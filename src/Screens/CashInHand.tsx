import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import Bottomnavigation from "./Bottomnavigation";
import Headerwithback from "./Headerwithback";
import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";
import { API_ROUTES } from "../constants/api-routes.constants";
import AdjustCashModal from "../Modals/AdjustCashModal";
import BankTransferModal from "../Modals/BankTransferModal";
import CalendarModal from "../Modals/CalendarModal";
import moment from "moment";
import { ScaledSheet } from "react-native-size-matters";

interface CashTransaction {
  id: number;
  date: string;
  dateFormatted: string;
  type: string;
  detail: string;
  amount: number;
  balance: number;
  isCredit: boolean;
  balance_after: number;
}

const CashInHand = ({ navigation }: any) => {
  const [cashBalance, setCashBalance] = useState<string>("00.00");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAdjustModal, setShowAdjustModal] = useState<boolean>(false);
  const [showBankTransferModal, setShowBankTransferModal] =
    useState<boolean>(false);
  const [transactions, setTransactions] = useState<CashTransaction[]>([]);
  const [groupedTransactions, setGroupedTransactions] = useState<{
    [key: string]: CashTransaction[];
  }>({});
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [calendarModel, setCalendarModel] = useState<string>("");
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [allTransactions, setAllTransactions] = useState<CashTransaction[]>([]);

  useEffect(() => {
    getCashAndLedger();
  }, []);

  const getCashAndLedger = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await api.get(API_ROUTES.vendorCashLedger);
      const res1 = await api.get(API_ROUTES.vendorCash);
      if (res.data) {
        setCashBalance(res1.data.balance || "00.00");
        // Transform ledger data if available
        if (res.data && Array.isArray(res.data)) {
          const transformedTransactions = transformCashLedgerData(res.data);
          setAllTransactions(transformedTransactions);
          setTransactions(transformedTransactions);
          const grouped = groupTransactionsByDate(transformedTransactions);
          setGroupedTransactions(grouped);
        } else {
          // Set empty array if no ledger data
          setTransactions([]);
          setAllTransactions([]);
          setGroupedTransactions({});
        }
      }
    } catch (error: any) {
      console.error("Error fetching cash ledger data:", error);
      setError("Failed to load cash ledger data");
      // Set fallback data on error
      setTransactions([]);
      setAllTransactions([]);
      setGroupedTransactions({});
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

  const groupTransactionsByDate = (transactions: CashTransaction[]) => {
    const grouped: { [key: string]: CashTransaction[] } = {};

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

    const sortedGrouped: { [key: string]: CashTransaction[] } = {};
    sortedDates.forEach((date) => {
      sortedGrouped[date] = grouped[date];
    });

    return sortedGrouped;
  };

  const transformCashLedgerData = (ledgerData: any[]): CashTransaction[] => {
    return ledgerData.map((txn: any, index: number) => {
      const transactionDate = new Date(txn.created_at || txn.date);
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
        type: txn.transaction_type || txn.type || "Cash Transaction",
        detail: txn.note || txn.detail || txn.reference || "N/A",
        amount: Math.abs(txn.new_balance || 0),
        balance: Number(txn.previous_balance) || 0,
        isCredit: (Number(txn.delta_amount) || 0) > 0,
      };
    });
  };

  // Filter transactions by date range
  const filterTransactionsByDateRange = (
    start: string,
    end: string
  ): CashTransaction[] => {
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

  const handleAdjustSuccess = () => {
    // Refresh cash balance and ledger after successful adjustment
    getCashAndLedger();
  };

  const handleBankTransferSuccess = () => {
    // Refresh cash balance and ledger after successful bank transfer
    getCashAndLedger();
  };
  const renderTransactionItem = (item: CashTransaction) => {
    return (
      <View key={item.id} style={styles.transactionCard}>
        {/* Transaction Row */}
        <View style={styles.transactionRow}>
          <View style={styles.col}>
            <Text style={styles.columnLabel}>Transaction</Text>
            <Text style={styles.columnValue}>
              {item.type === "withdrawal"
                ? "Transfer"
                : item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Text>
          </View>

          <View style={styles.col}>
            <Text style={styles.columnLabel}>Amount</Text>
            <Text
              style={[
                styles.amountValue,
                { color: item.isCredit ? "#163881" : "#FF0000" },
              ]}
            >
              {item.amount.toFixed(2)}
            </Text>
          </View>

          <View style={styles.col}>
            <Text style={styles.columnLabel}>Balance</Text>
            <Text style={styles.columnValue}>{item.balance.toFixed(2)}</Text>
          </View>
        </View>
        <View style={[styles.col, { alignItems: "flex-start", marginTop: 10 }]}>
          <Text style={styles.columnLabel}>Detail</Text>
          <Text style={styles.columnValue}>{item.detail}</Text>
        </View>
      </View>
    );
  };

  const renderDateSection = (date: string, transactions: CashTransaction[]) => {
    return (
      <View key={date} style={styles.dateSection}>
        <Text style={styles.dateText}>{formatDate(date)}</Text>
        {transactions.map((transaction) => renderTransactionItem(transaction))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Headerwithback
        title="Cash in hand"
        rightIcons={[
          <TouchableOpacity
            key="filter"
            onPress={() => setShowFilterModal(true)}
          >
            <Icon name="calendar" size={22} color="#FCA311" />
          </TouchableOpacity>,
        ]}
      />

      <View style={styles.balanceCard}>
        <View style={styles.row}>
          <Image
            source={require("../assets/money.png")} // Replace with your local image
            style={styles.icon}
          />
          <View>
            <Text style={styles.label}>Current Cash Balance</Text>
            <Text style={styles.amount}>Rs {cashBalance}</Text>
          </View>
        </View>
      </View>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={getCashAndLedger}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Transactions List */}
      <ScrollView
        style={styles.transactionsList}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(groupedTransactions).map(([date, transactions]) =>
          renderDateSection(date, transactions)
        )}

        {Object.keys(groupedTransactions).length === 0 && !isLoading && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions found</Text>
            <Text style={styles.emptySubText}>
              Cash transactions will appear here
            </Text>
          </View>
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

      {/* Buttons Container - Fixed at bottom */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowBankTransferModal(true)}
        >
          <Text style={styles.buttonText}>Bank Transfer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowAdjustModal(true)}
        >
          <Text style={styles.buttonText}>Adjust Cash</Text>
        </TouchableOpacity>
      </View>

      <Loading visible={isLoading} />

      <AdjustCashModal
        visible={showAdjustModal}
        onClose={() => setShowAdjustModal(false)}
        onSuccess={handleAdjustSuccess}
      />

      <BankTransferModal
        visible={showBankTransferModal}
        onClose={() => setShowBankTransferModal(false)}
        onSuccess={handleBankTransferSuccess}
      />
    </SafeAreaView>
  );
};
const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  balanceCard: {
    backgroundColor: "#FFF7EB",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FCA311",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 36,
    height: 36,
    marginRight: 12,
    resizeMode: "contain",
  },
  label: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  amount: {
    color: "green",
    fontSize: 16,
    fontWeight: "700",
  },
  // Ledger section styles
  ledger: {
    backgroundColor: "#FFE9C7",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderColor: "#FCA311",
    marginHorizontal: 16,
    borderRadius: 6,
    marginBottom: 10,
  },
  ledgerText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  balanceText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "green",
  },
  // Error container styles
  errorContainer: {
    backgroundColor: "#ffebee",
    borderColor: "#f44336",
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    margin: 16,
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
  // Transactions list styles
  transactionsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  transactionCard: {
    backgroundColor: "#FFF8ED",
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  col: {
    flex: 1,
    alignItems: "center",
  },
  columnLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 3,
    color: "#000",
  },
  columnValue: {
    fontSize: 12,
    color: "#000",
    textAlign: "center",
  },
  amountValue: {
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  // Button container - fixed at bottom
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 10,
  },
  button: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#FCA311",
    fontSize: 14,
    fontWeight: "600",
  },
  // Date Section
  dateSection: {
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
    width: Dimensions.get("window").width * 0.9,
    maxHeight: Dimensions.get("window").height * 0.6,
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

export default CashInHand;

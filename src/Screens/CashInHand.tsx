import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Bottomnavigation from "./Bottomnavigation";
import Headerwithback from "./Headerwithback";
import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";
import { API_ROUTES } from "../constants/api-routes.constants";
import AdjustCashModal from "../Modals/AdjustCashModal";
import BankTransferModal from "../Modals/BankTransferModal";
import { ScaledSheet } from "react-native-size-matters";

interface CashTransaction {
  id: number;
  date: string;
  type: string;
  detail: string;
  amount: number;
  balance: number;
  isCredit: boolean;
}

const CashInHand = ({ navigation }: any) => {
  const [cash, setCash] = useState<string>("00.00");
  const [cashBalance, setCashBalance] = useState<string>("00.00");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAdjustModal, setShowAdjustModal] = useState<boolean>(false);
  const [showBankTransferModal, setShowBankTransferModal] =
    useState<boolean>(false);
  const [transactions, setTransactions] = useState<CashTransaction[]>([]);
  const [error, setError] = useState<string | null>(null);
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
        setCash(res.data.balance || "00.00");
        setCashBalance(res1.data.balance || "00.00");
        // Transform ledger data if available
        if (res.data.ledger && Array.isArray(res.data.ledger)) {
          const transformedTransactions = transformCashLedgerData(
            res.data.ledger
          );
          setTransactions(transformedTransactions);
        } else {
          // Set empty array if no ledger data
          setTransactions([]);
        }
      }
    } catch (error: any) {
      console.error("Error fetching cash ledger data:", error);
      setError("Failed to load cash ledger data");
      // Set fallback data on error
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const transformCashLedgerData = (ledgerData: any[]): CashTransaction[] => {
    return ledgerData.map((txn: any, index: number) => ({
      id: txn.id || index + 1,
      date: new Date(txn.created_at || txn.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      type: txn.transaction_type || txn.type || "Cash Transaction",
      detail: txn.description || txn.detail || txn.reference || "N/A",
      amount: Math.abs(txn.amount || 0),
      balance: txn.balance || 0,
      isCredit: (txn.amount || 0) > 0,
    }));
  };

  const handleAdjustSuccess = () => {
    // Refresh cash balance and ledger after successful adjustment
    getCashAndLedger();
  };

  const handleBankTransferSuccess = () => {
    // Refresh cash balance and ledger after successful bank transfer
    getCashAndLedger();
  };
  return (
    <SafeAreaView style={styles.container}>
      <Headerwithback title="Cash in hand" />

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

      {/* Ledger Section */}
      <View style={styles.ledger}>
        <View></View>
        <Text style={styles.ledgerText}>Ledger</Text>
        <Text
          style={[
            styles.balanceText,
            { color: parseFloat(cash) >= 0 ? "green" : "red" },
          ]}
        >
          {parseFloat(cash).toFixed(2)}
        </Text>
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
        {transactions.map((item) => (
          <View key={item.id} style={styles.transactionCard}>
            {/* Date */}
            <Text style={styles.date}>Date {item.date}</Text>

            {/* Transaction Row */}
            <View style={styles.transactionRow}>
              <View style={styles.col}>
                <Text style={styles.columnLabel}>Transaction</Text>
                <Text style={styles.columnValue}>{item.type}</Text>
              </View>

              <View style={styles.col}>
                <Text style={styles.columnLabel}>Detail</Text>
                <Text style={styles.columnValue}>{item.detail}</Text>
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
                <Text style={styles.columnValue}>
                  {item.balance.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        ))}

        {transactions.length === 0 && !isLoading && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions found</Text>
            <Text style={styles.emptySubText}>
              Cash transactions will appear here
            </Text>
          </View>
        )}
      </ScrollView>

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
  date: {
    fontSize: 12,
    color: "gray",
    marginBottom: 5,
    textAlign: "center",
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
});

export default CashInHand;

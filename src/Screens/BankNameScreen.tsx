import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // For icons
import CustomHeader from "../CommonComponent/CustomHeader";
import { API_ROUTES } from "../constants/api-routes.constants";
import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";

interface BankTransaction {
  id: number;
  date: string;
  type: string;
  detail: string;
  amount: number;
  balance: number;
  isCredit: boolean;
}

interface BankInfo {
  name: string;
  balance: number;
}

const BankNameScreen = ({ navigation, route }: any) => {
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [bankInfo, setBankInfo] = useState<BankInfo>({
    name: "Bank Name",
    balance: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const bankId = route?.params?.bankId;
  const bankName = route?.params?.bank?.name || "Bank Name";

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
        setTransactions(transformedData);

        // Update bank info from API response
        setBankInfo({
          name: bankName,
          balance: response.data.balance || 0,
        });
      }
    } catch (error: any) {
      console.error("Error fetching bank ledger data:", error);
      setError("Failed to load bank ledger data");
      // Fallback to dummy data on error
      setTransactions([
        {
          id: 1,
          date: "10-11-2025",
          type: "Sales",
          detail: "Invoice no.",
          amount: 500,
          balance: 9500,
          isCredit: true,
        },
        {
          id: 2,
          date: "10-11-2025",
          type: "Expenditure",
          detail: "Category",
          amount: 500,
          balance: 9000,
          isCredit: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const transformBankLedgerData = (apiData: any): BankTransaction[] => {
    // Transform API response to match component's expected data structure
    if (apiData.ledger && Array.isArray(apiData.ledger)) {
      return apiData.ledger.map((txn: any, index: number) => ({
        id: txn.id || index + 1,
        date: new Date(txn.created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        type: txn.transaction_type || txn.type || "Transaction",
        detail: txn.description || txn.detail || "N/A",
        amount: Math.abs(txn.amount || 0),
        balance: txn.balance || 0,
        isCredit: (txn.amount || 0) > 0,
      }));
    }

    // Fallback transformation if API structure is different
    return [];
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <CustomHeader title={bankName} />
        <Loading visible={isLoading} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <CustomHeader title={bankInfo.name} />

      {/* Ledger */}
      <View style={styles.ledger}>
        <View></View>
        <Text style={styles.ledgerText}>Ledger</Text>
        <Text
          style={[
            styles.balanceText,
            { color: bankInfo.balance >= 0 ? "green" : "red" },
          ]}
        >
          {bankInfo.balance.toFixed(2)}
        </Text>
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
        {transactions.map((item) => (
          <View key={item.id} style={styles.transactionCard}>
            {/* Date */}
            <Text style={styles.date}>Date {item.date}</Text>

            {/* Transaction Row */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Transaction</Text>
                <Text style={{ color: "#000" }}>{item.type}</Text>
              </View>

              <View style={styles.col}>
                <Text style={styles.label}>Detail</Text>
                <Text style={{ color: "#000" }}>{item.detail}</Text>
              </View>

              <View style={styles.col}>
                <Text style={styles.label}>Amount</Text>
                <Text
                  style={[
                    styles.amount,
                    { color: item.isCredit ? "#163881" : "#FF0000" },
                  ]}
                >
                  {item.amount}
                </Text>
              </View>

              <View style={styles.col}>
                <Text style={styles.label}>Balance</Text>
                <Text style={{ color: "#000" }}>{item.balance.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default BankNameScreen;

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
    padding: 12,
    borderWidth: 1,
    borderColor: "#FCA311",
  },
  ledgerText: { fontWeight: "bold", fontSize: 16, color: "#000" },
  balanceText: { fontWeight: "bold", fontSize: 16, color: "green" },

  // Transaction Card
  transactionCard: {
    backgroundColor: "#FFF8ED",
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 8,
    elevation: 2,
    padding: 10,
  },
  date: {
    fontSize: 12,
    color: "gray",
    marginBottom: 5,
    textAlign: "center",
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
});

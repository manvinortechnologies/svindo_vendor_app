import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { API_ROUTES } from "../constants/api-routes.constants";
import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";

interface LedgerTransaction {
  type: "invoice" | "payment";
  id: string;
  amount?: number;
  paid: number;
  balance: number;
  medium?: string;
}

interface LedgerSection {
  date: string;
  transactions: LedgerTransaction[];
}

interface VendorInfo {
  name: string;
  phone: string;
  outstanding: number;
}

const VendorLedger = ({ navigation, route }: any) => {
  const [ledgerData, setLedgerData] = useState<LedgerSection[]>([]);
  const [vendorInfo, setVendorInfo] = useState<VendorInfo>({
    name: route?.params?.vendor?.name || "Vendor Name",
    phone: route?.params?.vendor?.contact || "+91 9999999999",
    outstanding: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const vendorId = route?.params?.vendor?.id;

  useEffect(() => {
    console.log("vendorId", vendorId);
    if (vendorId) {
      fetchLedgerData();
    }
  }, [vendorId]);

  const fetchLedgerData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get(
        API_ROUTES.vendorLedger.replace(":id", vendorId.toString())
      );

      if (response.data) {
        // Transform API data to match component structure
        const transformedData = transformLedgerData(response.data);
        setLedgerData(transformedData);

        // Update vendor info from API response
        setVendorInfo({
          name: route?.params?.vendor?.name || "Vendor Name",
          phone: route?.params?.vendor?.contact || "+91 9999999999",
          outstanding: response.data.balance || 0,
        });
      }
    } catch (error: any) {
      console.error("Error fetching vendor ledger data:", error);
      setError("Failed to load vendor ledger data");
    } finally {
      setIsLoading(false);
    }
  };

  const transformLedgerData = (apiData: any): LedgerSection[] => {
    // Transform API response to match component's expected data structure
    if (apiData.ledger && Array.isArray(apiData.ledger)) {
      // Group transactions by date
      const groupedByDate: { [key: string]: LedgerTransaction[] } = {};

      apiData.ledger.forEach((txn: any) => {
        const date = new Date(txn.created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        if (!groupedByDate[date]) {
          groupedByDate[date] = [];
        }

        // Determine transaction type based on transaction_type
        let type: "invoice" | "payment" = "payment";
        if (
          txn.transaction_type.includes("invoice") ||
          txn.transaction_type.includes("sale")
        ) {
          type = "invoice";
        }

        // Calculate balance (this might need adjustment based on business logic)
        const balance = txn.amount;

        groupedByDate[date].push({
          type: type,
          id: txn.reference_id?.toString() || txn.id.toString(),
          amount: type === "invoice" ? Math.abs(txn.amount) : undefined,
          paid: type === "payment" ? Math.abs(txn.amount) : 0,
          balance: balance,
          medium: txn.transaction_type,
        });
      });

      // Convert grouped data to sections
      return Object.keys(groupedByDate)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // Sort by date descending
        .map((date) => ({
          date: date,
          transactions: groupedByDate[date],
        }));
    }

    // Fallback transformation if API structure is different
    return [];
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back" size={18} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity style={{ marginRight: 12 }}>
              <Text style={styles.editText}>View /Edit Details</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="trash" size={22} color="red" />
            </TouchableOpacity>
          </View>
        </View>
        <Loading visible={isLoading} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={18} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity style={{ marginRight: 12 }}>
            <Text style={styles.editText}>View /Edit Details</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="trash" size={22} color="red" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Vendor Info */}
      <View style={styles.vendorInfo}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.vendorName}>{vendorInfo.name}</Text>
          <View style={styles.infoIcons}>
            <Icon name="call" size={20} color="black" style={styles.icon} />
            <Icon name="mail" size={20} color="black" style={styles.icon} />
            <Icon name="logo-whatsapp" size={20} color="green" />
          </View>
        </View>
        <Text style={styles.phone}>{vendorInfo.phone}</Text>

        <Text
          style={[
            styles.outstanding,
            { color: vendorInfo.outstanding < 0 ? "red" : "green" },
          ]}
        >
          {vendorInfo.outstanding.toFixed(2)}
        </Text>
      </View>

      {/* Ledger Title */}
      <View style={styles.ledgerHeader}>
        <View></View>
        <Text style={styles.ledgerTitle}>Ledger</Text>
        <Icon name="calendar" size={20} color="#FCA311" />
      </View>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={fetchLedgerData}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Ledger List */}
      <ScrollView>
        {ledgerData.map((section, index) => (
          <View key={index} style={styles.sectionBox}>
            <Text style={styles.dateText}>Date {section.date}</Text>

            {section.transactions.map((txn, i) => (
              <View
                key={i}
                style={[
                  styles.transactionRow,
                  { backgroundColor: i % 2 === 0 ? "#fff8f0" : "#fff" },
                ]}
              >
                {txn.type === "invoice" ? (
                  <>
                    <Text style={styles.txnText}>Invoice</Text>
                    <Text style={styles.txnValue}>{txn.id}</Text>
                    <Text style={styles.txnText}>Amount</Text>
                    <Text style={styles.txnValue}>
                      {txn.amount?.toString() ?? "N/A"}
                    </Text>
                    <Text style={styles.txnText}>Paid</Text>
                    <Text style={styles.txnValue}>{txn.paid.toFixed(2)}</Text>
                    <Text style={styles.txnText}>Balance</Text>
                    <Text
                      style={[
                        styles.txnValue,
                        { color: txn.balance < 0 ? "red" : "green" },
                      ]}
                    >
                      {txn.balance.toFixed(2)}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.txnText}>Transaction</Text>
                    <Text style={styles.txnValue}>{txn.id}</Text>
                    <Text style={styles.txnText}>Type</Text>
                    <Text style={styles.txnValue}>{txn.medium}</Text>
                    <Text style={styles.txnText}>Amount</Text>
                    <Text
                      style={[
                        styles.txnValue,
                        { color: txn.balance < 0 ? "red" : "green" },
                      ]}
                    >
                      {Math.abs(txn.balance).toFixed(2)}
                    </Text>
                    <Text style={styles.txnText}>Balance</Text>
                    <Text
                      style={[
                        styles.txnValue,
                        { color: (txn.amount || 0) < 0 ? "red" : "green" },
                      ]}
                    >
                      {txn.amount?.toFixed(2) || "0.00"}
                    </Text>
                  </>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Add Transaction Button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Transaction</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VendorLedger;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 20,
  },
  backButton: {
    backgroundColor: "#FCA511",
    borderRadius: 20,
    padding: 6,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  editText: {
    fontSize: 12,
    color: "orange",
  },
  vendorInfo: {
    padding: 12,
    marginHorizontal: 10,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  phone: {
    fontSize: 14,
    color: "#333",
  },
  infoIcons: {
    flexDirection: "row",
    gap: 10,
  },
  icon: {
    marginRight: 12,
  },
  outstanding: {
    fontSize: 18,
    color: "red",
    fontWeight: "bold",
  },
  ledgerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#ffe3b3",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FCA311",
  },
  ledgerTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  sectionBox: {
    marginTop: 8,
    padding: 10,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "400",
    marginBottom: 6,
    color: "gray",
    textAlign: "center",
  },
  transactionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  txnText: {
    fontSize: 12,
    color: "#555",
    width: "25%",
  },
  txnValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
    width: "25%",
  },
  addButton: {
    width: "30%",
    alignSelf: "flex-end",
    backgroundColor: "orange",
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    margin: 15,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
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

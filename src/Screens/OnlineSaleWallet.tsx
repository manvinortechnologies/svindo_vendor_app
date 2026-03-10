import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Headerwithback from "./Headerwithback";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import moment from "moment";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Transaction {
  id: string;
  amount: string;
  date: string;
  time: string;
  type: string;
  direction: "up" | "down";
  orderNo?: string;
}

const OnlineSaleWallet = () => {
  const insets = useSafeAreaInsets();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [totalSales, setTotalSales] = useState<number>(0);
  const [totalSettled, setTotalSettled] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchLedgerData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await api.get(API_ROUTES.onlineOrderLedger);

      // Handle both array response and object with results
      const ledgerEntries = Array.isArray(response.data)
        ? response.data
        : response.data?.results || [];

      if (ledgerEntries.length > 0) {
        // Group by order_id to create transactions
        const orderGroups: { [key: number]: any[] } = {};
        ledgerEntries.forEach((entry: any) => {
          const orderId = entry.order_id;
          if (!orderGroups[orderId]) {
            orderGroups[orderId] = [];
          }
          orderGroups[orderId].push(entry);
        });

        // Calculate totals and transform grouped entries to transaction format
        let totalSalesAmount = 0;
        let totalSettledAmount = 0;

        const transformedTransactions: Transaction[] = Object.keys(
          orderGroups,
        ).map((orderId) => {
          const entries = orderGroups[Number(orderId)];
          // Use the first entry's date for the transaction
          const firstEntry = entries[0];
          const date = firstEntry.created_at || new Date().toISOString();
          const formattedDate = moment(date).format("D/M/YYYY");
          const formattedTime = moment(date).format("h:mm A");

          // Calculate total amount for this order
          const orderTotal = entries.reduce((sum, entry) => {
            return sum + parseFloat(entry.amount || "0");
          }, 0);

          // Determine if order is settled (all items settled)
          const allSettled = entries.every(
            (entry) =>
              entry.status === "settled" || entry.status === "completed",
          );

          // Add to totals
          totalSalesAmount += orderTotal;
          if (allSettled) {
            totalSettledAmount += orderTotal;
          }

          return {
            id: `order_${orderId}`,
            amount: `Rs. ${orderTotal.toFixed(2)}`,
            date: formattedDate,
            time: formattedTime,
            type: allSettled ? "Settled" : "Sales",
            direction: allSettled ? "down" : "up",
            orderNo: orderId?.toString(),
          };
        });

        // Sort by date (newest first)
        transformedTransactions.sort((a, b) => {
          const dateA = moment(
            a.date + " " + a.time,
            "D/M/YYYY h:mm A",
          ).toDate();
          const dateB = moment(
            b.date + " " + b.time,
            "D/M/YYYY h:mm A",
          ).toDate();
          return dateB.getTime() - dateA.getTime();
        });

        // Calculate balance (total sales - total settled)
        const balanceAmount = totalSalesAmount - totalSettledAmount;

        setBalance(balanceAmount);
        setTotalSales(totalSalesAmount);
        setTotalSettled(totalSettledAmount);
        setTransactions(transformedTransactions);
      } else {
        // No data
        setBalance(0);
        setTotalSales(0);
        setTotalSettled(0);
        setTransactions([]);
      }
    } catch (error: any) {
      console.error("Error fetching online order ledger:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load sale ledger data. Please try again.",
      });
      setBalance(0);
      setTotalSales(0);
      setTotalSettled(0);
      setTransactions([]);
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchLedgerData();
    }, []),
  );

  const formatCurrency = (amount: number): string => {
    return `Rs. ${amount.toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <Headerwithback title="Sale Ledger" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FCA311" />
          <Text style={styles.loadingText}>Loading ledger data...</Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Headerwithback title="Sale Ledger" />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchLedgerData(true)}
            colors={["#FCA311"]}
            tintColor="#FCA311"
          />
        }
      >
        <View style={styles.balanceBox}>
          <View>
            <Text style={styles.balanceLabel}>Balance</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
          </View>
          <Icon name="wallet" size={40} color="#FCA311" />
        </View>

        {/* Transaction Details */}
        <View
          style={{
            borderWidth: 1,
            borderColor: "#C7C7C7",
            padding: 5,
            paddingVertical: 10,
            borderRadius: 10,
          }}
        >
          {/* Transaction Details Header */}
          <View style={styles.transactionHeader}>
            <Text style={styles.transactionTitle}>Transaction Details</Text>
            {/* <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Till day</Text>
              <Icon name="chevron-down" size={20} />
            </TouchableOpacity> */}
          </View>

          {/* Sales and Settled Boxes */}
          <View style={styles.summaryContainer}>
            <View style={[styles.summaryBox, { backgroundColor: "#E3DFFC" }]}>
              <Text style={styles.summaryLabel}>Sales</Text>
              <Text style={styles.summaryAmount}>
                {formatCurrency(totalSales)}
              </Text>
            </View>
            <View style={[styles.summaryBox, { backgroundColor: "#CFF6CE" }]}>
              <Text style={styles.summaryLabel}>Settled</Text>
              <Text style={styles.summaryAmount}>
                {formatCurrency(totalSettled)}
              </Text>
            </View>
          </View>

          {/* Transaction List */}
          {transactions.length > 0 ? (
            <FlatList
              data={transactions}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingVertical: 10 }}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.transactionItem}>
                  <View>
                    <Text
                      style={[
                        styles.transactionAmount,
                        {
                          color: item.type === "Settled" ? "green" : "#5E35B1",
                        },
                      ]}
                    >
                      {item.amount}
                    </Text>
                    <Text style={styles.transactionType}>{item.type}</Text>
                    {item.orderNo && (
                      <Text style={styles.orderText}>
                        Order no: {item.orderNo}
                      </Text>
                    )}
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.transactionDate}>
                      Date: {item.date}
                    </Text>
                    <Text style={styles.transactionDate}>
                      Time: {item.time}
                    </Text>
                  </View>
                  <Icon
                    name={item.direction === "down" ? "arrow-down" : "arrow-up"}
                    size={30}
                    color="#555"
                    style={{ marginTop: 5 }}
                  />
                </View>
              )}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No transactions found</Text>
            </View>
          )}
        </View>

        {/* Request Withdrawal Button */}
        {/* <TouchableOpacity style={styles.withdrawButton}>
          <Text style={styles.withdrawButtonText}>Request Withdrawal</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 15,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  balanceBox: {
    flexDirection: "row",
    backgroundColor: "#FBE4BF",
    borderRadius: 10,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 16,
  },
  balanceLabel: {
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
  },
  balanceAmount: {
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FCA311",
  },
  filterButton: {
    flexDirection: "row",
    gap: 5,
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
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryBox: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  summaryAmount: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
    color: "#000",
  },
  transactionItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "700",
  },
  transactionType: {
    fontSize: 12,
    color: "#000",
    fontWeight: "500",
  },
  orderText: {
    fontSize: 12,
    color: "#000",
    fontWeight: "500",
  },
  transactionDate: {
    fontSize: 12,
    color: "#000",
    fontWeight: "500",
    textAlign: "right",
  },
  withdrawButton: {
    width: "40%",
    alignSelf: "flex-end",
    backgroundColor: "#169729",
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 30,
  },
  withdrawButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
  },
});

export default OnlineSaleWallet;

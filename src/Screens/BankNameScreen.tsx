import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // For icons
import CustomHeader from "../CommonComponent/CustomHeader";

const BankNameScreen = () => {
  const transactions = [
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
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <CustomHeader title="Bank Name" />

      {/* Ledger */}
      <View style={styles.ledger}>
        <View></View>
        <Text style={styles.ledgerText}>Ledger</Text>
        <Text style={styles.balanceText}>9500.00</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {transactions.map((item) => (
          <View key={item.id} style={styles.transactionCard}>
            {/* Date */}
            <Text style={styles.date}>Date {item.date}</Text>

            {/* Transaction Row */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Transaction</Text>
                <Text>{item.type}</Text>
              </View>

              <View style={styles.col}>
                <Text style={styles.label}>Detail</Text>
                <Text>{item.detail}</Text>
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
                <Text>{item.balance.toFixed(2)}</Text>
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
  ledgerText: { fontWeight: "bold", fontSize: 16 },
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
  label: { fontSize: 12, fontWeight: "bold", marginBottom: 3 },
  amount: { fontWeight: "bold" },
});

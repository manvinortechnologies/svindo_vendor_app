import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ledgerData = [
  {
    date: "10-11-2025",
    transactions: [
      {
        type: "invoice",
        id: "INV-1234",
        amount: 10000,
        paid: 10000,
        balance: 10000,
      },
      {
        type: "payment",
        id: "Payment ID",
        medium: "Cash",
        paid: 10000,
        balance: 10000,
      },
    ],
  },
  {
    date: "09-11-2025",
    transactions: [
      {
        type: "invoice",
        id: "INV-1234",
        amount: 10000,
        paid: 10000,
        balance: 10000,
      },
      {
        type: "payment",
        id: "Payment ID",
        medium: "Cash",
        paid: 10000,
        balance: 10000,
      },
    ],
  },
];

const VendorLedger = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton}>
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
          <Text style={styles.vendorName}>vendor Name</Text>
          <View style={styles.infoIcons}>
            <Icon name="call" size={20} color="black" style={styles.icon} />
            <Icon name="mail" size={20} color="black" style={styles.icon} />
            <Icon name="logo-whatsapp" size={20} color="green" />
          </View>
        </View>
        <Text style={styles.phone}>+91 9999999999</Text>

        <Text style={styles.outstanding}>200.00</Text>
      </View>

      {/* Ledger Title */}
      <View style={styles.ledgerHeader}>
        <View></View>
        <Text style={styles.ledgerTitle}>Ledger</Text>
        <Icon name="calendar" size={20} color="#FCA311" />
      </View>

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
                    <Text style={styles.txnValue}>
                      {txn.balance.toFixed(2)}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.txnText}>Payment In</Text>
                    <Text style={styles.txnValue}>{txn.id}</Text>
                    <Text style={styles.txnText}>Medium</Text>
                    <Text style={styles.txnValue}>{txn.medium}</Text>
                    <Text style={styles.txnText}>Paid</Text>
                    <Text style={styles.txnValue}>{txn.paid.toFixed(2)}</Text>
                    <Text style={styles.txnText}>Balance</Text>
                    <Text style={styles.txnValue}>
                      {txn.balance.toFixed(2)}
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
});

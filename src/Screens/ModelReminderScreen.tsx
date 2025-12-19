import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import CustomHeader from "../CommonComponent/CustomHeader";
import { SafeAreaView } from "react-native-safe-area-context";

const ModelReminderScreen = () => {
  const reminderData = {
    billing: "Raigun Enterprise",
    creditType: "Credit",
    customerDetails: "Party Details here",
    saleType: "Wholesale",
    dueDate: "11/10/2024",
    items: [
      {
        id: "1",
        name: "White Shirt XL Size, Blue Color, Denim Brand...",
        qty: 2,
        price: 500,
        amount: 1000,
      },
      {
        id: "2",
        name: "White Shirt XL Size, Blue Color, Denim Brand...",
        qty: 2,
        price: 500,
        amount: 1000,
      },
    ],
    discount: 50,
    totalItems: 1000,
    totalTax: 500,
    totalAmount: 1500,
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <CustomHeader title="Reminder" />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Billing Info */}
        <View style={styles.billingContainer}>
          <Text style={styles.billingText}>
            Billing - {reminderData.billing}
          </Text>
          <View style={styles.creditTag}>
            <Text style={styles.creditText}>{reminderData.creditType}</Text>
          </View>
        </View>

        {/* Customer Details */}
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Customer Details</Text>
          <Text style={styles.detailValue}>{reminderData.customerDetails}</Text>
          <Text style={styles.detailLabel}>
            Sale type - {reminderData.saleType}
          </Text>
          <Text style={styles.detailLabel}>
            Due date - {reminderData.dueDate}
          </Text>
        </View>

        {/* Items Table */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>S.No.</Text>
          <Text style={[styles.tableHeaderText, { flex: 2 }]}>Item</Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>Quantity</Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>Price</Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>Amount</Text>
        </View>

        <FlatList
          data={reminderData.items}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.tableRow}>
              <Text style={[styles.tableText, { flex: 0.5 }]}>{index + 1}</Text>
              <Text style={[styles.tableText, { flex: 2 }]}>{item.name}</Text>
              <Text style={[styles.tableText, { flex: 1 }]}>{item.qty}</Text>
              <Text style={[styles.tableText, { flex: 1 }]}>
                Rs {item.price.toFixed(2)}
              </Text>
              <Text style={[styles.tableText, { flex: 1 }]}>
                {item.amount.toFixed(2)}
              </Text>
            </View>
          )}
        />

        {/* Totals */}
        <View style={styles.totalBox}>
          {/* Discount Row */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Discount</Text>
            <Text style={styles.totalLabel}>5%</Text>
            <Text style={styles.totalValue}>
              Rs {reminderData.discount.toFixed(2)}
            </Text>
          </View>

          {/* Total Items */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Items</Text>
            <Text style={styles.totalBold}>
              Rs {reminderData.totalItems.toFixed(2)}
            </Text>
          </View>

          {/* Total Tax */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Tax</Text>
            <Text style={styles.totalBold}>
              Rs {reminderData.totalTax.toFixed(2)}
            </Text>
          </View>

          {/* Total Amount */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>
              Rs {reminderData.totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Share Button */}
      <TouchableOpacity style={styles.shareButton}>
        <Icon name="logo-whatsapp" size={22} color="#25D366" />
        <Text style={styles.shareText}>Share Reminder</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ModelReminderScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  billingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
  billingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  creditTag: {
    backgroundColor: "#f5a623",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  creditText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  detailBox: {
    paddingHorizontal: 15,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  detailValue: {
    fontSize: 13,
    color: "gray",
    marginBottom: 5,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#00d0ffff",
    padding: 8,
    marginTop: 20,
    marginHorizontal: 10,
  },
  tableHeaderText: { fontSize: 13, fontWeight: "500", color: "#fff" },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginHorizontal: 10,
  },
  tableText: { fontSize: 12, color: "#000", fontWeight: "500" },
  totalBox: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 20,
    marginHorizontal: 15,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 13,
    color: "#4a5a7d",
  },
  totalValue: {
    fontSize: 13,
    color: "#000",
  },
  totalBold: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#000",
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "orange",
  },

  shareButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  shareText: { color: "#000", marginLeft: 8, fontWeight: "600" },
});

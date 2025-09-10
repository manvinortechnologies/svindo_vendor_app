import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  FlatList,
  Text,
} from "react-native";
import Header from "./Header";
import Bottomnavigation from "./Bottomnavigation";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Headerwithback from "./Headerwithback";

const transactions = [
  {
    id: "1",
    amount: "Rs. 500",
    date: "4/7/2025",
    time: "11:00 AM",
    type: "Withdrawn",
    campaign: "Campaign no: 12345",
    direction: "down",
  },
  {
    id: "2",
    amount: "Rs. 1000",
    date: "4/27/2025",
    time: "11:00 AM",
    type: "Sales",
    orderNo: "SVINDO1234",
    direction: "up",
  },
];

const AdWallet = () => {
  return (
    <View style={styles.container}>
      <Headerwithback title="Ads wallet" />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.balanceBox}>
          <View>
            <Text style={styles.balanceLabel}>Balance</Text>
            <Text style={styles.balanceAmount}>Rs. 1000.00</Text>
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
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Till day</Text>
              <Icon name="chevron-down" size={20} />
            </TouchableOpacity>
          </View>

          {/* Sales and Withdrawn Boxes */}
          <View style={styles.summaryContainer}>
            <View style={[styles.summaryBox, { backgroundColor: "#E3DFFC" }]}>
              <Text style={styles.summaryLabel}>Total Amount</Text>
              <Text style={styles.summaryAmount}>Rs.2000.00</Text>
            </View>
            <View style={[styles.summaryBox, { backgroundColor: "#CFF6CE" }]}>
              <Text style={styles.summaryLabel}>Ad Run</Text>
              <Text style={styles.summaryAmount}>Rs.1000.00</Text>
            </View>
          </View>

          {/* Transaction List */}
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 10 }}
            renderItem={({ item }) => (
              <View style={styles.transactionItem}>
                <View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      {
                        color: item.type === "Withdrawn" ? "green" : "#5E35B1",
                      },
                    ]}
                  >
                    {item.amount}
                  </Text>
                  <Text style={styles.transactionType}>{item.campaign}</Text>
                  {item.orderNo && (
                    <Text style={styles.orderText}>Addd to wallet</Text>
                  )}
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.transactionDate}>Date: {item.date}</Text>
                  <Text style={styles.transactionDate}>Time: {item.time}</Text>
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
        </View>

        {/* Request Withdrawal Button */}
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Amount</Text>
        </TouchableOpacity>
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
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  summaryAmount: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
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
    marginBottom: 10,
  },
  addButton: {
    width: "30%",
    alignSelf: "flex-end",
    backgroundColor: "#169729",
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 30,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default AdWallet;

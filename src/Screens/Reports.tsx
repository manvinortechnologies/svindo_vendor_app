import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Headerwithback from "./Headerwithback";
import Bottomnavigation from "./Bottomnavigation";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const reportData = [
  {
    title: "Transaction",
    reports: [
      "Sale Report",
      "Purchase Report",
      "Day Book",
      "Profit & Loss",
      "All Transactions Report",
    ],
  },
  {
    title: "Party Reports",
    reports: ["Party Statement"],
  },
  {
    title: "Item/Stock Reports",
    reports: ["Stock Summary Report", "Stock Detail Report"],
  },
  {
    title: "GST Reports",
    reports: ["GSTR-1"],
  },
  {
    title: "Expense Reports",
    reports: ["Expense Transaction Report"],
  },
];

const Reports = () => {
  const navigation = useNavigation();

  const handleReportPress = (reportName: string) => {
    // Map report names to screen names here
    const routeMap: { [key: string]: string } = {
      "Sale Report": "SaleReportScreen",
      "Purchase Report": "PurchaseReportScreen",
      "Day Book": "DayBookScreen",
      "Profit & Loss": "ProfitLossScreen",
      "All Transactions Report": "AllTransactionsScreen",
      "Party Statement": "PartyStatementScreen",
      "Stock Summary Report": "StockSummaryScreen",
      "Stock Detail Report": "StockDetailScreen",
      "GSTR-1": "GSTR1Screen",
      "Expense Transaction Report": "ExpenseTransactionScreen",
    };

    const routeName = routeMap[reportName];
    if (routeName) {
      navigation.navigate(routeName as never); // Cast needed for TS
    } else {
      console.warn("No screen found for:", reportName);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Headerwithback
        title="Reports"
        rightIcons={[
          <TouchableOpacity>
            <Feather name="search" size={20} color="#000" />
          </TouchableOpacity>,
          // <TouchableOpacity >
          //   <Feather name="settings" size={20} color="#000" />
          // </TouchableOpacity>,
        ]}
      />
      <ScrollView contentContainerStyle={styles.containercard}>
        {reportData.map((section, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.reports.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleReportPress(item)}
              >
                <Text style={styles.reportItem}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containercard: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#FFF7F0",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FCA311",
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: "#000",
  },
  reportItem: {
    fontSize: 14,
    marginBottom: 4,
    color: "#222",
  },
});

export default Reports;

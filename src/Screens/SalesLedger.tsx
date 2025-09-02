import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import MainContainer from "../CommonComponent/MainContainer";
import Headerwithback from "./Headerwithback";
import Loading from "../CommonComponent/Loading";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import { useNavigation } from "@react-navigation/native";
import { HomeNavigation } from "../constants/app-routes.constants";

interface SalesItem {
  product: number;
  quantity: number;
  price: string;
  amount: number;
  product_details: {
    name: string;
    brand_name: string;
    color: string;
    size: string;
  };
}

interface SalesEntry {
  id: number;
  payment_method: string;
  customer: number;
  customer_detials: {
    name: string;
    company_name: string;
  };
  discount_percentage: string;
  advance_amount: string;
  balance_amount: string;
  credit_date: string;
  total_amount: string;
  items: SalesItem[];
  created_at?: string;
}

const SalesLedger = () => {
  const navigation = useNavigation();

  const [salesData, setSalesData] = useState<SalesEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const groupedSales = salesData.reduce((groups, sale) => {
    const date = formatDate(sale.credit_date || sale.created_at || "");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(sale);
    return groups;
  }, {} as Record<string, SalesEntry[]>);

  const totalBalance = salesData.reduce(
    (sum, sale) => sum + parseFloat(sale.balance_amount || "0"),
    0
  );

  const renderSalesEntry = ({ item }: { item: SalesEntry }) => {
    const totalItems = item.items.reduce((sum, item) => sum + item.quantity, 0);
    const orderType =
      item.payment_method === "cash" ? "Cash Sale" : "Credit Sale";
    const status =
      parseFloat(item.balance_amount || "0") > 0 ? "Pending" : "Paid";

    return (
      <View style={styles.entryContainer}>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.tableHeader}>Invoice</Text>
            <Text style={styles.tableValue}>INV-{item.id}</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableHeader}>Amount</Text>
            <Text style={styles.tableValue}>
              ₹{parseFloat(item.total_amount).toFixed(2)}
            </Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableHeader}>Paid</Text>
            <Text style={styles.tableValue}>
              ₹
              {(
                parseFloat(item.total_amount) -
                parseFloat(item.balance_amount || "0")
              ).toFixed(2)}
            </Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableHeader}>Balance Amount</Text>
            <Text style={styles.tableValue}>
              ₹{parseFloat(item.balance_amount || "0").toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>{item.customer_detials.name}</Text>
          <Text style={styles.detailText}>Qty: {totalItems}</Text>
          <Text style={styles.detailText}>{orderType}</Text>
          <Text
            style={[
              styles.statusText,
              { color: status === "Paid" ? "#4CAF50" : "#F44336" },
            ]}
          >
            {status}
          </Text>
        </View>
      </View>
    );
  };

  const renderDateGroup = ({ item: date }: { item: string }) => (
    <View style={styles.dateGroup}>
      <Text style={styles.dateHeader}>{date}</Text>
      <View style={styles.tableHeaders}>
        <Text style={styles.tableHeader}>Invoice</Text>
        <Text style={styles.tableHeader}>Amount</Text>
        <Text style={styles.tableHeader}>Paid</Text>
        <Text style={styles.tableHeader}>Balance Amount</Text>
      </View>
      {groupedSales[date].map((sale) => (
        <View key={sale.id}>{renderSalesEntry({ item: sale })}</View>
      ))}
    </View>
  );

  return (
    <MainContainer>
      <View style={styles.container}>
        <Headerwithback title="Sales" />
        <Loading visible={isLoading} />

        {/* Ledger Summary Banner */}
        <View style={styles.ledgerBanner}>
          <Text style={styles.ledgerText}>Ledger</Text>
          <Text style={styles.balanceText}>₹{totalBalance.toFixed(2)}</Text>
        </View>

        {/* Sales Entries */}
        <FlatList
          data={Object.keys(groupedSales)}
          renderItem={renderDateGroup}
          keyExtractor={(date) => date}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />

        {/* Add Sales Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate(HomeNavigation.SALE_POS)}
        >
          <Text style={styles.addButtonText}>Add Sales</Text>
        </TouchableOpacity>
      </View>
    </MainContainer>
  );
};

export default SalesLedger;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  ledgerBanner: {
    backgroundColor: "#FFF3E0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
  },
  ledgerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  balanceText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4CAF50",
  },
  list: {
    flex: 1,
    marginTop: 12,
  },
  dateGroup: {
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
  },
  tableHeaders: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  tableHeader: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
  },
  entryContainer: {
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  tableCell: {
    flex: 1,
    alignItems: "center",
  },
  tableValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginTop: 4,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  detailText: {
    fontSize: 12,
    color: "#666",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#FCA311",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    margin: 16,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

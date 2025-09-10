import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MainContainer from "../CommonComponent/MainContainer";
import Headerwithback from "./Headerwithback";
import { Expense } from "../type/common";
import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";
import { useIsFocused } from "@react-navigation/native";
import { API_ROUTES } from "../constants/api-routes.constants";
import { ScaledSheet } from "react-native-size-matters";

const ExpensesScreen = ({ navigation }: any) => {
  const isFocused = useIsFocused();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expensesList, setExpenseseList] = useState<Expense[]>([]);
  const [groupedExpenses, setGroupedExpenses] = useState<{
    [key: string]: Expense[];
  }>({});
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    getAllExpenses();
  }, [isFocused]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  };

  const groupExpensesByDate = (expenses: Expense[]) => {
    const grouped: { [key: string]: Expense[] } = {};

    expenses.forEach((expense) => {
      const date = expense.expense_date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(expense);
    });

    // Sort dates in descending order (newest first)
    const sortedDates = Object.keys(grouped).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    const sortedGrouped: { [key: string]: Expense[] } = {};
    sortedDates.forEach((date) => {
      sortedGrouped[date] = grouped[date];
    });

    return sortedGrouped;
  };

  const getAllExpenses = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(API_ROUTES.expense);
      if (res.data.length > 0) {
        setExpenseseList(res.data);
        const grouped = groupExpensesByDate(res.data);
        setGroupedExpenses(grouped);

        let temptotal = 0;
        res.data.map((item: Expense) => {
          temptotal = temptotal + parseInt(item.amount);
        });
        setTotal(temptotal);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  const renderExpenseItem = (item: Expense) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.expenseCard}
        onPress={() => {
          navigation.navigate("ExpensesDetailScreen", { expenseData: item });
        }}
      >
        <View style={styles.expenseHeader}>
          <Text style={styles.cellText}>
            {(item as any).category_details?.name || "Category"}
          </Text>
          <Text style={styles.cellText}>
            {(item as any).payment_method?.toUpperCase() ||
              item.payment_type?.toUpperCase() ||
              "CASH"}
          </Text>
          <Text style={styles.cellText}>{item.payment_date}</Text>
          <Text style={styles.pendingText}>
            {item.is_paid ? "Paid" : "Pending"}
          </Text>
        </View>

        <View style={styles.expenseRow}>
          <Text style={styles.descText} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.descText} numberOfLines={2}>
            {item.amount}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDateSection = (date: string, expenses: Expense[]) => {
    return (
      <View key={date} style={styles.dateSection}>
        <Text style={styles.dateText}>{formatDate(date)}</Text>
        {expenses.map((expense) => renderExpenseItem(expense))}
      </View>
    );
  };

  return (
    <MainContainer>
      <View style={styles.container}>
        <Headerwithback
          title="Expenses"
          rightIcons={[
            <Icon name="calendar-outline" size={22} color="#FCA311" />,
          ]}
        />
        {/* Header */}
        {/* <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expenses</Text>
        <TouchableOpacity style={styles.calendarButton}>
          <Icon name="calendar-outline" size={22} color="#FCA311" />
        </TouchableOpacity>
      </View> */}

        {/* Ledger */}
        <View style={styles.ledger}>
          <Text style={styles.ledgerText}></Text>
          <Text style={[styles.ledgerText]}>Ledger</Text>
          <Text style={styles.ledgerAmount}>{total}</Text>
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          {Object.entries(groupedExpenses).map(([date, expenses]) =>
            renderDateSection(date, expenses)
          )}
        </ScrollView>

        {/* Add Expense Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            navigation.navigate("Expenses");
          }}
        >
          <Text style={styles.addText}>Add Expenses</Text>
        </TouchableOpacity>
      </View>
      <Loading visible={isLoading} />
    </MainContainer>
  );
};

export default ExpensesScreen;
const { width, height } = Dimensions.get("window");

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    paddingTop: 0,
  },
  backButton: {
    backgroundColor: "#FCA311",
    padding: 6,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  calendarButton: {
    padding: 6,
    borderRadius: 20,
  },
  ledger: {
    backgroundColor: "#FFEBCB",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  ledgerText: {
    fontWeight: "bold",
    fontSize: "12@s",
    color: "#000",
  },
  ledgerAmount: {
    color: "green",
    fontWeight: "bold",
  },
  scrollContainer: {
    paddingHorizontal: 15,
    // paddingBottom: 80,
  },
  dateSection: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  dateText: {
    marginTop: "8@s",
    // marginBottom: 8,
    fontSize: "12@s",
    fontWeight: "600",
    color: "#000",
    alignSelf: "center",
    // backgroundColor: "#F5F5F5",
    // paddingHorizontal: 12,
    // paddingVertical: 6,
    borderRadius: 12,
  },
  expenseCard: {
    backgroundColor: "#FFF6EF",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  expenseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    height: height / 30,
  },
  cellText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
  },
  expenseRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  descText: {
    flex: 1,
    fontSize: 13,
    color: "#555",
    width: "33%",
  },
  pendingText: {
    color: "red",
    fontWeight: "600",
    fontSize: 13,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#FCA311",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

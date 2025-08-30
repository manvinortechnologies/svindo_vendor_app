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

const ExpensesScreen = ({ navigation }: any) => {
  const isFocused = useIsFocused();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expensesList, setExpenseseList] = useState<Expense[]>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    getAllExpenses();
  }, [isFocused]);

  const getAllExpenses = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(API_ROUTES.expense);
      console.log("res--->", res);
      if (res.data.length > 0) {
        setExpenseseList(res.data);
        let temptotal = 0;
        res.data.map((item: Expense) => {
          temptotal = temptotal + parseInt(item.amount);
        });
        console.log("total --->", temptotal);
        setTotal(temptotal);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  const renderExpenese = ({
    item,
    index,
  }: {
    item: Expense;
    index: number;
  }) => {
    return (
      <View style={styles.scrollContainer}>
        {/* Date Section */}
        <Text style={styles.dateText}>Date {item.expense_date}</Text>

        {/* Expense Card */}
        <TouchableOpacity
          style={styles.expenseCard}
          onPress={() => {
            navigation.navigate("ExpensesDetailScreen");
          }}
        >
          <View style={styles.expenseHeader}>
            <Text style={styles.cellText}>Category</Text>
            <Text style={styles.cellText}>Cash</Text>
            <Text style={styles.cellText}>Payment date</Text>
            <Text style={styles.pendingText}>Pending</Text>
          </View>

          <View style={styles.expenseRow}>
            <Text style={styles.descText} numberOfLines={2}>
              {item.description}
            </Text>

            <Text style={styles.descText}>{item.amount}</Text>
            <Text style={styles.descText}>{item.payment_date}</Text>
            <Text style={[styles.descText, { textAlign: "right" }]}>
              {item.is_paid ? "No" : "Yes"}
            </Text>
          </View>
        </TouchableOpacity>
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
          <Text style={[styles.ledgerText, { marginLeft: 50 }]}>Ledger</Text>
          <Text style={styles.ledgerAmount}>{total}</Text>
        </View>
        <FlatList
          data={expensesList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderExpenese}
          contentContainerStyle={{ paddingBottom: 80 }}
        />

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

const styles = StyleSheet.create({
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
  },
  ledgerAmount: {
    color: "green",
    fontWeight: "bold",
  },
  scrollContainer: {
    paddingHorizontal: 15,
    // paddingBottom: 80,
  },
  dateText: {
    marginTop: 15,
    fontSize: 13,
    fontWeight: "500",
    color: "#404040",
    alignSelf: "center",
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

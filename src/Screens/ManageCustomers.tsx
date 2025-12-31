import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Headerwithback from "./Headerwithback";
import Bottomnavigation from "./Bottomnavigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Loading from "../CommonComponent/Loading";
import { Customer } from "../type/Customers";
import api from "../services/api/api";
import { ScaledSheet } from "react-native-size-matters";

type RootStackParamList = {
  ManageCustomer: undefined;
  AddCustomer: undefined;
};

export type SecurityScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ManageCustomer"
>;

const customers = [
  {
    id: "1",
    name: "Raigun Enterprise",
    phone: "9876543210",
    email: "Raigunenterprises@gmail.com",
    closingBalance: "Rs 0",
    initials: "RE",
  },
];

const ManageCustomers = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customersList, setCustomersList] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalPendingAmount, setTotalPendingAmount] = useState<number>(0);
  useFocusEffect(
    useCallback(() => {
      getCustomerData();
    }, [])
  );

  const getCustomerData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("vendor/customer/");
      setCustomersList(res.data);
      setFilteredCustomers(res.data); // initially show all
      setTotalPendingAmount(
        res.data.reduce(
          (acc: number, customer: Customer) => acc + Number(customer.balance),
          0
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (customersList) {
      const filtered = customersList.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.contact.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customersList]);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Headerwithback title="Manage Customers" />

      {/* Search and Add */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Icon name="search" size={20} color="#aaa" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search customer by name or phone"
            placeholderTextColor="#888"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        {/* <TouchableOpacity onPress={() => navigation.navigate("AddCustomer")}>
            <Text style={styles.addText}>+ Add New Customer</Text>
          </TouchableOpacity> */}
      </View>

      {/* You Collect & Pay */}
      <View style={styles.summaryContainer}>
        <TouchableOpacity style={styles.summaryBox}>
          <Text style={styles.summaryText}>
            Pending Amount: ₹{totalPendingAmount}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Table Headers */}
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>Details</Text>
        <Text style={styles.headerText}>Credit Balance</Text>
      </View>

      {/* Customer List */}
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.customerRow}
            onPress={() =>
              navigation.navigate("CustomerLedger", { customer: item })
            }
          >
            <View style={styles.detailsColumn}>
              {/* <View style={styles.detailsRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {item.name?.slice(0, 2)}
                    </Text>
                    </View>
                </View> */}
              <View style={styles.detailsTextContainer}>
                <Text style={styles.nameText}>{item.name}</Text>
                <Text style={styles.contactText}>{item.contact}</Text>
                <Text style={styles.emailText}>{item.company_name}</Text>
              </View>
            </View>
            <View style={styles.balanceColumn}>
              <Text style={styles.balanceText}>{item.balance}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <Text style={{ fontSize: 16, color: "#888" }}>
                No customers found.
              </Text>
            </View>
          ) : null
        }
      />

      {/* FAB: Add New Customer */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("AddCustomer")}
      >
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>

      <Loading visible={isLoading} />
    </View>
  );
};

export default ManageCustomers;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FCA311",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  searchBox: {
    flexDirection: "row",
    backgroundColor: "#f3f3f3",
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    // width: "80%",
  },
  searchInput: {
    flex: 1,
    padding: 8,
    marginLeft: 6,
  },
  addText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 12,
    textAlign: "right",
    width: "60%",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  summaryBox: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 8,
    minWidth: "40%",
    alignItems: "center",
  },
  summaryText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f3f3",
    paddingHorizontal: "10@s",
    paddingVertical: 8,
    justifyContent: "space-between",
  },
  headerText: {
    // flex: 1,
    fontWeight: "700",
    fontSize: 13,
    color: "#000",
    textAlign: "center",
  },
  customerRow: {
    flexDirection: "row",
    paddingHorizontal: "10@s",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailsColumn: {
    flex: 1,
    flexDirection: "row",
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailsTextContainer: {
    flex: 1,
    // marginLeft: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FCA311",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  nameText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  contactText: {
    fontSize: 12,
    color: "#333",
    marginBottom: 2,
  },
  emailText: {
    fontSize: 12,
    color: "#666",
  },
  balanceColumn: {
    width: "30%",
    alignItems: "center",
  },
  balanceText: {
    textAlign: "right",
    fontWeight: "600",
    fontSize: 13,
    color: "green",
  },
});

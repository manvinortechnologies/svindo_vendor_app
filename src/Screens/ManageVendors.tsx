import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/MaterialIcons";
import Headerwithback from "./Headerwithback";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";
import { Vendor } from "../type/Vendor";
import { API_ROUTES } from "../constants/api-routes.constants";

type RootStackParamList = {
  ManageVendor: undefined;
  AddVendor: undefined;
};

export type SecurityScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ManageVendor"
>;

const ManageVendors = ({ navigation }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [vendorList, setVendorList] = useState<Vendor[]>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [totalPendingAmount, setTotalPendingAmount] = useState<number>(0);
  useFocusEffect(
    useCallback(() => {
      getVendeorData();
    }, [])
  );
  const getVendeorData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(API_ROUTES.vendorList);
      setVendorList(res.data);
      setFilteredVendors(res.data); // initialize filtered data
      setTotalPendingAmount(
        res.data.reduce(
          (acc: number, vendor: Vendor) => acc + vendor.balance,
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
    if (vendorList) {
      const filtered = vendorList.filter(
        (vendor) =>
          vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.contact.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVendors(filtered);
    }
  }, [searchTerm, vendorList]);

  return (
    <SafeAreaView style={styles.container}>
      <Headerwithback title="Manage Venders" />

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
        {/* <TouchableOpacity onPress={() => navigation.navigate("AddVendor")}>
            <Text style={styles.addText}>+ Add New Vendors</Text>
          </TouchableOpacity> */}
      </View>

      {/* You Collect & Pay */}
      <View style={styles.summaryContainer}>
        <TouchableOpacity style={styles.summaryBox}>
          <Text style={styles.summaryText}>
            You Give: ₹{totalPendingAmount}
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.summaryBox}>
            <Text style={styles.summaryText}>You Pay: ₹0</Text>
          </TouchableOpacity> */}
      </View>

      {/* Table Headers */}
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>Details</Text>
        <Text style={styles.headerText}>Closing Balance</Text>
      </View>

      {/* Customer List */}
      <FlatList
        data={filteredVendors}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.customerRow}
            onPress={() =>
              navigation.navigate("VendorLedger", { vendor: item })
            }
          >
            <View style={styles.detailsColumn}>
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
                No Vendor found.
              </Text>
            </View>
          ) : null
        }
      />
      {/* FAB: Add New Vendor */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("AddVendor")}
      >
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>
      <Loading visible={isLoading} />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
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
    width: "60%",
    textAlign: "right",
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "space-between",
  },
  headerText: {
    fontWeight: "700",
    fontSize: 13,
    color: "#000",
  },
  customerRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
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
  detailsTextContainer: {
    flex: 1,
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
    textAlign: "center",
    fontWeight: "600",
    fontSize: 13,
    color: "green",
  },
});

export default ManageVendors;

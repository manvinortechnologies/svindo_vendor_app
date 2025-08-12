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
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import Headerwithback from "./Headerwithback";
import Bottomnavigation from "./Bottomnavigation";
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

  useFocusEffect(
    useCallback(() => {
      // Your API call function
      getVendeorData();

      // Optional: clean-up function
      return () => {
        // cleanup logic if needed
      };
    }, []) // empty dependency so it triggers every time the screen is focused
  );
  const getVendeorData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(API_ROUTES.vendorList);
      console.log("res===>", res);
      setVendorList(res.data);
      setFilteredVendors(res.data); // initialize filtered data
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
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
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
          <TouchableOpacity onPress={() => navigation.navigate("AddVendor")}>
            <Text style={styles.addText}>+ Add New Vendors</Text>
          </TouchableOpacity>
        </View>

        {/* You Collect & Pay */}
        <View style={styles.summaryContainer}>
          <TouchableOpacity style={styles.summaryBox}>
            <Text style={styles.summaryText}>You Collect: ₹0</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.summaryBox}>
            <Text style={styles.summaryText}>You Pay: ₹0</Text>
          </TouchableOpacity> */}
        </View>

        {/* Table Headers */}
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Name</Text>
          <Text style={styles.headerText}>Contact Info</Text>
          <Text style={styles.headerText}>Closing Balance</Text>
        </View>

        {/* Customer List */}
        <FlatList
          data={filteredVendors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.customerRow}>
              <View style={styles.nameColumn}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.name.slice(0, 2)}</Text>
                </View>
                <Text numberOfLines={2} style={styles.nameText}>
                  {item.name}
                </Text>
              </View>
              <View style={styles.contactColumn}>
                <Text style={styles.contactText}>{item.contact}</Text>
                <Text style={styles.contactText}>{item.email}</Text>
              </View>
              <View style={{ width: "30%", alignItems: "center" }}>
                <Text style={styles.balanceText}>{item.balance}</Text>
              </View>
            </View>
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
        <Loading visible={isLoading} />

        <Bottomnavigation />
      </SafeAreaView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    width: "80%",
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
    flex: 1,
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
  },
  nameColumn: {
    flexDirection: "row",
    alignItems: "center",
    width: "30%",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FCA311",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
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
  },
  contactColumn: {
    flex: 1,
    textAlign: "right",
    width: "30%",
  },
  contactText: {
    fontSize: 12,
    color: "#333",
  },
  balanceText: {
    flex: 1,
    textAlign: "right",
    fontWeight: "600",
    fontSize: 13,
    color: "green",
  },
});

export default ManageVendors;

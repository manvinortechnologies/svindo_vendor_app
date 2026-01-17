import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MainContainer from "../CommonComponent/MainContainer";
import CustomHeader from "../CommonComponent/CustomHeader";
import Loading from "../CommonComponent/Loading";
import { Company } from "../type/Company";
import api from "../services/api/api";
import { ScaledSheet } from "react-native-size-matters";
import { API_ROUTES } from "../constants/api-routes.constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// interface Company {
//   id: number;
//   name: string;
//   gstin: string;
// }

// const companies: Company[] = [
//   { id: 1, name: 'Raigun enterprise', gstin: '123jkghfhsk' },
// ];

const ManageCompanies = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [companiesList, setCompaniesLst] = useState<Company[]>();

  useEffect(() => {
    getAllCompanyData();
  }, []);

  const getAllCompanyData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(API_ROUTES.companyProfle);
      if (res.data) {
        setCompaniesLst(res.data);
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleAdd = () => {
    navigation.navigate("CompanyProfile");
    // Handle add company
  };

  const handleEdit = (id: number) => {
    // Handle edit company
    navigation.navigate("CompanyProfile", { id: id });
  };

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      const apiEnd = `${API_ROUTES.companyProfle}/${id}/`;
      const res = await api.delete(apiEnd);

      // Refresh the list after successful deletion
      await getAllCompanyData();
    } catch (error) {
      console.error("Error deleting company:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCompany = ({ item }: { item: Company }) => (
    <View style={styles.companyCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.companyName}>{item.company_name}</Text>
        <Text style={styles.gstin}>GSTIN - {item.gstin}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleEdit(item.id)}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
        {/* <Text style={styles.separator}>|</Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* Header */}
      <CustomHeader
        title="Manage Companies"
        rightIcon={
          !companiesList?.length ? (
            <TouchableOpacity
              onPress={handleAdd}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Ionicons name="add" size={20} color="#FCA511" />
              <Text
                style={{ color: "#FCA511", fontWeight: "700", marginLeft: 4 }}
              >
                Add
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />

      {/* List */}
      <FlatList
        data={companiesList}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={renderCompany}
        ListEmptyComponent={
          <>
            <Text style={{ alignSelf: "center", color: "#777" }}>
              List is Empty
            </Text>
          </>
        }
      />
      <Loading visible={isLoading} />
    </View>
  );
};

export default ManageCompanies;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  backButton: {
    backgroundColor: "#FCA511",
    borderRadius: 20,
    padding: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
    textAlign: "center",
    marginRight: 32,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addText: {
    color: "#FCA511",
    fontWeight: "600",
    marginLeft: 4,
  },
  companyCard: {
    backgroundColor: "#FFF8F2",
    borderColor: "#FCA511",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  companyName: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 14,
  },
  gstin: {
    color: "#727272",
    fontSize: 12,
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  editText: {
    color: "#6E6E6E",
    fontSize: "12@s",
    fontWeight: "600",
  },
  deleteText: {
    color: "#FF3B30",
    fontSize: "12@s",
    fontWeight: "600",
  },
  separator: {
    marginHorizontal: 6,
    color: "#ccc",
  },
});

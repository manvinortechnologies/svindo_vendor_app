import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomModal from "./CustomModal";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { HomeNavigation } from "../constants/app-routes.constants";

const { width, height } = Dimensions.get("window");

type CompanyOption = {
  id: number | string;
  name: string;
  [key: string]: any;
};

interface CompanySelectModalProps {
  options?: CompanyOption[];
  onSelect: (item: CompanyOption) => void;
  selectedValue?: CompanyOption;
  onClose: () => void;
  visible: boolean;
  title: string;
}

export default function CompanySelectModal({
  options = [],
  onSelect,
  selectedValue,
  onClose,
  visible,
  title,
}: CompanySelectModalProps) {
  const [search, setSearch] = useState<string>("");
  const navigation = useNavigation();

  const filteredOptions = options.filter((item: any) => {
    const nameMatch =
      typeof item.name === "string" &&
      item.name.toLowerCase().includes(search.toLowerCase());
    const contactMatch =
      item.contact && item.contact.toString().includes(search);
    return nameMatch || contactMatch;
  });

  return (
    <CustomModal
      modalStyle={{ minHeight: height * 0.48 }}
      visible={visible}
      onClose={onClose}
    >
      {/* Custom Header with Title and Add Button */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{title || "Select Option"}</Text>
        <TouchableOpacity
          style={styles.addCustomerButton}
          onPress={() => {
            onClose();
            navigation.navigate(HomeNavigation.ADDCUSTOMER as never);
          }}
        >
          <Text style={styles.addCustomerButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or contact"
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#999"
      />

      <View style={styles.dropdownMenu}>
        <FlatList
          data={filteredOptions}
          keyExtractor={(item) => item.id.toString()}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true} // Important for Android
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(item);
                onClose();
                setSearch("");
              }}
            >
              <View style={styles.itemContent}>
                <Text style={styles.dropdownItemText}>{item.name}</Text>
                {item.contact && (
                  <Text style={styles.contactText}>{item.contact}</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.noResultText}>No results found</Text>
          }
        />
      </View>
    </CustomModal>
  );
}

const styles = StyleSheet.create({
  dropdownMenu: {
    // borderWidth: 1,
    // borderColor: "#ccc",
    // borderRadius: 5,
    backgroundColor: "#fff",
    maxHeight: height * 0.3,
  },
  searchInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    fontSize: width * 0.038,
    color: "#000",
    marginBottom: 10,
  },
  dropdownItem: {
    padding: width * 0.03,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownItemText: {
    fontSize: width * 0.04,
    color: "#000",
    flex: 1,
  },
  contactText: {
    fontSize: width * 0.035,
    color: "#666",
    marginLeft: 10,
  },
  noResultText: {
    textAlign: "center",
    padding: 10,
    color: "#888",
    fontSize: width * 0.038,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FCA311",
    flex: 1,
  },
  addCustomerButton: {
    backgroundColor: "#FCA311",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  addCustomerButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});

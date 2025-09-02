import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Vendor } from "../type/Vendor";
import { HomeNavigation } from "../constants/app-routes.constants";

interface VendorModalProps {
  visible: boolean;
  vendors?: Vendor[] | null;
  selectedVendor: Vendor | null;
  onSelect: (vendor: Vendor) => void;
  onClose: () => void;
}

const VendorModal: React.FC<VendorModalProps> = ({
  visible,
  vendors,
  selectedVendor,
  onSelect,
  onClose,
}) => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");

  // Filter vendors based on search text
  const filteredVendors =
    vendors?.filter((vendor) =>
      vendor.name.toLowerCase().includes(searchText.toLowerCase())
    ) || [];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Custom Header with Title and Add Button */}
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Select Vendor</Text>
            <TouchableOpacity
              style={styles.addVendorButton}
              onPress={() => {
                onClose();
                navigation.navigate(HomeNavigation.ADDVENDOR as never);
              }}
            >
              <Text style={styles.addVendorButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search vendors..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />

          <FlatList
            data={filteredVendors}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const isSelected = selectedVendor?.id === item.id;
              return (
                <TouchableOpacity
                  style={[
                    styles.vendorItem,
                    isSelected && styles.selectedVendor,
                  ]}
                  onPress={() => onSelect(item)}
                >
                  <Text
                    style={[
                      styles.vendorName,
                      isSelected && styles.selectedText,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={() => (
              <Text
                style={{ textAlign: "center", marginTop: 20, color: "#999" }}
              >
                {searchText
                  ? "No vendors found matching your search."
                  : "No vendors available."}
              </Text>
            )}
          />
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default VendorModal;

const THEME_COLOR = "#FCA311";

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 10,
    padding: 15,
    maxHeight: Dimensions.get("window").height * 0.7,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FCA311",
    flex: 1,
  },
  addVendorButton: {
    backgroundColor: "#FCA311",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  addVendorButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  searchInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  vendorItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  selectedVendor: {
    backgroundColor: "#fff3e0",
    borderLeftWidth: 5,
    borderLeftColor: THEME_COLOR,
  },
  vendorName: {
    fontSize: 16,
    color: "#333",
  },
  selectedText: {
    color: "#333",
    fontWeight: "bold",
  },
  closeBtn: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "red",
    borderRadius: 6,
    alignItems: "center",
  },
  closeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

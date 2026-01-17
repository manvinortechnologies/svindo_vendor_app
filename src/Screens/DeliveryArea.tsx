import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import CheckBox from "@react-native-community/checkbox";
import MainContainer from "../CommonComponent/MainContainer";
import CustomHeader from "../CommonComponent/CustomHeader";
import Loading from "../CommonComponent/Loading";
import CustomButton from "../CommonComponent/CustomeButton";
import api from "../services/api/api";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";

interface Pincode {
  id: number;
  pincode: string;
  city?: string;
  state?: string;
  district?: string;
  code?: string;
}

const DeliveryArea = () => {
  const insets = useSafeAreaInsets();
  const [pincodes, setPincodes] = useState<Pincode[]>([]);
  const [filteredPincodes, setFilteredPincodes] = useState<Pincode[]>([]);
  const [selectedPincodes, setSelectedPincodes] = useState<number[]>([]);
  const [initialSelectedPincodes, setInitialSelectedPincodes] = useState<
    number[]
  >([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    fetchPincodes();
    fetchSelectedPincodes();
  }, []);

  useEffect(() => {
    filterPincodes();
  }, [searchQuery, pincodes]);

  const fetchPincodes = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/masters/get-pincode/");

      if (response.data) {
        const pincodeList = Array.isArray(response.data)
          ? response.data
          : response.data.pincodes || response.data.results || [];

        setPincodes(pincodeList);
        setFilteredPincodes(pincodeList);
      }
    } catch (error) {
      console.error("Error fetching pincodes:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch pincodes. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSelectedPincodes = async () => {
    try {
      const response = await api.get("/vendor/coverage/");

      if (response.data && Array.isArray(response.data)) {
        // Extract pincode IDs from the response array
        // Response format: [{ id, user, pincode, pincode_details }, ...]
        const selectedIds = response.data
          .map((item: any) => item.pincode)
          .filter((id: any) => id != null && !isNaN(Number(id)))
          .map((id: any) => Number(id));

        setSelectedPincodes(selectedIds);
        setInitialSelectedPincodes(selectedIds);
      }
    } catch (error) {
      console.error("Error fetching selected pincodes:", error);
      // Don't show alert for this as it's not critical - user can still select pincodes
    }
  };

  const filterPincodes = () => {
    if (!searchQuery.trim()) {
      setFilteredPincodes(pincodes);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = pincodes.filter(
      (item) =>
        item.pincode?.toLowerCase().includes(query) ||
        item.city?.toLowerCase().includes(query) ||
        item.state?.toLowerCase().includes(query) ||
        item.district?.toLowerCase().includes(query)
    );
    setFilteredPincodes(filtered);
  };

  const togglePincode = (pincodeId: number) => {
    setSelectedPincodes((prev) => {
      if (prev.includes(pincodeId)) {
        return prev.filter((id) => id !== pincodeId);
      } else {
        return [...prev, pincodeId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedPincodes.length === filteredPincodes.length) {
      setSelectedPincodes([]);
    } else {
      const allIds = filteredPincodes.map((item) => item.id);
      setSelectedPincodes(allIds);
    }
  };

  // Check if there are changes in selected pincodes
  const hasChanges = () => {
    // Sort both arrays for comparison
    const currentSorted = [...selectedPincodes].sort((a, b) => a - b);
    const initialSorted = [...initialSelectedPincodes].sort((a, b) => a - b);

    // Compare lengths first
    if (currentSorted.length !== initialSorted.length) {
      return true;
    }

    // Compare each element
    return currentSorted.some((id, index) => id !== initialSorted[index]);
  };

  const handleSave = async () => {
    if (selectedPincodes.length === 0) {
      Toast.show({
        type: "info",
        text1: "Please select at least one pincode.",
      });
      return;
    }

    try {
      setIsSaving(true);

      // Prepare payload with pincode IDs
      const payload = {
        pincode_ids: selectedPincodes,
      };

      const response = await api.post("/vendor/coverage/", payload);

      if (response.status === 200 || response.status === 201) {
        // Update initial selection after successful save
        setInitialSelectedPincodes([...selectedPincodes]);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: `${selectedPincodes.length} pincode(s) saved successfully.`,
        });
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error: any) {
      console.error("Error saving pincodes:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to save pincodes. Please try again.";
      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderPincodeItem = ({ item }: { item: Pincode }) => {
    const isSelected = selectedPincodes.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.pincodeItem, isSelected && styles.pincodeItemSelected]}
        onPress={() => togglePincode(item.id)}
      >
        <View style={styles.pincodeInfo}>
          <Text style={styles.pincodeText}>{item.pincode}</Text>
          {(item.city || item.state || item.district) && (
            <Text style={styles.pincodeLocation}>
              {[item.city, item.code, item.state].filter(Boolean).join(", ")}
            </Text>
          )}
        </View>
        <CheckBox
          value={isSelected}
          onValueChange={() => togglePincode(item.id)}
          tintColors={{ true: "#FCA311", false: "#ccc" }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <CustomHeader
        title="Visibility & Instant Delivery Areas"
        // rightIcon={
        //   <CheckBox
        //     value={
        //       selectedPincodes.length === filteredPincodes.length &&
        //       filteredPincodes.length > 0
        //     }
        //     onValueChange={handleSelectAll}
        //     tintColors={{ true: "#FCA311", false: "#ccc" }}
        //   />
        // }
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by pincode, city, state..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Icon name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Note */}
      <View style={styles.noteContainer}>
        <Text style={styles.noteText}>
          For All India visibility of store please verify your business and
          contact supports. {"\n"}For unregistered Stores please add pincodes
          only from the same state, Selling outside the state online without GST
          is illegal, If found your account will be banned permanently.
        </Text>
      </View>

      {/* Pincode List */}
      <View style={styles.listContainer}>
        {filteredPincodes.length > 0 ? (
          <>
            <Text style={styles.selectedCount}>
              {selectedPincodes.length} of {filteredPincodes.length} selected
            </Text>
            <FlatList
              data={filteredPincodes}
              renderItem={renderPincodeItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={true}
            />
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="location-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery ? "No pincodes found" : "No pincodes available"}
            </Text>
            {searchQuery && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>Clear Search</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Save Button */}
      {hasChanges() && (
        <View style={styles.footer}>
          <CustomButton
            title={`Save ${selectedPincodes.length} Pincode(s)`}
            onPress={handleSave}
            isLoading={isSaving}
            disabled={isSaving}
          />
        </View>
      )}

      <Loading visible={isLoading} />
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
    backgroundColor: "#f5f5f5",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    // paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#000",
  },
  noteContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#FFF3CD",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FFC107",
  },
  noteText: {
    fontSize: 12,
    color: "#856404",
    lineHeight: 18,
  },
  selectAllBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  selectAllText: {
    fontSize: 12,
    color: "#FCA311",
    fontWeight: "600",
  },
  listContainer: {
    flex: 1,
  },
  selectedCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f9f9f9",
  },
  listContent: {
    paddingBottom: 100,
  },
  pincodeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  pincodeItemSelected: {
    backgroundColor: "#FFF8E1",
  },
  pincodeInfo: {
    flex: 1,
    marginRight: 12,
  },
  pincodeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  pincodeLocation: {
    fontSize: 13,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
    textAlign: "center",
  },
  clearButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#FCA311",
    borderRadius: 8,
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
});

export default DeliveryArea;

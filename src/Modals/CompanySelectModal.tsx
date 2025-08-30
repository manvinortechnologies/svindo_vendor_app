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

  const filteredOptions = options.filter(
    (item: any) =>
      typeof item.name === "string" &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CustomModal
      modalStyle={{ minHeight: height * 0.48 }}
      visible={visible}
      onClose={onClose}
      title={title || "Select Option"}
    >
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name"
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
              <Text style={styles.dropdownItemText}>{item.name}</Text>
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
  dropdownItemText: {
    fontSize: width * 0.04,
  },
  noResultText: {
    textAlign: "center",
    padding: 10,
    color: "#888",
    fontSize: width * 0.038,
  },
});

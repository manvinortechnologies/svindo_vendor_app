import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");
export interface DropDownOption {
  name: string;
  id: string | number;
}

interface CustomDropdownProps {
  placeholder: string;
  options?: DropDownOption[];
  onSelect: (value: any) => void;
  selectedValue: string;
  styles?: StyleProp<ViewStyle>;
  dropDownBoxStyle?: StyleProp<ViewStyle>;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  placeholder,
  options = [],
  onSelect,
  selectedValue,
  styles: customStyles,
  dropDownBoxStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter(
    (item) =>
      typeof item.name === "string" &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.dropdownContainer, customStyles]}>
      <TouchableOpacity
        style={[styles.dropdown, dropDownBoxStyle]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text
          style={[
            styles.dropdownText,
            placeholder && !selectedValue && { color: "#888" },
          ]}
        >
          {selectedValue || placeholder}
        </Text>
        <Icon
          name="chevron-down-outline"
          size={20}
          color="#888"
          style={styles.dropdownArrow}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownMenu}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name"
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#999"
          />
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
                  setIsOpen(false);
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
      )}
    </View>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  dropdownContainer: {
    marginBottom: height * 0.01,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: width * 0.03,
    backgroundColor: "#FAFAFC",
  },
  dropdownText: {
    fontSize: width * 0.038,
    color: "#666",
  },
  dropdownArrow: {
    fontSize: width * 0.05,
    color: "#666",
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    position: "absolute",
    width: "100%",
    zIndex: 999,
    marginTop: 50,
    maxHeight: height * 0.3,
  },
  searchInput: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    fontSize: width * 0.038,
    color: "#000",
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

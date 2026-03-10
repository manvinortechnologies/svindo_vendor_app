import React, { useState, useMemo } from "react";
import {
  StyleProp,
  ViewStyle,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import SearchBar from "./SearchBar";
import { KeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";

export interface DropDownOption {
  name: string;
  id: string | number;
}

interface CustomDropdownProps {
  placeholder: string;
  options?: DropDownOption[];
  onSelect: (value: any) => void;
  selectedValue: any | null;
  styles?: StyleProp<ViewStyle>;
  dropDownBoxStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  isSearchable?: boolean;
  position?: "bottom" | "top" | "auto";
  mode?: "default" | "modal" | "auto";
  onFocus?: () => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  placeholder,
  options = [],
  onSelect,
  selectedValue,
  styles: customStyles,
  dropDownBoxStyle,
  disabled = false,
  isSearchable = true,
  position = "bottom",
  mode = "default",
  onFocus,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get selected option name
  const selectedOption = options.find(
    (opt) =>
      opt.id === selectedValue ||
      opt.id?.toString() === selectedValue?.toString(),
  );

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!isSearchable || !searchQuery.trim()) {
      return options;
    }
    const query = searchQuery.toLowerCase();
    return options.filter((option) =>
      option.name.toLowerCase().includes(query),
    );
  }, [options, searchQuery, isSearchable]);

  const handleSelect = (option: DropDownOption) => {
    onSelect(option);
    setModalVisible(false);
    setSearchQuery("");
  };

  const handleOpen = () => {
    if (!disabled) {
      setModalVisible(true);
      setSearchQuery("");
      onFocus?.();
    }
  };

  const handleClose = () => {
    setModalVisible(false);
    setSearchQuery("");
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.dropdown, dropDownBoxStyle, customStyles]}
        onPress={handleOpen}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text
          style={[
            selectedOption ? styles.selectedTextStyle : styles.placeholderStyle,
            disabled && styles.disabledText,
          ]}
          numberOfLines={1}
        >
          {selectedOption ? selectedOption.name : placeholder}
        </Text>
        <Icon
          name="chevron-down"
          size={20}
          color={disabled ? "#ccc" : "#666"}
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.overlay}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={handleClose}
          >
            <View
              style={styles.modalContent}
              onStartShouldSetResponder={() => true}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{placeholder}</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.closeButton}
                >
                  <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              {isSearchable && (
                <View style={styles.searchContainer}>
                  <SearchBar
                    placeholder="Search..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
              )}

              <ScrollView
                style={styles.optionsScrollView}
                showsVerticalScrollIndicator={true}
              >
                {filteredOptions.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No options found</Text>
                  </View>
                ) : (
                  filteredOptions.map((option) => {
                    const isSelected =
                      option.id === selectedValue ||
                      option.id?.toString() === selectedValue?.toString();
                    return (
                      <TouchableOpacity
                        key={option.id?.toString()}
                        style={[
                          styles.optionItem,
                          isSelected && styles.optionItemSelected,
                        ]}
                        onPress={() => handleSelect(option)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            isSelected && styles.optionTextSelected,
                          ]}
                        >
                          {option.name}
                        </Text>
                        {isSelected && (
                          <Icon name="check" size={20} color="#FCA311" />
                        )}
                      </TouchableOpacity>
                    );
                  })
                )}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default CustomDropdown;

const styles = ScaledSheet.create({
  dropdown: {
    height: "40@s",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: "5@s",
    paddingHorizontal: "10@s",
    backgroundColor: "#FAFAFC",
    marginBottom: "1@s",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  placeholderStyle: {
    fontSize: "12@s",
    color: "#888",
    flex: 1,
  },
  selectedTextStyle: {
    fontSize: "14@s",
    color: "#666",
    flex: 1,
  },
  disabledText: {
    color: "#ccc",
  },
  overlay: {
    flex: 1,
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
    // justifyContent: "center",
    // alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "85%",
    maxWidth: 400,
    maxHeight: "70%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  optionsScrollView: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  optionItemSelected: {
    backgroundColor: "#FFF4E5",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  optionTextSelected: {
    color: "#FCA311",
    fontWeight: "600",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
  },
});

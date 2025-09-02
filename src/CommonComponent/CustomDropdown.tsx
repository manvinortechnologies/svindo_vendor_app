import React from "react";
import { Dimensions, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const { width, height } = Dimensions.get("window");
export interface DropDownOption {
  name: string;
  id: string | number;
}

interface CustomDropdownProps {
  placeholder: string;
  options?: DropDownOption[];
  onSelect: (value: any) => void;
  selectedValue: string | number | null;
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
  return (
    <Dropdown
      style={[styles.dropdown, dropDownBoxStyle, customStyles]}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      itemTextStyle={styles.itemTextStyle}
      data={options}
      search
      maxHeight={300}
      labelField="name"
      valueField="id"
      placeholder={placeholder}
      searchPlaceholder="Search..."
      value={selectedValue}
      onChange={(item) => onSelect(item)}
      renderLeftIcon={() => null}
      renderRightIcon={() => null}
    />
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
    backgroundColor: "#FAFAFC",
    marginBottom: height * 0.01,
  },
  placeholderStyle: {
    fontSize: width * 0.038,
    color: "#888",
  },
  selectedTextStyle: {
    fontSize: width * 0.038,
    color: "#666",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: width * 0.038,
    color: "#000",
  },
  itemTextStyle: {
    color: "#000",
  },
});

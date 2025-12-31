import React, { useRef, useState } from "react";
import { Dimensions, StyleProp, ViewStyle, View, Platform } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { ScaledSheet } from "react-native-size-matters";
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
  const containerRef = useRef<View>(null);
  const [dropdownPosition, setDropdownPosition] = useState<
    "bottom" | "top" | "auto"
  >(position);

  const handleFocus = () => {
    // Call the original onFocus if provided
    onFocus?.();

    // Scroll to show dropdown above keyboard
    if (containerRef.current) {
      // Use a delay to ensure the dropdown is rendered
      setTimeout(() => {
        containerRef.current?.measureInWindow((x, y, width, height) => {
          // Approximate keyboard height
          const keyboardHeight = Platform.OS === "ios" ? 350 : 300;
          const screenHeight = Dimensions.get("window").height;
          const dropdownBottom = y + height + 300; // Add dropdown maxHeight (300)
          const spaceAboveKeyboard = screenHeight - keyboardHeight;

          // If dropdown would be hidden by keyboard, change position to top
          if (dropdownBottom > spaceAboveKeyboard) {
            setDropdownPosition("top");
          } else {
            setDropdownPosition(position);
          }

          // Scroll the view to show the dropdown
          // KeyboardAwareScrollView should handle this, but we help by ensuring visibility
          containerRef.current?.measure((x, y, width, height, pageX, pageY) => {
            // The KeyboardAwareScrollView will automatically scroll to focused inputs
            // We just need to ensure the container is properly positioned
          });
        });
      }, 200); // Delay to ensure keyboard animation has started
    }
  };

  const handleBlur = () => {
    // Reset position when dropdown closes
    setDropdownPosition(position);
  };

  return (
    <View ref={containerRef} collapsable={false}>
      <Dropdown
        style={[styles.dropdown, dropDownBoxStyle, customStyles]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        itemTextStyle={styles.itemTextStyle}
        data={options}
        search={false}
        maxHeight={300}
        labelField="name"
        valueField="id"
        placeholder={placeholder}
        mode={mode}
        searchPlaceholder="Search..."
        value={selectedValue}
        onChange={onSelect}
        renderLeftIcon={() => null}
        renderRightIcon={() => null}
        disable={disabled}
        dropdownPosition={dropdownPosition}
        keyboardAvoiding={true}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
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
  },
  placeholderStyle: {
    fontSize: "12@s",
    color: "#888",
  },
  selectedTextStyle: {
    fontSize: "14@s",
    color: "#666",
  },
  iconStyle: {
    width: "10@s",
    height: "10@s",
  },
  inputSearchStyle: {
    height: "40@s",
    fontSize: "14@s",
    color: "#000",
  },
  itemTextStyle: {
    color: "#000",
  },
});

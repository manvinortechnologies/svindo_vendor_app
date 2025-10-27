import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  KeyboardTypeOptions,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  Text,
  ViewStyle,
} from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import Icon from "react-native-vector-icons/Ionicons";

interface CustomTextInputProps {
  // You can define your props here if needed
  placeholder?: string;
  placeholderTextColor?: string;
  styles?: StyleProp<TextStyle>;
  onChangeText?: (text: string) => void;
  value?: string;
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  showLeftIcon?: boolean;
  leftIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  placeholder = "Description",
  placeholderTextColor = "#999",
  styles: customStyles,
  containerStyle: customContainerStyles,
  onChangeText,
  value,
  editable = true,
  keyboardType = "default",
  secureTextEntry = false,
  showPasswordToggle = false,
  autoCapitalize = "none",
  maxLength,
  showLeftIcon = false,
  leftIcon = null,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, customContainerStyles]}>
      {showLeftIcon && leftIcon}
      <TextInput
        style={[styles.input, customStyles]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        onChangeText={onChangeText}
        value={value}
        editable={editable}
        keyboardType={keyboardType}
        maxLength={maxLength}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        autoCapitalize={autoCapitalize}
      />
      {showPasswordToggle && secureTextEntry && (
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={togglePasswordVisibility}
        >
          <Icon
            name={isPasswordVisible ? "eye-off" : "eye"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
const styles = ScaledSheet.create({
  container: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7DD",
    borderColor: "#FCA511",
    borderWidth: 1,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: "10@s",
    // paddingRight: "50@s", // Make room for the eye button
    height: "40@s",
    color: "#333",
  },
  eyeButton: {
    // position: "absolute",
    // right: "15@s",
    // top: "10@s",
    padding: "5@s",
    paddingRight: "10@s",
  },
});

export default CustomTextInput;

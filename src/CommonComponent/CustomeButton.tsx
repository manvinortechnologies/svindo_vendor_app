import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  isValid?: boolean;
  gradientColors?: string[];
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  disabled = false,
  isLoading = false,
  isValid = true,
  gradientColors = ["#F9C313", "#FCA511"],
  containerStyle,
  textStyle,
}) => {
  const opacity = isValid && !disabled ? 1 : 0.5;

  return (
    <TouchableOpacity
      style={[styles.submitButton, { opacity }, containerStyle]}
      onPress={onPress}
      disabled={!isValid || disabled || isLoading}
    >
      <LinearGradient colors={gradientColors} style={styles.gradientButton}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[styles.submitText, textStyle]}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  gradientButton: {
    borderRadius: 25,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    paddingVertical: 14,
  },
});

export default CustomButton;

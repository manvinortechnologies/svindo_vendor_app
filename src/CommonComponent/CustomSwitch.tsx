import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  activeColor?: string; // Color when switch is ON
  inactiveColor?: string; // Color when switch is OFF
  borderColor?: string; // Border color when switch is OFF
  disabled?: boolean;
}

const CustomSwitch = ({
  value,
  onValueChange,
  activeColor = "#FCA311",
  inactiveColor = "#ccc",
  borderColor = "#ccc",
  disabled = false,
}: CustomSwitchProps) => {
  const dynamicSwitchContainer = {
    backgroundColor: "#fff",
    borderColor: value ? activeColor : borderColor,
    alignItems: (value ? "flex-end" : "flex-start") as
      | "flex-end"
      | "flex-start",
  };

  const dynamicCircle = {
    backgroundColor: value ? activeColor : inactiveColor,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={[styles.switchContainer, dynamicSwitchContainer]}
    >
      <View style={[styles.circle, dynamicCircle]} />
    </TouchableOpacity>
  );
};

export default CustomSwitch;

const styles = StyleSheet.create({
  switchContainer: {
    width: 52,
    height: 14,
    borderRadius: 28,
    padding: 2,
    justifyContent: "center",
    borderWidth: 4,
    paddingVertical: 8,
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 12,
  },
});

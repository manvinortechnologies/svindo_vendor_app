import React from "react";
import { TouchableOpacity, Text, StyleSheet ,TextStyle } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type NavigationButtonProps = {
  screen: string; // Allows dynamic screen names
  label: string;
  color?: string;
  fontSize?: number;
  fontWeight?: TextStyle["fontWeight"]; // safer typing


};

const NavigationButton: React.FC<NavigationButtonProps> = ({ screen, label, color = "#000", fontSize=16 , fontWeight = "normal", }) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <TouchableOpacity onPress={() => navigation.navigate(screen as never)}>
   <Text style={{ color, fontSize, fontWeight }}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
});

export default NavigationButton;

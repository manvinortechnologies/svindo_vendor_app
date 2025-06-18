import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type NavigationButtonProps = {
  screen: string; // Dynamic screen name
  label: string;
  children: React.ReactNode;
};
// 

{/* <NavigationButton screen="MarketingTools" label="Online Store"  color="#FCA511" fontSize={16} fontWeight="bold"/> */}

const NavigationScreen: React.FC<NavigationButtonProps> = ({ screen, label }) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate(screen as never)}>
      <Text style={styles.text}>{label}</Text>
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

export default NavigationScreen;

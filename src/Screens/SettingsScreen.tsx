import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import Headerwithback from "./Headerwithback";
import Bottomnavigation from "./Bottomnavigation";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

// Define your navigation types if needed
type RootStackParamList = {
  PreferencesScreen: undefined;
  Sales: undefined;
  Purchases: undefined;
  DiscountSettings: undefined;
  TaxesAndGST: undefined;
};

type SettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PreferencesScreen"
>;

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const settingsOptions = [
    { label: "Preferences", route: "PreferencesScreen" },
    { label: "Sales", route: "Sales" },
    { label: "Purchases", route: "Purchase" },
    { label: "Discount Settings", route: "DiscountSettings" },
    { label: "Taxes & GST", route: "TaxesAndGST" },
  ];

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Headerwithback title="Settings" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {settingsOptions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigation.navigate(item.route as any)}
          >
            <Text style={styles.cardText}>{item.label}</Text>
            <Text style={styles.arrow}>{">"}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { backgroundColor: "#FFF", flex: 1 },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000",
  },
  arrow: {
    fontSize: 16,
    color: "#999",
  },
});

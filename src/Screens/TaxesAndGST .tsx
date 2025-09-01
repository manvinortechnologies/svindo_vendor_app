import React, { useState } from "react";
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
import CustomSwitch from "./CustomSwitch";
import { SafeAreaView } from "react-native-safe-area-context";

// 1. Define the allowed keys explicitly
type SwitchKey =
  | "gst"
  | "hsn"
  | "cess"
  | "reverseCharge"
  | "stateOfSupply"
  | "ewayBill"
  | "compositeScheme";

const TaxesAndGST = () => {
  const [switches, setSwitches] = useState<Record<SwitchKey, boolean>>({
    gst: true,
    hsn: true,
    cess: true,
    reverseCharge: true,
    stateOfSupply: true,
    ewayBill: true,
    compositeScheme: true,
  });

  const toggleSwitch = (key: SwitchKey) => {
    setSwitches((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Headerwithback title="Taxes & GST" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.listItem}>
          <Text style={styles.text}>Tax List</Text>
          <Text style={styles.arrow}>{">"}</Text>
        </TouchableOpacity>

        {[
          { label: "GST", key: "gst" },
          { label: "HSN/SAC Code", key: "hsn" },
          { label: "Additional CESS", key: "cess" },
          { label: "Reverse Charge", key: "reverseCharge" },
          { label: "State of Supply", key: "stateOfSupply" },
          { label: "E- way Bill No.", key: "ewayBill" },
          { label: "Composite Scheme", key: "compositeScheme" },
        ].map((item) => (
          <View key={item.key} style={styles.listItem}>
            <Text style={styles.text}>{item.label}</Text>
            <CustomSwitch
              value={switches[item.key as SwitchKey]} // 👈 safely cast key
              onValueChange={() => toggleSwitch(item.key as SwitchKey)}
            />
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default TaxesAndGST;

const styles = StyleSheet.create({
  container: { backgroundColor: "#FFF", flex: 1 },
  scrollContent: {
    padding: 16,
    paddingBottom: 60,
  },
  listItem: {
    backgroundColor: "#fff1dc",
    borderWidth: 1,
    borderColor: "#fca103",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  arrow: {
    fontSize: 18,
    color: "#fca103",
  },
  button: {
    backgroundColor: "#fca103",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 30,
    width: "50%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

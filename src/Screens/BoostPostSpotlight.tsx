import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
} from "react-native";
import CustomHeader from "../CommonComponent/CustomHeader";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const BoostPostSpotlight = () => {
  const [amount, setAmount] = useState("");

  const handleBoost = () => {
    if (!amount || parseInt(amount) < 10) {
      alert("Please enter at least 10 Rupees.");
      return;
    }
    alert(`Boost started with ₹${amount}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <CustomHeader title="Enter Details" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Select Post / Spotlight */}
        <TouchableOpacity style={styles.selectBox}>
          <Text style={styles.selectText}>Select Post / Spotlight</Text>
        </TouchableOpacity>

        {/* Budget Input */}
        <View style={styles.budgetContainer}>
          <Text style={styles.budgetLabel}>Budget (Minimum - 10 Rupees)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Amount"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* Boost Button */}
        <TouchableOpacity style={styles.boostBtn} onPress={handleBoost}>
          <Text style={styles.boostText}>Boost</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BoostPostSpotlight;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },

  selectBox: {
    alignSelf: "center",
    width: width * 0.7,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#FFCC80",
    backgroundColor: "#FFEFD5",
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 80,
  },
  selectText: {
    fontSize: 14,
    color: "gray",
  },
  budgetContainer: {
    width: width * 0.9,
    marginBottom: 40,
  },
  budgetLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#FFCC80",
    backgroundColor: "#FFEFD5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontSize: 16,
  },
  boostBtn: {
    width: width * 0.75,
    alignSelf: "center",
    backgroundColor: "#169729",
    paddingVertical: 8,
    borderRadius: 30,
    alignItems: "center",
  },
  boostText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
function alert(arg0: string) {
  throw new Error("Function not implemented.");
}

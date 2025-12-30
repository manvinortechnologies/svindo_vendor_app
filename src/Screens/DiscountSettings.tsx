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
import CustomSwitch from "./CustomSwitch"; // Make sure this path is correct
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DiscountSettings = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Headerwithback title="Discount Settings" />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.disc}>
            Choose wether the discount (in Rs) is to be applied on the unit
            price , price with tax ,total amount{" "}
          </Text>

          {/* Track for delivery challan */}
          <View style={styles.discountcard}>
            <Text style={styles.discounttype}>Discount Type</Text>
            <Text style={styles.discountotal}>
              Total Amount <Icon name="chirven" size={20}></Icon>{" "}
            </Text>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.updateBtn}>
        <Text style={styles.updateText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#FFF", flex: 1 },
  content: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: "#fff7ec",
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 10,
    padding: 16,
  },
  discountcard: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  disc: {
    color: "#918B8B",
  },
  discounttype: {
    fontWeight: "bold",
    fontSize: 18,
  },

  discountotal: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#FCA311",
  },

  updateBtn: {
    backgroundColor: "#FCA311",
    marginTop: 40,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 10,
    width: "50%",
    alignSelf: "center",
    marginBottom: 10,
  },
  updateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});

export default DiscountSettings;

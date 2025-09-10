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
import { SafeAreaView } from "react-native-safe-area-context";

const Sales = () => {
  const [roundOff, nagetiveqty] = useState(false);
  const [sendEmail, showPrice] = useState(true);
  const [sendSMS, showmargin] = useState(false);
  const [trackServiceInventory, sendInvoice] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Headerwithback title="Sales" />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          {/* Round Off */}
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>Allow Nagetive Quantity </Text>
              <Text style={styles.switchDesc}>loremipsumloreimpsum</Text>
            </View>
            <CustomSwitch value={roundOff} onValueChange={nagetiveqty} />
          </View>

          {/* Send Email */}
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>Show Purchase Price</Text>
              <Text style={styles.switchDesc}>loremipsumloreimpsum</Text>
            </View>
            <CustomSwitch value={sendEmail} onValueChange={showPrice} />
          </View>

          {/* Send SMS */}
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>Show Margin</Text>
              <Text style={styles.switchDesc}>loremipsumloreimpsum</Text>
            </View>
            <CustomSwitch value={sendSMS} onValueChange={showmargin} />
          </View>

          {/* Track for services */}
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>Send Invoice Automatically</Text>
              <Text style={styles.switchDesc}>loremipsumloreimpsum</Text>
            </View>
            <CustomSwitch
              value={trackServiceInventory}
              onValueChange={sendInvoice}
            />
          </View>

          {/* Track for delivery challan */}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.updateBtn}>
        <Text style={styles.updateText}>Update</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#FFF", flex: 1 },
  content: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: "#fff7ec",
    borderWidth: 1,
    borderColor: "#f8b14d",
    borderRadius: 10,
    padding: 16,
  },
  cardTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 15,
  },
  radioRow: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 20,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#f8b14d",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#f8b14d",
  },
  radioLabel: {
    fontSize: 14,
    color: "#000",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  switchTitle: {
    fontWeight: "600",
    fontSize: 14,
    color: "#000",
  },
  switchDesc: {
    color: "#999",
    fontSize: 12,
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

export default Sales;

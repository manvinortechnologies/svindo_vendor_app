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
import Bottomnavigation from "./Bottomnavigation";
import CustomSwitch from "./CustomSwitch"; // Make sure this path is correct
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const PreferencesScreen = () => {
  const insets = useSafeAreaInsets();
  const [sortBy, setSortBy] = useState<"created" | "document">("created");
  const [roundOff, setRoundOff] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSMS, setSendSMS] = useState(false);
  const [trackServiceInventory, setTrackServiceInventory] = useState(false);
  const [trackDeliveryInventory, setTrackDeliveryInventory] = useState(true);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Headerwithback title="Preferences" />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Show Transactions sorted by</Text>
          <View style={styles.radioRow}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setSortBy("created")}
            >
              <View style={styles.radioCircle}>
                {sortBy === "created" && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioLabel}>Created Date</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setSortBy("document")}
            >
              <View style={styles.radioCircle}>
                {sortBy === "document" && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioLabel}>Document Date</Text>
            </TouchableOpacity>
          </View>

          {/* Round Off */}
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>Round Off</Text>
              <Text style={styles.switchDesc}>loremipsumloreimpsum</Text>
            </View>
            <CustomSwitch value={roundOff} onValueChange={setRoundOff} />
          </View>

          {/* Send Email */}
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>
                Send Email on record payment
              </Text>
              <Text style={styles.switchDesc}>loremipsumloreimpsum</Text>
            </View>
            <CustomSwitch value={sendEmail} onValueChange={setSendEmail} />
          </View>

          {/* Send SMS */}
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>Send SMS on record payment</Text>
              <Text style={styles.switchDesc}>loremipsumloreimpsum</Text>
            </View>
            <CustomSwitch value={sendSMS} onValueChange={setSendSMS} />
          </View>

          {/* Track for services */}
          <View style={styles.switchRow}>
            <Text style={styles.switchTitle}>Track Inventory for Services</Text>
            <CustomSwitch
              value={trackServiceInventory}
              onValueChange={setTrackServiceInventory}
            />
          </View>

          {/* Track for delivery challan */}
          <View style={styles.switchRow}>
            <Text style={styles.switchTitle}>
              Track Inventory for Delivery Challan
            </Text>
            <CustomSwitch
              value={trackDeliveryInventory}
              onValueChange={setTrackDeliveryInventory}
            />
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.updateBtn}>
        <Text style={styles.updateText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PreferencesScreen;

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

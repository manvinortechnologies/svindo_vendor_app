import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import CustomHeader from "../CommonComponent/CustomHeader";
import CustomSwitch from "../CommonComponent/CustomSwitch";
import Icon from "react-native-vector-icons/Ionicons";

const SmsScreen = () => {
  const [availableCredits, setAvailableCredits] = useState(2000);
  const [usedCredits, setUsedleCredits] = useState(1000);

  const [purchaseMsgEnabled, setPurchaseMsgEnabled] = useState(true);

  const [quoteMsgEnabled, setQuoteMsgEnabled] = useState(true);
  const [creditReminderEnabled, setCreditReminderEnabled] = useState(true);
  return (
    <View style={styles.container}>
      <CustomHeader title="SMS" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* SMS Credits Details */}
        <View style={styles.creditsContainer}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.sectionTitle}>SMS Credits Details</Text>
            <View
              style={{
                flexDirection: "row",
                gap: 2,
                borderWidth: 1,
                borderColor: "#ddd",
                padding: 5,
                paddingHorizontal: 10,
                marginBottom: 5,
                borderRadius: 10,
              }}
            >
              <Text>Till day</Text>
              <TouchableOpacity>
                <Icon name="chevron-down" size={18} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.creditRow}>
            <View style={[styles.creditBox, { backgroundColor: "#CDBDFF" }]}>
              <Text style={styles.creditLabel}>Available</Text>
              <Text style={styles.creditValue}>
                {availableCredits.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.creditBox, { backgroundColor: "#CEFFB7" }]}>
              <Text style={styles.creditLabel}>Used</Text>
              <Text style={styles.creditValue}>{usedCredits.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Note Section */}
        <View style={styles.noteBox}>
          <Text style={styles.noteTitle}>Note:</Text>
          <Text style={styles.noteText}>
            This feature is to automatically send different transactions to your
            customer via SMS.
          </Text>
          <Text style={styles.noteText}>
            It's a paid service, add SMS credits to avail the benefits
          </Text>
        </View>

        {/* Toggle */}
        <View style={styles.toggleBox}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Enable Purchase Message</Text>
            <CustomSwitch
              value={purchaseMsgEnabled}
              onValueChange={setPurchaseMsgEnabled}
            />
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Enable Quote Message</Text>
            <CustomSwitch
              value={quoteMsgEnabled}
              onValueChange={setQuoteMsgEnabled}
            />
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>
              Enable Credit Reminder Message
            </Text>
            <CustomSwitch
              value={creditReminderEnabled}
              onValueChange={setCreditReminderEnabled}
            />
          </View>
        </View>

        {/* Templates */}
        <View style={styles.templatesBox}>
          <Text style={styles.templatesTitle}>SMS templates used</Text>
        </View>
      </ScrollView>

      {/* Add Credit Button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Credit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SmsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  creditsContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FCA311",
    marginBottom: 8,
  },
  creditRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  creditBox: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 8,
    alignItems: "flex-start",
  },
  creditLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  creditValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },
  noteBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  noteText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
    marginBottom: 2,
  },
  toggleBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },
  toggleText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
  },
  templatesBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    height: 80,
    marginBottom: 20,
  },
  templatesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  addButton: {
    width: "30%",
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#169729",
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

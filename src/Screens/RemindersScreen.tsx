import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import Ionicons from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";

type ReminderItemProps = {
  label: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
};

const ReminderScreen = () => {
  const navigation = useNavigation();
  const [emailReminders, setEmailReminders] = useState({
    pendingInvoices: true,
    lowStock: false,
  });
  const [activeTab, setActiveTab] = useState<"reminder" | "summary">(
    "reminder"
  );
  const [weekly, setWeekly] = useState(false);
  const [monthly, setMonthly] = useState(false);
  const [monthlyGSTR1, setMonthlyGSTR1] = useState(false);
  const [daily, setDaily] = useState(false);

  const handleSave = () => {
    // You can replace this with your actual API logic
    console.log({
      weekly,
      monthly,
      monthlyGSTR1,
      daily,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={16} color="#fff" />
        </TouchableOpacity>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === "reminder" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("reminder")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "reminder" && styles.activeTabText,
              ]}
            >
              Reminder
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === "summary" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("summary")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "summary" && styles.activeTabText,
              ]}
            >
              Summary
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}

      {/* Reminder Content */}

      {activeTab === "reminder" && (
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.content}>
            {/* Credits */}
            {/* <View style={styles.creditsContainer}>
              <View style={styles.creditBox}>
                <Text style={styles.creditValue}>20.0</Text>
                <Text style={styles.creditLabel}>Total Credits Available</Text>
              </View>
              <View style={styles.creditBox}>
                <Text style={styles.creditValue}>100</Text>
                <Text style={styles.creditLabel}>SMS/E_mails can be sent</Text>
              </View>
            </View> */}

            {/* Reminder Toggles */}
            <View style={styles.mainconntainer}>
              <View style={styles.card}>
                <Text style={styles.note}>
                  *Email will be sent if any of these reminders are turned on
                </Text>
                <View style={styles.reminderRow}>
                  <Text style={styles.reminderLabel}>
                    Pending Invoices Reminder
                  </Text>
                  <TouchableOpacity style={styles.emailButton}>
                    <Text style={styles.emailText}>Email</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.reminderRow}>
                  <Text style={styles.reminderLabel}>
                    Low Stock Reminder{" "}
                    <Ionicons name="info" size={14} color="#000" />
                  </Text>
                  <TouchableOpacity style={styles.emailButton}>
                    <Text style={styles.emailText}>Email</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Reminders to Party */}
            <View style={styles.mainconntainer}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Reminders to Party</Text>
                  <Ionicons name="more-vert" size={20} color="#000" />
                </View>

                <Text style={styles.name}>
                  Name:{" "}
                  <Text style={{ fontWeight: "600", color: "#000" }}>
                    Reminder 1
                  </Text>
                </Text>
                <Text style={styles.reminderDays}>
                  Reminder days:{" "}
                  <Text style={{ fontWeight: "600", color: "#000" }}>
                    On Due Date
                  </Text>
                </Text>
                <Text style={styles.description}>
                  party will be reminded on due date
                </Text>

                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>SMS</Text>
                  <Text style={styles.statusLabel}>Email</Text>
                  <Text style={styles.statusLabel}>Active</Text>
                </View>
                <View style={styles.statusRow}>
                  <Ionicons name="check-circle" size={20} color="green" />
                  <Ionicons name="check-circle" size={20} color="green" />
                  <Ionicons name="times-circle" size={20} color="red" />
                </View>
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.fab}>
            <Text style={styles.fabPlus}>+</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === "summary" && (
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.contentBox}>
            <View style={styles.summarytab}>
              <ReminderItem
                label="Weekly Summary"
                value={weekly}
                onValueChange={setWeekly}
              />
              <ReminderItem
                label="Monthly Summary"
                value={monthly}
                onValueChange={setMonthly}
              />
              {/* <ReminderItem
                label="Monthly GSTR 1 Report"
                value={monthlyGSTR1}
                onValueChange={setMonthlyGSTR1}
              /> */}
              <ReminderItem
                label="Daily Summary"
                value={daily}
                onValueChange={setDaily}
              />
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save & Update</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Save Button */}
    </SafeAreaView>
  );
};

const ReminderItem: React.FC<ReminderItemProps> = ({
  label,
  value,
  onValueChange,
}) => (
  <View style={styles.itemRow}>
    <Text style={styles.itemLabel}>{label}</Text>

    <View style={styles.emailToggle}>
      <Text style={styles.emailLabel}>
        <Icon
          name="information"
          size={14}
          color="#999"
          style={{ marginHorizontal: 4 }}
        />{" "}
        Email
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  summarytab: {
    backgroundColor: "#fff",
    padding: 10,
  },

  headerText: { fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  orangeText: { color: "#FCA311" },
  content: { padding: 16 },
  creditsContainer: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFF5E5",
  },
  creditBox: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
  },
  creditValue: { fontSize: 16, fontWeight: "bold", color: "#000" },
  creditLabel: { fontSize: 13, color: "#333" },
  mainconntainer: {
    backgroundColor: "#FFF5E5",
    paddingHorizontal: 12,
    paddingBottom: 16,
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginTop: 16,
    borderRadius: 8,
  },
  note: { fontSize: 11, marginBottom: 10, color: "#444" },
  reminderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  reminderLabel: { fontWeight: "bold", color: "#000" },
  emailButton: {
    backgroundColor: "#FCA311",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  emailText: { color: "#fff", fontWeight: "600" },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: { fontWeight: "600", color: "#000" },
  name: { marginBottom: 4, color: "#000" },
  reminderDays: { marginBottom: 4, color: "#000" },
  description: { fontSize: 12, color: "#666", marginBottom: 12 },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    marginVertical: 4,
  },
  statusLabel: { fontSize: 12, fontWeight: "bold", color: "#000" },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#FF9100",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  fabPlus: { color: "#fff", fontSize: 30, fontWeight: "bold", marginTop: -2 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 10,
    paddingHorizontal: 16,
    marginLeft: 60,
    marginTop: 20,
  },
  tabItem: {
    marginRight: 20,
    paddingBottom: 4,
  },
  tabText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: "#FCA311",
  },
  activeTabText: {
    color: "#FCA311",
  },
  contentBox: {
    backgroundColor: "#FFF6E8",
    borderRadius: 8,
    padding: 12,
    gap: 12,
    marginHorizontal: 10,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    marginVertical: 5,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    flex: 1,
  },
  emailToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  emailLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#FCA311",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  saveButton: {
    marginTop: "auto",
    backgroundColor: "#FCA311",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 20,
    width: "80%",
    alignSelf: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: "50%",
    transform: [{ translateY: -16 }],
    backgroundColor: "#FCA311",
    borderRadius: 20,
    padding: 8,
  },
});

export default ReminderScreen;

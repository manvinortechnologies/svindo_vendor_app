import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  TextInput,
} from "react-native";
import Headerwithback from "./Headerwithback";
import CustomSwitch from "./CustomSwitch";
import Ionicons from "react-native-vector-icons/MaterialCommunityIcons";
import Bottomnavigation from "./Bottomnavigation";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
type RootStackParamList = {
  MyAccount: undefined;
  InvoiceTemplates: undefined;
  Signup: undefined;
};

// Type the navigation prop for this screen
type SignupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Signup"
>;

const InvoiceSettings = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const [toggles, setToggles] = useState({
    documentColor: false,
    showImages: false,
    showNetBalance: true,
    showPayments: false,
    showRoundOff: false,
    showDueDate: false,
    hideQuantity: false,
    showDispatchAddress: false,
    encryptPDF: true,
    showQuantityConversionRate: false,
    repeatHeader: false,
    showReceiverSignature: false,
    allowNegativeQuantity: false,
    enableHeader: false,
    showHSNSACSummary: true,
    showCompanyDetails: true,
    showConversionFactor: true,
    showinRs: true,
  });

  type ToggleKey = keyof typeof toggles;

  const toggleSwitch = (key: ToggleKey) => {
    setToggles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Headerwithback title="Invoice Settings" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Settings */}

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate("InvoiceTemplates")}
        >
          <View>
            <Text style={styles.settingTitle}>Invoice Templates</Text>
            <Text style={styles.settingDesc}>Customise invoice templates</Text>
          </View>
          <Icon name="chevron-right" color="black" size={24} />
        </TouchableOpacity>

        <View style={styles.settingItem}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Document Color</Text>
            <Text style={styles.settingDesc}>
              Customise invoice color with your brand color
            </Text>
          </View>
          <CustomSwitch
            value={toggles.documentColor}
            onValueChange={() => toggleSwitch("documentColor")}
          />
        </View>

        <TouchableOpacity style={styles.settingItem}>
          <View>
            <Text style={styles.settingTitle}>Manage Custom Header</Text>
            <Text style={styles.settingDesc}>
              Active fields will be shown in the invoice
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View>
            <Text style={styles.settingTitle}>Document prefix and suffix</Text>
            <Text style={styles.settingDesc}>
              Add multiple suffix and prefix for all your documents
            </Text>
          </View>
          <Icon name="chevron-right" color="black" size={24} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View>
            <Text style={styles.settingTitle}>Invoice Labels</Text>
            <Text style={styles.settingDesc}>
              Customise Invoice PDF Titles/Labels
            </Text>
          </View>
        </TouchableOpacity>

        {/* Language & Font Style Section */}
        <View style={styles.languageSection}>
          <Text style={styles.sectionTitle}>Language & Font Style</Text>
          <Text style={styles.sectionDesc}>
            You can select language in the pdf and font style
          </Text>

          {[
            { key: "showImages", label: "Show Images" },
            { key: "showNetBalance", label: "Show Net Balance" },
            { key: "showPayments", label: "Show Payments" },
            { key: "showRoundOff", label: "Show Round off" },
            { key: "showDueDate", label: "Show Due Date" },
            { key: "hideQuantity", label: "Hide Quantity" },
            { key: "showDispatchAddress", label: "Show Dispatch Address" },
            { key: "encryptPDF", label: "Encryption in PDF" },
            {
              key: "showQuantityConversionRate",
              label: "Show Quantity Conversion Rate",
            },
            { key: "repeatHeader", label: "Repeat Header" },
            {
              key: "showReceiverSignature",
              label: "Show Receiver's Signature",
            },
            { key: "allowNegativeQuantity", label: "Allow Negative Quantity" },
            { key: "enableHeader", label: "Enable Header" },
            { key: "showHSNSACSummary", label: "Show HSN/SAC Summary" },
            { key: "showCompanyDetails", label: "Show Company Details" },
          ].map((item) => (
            <View key={item.key} style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleLabel}>{item.label}</Text>
                <Text style={styles.settingDesc}>loremipsumloremi...</Text>
              </View>
              <CustomSwitch
                value={toggles[item.key as ToggleKey]}
                onValueChange={() => toggleSwitch(item.key as ToggleKey)}
              />
            </View>
          ))}
          <View style={styles.invoicesection}>
            <Text style={styles.inputLabel}>Document Footer</Text>
            <TextInput style={styles.input} placeholder="" />
            <Text style={styles.settingDesc}>loremipsumloremi...</Text>
            <Text style={[styles.inputLabel, { marginTop: 15 }]}>
              Tharmal Print Fotter
            </Text>
            <TextInput style={styles.input} placeholder="" />
            <Text style={styles.settingDesc}>loremipsumloremi...</Text>
          </View>
        </View>

        {/* Add Margin Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Add Margins to the Documents</Text>
          <Text style={styles.inputLabel}>Document Margin Top</Text>
          <TextInput style={styles.input} placeholder="" />
          <Text style={styles.settingDesc}>loremipsumloremi...</Text>
          <Text style={[styles.inputLabel, { marginTop: 15 }]}>
            Document Margin Bottom
          </Text>
          <TextInput style={styles.input} placeholder="" />
          <Text style={styles.settingDesc}>loremipsumloremi...</Text>
        </View>

        {/* Add Margin Section */}
        {/* Image Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>
            Invoice Header and Footer Images
          </Text>
          {[
            "Invoice Header Image",
            "Invoice Footer Image",
            "Watermark Image",
          ].map((item, idx) => (
            <View key={idx} style={styles.row}>
              <Text style={styles.title}>{item}</Text>
              <Ionicons name="add-circle-outline" size={24} color="black" />
            </View>
          ))}
        </View>

        <View style={styles.languageSection}>
          <Text style={styles.sectionTitle}>Export Invoice Setting </Text>
          {[
            { key: "showConversionFactor", label: "Show Conversion Factor" },
            { key: "showinRs", label: "Show in Rs" },
          ].map((item) => (
            <View key={item.key} style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleLabel}>{item.label}</Text>
                <Text style={styles.settingDesc}>loremipsumloremi...</Text>
              </View>
              <CustomSwitch
                value={toggles[item.key as ToggleKey]}
                onValueChange={() => toggleSwitch(item.key as ToggleKey)}
              />
            </View>
          ))}
        </View>
        <TouchableOpacity style={[styles.settingItem, { marginTop: 10 }]}>
          <View>
            <Text style={styles.settingTitle}>Get Custom Invoice</Text>
            <Text style={styles.settingDesc}>
              Get Customize Invoice Templates
            </Text>
          </View>
          <Icon name="chevron-right" color="black" size={24} />
        </TouchableOpacity>
      </ScrollView>
      <TouchableOpacity style={styles.updateBtn}>
        <Text style={styles.updateText}>Save and Update</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default InvoiceSettings;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#BCBCBC",
  },
  settingTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  settingDesc: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
  languageSection: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BCBCBC",
    marginTop: 20,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },

  invoicesection: {},
  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#BCBCBC",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: 12,
    color: "#888",
  },
  inputBlock: {
    marginTop: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#eee",
    borderRadius: 8,
    padding: 10,
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
    color: "#fff",
  },
});

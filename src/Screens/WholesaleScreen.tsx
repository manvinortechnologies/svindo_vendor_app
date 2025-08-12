import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Headerwithback from "./Headerwithback"; // Use your actual Headerwithback import path
import OptionInput from "../CommonComponent/OptionalInputs";

export default function WholesaleScreen() {
  const [selectedType, setSelectedType] = useState("Invoice");
  const [formData, setFormData] = useState({
    dispatchAddress: "",
    signature: "",
    references: "",
    notes: "",
    terms: "",
    shippingCharges: "",
    packagingCharges: "",
    ewayBill: "",
    lrNumber: "",
    vehicleNumber: "",
    transportName: "",
    parcels: "",
  });

  // Update handler
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Define the array of optional input fields at the top of your component
  const optionalFields = [
    { icon: "truck", label: "Dispatch Address", state: "dispatchAddress" },
    { icon: "pencil", label: "Select Signature", state: "signature" },
    { icon: "briefcase", label: "Add References", state: "references" },
    { icon: "file-document-edit", label: "Add Notes", state: "notes" },
    { icon: "file-document-outline", label: "Add Terms", state: "terms" },
    {
      icon: "currency-inr",
      label: "Delivery/ Shipping Charges",
      state: "shippingCharges",
      keyboardType: "numeric",
    },
    {
      icon: "currency-inr",
      label: "Packaging Charges",
      state: "packagingCharges",
      keyboardType: "numeric",
    },
    { icon: "file-multiple", label: "E-way Bill Number", state: "ewayBill" },
    {
      icon: null,
      label: "LR Number",
      state: "lrNumber",
      boldLabelPrefix: "LR",
    },
    { icon: "truck-fast", label: "Vehicle Number", state: "vehicleNumber" },
    { icon: "truck-delivery", label: "Transport Name", state: "transportName" },
    {
      icon: "cube-outline",
      label: "No. of Parcels",
      state: "parcels",
      keyboardType: "numeric",
    },
  ];

  return (
    <View style={styles.container}>
      <Headerwithback
        title="Wholesale "
        rightIcons={[
          <Icon
            name="format-list-text"
            size={25}
            color="#FFA700"
            key="search"
          />,
        ]}
      />
      <ScrollView style={styles.content}>
        {/* Document Type Selector */}
        <View style={styles.typeSelector}>
          {[
            "Invoice",
            "Pro Forma Invoice",
            "Quotation",
            "Credit Note",
            "Delivery Challan",
          ].map((type, idx) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                type === selectedType && styles.typeButtonActive, // Highlight 'Invoice'
              ]}
              onPress={() => setSelectedType(type)}
            >
              <Text
                style={
                  type === selectedType
                    ? styles.typeButtonTextActive
                    : styles.typeButtonText
                }
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Invoice Header */}
        <View style={styles.invoiceHeader}>
          <Text style={styles.invoiceId}>PINV-1</Text>
          <Text style={styles.invoiceDate}>14-02-2025</Text>
          <TouchableOpacity>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.optionalTitle}>Optional</Text>

        {/* Optional Fields List */}
        <View style={styles.optionalList}>
          {optionalFields.map((field) => (
            <OptionInput
              key={field.state}
              icon={field.icon}
              label={field.label}
              value={formData[field.state]}
              onChangeText={(text) => handleChange(field.state, text)}
              keyboardType={field.keyboardType}
              boldLabelPrefix={field.boldLabelPrefix}
            />
          ))}
        </View>

        {/* Proceed Button */}
        <TouchableOpacity style={styles.proceedButton}>
          <Text style={styles.proceedButtonText}>Proceed</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// Reusable Option List Item component
const OptionItem = ({ icon, label }) => (
  <TouchableOpacity style={styles.optionItem}>
    <Icon name={icon} size={18} color="#666" style={styles.optionIcon} />
    <Text style={styles.optionText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 40 : 0,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  typeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  typeButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "white",
  },
  typeButtonActive: {
    backgroundColor: "#FFA700",
    borderColor: "#FFA700",
  },
  typeButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  typeButtonTextActive: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  invoiceHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FCA3111C",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 24,
  },
  invoiceId: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
  },
  invoiceDate: {
    color: "#999",
    fontSize: 12,
    marginRight: 12,
  },
  editText: {
    color: "#FFA700",
    fontWeight: "bold",
    fontSize: 14,
  },
  optionalTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 12,
  },
  optionalList: {
    backgroundColor: "#FCA3111C",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#DEDEDE",
  },
  optionIcon: {
    marginRight: 16,
  },
  optionText: {
    color: "#666",
    fontSize: 14,
  },
  optionInput: {
    flex: 1,
    fontSize: 14,
    color: "#222",
    // borderBottomWidth: 1,
    // borderBottomColor: "#FFD272",
    paddingVertical: 2,
  },
  lrText: {
    fontWeight: "bold",
    marginRight: 10,
  },
  proceedButton: {
    marginTop: 30,
    backgroundColor: "#FFA700",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
  },
  proceedButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Headerwithback from "./Headerwithback";

const screenWidth = Dimensions.get("window").width;

const PaymentsScreen = () => {
  const [selectedType, setSelectedType] = useState<"You Gave" | "You Received">("You Gave");
  const [selectedParty, setSelectedParty] = useState<"Customer" | "Vendor">("Customer");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("UPI");

  const paymentMethods = ["UPI", "Cash", "Card", "Cheque", "EMI", "Netbanking"];

  return (
    <View style={styles.container}>
      <Headerwithback title="Payments" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Type */}
        <View style={styles.row}>
            <Text style={{fontSize: 14, color: '#000', fontWeight: '700'}}>Type</Text>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedType === "You Gave" && styles.activeButton,
            ]}
            onPress={() => setSelectedType("You Gave")}
          >
            <Text
              style={[
                styles.toggleButtonText,
                selectedType === "You Gave" && styles.activeButtonText,
              ]}
            >
              You Gave
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedType === "You Received" && styles.activeButton,
            ]}
            onPress={() => setSelectedType("You Received")}
          >
            <Text
              style={[
                styles.toggleButtonText,
                selectedType === "You Received" && styles.activeButtonText,
              ]}
            >
              You Received
            </Text>
          </TouchableOpacity>
        </View>

        {/* Party */}
        <View style={styles.row}>
            <Text style={{fontSize: 14, color: '#000', fontWeight: '700'}}>Party</Text>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedParty === "Customer" && styles.activeButton,
            ]}
            onPress={() => setSelectedParty("Customer")}
          >
            <Text
              style={[
                styles.toggleButtonText,
                selectedParty === "Customer" && styles.activeButtonText,
              ]}
            >
              Customer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedParty === "Vendor" && styles.activeButton,
            ]}
            onPress={() => setSelectedParty("Vendor")}
          >
            <Text
              style={[
                styles.toggleButtonText,
                selectedParty === "Vendor" && styles.activeButtonText,
              ]}
            >
              Vendor
            </Text>
          </TouchableOpacity>
        </View>

        {/* Select Party */}
        <Text style={styles.label}>Select Party</Text>
        <TextInput
          placeholder="Search"
          placeholderTextColor="#999"
          style={styles.input}
        />

        {/* Amount */}
        <Text style={styles.label}>Amount</Text>
        <TextInput
          placeholder="Enter here"
          placeholderTextColor="#999"
          keyboardType="numeric"
          style={styles.input}
        />

        {/* Payment Date */}
        <Text style={styles.label}>Payment Date</Text>
        <View style={styles.inputRow}>
          <TextInput
            placeholder="DD/MM/YYYY"
            placeholderTextColor="#999"
            style={[styles.input, { flex: 1 }]}
          />
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="calendar-today" size={20} color="#FCA311" />
          </TouchableOpacity>
        </View>

        {/* Select Type */}
        <Text style={[styles.label, { marginTop: 10 }]}>Select Type *</Text>
        <View style={styles.paymentRow}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                styles.paymentMethod,
                selectedPaymentMethod === method && styles.paymentMethodActive,
              ]}
              onPress={() => setSelectedPaymentMethod(method)}
            >
              <Text
                style={[
                  styles.paymentMethodText,
                  selectedPaymentMethod === method && styles.paymentMethodTextActive,
                ]}
              >
                {method}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Select Account */}
        <Text style={styles.label}>Select Account</Text>
        <TextInput
          placeholder=""
          placeholderTextColor="#999"
          style={styles.input}
        />

        {/* Notes */}
        <Text style={styles.label}>Notes</Text>
        <TextInput
          placeholder="Expense Description"
          placeholderTextColor="#999"
          style={styles.notesInput}
          multiline
        />

        {/* Attachments */}
        <Text style={styles.label}>Attachments</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.attachmentButton}>
            <Icon name="photo-camera" size={20} color="#000" />
            <Text style={styles.attachmentText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachmentButton}>
            <Icon name="upload-file" size={20} color="#000" />
            <Text style={styles.attachmentText}>Upload File</Text>
          </TouchableOpacity>
        </View>

        {/* Create Button */}
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default PaymentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 15
  },
  content: {
    padding: 16,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 10,
  },
  toggleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    paddingVertical: 4,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#FCA311",
  },
  toggleButtonText: {
    color: "#000",
    fontWeight: "500",
  },
  activeButtonText: {
    color: "#fff",
  },
  label: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#FFF8EB",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 10,
  },
  paymentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  paymentMethod: {
    width: '30%',
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#C3C3C3',
    alignItems: 'center'
  },
  paymentMethodActive: {
    backgroundColor: "#FCA311",
  },
  paymentMethodText: {
    fontSize: 14,
    color: "#fff",
  },
  paymentMethodTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 10,
    minHeight: 80,
    backgroundColor: "#FFF8EB",
  },
  attachmentButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 8,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFF8EB",
  },
  attachmentText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#000",
  },
  createButton: {
    width: '35%',
    alignSelf: 'flex-end',
    backgroundColor: "#FCA311",
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 20,
  },
  createButtonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
});

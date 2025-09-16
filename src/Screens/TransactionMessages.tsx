import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScaledSheet } from "react-native-size-matters";
import CustomHeader from "../CommonComponent/CustomHeader";
import Loading from "../CommonComponent/Loading";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";

const TransactionMessages = () => {
  const navigation = useNavigation();
  const [message, setMessage] = useState("");
  const [sendPaymentLink, setSendPaymentLink] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!message.trim()) {
      Alert.alert("Error", "Please enter a message");
      return;
    }

    try {
      setIsLoading(true);

      // API call to save transaction message settings
      const payload = {
        message: message.trim(),
        send_payment_link: sendPaymentLink,
      };

      // You can replace this with the actual API endpoint for transaction messages
      const response = await api.post(API_ROUTES.storeOnlineSetting, payload);

      Alert.alert(
        "Success",
        "Transaction message settings saved successfully",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error("Error saving transaction message:", error);
      Alert.alert("Error", "Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Enter Details" />
      <Loading visible={isLoading} />

      <View style={styles.content}>
        {/* Note Section */}
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            <Text style={styles.noteLabel}>Note: </Text>
            This message will be sent to all customers who will order online.
          </Text>
        </View>

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Enter message"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor="#999"
          />
        </View>

        {/* Checkbox Option */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setSendPaymentLink(!sendPaymentLink)}
          >
            <View
              style={[
                styles.checkboxSquare,
                sendPaymentLink && styles.checkboxChecked,
              ]}
            >
              {sendPaymentLink && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>
              Send Automated Payment Link for UPI payments, to customers if not
              a prepaid order.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TransactionMessages;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: "20@s",
    paddingTop: "20@s",
  },
  noteContainer: {
    marginBottom: "20@s",
  },
  noteLabel: {
    fontWeight: "600",
    color: "#000",
  },
  noteText: {
    fontSize: "14@s",
    color: "#666",
    lineHeight: "20@s",
  },
  inputContainer: {
    marginBottom: "30@s",
  },
  messageInput: {
    backgroundColor: "#FFF3E0",
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: "8@s",
    padding: "15@s",
    fontSize: "16@s",
    color: "#000",
    minHeight: "120@s",
    textAlignVertical: "top",
  },
  checkboxContainer: {
    marginBottom: "40@s",
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkboxSquare: {
    width: "20@s",
    height: "20@s",
    borderWidth: 2,
    borderColor: "#FCA311",
    borderRadius: "4@s",
    marginRight: "12@s",
    marginTop: "2@s",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: "#FCA311",
  },
  checkmark: {
    color: "#fff",
    fontSize: "12@s",
    fontWeight: "bold",
  },
  checkboxText: {
    flex: 1,
    fontSize: "14@s",
    color: "#333",
    lineHeight: "20@s",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: "16@s",
    paddingHorizontal: "24@s",
    borderRadius: "8@s",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: "20@s",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: "16@s",
    fontWeight: "600",
    textTransform: "lowercase",
  },
});

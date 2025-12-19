import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { API_ROUTES } from "../constants/api-routes.constants";
import api from "../services/api/api";
import Toast from "react-native-toast-message";

interface AdjustCashModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AdjustCashModal: React.FC<AdjustCashModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState("");
  const handleConfirm = async () => {
    if (!amount.trim()) {
      Toast.show({
        text1: "Please enter an amount",
        type: "error",
      });
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Toast.show({
        text1: "Please enter a valid amount",
        type: "error",
      });
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        amount: numericAmount.toFixed(2),
        note: note,
      };

      const response = await api.post(API_ROUTES.adjustCash, payload);

      setAmount("");
      onClose();
      onSuccess();
    } catch (error: any) {
      console.error("Error adjusting cash:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setAmount("");
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Adjust Cash Balance</Text>
            <TouchableOpacity onPress={handleClose} disabled={isLoading}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>Enter Amount</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount (e.g., 10500.00)"
              keyboardType="numeric"
              editable={!isLoading}
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Enter Note</Text>
            <TextInput
              style={styles.input}
              value={note}
              onChangeText={setNote}
              placeholder="Enter note"
              keyboardType="default"
              editable={!isLoading}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                isLoading && styles.disabledButton,
              ]}
              onPress={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.confirmButtonText}>Confirm</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = ScaledSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "20@s",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: "12@s",
    width: "100%",
    maxWidth: "400@s",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "20@s",
    paddingVertical: "15@s",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: "18@s",
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    padding: "20@s",
  },
  label: {
    fontSize: "14@s",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8@s",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: "8@s",
    paddingHorizontal: "15@s",
    paddingVertical: "8@s",
    fontSize: "14@s",
    color: "#333",
    backgroundColor: "#f9f9f9",
  },
  helperText: {
    fontSize: "12@s",
    color: "#666",
    marginVertical: "8@s",
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: "20@s",
    paddingBottom: "20@s",
    gap: "12@s",
  },
  button: {
    flex: 1,
    paddingVertical: "12@s",
    borderRadius: "8@s",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: "14@s",
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: "#FCA511",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: "14@s",
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default AdjustCashModal;

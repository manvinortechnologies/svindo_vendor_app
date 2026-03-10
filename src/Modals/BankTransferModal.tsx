import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { API_ROUTES } from "../constants/api-routes.constants";
import api from "../services/api/api";
import CustomDropdown, {
  DropDownOption,
} from "../CommonComponent/CustomDropdown";
import Toast from "react-native-toast-message";
import Modal from "react-native-modal";

interface BankTransferModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BankTransferModal: React.FC<BankTransferModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [selectedBank, setSelectedBank] = useState<DropDownOption | null>(null);
  const [bankList, setBankList] = useState<DropDownOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingBanks, setIsLoadingBanks] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      fetchBankList();
    }
  }, [visible]);

  const fetchBankList = async () => {
    try {
      setIsLoadingBanks(true);
      const response = await api.get(API_ROUTES.vendorBank);

      if (response.data) {
        const transformedBanks: DropDownOption[] = response.data?.map(
          (item: any) => ({
            id: item.id,
            name: item.name || item.bank_name || item.account_name,
          }),
        );
        setBankList(transformedBanks);
      }
    } catch (error: any) {
      console.error("Error fetching bank list:", error);
      Toast.show({
        text1: "Failed to load bank list",
        type: "error",
      });
    } finally {
      setIsLoadingBanks(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedBank) {
      Toast.show({
        text1: "Please select a bank account",
        type: "error",
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Toast.show({
        text1: "Please enter a valid amount",
        type: "error",
      });
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        bank_account: selectedBank.id,
        amount: parseFloat(amount).toFixed(2),
      };

      const response = await api.post(API_ROUTES.cashTransfer, payload);

      setAmount("");
      setSelectedBank(null);
      onClose();
      onSuccess();

      Toast.show({
        text1: "Bank transfer initiated successfully",
        type: "success",
      });
    } catch (error: any) {
      console.error("Error initiating bank transfer:", error);
      Toast.show({
        text1:
          error.response?.data?.message || "Failed to initiate bank transfer",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAmount("");
    setSelectedBank(null);
    onClose();
  };

  return (
    <Modal
      isVisible={visible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      onDismiss={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Cash to Bank Transfer</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {/* Bank Selection */}
            <Text style={styles.label}>Select Bank Account</Text>
            {isLoadingBanks ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#FCA311" />
                <Text style={styles.loadingText}>Loading banks...</Text>
              </View>
            ) : (
              <CustomDropdown
                placeholder="Select Bank Account"
                options={bankList}
                onSelect={(option) => setSelectedBank(option)}
                selectedValue={selectedBank?.id || null}
                dropDownBoxStyle={styles.dropdown}
              />
            )}

            {/* Amount Input */}
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              placeholderTextColor="#999"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              returnKeyType="done"
            />

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleClose}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleConfirm}
                disabled={isLoading || !selectedBank || !amount}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>Continue</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = ScaledSheet.create({
  overlay: {
    flex: 1,
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
    marginTop: 12,
  },
  dropdown: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#FFF8EB",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 8,
    backgroundColor: "#FFF8EB",
  },
  loadingText: {
    marginLeft: 8,
    color: "#FCA311",
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  confirmButton: {
    backgroundColor: "#FCA311",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default BankTransferModal;

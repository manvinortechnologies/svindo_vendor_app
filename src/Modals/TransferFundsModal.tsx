import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { API_ROUTES } from "../constants/api-routes.constants";
import api from "../services/api/api";
import CustomDropdown, {
  DropDownOption,
} from "../CommonComponent/CustomDropdown";

interface TransferFundsModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TransferFundsModal: React.FC<TransferFundsModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [fromBank, setFromBank] = useState<DropDownOption | null>(null);
  const [toBank, setToBank] = useState<DropDownOption | null>(null);
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
      const response = await api.get(API_ROUTES.vendorAddBank);

      if (response.data) {
        const transformedBanks: DropDownOption[] = response.data?.map(
          (item: any) => ({
            id: item.id,
            name: item.name || item.bank_name || item.account_name,
          })
        );
        setBankList(transformedBanks);
      }
    } catch (error: any) {
      console.error("Error fetching bank list:", error);
      Alert.alert("Error", "Failed to load bank list");
    } finally {
      setIsLoadingBanks(false);
    }
  };

  const handleConfirm = async () => {
    if (bankList.length < 2) {
      Alert.alert(
        "Insufficient Bank Accounts",
        "You need at least 2 bank accounts to transfer funds internally. Please add more bank accounts first.",
        [
          {
            text: "OK",
            onPress: () => onClose(),
          },
        ]
      );
      return;
    }

    if (!fromBank) {
      Alert.alert("Error", "Please select a source bank account");
      return;
    }

    if (!toBank) {
      Alert.alert("Error", "Please select a destination bank account");
      return;
    }

    if (fromBank.id === toBank.id) {
      Alert.alert("Error", "Source and destination banks cannot be the same");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        from_bank_id: fromBank.id,
        to_bank_id: toBank.id,
        amount: parseFloat(amount).toFixed(2),
        notes: notes || "",
      };

      const response = await api.post(API_ROUTES.bankToBankTransfer, payload);

      setAmount("");
      setNotes("");
      setFromBank(null);
      setToBank(null);
      onClose();
      onSuccess();

      Alert.alert("Success", "Bank transfer completed successfully");
    } catch (error: any) {
      console.error("Error initiating bank transfer:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to complete bank transfer"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAmount("");
    setNotes("");
    setFromBank(null);
    setToBank(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Transfer Funds</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {bankList.length < 2 ? (
              /* Insufficient Banks Message */
              <View style={styles.insufficientBanksContainer}>
                <Icon name="bank-outline" size={48} color="#FCA311" />
                <Text style={styles.insufficientBanksTitle}>
                  Insufficient Bank Accounts
                </Text>
                <Text style={styles.insufficientBanksMessage}>
                  You need at least 2 bank accounts to transfer funds
                  internally. Please add more bank accounts first.
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={handleClose}
                  >
                    <Text style={styles.cancelButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              /* Normal Transfer Form */
              <>
                {/* From Bank Selection */}
                <Text style={styles.label}>From Bank Account</Text>
                {isLoadingBanks ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#FCA311" />
                    <Text style={styles.loadingText}>Loading banks...</Text>
                  </View>
                ) : (
                  <CustomDropdown
                    placeholder="Select source bank"
                    options={bankList}
                    onSelect={(option) => setFromBank(option)}
                    selectedValue={fromBank?.id || null}
                    dropDownBoxStyle={styles.dropdown}
                  />
                )}

                {/* To Bank Selection */}
                <Text style={styles.label}>To Bank Account</Text>
                {isLoadingBanks ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#FCA311" />
                    <Text style={styles.loadingText}>Loading banks...</Text>
                  </View>
                ) : (
                  <CustomDropdown
                    placeholder="Select destination bank"
                    options={bankList}
                    onSelect={(option) => setToBank(option)}
                    selectedValue={toBank?.id || null}
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

                {/* Notes Input */}
                <Text style={styles.label}>Notes (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.notesInput]}
                  placeholder="Enter transfer notes"
                  placeholderTextColor="#999"
                  value={notes}
                  onChangeText={setNotes}
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
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
                    disabled={isLoading || !fromBank || !toBank || !amount}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.confirmButtonText}>Confirm</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
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
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "90%",
    maxWidth: 400,
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
  notesInput: {
    height: 80,
    textAlignVertical: "top",
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
  insufficientBanksContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  insufficientBanksTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  insufficientBanksMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
});

export default TransferFundsModal;

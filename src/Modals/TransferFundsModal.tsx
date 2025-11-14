import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { API_ROUTES } from "../constants/api-routes.constants";
import api from "../services/api/api";
import CustomDropdown, {
  DropDownOption,
} from "../CommonComponent/CustomDropdown";
import Toast from "react-native-toast-message";

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
  const [errors, setErrors] = useState<{
    fromBank?: string;
    toBank?: string;
    amount?: string;
  }>({});

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
      Toast.show({
        text1: "Error",
        type: "error",
        text2: "Failed to load bank list",
      });
    } finally {
      setIsLoadingBanks(false);
    }
  };

  const handleConfirm = async () => {
    // Reset errors
    setErrors({});

    // Validate fields
    const newErrors: {
      fromBank?: string;
      toBank?: string;
      amount?: string;
    } = {};

    if (!fromBank) {
      newErrors.fromBank = "Please select a source bank account";
    }

    if (!toBank) {
      newErrors.toBank = "Please select a destination bank account";
    }

    if (fromBank && toBank && fromBank.id === toBank.id) {
      newErrors.toBank = "Source and destination banks cannot be the same";
    }

    if (!amount || parseFloat(amount) <= 0 || isNaN(parseFloat(amount))) {
      newErrors.amount = "Please enter a valid amount";
    }

    // If there are errors, set them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        from_bank_id: fromBank!.id,
        to_bank_id: toBank!.id,
        amount: parseFloat(amount).toFixed(2),
        notes: notes || "",
      };

      const response = await api.post(API_ROUTES.bankToBankTransfer, payload);

      setAmount("");
      setNotes("");
      setFromBank(null);
      setToBank(null);
      setErrors({});
      onClose();
      onSuccess();

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Bank transfer completed successfully",
      });
    } catch (error: any) {
      console.error("Error initiating bank transfer:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.message || "Failed to complete bank transfer",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAmount("");
    setNotes("");
    setFromBank(null);
    setToBank(null);
    setErrors({});
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
                    onSelect={(option) => {
                      setFromBank(option);
                      if (errors.fromBank) {
                        setErrors((prev) => ({ ...prev, fromBank: undefined }));
                      }
                    }}
                    selectedValue={fromBank?.id || null}
                    dropDownBoxStyle={[
                      styles.dropdown,
                      errors.fromBank && styles.dropdownError,
                    ]}
                  />
                )}
                {errors.fromBank && (
                  <Text style={styles.errorText}>{errors.fromBank}</Text>
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
                    onSelect={(option) => {
                      setToBank(option);
                      if (errors.toBank) {
                        setErrors((prev) => ({ ...prev, toBank: undefined }));
                      }
                    }}
                    selectedValue={toBank?.id || null}
                    dropDownBoxStyle={[
                      styles.dropdown,
                      errors.toBank && styles.dropdownError,
                    ]}
                  />
                )}
                {errors.toBank && (
                  <Text style={styles.errorText}>{errors.toBank}</Text>
                )}

                {/* Amount Input */}
                <Text style={styles.label}>Amount</Text>
                <TextInput
                  style={[styles.input, errors.amount && styles.inputError]}
                  placeholder="Enter amount"
                  placeholderTextColor="#999"
                  value={amount}
                  onChangeText={(text) => {
                    setAmount(text);
                    if (errors.amount) {
                      setErrors((prev) => ({ ...prev, amount: undefined }));
                    }
                  }}
                  keyboardType="numeric"
                  returnKeyType="done"
                />
                {errors.amount && (
                  <Text style={styles.errorText}>{errors.amount}</Text>
                )}

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
  inputError: {
    borderColor: "#FF0000",
  },
  dropdownError: {
    borderColor: "#FF0000",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
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

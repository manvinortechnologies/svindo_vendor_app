import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  FlatList,
  RefreshControl,
  KeyboardTypeOptions,
  GestureResponderEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Headerwithback from "./Headerwithback";
import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";
import AddBankDetailsModal from "../Modals/AddBankDetailsModal";
import TransferFundsModal from "../Modals/TransferFundsModal";
import { BankDetails } from "../type/common";
import { API_ROUTES } from "../constants/api-routes.constants";
import { ScaledSheet } from "react-native-size-matters";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import { InputBox } from "../CommonComponent/InputBox";

type BankEditFieldKey =
  | "name"
  | "account_holder"
  | "account_number"
  | "ifsc_code"
  | "branch";

const editFieldConfigs: Array<{
  key: BankEditFieldKey;
  label: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}> = [
  { key: "name", label: "Bank Name" },
  { key: "account_holder", label: "Account Holder Name" },
  { key: "account_number", label: "Account Number", keyboardType: "numeric" },
  { key: "ifsc_code", label: "IFSC Code", autoCapitalize: "characters" },
  { key: "branch", label: "Branch" },
];

const BankAccounts = ({ navigation }: any) => {
  const [cash, setCash] = useState<string>("00.00");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [bankList, setBankList] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeBank, setActiveBank] = useState<any | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    account_holder: "",
    account_number: "",
    ifsc_code: "",
    branch: "",
  });
  const [editErrors, setEditErrors] = useState<Partial<typeof editForm>>({});
  const [actionLoading, setActionLoading] = useState(false);
  useEffect(() => {
    getCash();
  }, []);

  const getCash = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(API_ROUTES.vendorCash);
      const res2 = await api.get(API_ROUTES.vendorAddBank);
      if (res.data) {
        setCash(res.data.balance);
      }
      if (res2.data) {
        setBankList(res2.data);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getCash();
    } catch (error) {
      console.log("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSaveBankDetails = async (details: BankDetails) => {
    try {
      setIsLoading(true);
      const res = await api.post(API_ROUTES.vendorAddBank, details);
      console.log("res-->", res);
      getCash();
    } catch (error) {
      console.log("bank api Error 41--", error);
    } finally {
      setIsLoading(false);
    }
    // Submit to API or save locally
  };

  const populateEditForm = (bank: any) => {
    setEditForm({
      name: bank?.name || "",
      account_holder: bank?.account_holder || "",
      account_number: bank?.account_number?.toString() || "",
      ifsc_code: bank?.ifsc_code || "",
      branch: bank?.branch || "",
    });
    setEditErrors({});
  };

  const ensureBankSelected = (bank?: any) => {
    if (bank) return bank;
    Toast.show({
      type: "info",
      text1: "Select a bank",
      text2: "Use the edit/delete button on a bank card.",
    });
    return null;
  };

  const handleOpenEdit = (bankArg?: any) => {
    const target = ensureBankSelected(bankArg);
    if (!target) return;
    setActiveBank(target);
    populateEditForm(target);
    setShowEditModal(true);
  };

  const handleOpenDelete = (bankArg?: any) => {
    const target = ensureBankSelected(bankArg);
    if (!target) return;
    setActiveBank(target);
    setShowDeleteModal(true);
  };

  const validateEditForm = () => {
    const errors: Partial<typeof editForm> = {};
    if (!editForm.name.trim()) errors.name = "Bank name is required";
    if (!editForm.account_holder.trim())
      errors.account_holder = "Account holder is required";
    if (!editForm.account_number.trim())
      errors.account_number = "Account number is required";
    if (!/^\d{9,18}$/.test(editForm.account_number.trim()))
      errors.account_number = "Account number must be 9-18 digits";
    if (!editForm.ifsc_code.trim()) errors.ifsc_code = "IFSC code is required";
    if (!/^[A-Za-z]{4}[a-zA-Z0-9]{8}$/.test(editForm.ifsc_code.trim()))
      errors.ifsc_code = "Enter a valid IFSC BARB0ABCDEF / HDFC0000123";
    if (!editForm.branch.trim()) errors.branch = "Branch is required";
    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateBank = async () => {
    if (!activeBank) return;
    if (!validateEditForm()) return;
    try {
      setActionLoading(true);
      await api.put(
        `${API_ROUTES.vendorBankDetail}${activeBank.id}/`,
        editForm
      );
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Bank details updated",
      });
      setShowEditModal(false);
      getCash();
    } catch (error: any) {
      console.log("Update bank error", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message || "Failed to update bank",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBank = async () => {
    if (!activeBank) return;
    try {
      setActionLoading(true);
      await api.delete(`${API_ROUTES.vendorBankDetail}${activeBank.id}/`);
      Toast.show({
        type: "success",
        text1: "Deleted",
        text2: "Bank account removed",
      });
      setShowDeleteModal(false);
      getCash();
    } catch (error: any) {
      console.log("Delete bank error", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message || "Failed to delete bank",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleTransferSuccess = () => {
    getCash(); // Refresh the data after successful transfer
  };
  return (
    <SafeAreaView style={styles.container}>
      <Headerwithback title="Bank Account" />

      <FlatList
        contentContainerStyle={styles.contentContainer}
        keyExtractor={(item) => item.id.toString()}
        data={bankList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FCA311"]} // Android
            tintColor="#FCA311" // iOS
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("BankNameScreen", {
                bankId: item.id,
                bank: item,
              })
            }
            style={[styles.card, styles.accCard]}
          >
            <View style={styles.rowBetween}>
              <Image
                source={require("../assets/bank.png")}
                style={styles.icon}
              />
              <View style={styles.bankInfoText}>
                <Text
                  style={styles.title}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </Text>
                <Text
                  style={styles.accName}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.account_holder}
                </Text>
              </View>
              <View>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.cardActionButton}
                    onPress={(event: GestureResponderEvent) => {
                      event.stopPropagation();
                      handleOpenEdit(item);
                    }}
                  >
                    <Icon name="create-outline" size={18} color="#4A4A4A" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cardActionButton}
                    onPress={(event: GestureResponderEvent) => {
                      event.stopPropagation();
                      handleOpenDelete(item);
                    }}
                  >
                    <Icon name="trash-outline" size={18} color="#D32F2F" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.accBalance}>₹ {item.balance}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListHeaderComponent={() => (
          <View>
            {/* Add Bank Card */}
            <View style={styles.card}>
              <View style={styles.row}>
                <Image
                  source={require("../assets/bank.png")}
                  style={styles.icon}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>
                    Add your bank & UPI to Invoices
                  </Text>
                  <Text style={styles.description}>
                    Let your customers pay you directly from the invoice no
                    fuss, no delays
                  </Text>
                </View>
              </View>
            </View>

            {/* Accounts Label */}
            <Text style={styles.sectionTitle}>Accounts</Text>

            {/* Cash Card */}
            <View style={styles.card}>
              <View style={styles.row}>
                <Image
                  source={require("../assets/money.png")}
                  style={styles.icon}
                />
                <View>
                  <Text style={styles.title}>Cash</Text>
                  <Text style={styles.amount}>Rs {cash}</Text>
                </View>
              </View>
            </View>

            {/* Transfer Funds Card */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => setIsTransferModalVisible(true)}
            >
              <View style={styles.row}>
                <Image
                  source={require("../assets/transfer.png")}
                  style={styles.icon}
                />
                <View>
                  <Text style={styles.title}>Transfer funds</Text>
                  <Text style={styles.description}>
                    Transfer funds between internal banks
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Add New Bank Button */}
      <TouchableOpacity
        onPress={() => {
          setIsModalVisible(true);
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Add New Bank</Text>
      </TouchableOpacity>
      <AddBankDetailsModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleSaveBankDetails}
      />
      <TransferFundsModal
        visible={isTransferModalVisible}
        onClose={() => setIsTransferModalVisible(false)}
        onSuccess={handleTransferSuccess}
      />
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.actionModalOverlay}>
          <View style={styles.editModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Bank Details</Text>
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={22} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollContent}>
              {editFieldConfigs.map((field) => (
                <View key={field.key} style={{ marginBottom: 12 }}>
                  <InputBox
                    label={field.label}
                    value={editForm[field.key]}
                    placeholder={field.label}
                    onChangeText={(text) =>
                      setEditForm((prev) => ({
                        ...prev,
                        [field.key]:
                          field.key === "ifsc_code" ? text.toUpperCase() : text,
                      }))
                    }
                    keyboardType={field.keyboardType || "default"}
                    autoCapitalize={field.autoCapitalize || "sentences"}
                    background="#FFF8ED"
                    styless={{ marginBottom: 0 }}
                  />
                  {editErrors[field.key] && (
                    <Text style={styles.inlineErrorText}>
                      {editErrors[field.key]}
                    </Text>
                  )}
                </View>
              ))}
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
                disabled={actionLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.applyButton,
                  actionLoading && styles.disabledButton,
                ]}
                onPress={handleUpdateBank}
                disabled={actionLoading}
              >
                <Text style={styles.applyButtonText}>
                  {actionLoading ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.actionModalOverlay}>
          <View style={styles.confirmModalContainer}>
            <Text style={styles.modalTitle}>Delete Bank Account</Text>
            <Text style={styles.confirmMessage}>
              Are you sure you want to delete this bank account? This action
              cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
                disabled={actionLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.deleteButton,
                  actionLoading && styles.disabledButton,
                ]}
                onPress={handleDeleteBank}
                disabled={actionLoading}
              >
                <Text style={styles.deleteButtonText}>
                  {actionLoading ? "Deleting..." : "Delete"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Loading visible={isLoading} />
    </SafeAreaView>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: "16@s",
    paddingBottom: "60@s",
  },
  card: {
    backgroundColor: "#FFF7EB",
    borderColor: "#FCA311",
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  bankInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    // flex: 1,
    gap: 10,
  },
  bankInfoText: {
    flex: 1,
    // width: "50%",
    maxWidth: "60%",
  },
  icon: {
    width: "26@s",
    height: "26@s",
    marginRight: "8@s",
    resizeMode: "contain",
  },
  title: {
    fontSize: "12@s",
    fontWeight: "600",
    color: "#000",
  },
  description: {
    fontSize: "10@s",
    color: "#333",
    marginTop: 2,
    // width: "80%",
  },
  sectionTitle: {
    fontSize: "14@s",
    fontWeight: "700",
    marginBottom: 8,
    color: "#000",
  },
  amount: {
    fontSize: "14@s",
    color: "green",
    fontWeight: "700",
  },
  accName: {
    fontSize: "10@s",
    color: "#000",
  },
  accBalance: {
    fontSize: "12@s",
    color: "#000",
    textAlign: "right",
    marginTop: "5@s",
  },
  accCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  cardActionButton: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 20,
    backgroundColor: "#FFF1DC",
  },
  footer: {
    padding: "16@s",
    backgroundColor: "#fff",
  },
  button: {
    position: "absolute",
    bottom: "20@s",
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: "#FCA311",
    paddingVertical: "10@s",
    paddingHorizontal: "20@s",
    borderRadius: "8@s",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
    marginHorizontal: "100@s",
  },
  buttonText: {
    color: "#fff",
    fontSize: "12@s",
    fontWeight: "600",
  },
  actionModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  editModalContainer: {
    width: "100%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
  confirmModalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  deleteButton: {
    backgroundColor: "#D32F2F",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalScrollContent: {
    padding: 20,
  },
  inlineErrorText: {
    color: "#f44336",
    fontSize: 12,
    marginTop: 4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  closeButton: {
    padding: 4,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  applyButton: {
    backgroundColor: "#FCA311",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
  confirmMessage: {
    fontSize: 14,
    color: "#4A4A4A",
    marginVertical: 16,
    lineHeight: 20,
  },
});

export default BankAccounts;

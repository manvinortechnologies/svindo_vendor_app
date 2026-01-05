import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  RefreshControl,
  GestureResponderEvent,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Headerwithback from "./Headerwithback";
import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";
import AddBankDetailsModal, {
  BankDetails as ModalBankDetails,
} from "../Modals/AddBankDetailsModal";
import TransferFundsModal from "../Modals/TransferFundsModal";
import { BankDetails } from "../type/common";
import { API_ROUTES } from "../constants/api-routes.constants";
import { s, ScaledSheet } from "react-native-size-matters";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";

const BankAccounts = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [cash, setCash] = useState<string>("00.00");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [bankList, setBankList] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeBank, setActiveBank] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  useEffect(() => {
    getCash();
  }, []);

  const getCash = async () => {
    try {
      setIsLoading(true);
      // const res = await api.get(API_ROUTES.vendorCash);
      const res2 = await api.get(API_ROUTES.vendorAddBank);

      if (res2.data) {
        const totalBalance = res2.data.reduce(
          (acc: number, item: any) => acc + Number(item.balance),
          0
        );
        setCash(totalBalance);
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
    setIsModalVisible(true);
  };

  const handleOpenDelete = (bankArg?: any) => {
    const target = ensureBankSelected(bankArg);
    if (!target) return;
    setActiveBank(target);
    setShowDeleteModal(true);
  };

  const handleUpdateBank = async (bankDetails: ModalBankDetails) => {
    if (!activeBank) return;
    try {
      setActionLoading(true);
      const { id, opening_balance, ...updateData } = bankDetails;
      await api.put(
        `${API_ROUTES.vendorBankDetail}${activeBank.id}/`,
        updateData
      );
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Bank details updated",
      });
      setIsModalVisible(false);
      setActiveBank(null);
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
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Headerwithback title="Bank Account" />

      <FlatList
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + s(10) },
        ]}
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
            style={[styles.card]}
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
                {!item.online_order_bank && (
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
                )}
                <Text style={styles.accBalance}>₹ {item.balance}</Text>
              </View>
            </View>
            {item.online_order_bank && (
              <Text style={styles.accBalance}>
                Online order amount will show in this account
              </Text>
            )}
          </TouchableOpacity>
        )}
        ListHeaderComponent={() => (
          <View>
            {/* Add Bank Card */}
            {/* <View style={styles.card}>
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
            </View> */}

            {/* Accounts Label */}
            <Text style={styles.sectionTitle}>Accounts</Text>

            {/* Cash Card */}
            <View style={styles.card}>
              <View style={styles.row}>
                <View style={styles.iconContainer}>
                  <MaterialIcon
                    name="account-balance-wallet"
                    size={s(25)}
                    color="#FCA311"
                  />
                </View>
                <View>
                  <Text style={styles.title}>Total Bank Balance</Text>
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
        style={[styles.button, { bottom: insets.bottom + s(20) }]}
      >
        <Text style={styles.buttonText}>Add New Bank</Text>
      </TouchableOpacity>
      <AddBankDetailsModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setActiveBank(null);
        }}
        onSubmit={handleSaveBankDetails}
        editBankDetails={activeBank}
        onUpdate={handleUpdateBank}
      />
      <TransferFundsModal
        visible={isTransferModalVisible}
        onClose={() => setIsTransferModalVisible(false)}
        onSuccess={handleTransferSuccess}
      />
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
    </View>
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
  iconContainer: {
    // padding: 10,
    height: "26@s",
    width: "26@s",
    marginRight: "8@s",
    justifyContent: "center",
    alignItems: "center",
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

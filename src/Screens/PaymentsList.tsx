import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import MainContainer from "../CommonComponent/MainContainer";
import CustomHeader from "../CommonComponent/CustomHeader";
import Loading from "../CommonComponent/Loading";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import { HomeNavigation } from "../constants/app-routes.constants";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import moment from "moment";
import CustomModal from "../Modals/CustomModal";
import DeleteModal from "./DeleteModal";

interface CustomerDetails {
  id: number;
  name: string;
  email: string;
  contact: string;
  opening_balance: number;
  balance: number;
  company_name: string;
  gst_number: string;
  aadhar_number: string;
  pan_number: string;
  billing_address_line1: string;
  billing_address_line2: string;
  billing_pincode: string;
  billing_city: string;
  billing_state: string;
  billing_country: string;
  dispatch_address_line1: string;
  dispatch_address_line2: string;
  dispatch_pincode: string;
  dispatch_city: string;
  dispatch_state: string;
  dispatch_country: string;
  transport_name: string;
  user: number;
}

interface VendorDetails {
  id: number;
  name: string;
  email: string;
  contact: string;
  // Add other vendor fields as needed
}

interface Payment {
  id: number;
  customer_details: CustomerDetails | null;
  vendor_details: VendorDetails | null;
  type: "gave" | "received";
  amount: string;
  payment_date: string;
  payment_type: "cash" | "upi" | "bank" | "card";
  notes: string;
  attachment: string | null;
  user: number;
  vendor: number | null;
  customer: number | null;
  bank: number | null;
}

const PaymentsList = () => {
  const navigation = useNavigation();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isFocused = useIsFocused();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // Fetch payments data from API
  const fetchPayments = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await api.get(API_ROUTES.paymnet);
      setPayments(response.data || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
      Alert.alert("Error", "Failed to load payments. Please try again.");
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  // Handle pull to refresh
  const onRefresh = () => {
    fetchPayments(true);
  };

  useEffect(() => {
    fetchPayments();
  }, [isFocused]);

  const formatDate = (dateString: string) => {
    return moment(dateString).format("DD MMM YYYY");
  };

  const getPaymentTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "upi":
        return "phone-portrait-outline";
      case "cash":
        return "cash-outline";
      case "bank":
        return "card-outline";
      case "card":
        return "card-outline";
      default:
        return "wallet-outline";
    }
  };

  const getPaymentTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "upi":
        return "#4CAF50";
      case "cash":
        return "#FF9800";
      case "bank":
        return "#2196F3";
      case "card":
        return "#9C27B0";
      default:
        return "#666";
    }
  };

  const handlePaymentPress = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedPayment(null);
    setIsEditing(false);
  };

  // Delete payment function
  const handleDeletePayment = async () => {
    if (!selectedPayment) return;

    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`${API_ROUTES.paymnet}${selectedPayment?.id}/`);

      // Remove payment from local state
      setPayments((prevPayments) =>
        prevPayments.filter((payment) => payment.id !== selectedPayment?.id)
      );

      // Close modal
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting payment:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Edit payment function
  const handleEditPayment = () => {
    if (!selectedPayment) return;

    // Navigate to edit payment screen with the selected payment data
    (navigation as any).navigate(HomeNavigation.PAYMENTSCREEN, {
      editMode: true,
      paymentData: selectedPayment,
    });

    // Close modal
    handleCloseModal();
  };

  const renderPaymentItem = ({ item }: { item: Payment }) => {
    const isReceived = item.type === "received";
    const partyName =
      item.customer_details?.name || item.vendor_details?.name || "Unknown";
    const partyType = item.customer_details ? "Customer" : "Vendor";

    return (
      <TouchableOpacity
        style={styles.paymentItem}
        onPress={() => handlePaymentPress(item)}
      >
        <View style={styles.paymentHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.partyInfo}>
              <Text style={styles.partyType}>{partyType} : </Text>
              <Text style={styles.partyName}>{partyName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Type : </Text>
              <Text style={styles.detailValue}>
                {item.payment_type.toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text
              style={[
                styles.amount,
                { color: isReceived ? "#4CAF50" : "#F44336" },
              ]}
            >
              {isReceived ? "+" : "-"}₹{Number(item.amount).toFixed(2)}
            </Text>
            <Text style={styles.paymentDate}>
              {formatDate(item.payment_date)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Group payments by date
  const groupedPayments = payments.reduce((groups, payment) => {
    const date = formatDate(payment.payment_date);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(payment);
    return groups;
  }, {} as Record<string, Payment[]>);

  const renderDateGroup = ({ item: date }: { item: string }) => (
    <View style={styles.dateGroup}>
      <Text style={styles.dateHeader}>{date}</Text>
      {groupedPayments[date].map((payment) => (
        <View key={payment.id}>{renderPaymentItem({ item: payment })}</View>
      ))}
    </View>
  );

  // Calculate totals
  const totalReceived = payments
    .filter((p) => p.type === "received")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const totalGiven = payments
    .filter((p) => p.type === "gave")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const netAmount = totalReceived - totalGiven;

  return (
    <MainContainer>
      <View style={styles.container}>
        <Loading visible={isLoading} />

        <CustomHeader
          title="Payments"
          rightIcon={
            <TouchableOpacity
              style={styles.addButton}
              onPress={() =>
                (navigation as any).navigate(HomeNavigation.PAYMENTSCREEN)
              }
            >
              <Icon name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          }
        />

        {/* Summary Banner */}
        <View style={styles.summaryBanner}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Received</Text>
            <Text style={[styles.summaryAmount, { color: "#4CAF50" }]}>
              ₹{totalReceived.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Given</Text>
            <Text style={[styles.summaryAmount, { color: "#F44336" }]}>
              ₹{totalGiven.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Net</Text>
            <Text
              style={[
                styles.summaryAmount,
                { color: netAmount >= 0 ? "#4CAF50" : "#F44336" },
              ]}
            >
              ₹{Math.abs(netAmount).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Payments List */}
        <FlatList
          data={Object.keys(groupedPayments)}
          renderItem={renderDateGroup}
          keyExtractor={(date) => date}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={["#FCA311"]}
              tintColor="#FCA311"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="receipt-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No payments found</Text>
              <Text style={styles.emptySubText}>
                Pull down to refresh or add a new payment
              </Text>
            </View>
          }
        />
      </View>

      {/* Payment Details Modal */}
      <CustomModal
        visible={isModalVisible}
        title="Payment Details"
        onClose={handleCloseModal}
        modalStyle={{ flex: 1 }}
      >
        {selectedPayment && (
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalAmount}>
                {selectedPayment.type === "received" ? "+" : "-"}₹
                {Number(selectedPayment.amount).toFixed(2)}
              </Text>
              <Text
                style={[
                  styles.modalTransactionType,
                  {
                    color:
                      selectedPayment.type === "received"
                        ? "#4CAF50"
                        : "#F44336",
                  },
                ]}
              >
                {selectedPayment.type === "received"
                  ? "Money Received"
                  : "Money Given"}
              </Text>
            </View>

            <View style={styles.modalDetails}>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalLabel}>Payment ID:</Text>
                <Text style={styles.modalValue}>#{selectedPayment.id}</Text>
              </View>

              <View style={styles.modalDetailRow}>
                <Text style={styles.modalLabel}>Date:</Text>
                <Text style={styles.modalValue}>
                  {formatDate(selectedPayment.payment_date)}
                </Text>
              </View>

              <View style={styles.modalDetailRow}>
                <Text style={styles.modalLabel}>Payment Type:</Text>
                <Text style={styles.modalValue}>
                  {selectedPayment.payment_type.toUpperCase()}
                </Text>
              </View>

              <View style={styles.modalDetailRow}>
                <Text style={styles.modalLabel}>Party Type:</Text>
                <Text style={styles.modalValue}>
                  {selectedPayment.customer_details ? "Customer" : "Vendor"}
                </Text>
              </View>

              <View style={styles.modalDetailRow}>
                <Text style={styles.modalLabel}>Party Name:</Text>
                <Text style={styles.modalValue}>
                  {selectedPayment.customer_details?.name ||
                    selectedPayment.vendor_details?.name ||
                    "Unknown"}
                </Text>
              </View>

              {(selectedPayment.customer_details?.contact ||
                selectedPayment.vendor_details?.contact) && (
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalLabel}>Contact:</Text>
                  <Text style={styles.modalValue}>
                    {selectedPayment.customer_details?.contact ||
                      selectedPayment.vendor_details?.contact}
                  </Text>
                </View>
              )}

              {(selectedPayment.customer_details?.email ||
                selectedPayment.vendor_details?.email) && (
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalLabel}>Email:</Text>
                  <Text style={styles.modalValue}>
                    {selectedPayment.customer_details?.email ||
                      selectedPayment.vendor_details?.email}
                  </Text>
                </View>
              )}

              {selectedPayment.customer_details?.company_name && (
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalLabel}>Company:</Text>
                  <Text style={styles.modalValue}>
                    {selectedPayment.customer_details.company_name}
                  </Text>
                </View>
              )}

              {selectedPayment.notes && (
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalLabel}>Notes:</Text>
                  <Text style={styles.modalValue}>{selectedPayment.notes}</Text>
                </View>
              )}

              {selectedPayment.attachment && (
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalLabel}>Attachment:</Text>
                  <TouchableOpacity style={styles.attachmentButton}>
                    <Icon name="document-outline" size={16} color="#FCA311" />
                    <Text style={styles.attachmentText}>View Attachment</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={handleEditPayment}
                disabled={isEditing}
              >
                <Icon name="create-outline" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>
                  {isEditing ? "Editing..." : "Edit"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleDeletePayment}
                disabled={isDeleting}
              >
                <Icon name="trash-outline" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </CustomModal>

      <DeleteModal
        showDeleteModal={showDeleteModal}
        handleCancelDelete={handleCancelDelete}
        handleConfirmDelete={handleConfirmDelete}
        title="Delete Payment"
        message="Are you sure you want to delete this payment? This action cannot be undone."
        subMessage="This action cannot be undone and will permanently remove all payment data."
        buttonText="Cancel"
        buttonText2="Delete"
      />
    </MainContainer>
  );
};

export default PaymentsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  summaryBanner: {
    backgroundColor: "#FFF3E0",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 16,
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    fontWeight: "500",
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: "700",
  },
  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#E0E0E0",
  },
  list: {
    flex: 1,
    marginTop: 12,
  },
  dateGroup: {
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  paymentItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 12,
  },
  headerLeft: {
    // flexDirection: "row",
    // alignItems: "center",
    flex: 1,
  },
  partyInfo: {
    flexDirection: "row",
    alignItems: "center",
    // flex: 1,
  },
  paymentTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  partyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  partyType: {
    fontSize: 12,
    color: "#666",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  paymentDate: {
    fontSize: 12,
    color: "#666",
  },
  paymentDetails: {
    // marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    // flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    // flex: 1,
    textAlign: "right",
  },
  attachmentButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  attachmentText: {
    fontSize: 12,
    color: "#FCA311",
    marginLeft: 4,
    fontWeight: "500",
  },
  paymentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 8,
  },
  paymentId: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  actionButtonOld: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#FCA311",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  // Modal styles
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  modalTransactionType: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalDetails: {
    flex: 1,
  },
  modalDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  modalLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    flex: 1,
  },
  modalValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    flex: 2,
    textAlign: "right",
  },
  // Action buttons styles
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: "#FCA311",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});

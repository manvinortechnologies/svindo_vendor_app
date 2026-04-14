import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import CustomHeader from "../CommonComponent/CustomHeader";
import Loading from "../CommonComponent/Loading";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import { HomeNavigation } from "../constants/app-routes.constants";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import moment from "moment";
import CustomModal from "../Modals/CustomModal";
import DeleteModal from "./DeleteModal";
import CalendarModal from "../Modals/CalendarModal";
import Toast from "react-native-toast-message";
import { s } from "react-native-size-matters";

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
  bank_details: {
    id: number;
    name: string;
    account_number: string;
    ifsc_code: string;
  } | null;
}

const PaymentsList = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isFocused = useIsFocused();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Filter states
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [calendarModel, setCalendarModel] = useState<string>("");
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [allPayments, setAllPayments] = useState<Payment[]>([]);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(
    null,
  );
  // Fetch payments data from API
  const fetchPayments = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await api.get(API_ROUTES.paymnet);
      const paymentsData = response.data || [];
      setAllPayments(paymentsData);
      setPayments(paymentsData);
    } catch (error) {
      console.error("Error fetching payments:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load payments. Please try again.",
      });
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

  // Filter payments by date range
  const filterPaymentsByDateRange = (start: string, end: string): Payment[] => {
    if (!start || !end) return allPayments;

    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    // Set end date to end of day
    endDateObj.setHours(23, 59, 59, 999);

    return allPayments.filter((payment) => {
      const paymentDate = new Date(payment.payment_date);
      return paymentDate >= startDateObj && paymentDate <= endDateObj;
    });
  };

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      const filtered = filterPaymentsByDateRange(startDate, endDate);
      setPayments(filtered);
      setIsFiltered(true);
      setShowFilterModal(false);
    }
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setPayments(allPayments);
    setIsFiltered(false);
    setShowFilterModal(false);
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
        prevPayments.filter((payment) => payment.id !== selectedPayment?.id),
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
              <Text style={styles.partyName} numberOfLines={2}>
                {partyName}
              </Text>
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
  const groupedPayments = payments
    .sort(
      (a, b) =>
        new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime(),
    )
    .reduce((groups, payment) => {
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
      {groupedPayments[date]
        ?.sort(
          (a, b) =>
            new Date(a.payment_date).getTime() -
            new Date(b.payment_date).getTime(),
        )
        .map((payment) => (
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
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.container}>
        <Loading visible={isLoading} />

        <CustomHeader
          title="Payments"
          rightIcon={
            <TouchableOpacity onPress={() => setShowFilterModal(true)}>
              <Icon name="calendar" size={22} color="#FCA311" />
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
          contentContainerStyle={{ paddingBottom: s(60) }}
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

        {/* FAB - Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() =>
            (navigation as any).navigate(HomeNavigation.PAYMENTSCREEN)
          }
          activeOpacity={0.8}
        >
          <Icon name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Calendar Modal */}
      <CalendarModal
        initialDate={calendarModel === "start" ? startDate : endDate}
        visible={calendarModel !== ""}
        onClose={() => setCalendarModel("")}
        onSelect={(e) =>
          calendarModel === "start" ? setStartDate(e) : setEndDate(e)
        }
        maxDate={moment().format("YYYY-MM-DD")}
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.filterModalHeader}>
              <Text style={styles.filterModalTitle}>Filter by Date Range</Text>
              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                style={styles.filterCloseButton}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.filterModalContent}>
              <View style={styles.dateInputContainer}>
                <Text style={styles.dateLabel}>Start Date</Text>
                <TouchableOpacity onPress={() => setCalendarModel("start")}>
                  <TextInput
                    style={styles.dateInput}
                    value={startDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#999"
                    editable={false}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.dateInputContainer}>
                <Text style={styles.dateLabel}>End Date</Text>
                <TouchableOpacity onPress={() => setCalendarModel("end")}>
                  <TextInput
                    style={styles.dateInput}
                    value={endDate}
                    editable={false}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#999"
                  />
                </TouchableOpacity>
              </View>

              {isFiltered && (
                <View style={styles.filterStatus}>
                  <Text style={styles.filterStatusText}>Filters applied</Text>
                  <TouchableOpacity
                    onPress={handleClearFilter}
                    style={styles.clearFilterButton}
                  >
                    <Text style={styles.clearFilterText}>Clear Filter</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.filterModalButtons}>
                <TouchableOpacity
                  style={[styles.filterModalButton, styles.filterCancelButton]}
                  onPress={() => setShowFilterModal(false)}
                >
                  <Text style={styles.filterCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterModalButton,
                    styles.filterApplyButton,
                    (!startDate || !endDate) && styles.disabledButton,
                  ]}
                  onPress={handleApplyFilter}
                  disabled={!startDate || !endDate}
                >
                  <Text style={styles.filterApplyButtonText}>Apply Filter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment Details Modal */}
      <CustomModal
        visible={isModalVisible}
        title="Payment Details"
        onClose={handleCloseModal}
        modalStyle={{ flexGrow: 1 }}
      >
        {selectedPayment && (
          <ScrollView contentContainerStyle={styles.modalContent}>
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

              {selectedPayment.payment_type !== "cash" && (
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalLabel}>Bank Name:</Text>
                  <Text style={styles.modalValue}>
                    {selectedPayment?.bank_details?.name?.toUpperCase()}
                  </Text>
                </View>
              )}

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
                  <TouchableOpacity
                    style={styles.attachmentButton}
                    onPress={() => {
                      setSelectedAttachment(selectedPayment.attachment);
                      setShowImageModal(true);
                    }}
                  >
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
          </ScrollView>
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

      {/* Image Preview Modal */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowImageModal(false);
          setSelectedAttachment(null);
        }}
      >
        <View style={styles.imageModalOverlay}>
          <TouchableOpacity
            style={styles.imageModalCloseButton}
            onPress={() => {
              setShowImageModal(false);
              setSelectedAttachment(null);
            }}
          >
            <Icon name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.imageModalContent}>
            {selectedAttachment && (
              <Image
                source={{ uri: selectedAttachment }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
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
    maxWidth: "80%",
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
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FCA311",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  // Modal styles
  modalContent: {
    flexGrow: 1,
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
  // Filter Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: Dimensions.get("window").width * 0.9,
    maxHeight: Dimensions.get("window").height * 0.6,
  },
  filterModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  filterCloseButton: {
    padding: 4,
  },
  filterModalContent: {
    padding: 20,
  },
  dateInputContainer: {
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
  },
  filterStatus: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  filterStatusText: {
    fontSize: 14,
    color: "#2196F3",
    fontWeight: "500",
  },
  clearFilterButton: {
    backgroundColor: "#FF5722",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearFilterText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  filterModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  filterModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  filterCancelButton: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  filterCancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  filterApplyButton: {
    backgroundColor: "#FCA311",
  },
  filterApplyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageModalCloseButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  imageModalContent: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: Dimensions.get("window").width - 40,
    height: Dimensions.get("window").height - 100,
  },
});

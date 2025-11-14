import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  TextInput,
  Dimensions,
  Linking,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { API_ROUTES } from "../constants/api-routes.constants";
import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";
import { HomeNavigation } from "../constants/app-routes.constants";
import CalendarModal from "../Modals/CalendarModal";
import CustomModal from "../Modals/CustomModal";
import moment from "moment";
import DeleteModal from "./DeleteModal";
import CustomHeader from "../CommonComponent/CustomHeader";
import Toast from "react-native-toast-message";

interface LedgerTransaction {
  type: "invoice" | "payment";
  id: string;
  amount?: number;
  paid: number;
  balance: number;
  medium?: string;
}

interface LedgerSection {
  date: string;
  transactions: LedgerTransaction[];
}

interface CustomerInfo {
  name: string;
  phone: string;
  outstanding: number;
  totalSale?: number;
  creditBalance?: number;
}

const CustomerLedger = ({ navigation, route }: any) => {
  const [ledgerData, setLedgerData] = useState<LedgerSection[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: route?.params?.customer?.name,
    phone: route?.params?.customer?.contact,
    outstanding: 0,
    totalSale: 0,
    creditBalance: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Calendar filter states
  const [showCalendarModal, setShowCalendarModal] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [filteredLedgerData, setFilteredLedgerData] = useState<LedgerSection[]>(
    []
  );
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [calendarModel, setCalendarModel] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const customerId = route?.params?.customer?.id;

  useEffect(() => {
    if (customerId) {
      fetchLedgerData();
    }
  }, [customerId]);

  const fetchLedgerData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get(
        API_ROUTES.customerLedger.replace(":id", customerId.toString())
      );

      if (response.data) {
        // Transform API data to match component structure
        const transformedData = transformLedgerData(response.data);
        setLedgerData(transformedData);

        // Calculate total sale from ledger transactions
        const totalSale = calculateTotalSale(response.data.ledger || []);
        const creditBalance = response.data.balance || 0;

        // Update customer info from API response
        setCustomerInfo({
          name: route?.params?.customer?.name || "Customer Name",
          phone: route?.params?.customer?.contact || "+91 9999999999",
          outstanding: creditBalance,
          totalSale: totalSale,
          creditBalance: creditBalance,
        });
      }
    } catch (error: any) {
      console.error("Error fetching ledger data:", error);
      setError("Failed to load ledger data");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalSale = (ledger: any[]): number => {
    if (!ledger || !Array.isArray(ledger)) return 0;

    return ledger.reduce((total, txn) => {
      // Sum all invoice/sale transactions
      if (
        txn.transaction_type?.includes("invoice") ||
        txn.transaction_type?.includes("sale")
      ) {
        return total + Math.abs(txn.amount || 0);
      }
      return total;
    }, 0);
  };

  const transformLedgerData = (apiData: any): LedgerSection[] => {
    // Transform API response to match component's expected data structure
    if (apiData.ledger && Array.isArray(apiData.ledger)) {
      // Group transactions by date
      const groupedByDate: { [key: string]: LedgerTransaction[] } = {};

      apiData.ledger.forEach((txn: any) => {
        const date = new Date(txn.created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        if (!groupedByDate[date]) {
          groupedByDate[date] = [];
        }

        // Determine transaction type based on transaction_type
        let type: "invoice" | "payment" = "payment";
        if (
          txn.transaction_type.includes("invoice") ||
          txn.transaction_type.includes("sale")
        ) {
          type = "invoice";
        }

        // Calculate balance (this might need adjustment based on business logic)
        const balance = txn.amount;

        groupedByDate[date].push({
          type: type,
          id: txn.reference_id?.toString() || txn.id.toString(),
          amount: type === "invoice" ? Math.abs(txn.amount) : undefined,
          paid: type === "payment" ? Math.abs(txn.amount) : 0,
          balance: balance,
          medium: txn.transaction_type,
        });
      });

      // Convert grouped data to sections
      return Object.keys(groupedByDate)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // Sort by date descending
        .map((date) => ({
          date: date,
          transactions: groupedByDate[date],
        }));
    }

    // Fallback transformation if API structure is different
    return [];
  };

  const openWhatsApp = async () => {
    const phoneNumber = "+918377935333";
    const message = "Hello! I need support with Svindo App.";
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        // Fallback to web WhatsApp if app is not installed
        const webUrl = `https://wa.me/${phoneNumber.replace(
          /\D/g,
          ""
        )}?text=${encodeURIComponent(message)}`;
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Unable to open WhatsApp. Please try again.",
      });
    }
  };

  const openCall = async () => {
    const phoneNumber = customerInfo.phone;
    const url = `tel:${phoneNumber}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error opening phone dialer:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Unable to open phone dialer. Please try again.",
      });
    }
  };

  const openMessage = async () => {
    const phoneNumber = customerInfo.phone;
    const message = "Hello! I need support with Svindo App.";
    const url = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error opening SMS app:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Unable to open SMS app. Please try again.",
      });
    }
  };

  // Date filtering functions
  const filterLedgerByDateRange = (start: string, end: string) => {
    if (!start || !end) return ledgerData;

    const startDateObj = new Date(start);
    const endDateObj = new Date(end);

    return ledgerData.filter((section) => {
      const sectionDate = new Date(
        moment(section.date, "DD-MM-YYYY").format("YYYY-MM-DD")
      );
      return sectionDate >= startDateObj && sectionDate <= endDateObj;
    });
  };

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      const filtered = filterLedgerByDateRange(startDate, endDate);
      setFilteredLedgerData(filtered);
      setIsFiltered(true);
      setShowCalendarModal(false);
    }
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setFilteredLedgerData([]);
    setIsFiltered(false);
    setShowCalendarModal(false);
  };

  const handleDeleteCustomerApi = async () => {
    try {
      await api.delete(`${API_ROUTES.vendorCustomer}/${customerId}/`);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Customer deleted successfully",
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting customer:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to delete customer. Please try again.",
      });
    }
  };

  const handleDeleteCustomer = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    handleDeleteCustomerApi();
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleEditCustomer = () => {
    navigation.navigate(HomeNavigation.ADDCUSTOMER as never, {
      customer: { ...customerInfo, ...route?.params?.customer },
      isEdit: true,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <CustomHeader
          title=""
          rightIcon={
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={{ marginRight: 12 }}
                onPress={handleEditCustomer}
              >
                <Text style={styles.editText}>View /Edit Details</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteCustomer}>
                <Icon name="trash" size={22} color="red" />
              </TouchableOpacity>
            </View>
          }
        />
        <Loading visible={isLoading} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <CustomHeader
        title=""
        rightIcon={
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={{ marginRight: 12 }}
              onPress={handleEditCustomer}
            >
              <Text style={styles.editText}>View /Edit Details</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteCustomer}>
              <Icon name="trash" size={22} color="red" />
            </TouchableOpacity>
          </View>
        }
      />

      {/* Customer Info */}
      <View style={styles.customerInfo}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={styles.customerName}>{customerInfo.name}</Text>
            <Text style={styles.phone}>{customerInfo.phone}</Text>
          </View>
          <View>
            <View style={styles.infoIcons}>
              <TouchableOpacity onPress={openCall}>
                <Icon name="call" size={20} color="black" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={openMessage}>
                <Icon name="mail" size={20} color="black" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={openWhatsApp}>
                <Icon name="logo-whatsapp" size={20} color="green" />
              </TouchableOpacity>
            </View>
            <Text
              style={[
                styles.outstanding,
                {
                  color: customerInfo.outstanding < 0 ? "red" : "green",
                  textAlign: "right",
                },
              ]}
            >
              {customerInfo.outstanding.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Sale</Text>
          <Text style={styles.summaryValue}>
            Rs.{(customerInfo.totalSale || 0).toFixed(2)}
          </Text>
        </View>
        <View style={[styles.summaryCard, styles.creditCard]}>
          <Text style={styles.summaryLabel}>Credit Balance</Text>
          <Text
            style={[
              styles.summaryValue,
              {
                color:
                  (customerInfo.creditBalance || 0) < 0 ? "#F44336" : "#492F99",
              },
            ]}
          >
            Rs.{(customerInfo.creditBalance || 0).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Ledger Title */}
      <View style={styles.ledgerHeader}>
        <View></View>
        <Text style={styles.ledgerTitle}>Ledger</Text>
        <TouchableOpacity onPress={() => setShowCalendarModal(true)}>
          <Icon name="calendar-outline" size={22} color="#FCA311" />
        </TouchableOpacity>
      </View>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={fetchLedgerData}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Ledger List */}
      <ScrollView>
        {(isFiltered ? filteredLedgerData : ledgerData).map(
          (section, index) => (
            <View key={index} style={styles.sectionBox}>
              <Text style={styles.dateText}>Date {section.date}</Text>

              {section.transactions.map((txn, i) => (
                <View
                  key={i}
                  style={[
                    styles.transactionRow,
                    { backgroundColor: i % 2 === 0 ? "#fff8f0" : "#fff" },
                  ]}
                >
                  {txn.type === "invoice" ? (
                    <>
                      <Text style={styles.txnText}>Invoice</Text>
                      <Text style={styles.txnValue}>{txn.id}</Text>
                      <Text style={styles.txnText}>Amount</Text>
                      <Text style={styles.txnValue}>
                        {txn.amount?.toString() ?? "N/A"}
                      </Text>
                      <Text style={styles.txnText}>Paid</Text>
                      <Text style={styles.txnValue}>{txn.paid.toFixed(2)}</Text>
                      <Text style={styles.txnText}>Balance</Text>
                      <Text
                        style={[
                          styles.txnValue,
                          { color: txn.balance < 0 ? "red" : "green" },
                        ]}
                      >
                        {txn.balance.toFixed(2)}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.txnText}>Transaction</Text>
                      <Text style={styles.txnValue}>{txn.id}</Text>
                      <Text style={styles.txnText}>Type</Text>
                      <Text style={styles.txnValue}>{txn.medium}</Text>
                      <Text style={styles.txnText}>Amount</Text>
                      <Text
                        style={[
                          styles.txnValue,
                          { color: txn.balance < 0 ? "red" : "green" },
                        ]}
                      >
                        {Math.abs(txn.balance).toFixed(2)}
                      </Text>
                      <Text style={styles.txnText}>Balance</Text>
                      <Text
                        style={[
                          styles.txnValue,
                          { color: (txn.amount || 0) < 0 ? "red" : "green" },
                        ]}
                      >
                        {(txn.amount || 0).toFixed(2)}
                      </Text>
                    </>
                  )}
                </View>
              ))}
            </View>
          )
        )}
      </ScrollView>

      {/* Add Transaction Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate(HomeNavigation.PAYMENTSCREEN as never)
        }
      >
        <Text style={styles.addButtonText}>Add Transaction</Text>
      </TouchableOpacity>

      {/* Calendar Modal */}
      <CalendarModal
        visible={calendarModel !== ""}
        onClose={() => setCalendarModel("")}
        onSelect={(e) =>
          calendarModel === "start" ? setStartDate(e) : setEndDate(e)
        }
        maxDate={moment().format("YYYY-MM-DD")}
        initialDate={calendarModel === "start" ? startDate : endDate}
      />

      {/* Date Range Filter Modal */}
      <Modal
        visible={showCalendarModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCalendarModal(false)}
      >
        <View style={styles.filterModalOverlay}>
          <View style={styles.filterModalContainer}>
            <View style={styles.filterModalHeader}>
              <Text style={styles.filterModalTitle}>Filter by Date Range</Text>
              <TouchableOpacity
                onPress={() => setShowCalendarModal(false)}
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
                  <Text style={styles.filterStatusText}>
                    Filtered by date range
                  </Text>
                  <TouchableOpacity
                    onPress={handleClearFilter}
                    style={styles.clearFilterButton}
                  >
                    <Text style={styles.clearFilterText}>Clear Filter</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowCalendarModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.applyButton]}
                  onPress={handleApplyFilter}
                  disabled={!startDate || !endDate}
                >
                  <Text style={styles.applyButtonText}>Apply Filter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Customer Confirmation Modal */}
      <DeleteModal
        showDeleteModal={showDeleteModal}
        handleCancelDelete={handleCancelDelete}
        handleConfirmDelete={handleConfirmDelete}
        title="Delete Customer"
        message="Are you sure you want to delete this customer?"
        subMessage="This action cannot be undone and will permanently remove all customer data."
        buttonText="Cancel"
        buttonText2="Delete"
      />
    </View>
  );
};

export default CustomerLedger;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 20,
  },
  backButton: {
    backgroundColor: "#FCA511",
    borderRadius: 20,
    padding: 6,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  editText: {
    fontSize: 12,
    color: "orange",
  },
  customerInfo: {
    padding: 12,
    marginHorizontal: 10,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFF1D6",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FCA311",
    marginHorizontal: 5,
  },
  creditCard: {
    backgroundColor: "#F0F4FF",
    borderColor: "#492F99",
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  customerName: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    color: "#000",
  },
  phone: {
    fontSize: 14,
    color: "#333",
  },
  infoIcons: {
    flexDirection: "row",
    gap: 10,
  },
  icon: {
    marginRight: 12,
  },
  outstanding: {
    fontSize: 18,
    color: "red",
    fontWeight: "bold",
  },
  ledgerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#ffe3b3",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FCA311",
  },
  ledgerTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
  },
  sectionBox: {
    marginTop: 8,
    padding: 10,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "400",
    marginBottom: 6,
    color: "gray",
    textAlign: "center",
  },
  transactionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  txnText: {
    fontSize: 12,
    color: "#555",
    width: "25%",
  },
  txnValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
    width: "25%",
  },
  addButton: {
    width: "30%",
    alignSelf: "flex-end",
    backgroundColor: "orange",
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    margin: 15,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    borderColor: "#f44336",
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    margin: 10,
    alignItems: "center",
  },
  errorText: {
    color: "#f44336",
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#f44336",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  // Calendar Filter Modal Styles
  filterModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  filterModalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "90%",
    maxHeight: "60%",
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
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
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
  // Delete Modal Styles
  deleteModalStyle: {
    maxHeight: "50%",
    width: "90%",
  },
  deleteModalContent: {
    alignItems: "center",
    paddingVertical: 10,
  },
  deleteIconContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#FFEBEE",
    borderRadius: 50,
  },
  deleteModalText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  deleteModalSubText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  deleteModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 15,
  },
  cancelDeleteButton: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    flex: 1,
  },
  cancelDeleteButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmDeleteButton: {
    backgroundColor: "#F44336",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  confirmDeleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButtonIcon: {
    marginRight: 8,
  },
});

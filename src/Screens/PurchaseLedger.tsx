import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Modal,
  TextInput,
} from "react-native";
import MainContainer from "../CommonComponent/MainContainer";
import Loading from "../CommonComponent/Loading";
import CustomModal from "../Modals/CustomModal";
import CalendarModal from "../Modals/CalendarModal";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { HomeNavigation } from "../constants/app-routes.constants";
import Icon from "react-native-vector-icons/Ionicons";
import CustomHeader from "../CommonComponent/CustomHeader";
import moment from "moment";
import { ScaledSheet } from "react-native-size-matters";
import Toast from "react-native-toast-message";
import DeleteConfirmationModal from "../Modals/DeleteConfirmationModal";
import { StackNavigationProp } from "@react-navigation/stack";

interface PurchaseItem {
  product: number;
  quantity?: number;
  price?: number;
  amount?: number;
  product_details?: any;
}

interface VendorDetails {
  id: number;
  name: string;
  email: string;
  contact: string;
  company_name: string;
  gst: string | null;
  state_details?: {
    id: number;
    name: string;
    code: string | null;
  };
}

interface PurchaseEntry {
  id: number;
  total_amount: number;
  purchase_code: string;
  purchase_date: string;
  supplier_invoice_date: string | null;
  serial_number: string | null;
  discount_percentage: string;
  discount_amount: string;
  payment_method: string;
  advance_payment_amount: string;
  advance_amount: string;
  advance_mode: string;
  due_date: string | null;
  dispatch_address: string;
  references: string;
  notes: string;
  terms: string;
  delivery_shipping_charges: string;
  packaging_charges: string;
  eway_bill_no: string;
  lr_no: string;
  vehicle_no: string;
  transport_name: string;
  no_of_parcels: number | null;
  items: PurchaseItem[];
  vendor_details: VendorDetails;
  bank_details: any | null;
  user: number;
  vendor: number;
  advance_bank: number | null;
  created_at?: string;
}

type RootStackParamList = {
  PurchaseLedger: {
    purchaseId?: number;
  };
};

type PurchaseLedgerNavProp = StackNavigationProp<
  RootStackParamList,
  HomeNavigation.PURCHASE_LEDGER
>;

const PurchaseLedger = () => {
  const navigation = useNavigation<PurchaseLedgerNavProp>();
  const route =
    useRoute<RouteProp<RootStackParamList, HomeNavigation.PURCHASE_LEDGER>>();

  const [purchaseData, setPurchaseData] = useState<PurchaseEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPurchase, setSelectedPurchase] =
    useState<PurchaseEntry | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  // Date filter states
  const [showCalendarModal, setShowCalendarModal] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [filteredPurchaseData, setFilteredPurchaseData] = useState<
    PurchaseEntry[]
  >([]);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [calendarModel, setCalendarModel] = useState<string>("");

  // Fetch purchase data from API
  const fetchPurchaseData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await api.get(API_ROUTES.purchase);
      const sortedData = response.data.sort(
        (a: PurchaseEntry, b: PurchaseEntry) => {
          const dateA = new Date(
            a.purchase_date || a.created_at || ""
          ).getTime();
          const dateB = new Date(
            b.purchase_date || b.created_at || ""
          ).getTime();
          return dateB - dateA;
        }
      );
      setPurchaseData(sortedData || []);
    } catch (error) {
      console.error("Error fetching purchase data:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load purchase data. Please try again.",
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
    fetchPurchaseData(true);
  };

  // Handle modal open/close
  const openModal = (purchase: PurchaseEntry) => {
    setSelectedPurchase(purchase);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedPurchase(null);
  };

  // Handle edit purchase
  const handleEditPurchase = () => {
    if (!selectedPurchase) return;
    closeModal();
    (navigation as any).navigate(HomeNavigation.CREATE_PURCHASE, {
      editMode: true,
      purchaseData: selectedPurchase,
    });
  };

  // Handle delete purchase
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPurchase) return;

    try {
      setIsDeleting(true);
      await api.delete(`${API_ROUTES.purchase}${selectedPurchase.id}/`);

      // Remove purchase from local state
      setPurchaseData((prevPurchases) =>
        prevPurchases.filter((purchase) => purchase.id !== selectedPurchase.id)
      );

      // Update filtered data if it exists
      if (isFiltered) {
        setFilteredPurchaseData((prevFiltered) =>
          prevFiltered.filter((purchase) => purchase.id !== selectedPurchase.id)
        );
      }

      // Close modals
      setShowDeleteModal(false);
      closeModal();

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Purchase deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting purchase:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error?.response?.data?.message ||
          "Failed to delete purchase. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Date filtering functions
  const filterPurchasesByDateRange = (start: string, end: string) => {
    if (!start || !end) return purchaseData;

    const startDateObj = new Date(start);
    const endDateObj = new Date(end);

    return purchaseData.filter((purchase) => {
      const purchaseDate = new Date(
        purchase.purchase_date || purchase.created_at || ""
      );
      return purchaseDate >= startDateObj && purchaseDate <= endDateObj;
    });
  };

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      const filtered = filterPurchasesByDateRange(startDate, endDate);
      setFilteredPurchaseData(filtered);
      setIsFiltered(true);
      setShowCalendarModal(false);
    }
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setFilteredPurchaseData([]);
    setIsFiltered(false);
    setShowCalendarModal(false);
  };

  useEffect(() => {
    fetchPurchaseData();
  }, []);

  // Handle navigation params - open purchase modal if purchaseId is provided
  useEffect(() => {
    if (route.params?.purchaseId && purchaseData.length > 0) {
      const purchase = purchaseData.find(
        (p) => p.id === route.params?.purchaseId
      );
      if (purchase) {
        openModal(purchase);
        // Clear the param after opening modal
        navigation.setParams({ purchaseId: undefined });
      }
    }
  }, [route.params?.purchaseId, purchaseData]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Calculate total amount for a purchase
  const calculatePurchaseTotal = (purchase: PurchaseEntry): number => {
    let total = 0;
    if (purchase.items && purchase.items.length > 0) {
      total = purchase.items.reduce((sum, item) => {
        return (
          sum +
          Number(item.amount || item.price || 0) * Number(item.quantity || 1)
        );
      }, 0);
    }
    // Add shipping and packaging charges
    total += Number(purchase.delivery_shipping_charges || 0);
    total += Number(purchase.packaging_charges || 0);
    // Subtract discount
    total -= Number(purchase.discount_amount || 0);
    return total;
  };

  // Use filtered data if available, otherwise use all purchase data
  const currentPurchaseData = isFiltered ? filteredPurchaseData : purchaseData;

  const groupedPurchases = currentPurchaseData.reduce((groups, purchase) => {
    const date = formatDate(
      purchase.purchase_date || purchase.created_at || ""
    );
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(purchase);
    return groups;
  }, {} as Record<string, PurchaseEntry[]>);

  const totalBalance = currentPurchaseData.reduce((sum, purchase) => {
    return sum + calculatePurchaseTotal(purchase);
  }, 0);

  const renderPurchaseEntry = ({ item }: { item: PurchaseEntry }) => {
    const isCredit = item.payment_method === "credit";
    const totalAmount = Number(item.total_amount || 0);
    const paidAmount = Number(
      !isCredit ? item.total_amount : item.advance_amount || 0
    );
    const balanceAmount = isCredit ? totalAmount - paidAmount : 0;
    const paymentMethod =
      item.payment_method.charAt(0).toUpperCase() +
      item.payment_method.slice(1);

    return (
      <View style={styles.entryContainer}>
        <View style={styles.tableRow}>
          {/* <View style={styles.tableCell}>
            <Text style={styles.tableValue}>{item.purchase_code}</Text>
          </View> */}
          <View style={styles.tableCell}>
            <Text style={styles.tableValue}>₹{totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableValue}>₹{paidAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableValue}>₹{balanceAmount.toFixed(2)}</Text>
          </View>
        </View>
        <Text style={styles.purchaseCodeText}>
          Purchase Code : {item.purchase_code}
        </Text>
        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>
            {item.vendor_details?.name || "N/A"}
          </Text>
          <Text style={styles.detailText}>
            Items: {item.items?.length || 0}
          </Text>
          <Text style={styles.detailText}>{paymentMethod}</Text>
        </View>
      </View>
    );
  };

  const renderDateGroup = ({ item: date }: { item: string }) => (
    <View style={styles.dateGroup}>
      <Text style={styles.dateHeader}>{date}</Text>
      <View style={styles.tableHeaders}>
        {/* <Text style={styles.tableHeader}>Purchase Code</Text> */}
        <Text style={styles.tableHeader}>Amount</Text>
        <Text style={styles.tableHeader}>Paid</Text>
        <Text style={styles.tableHeader}>Due</Text>
      </View>
      {groupedPurchases[date].map((purchase) => (
        <TouchableOpacity
          key={purchase.id}
          onPress={() => openModal(purchase)}
          style={styles.purchaseEntryTouchable}
        >
          {renderPurchaseEntry({ item: purchase })}
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <MainContainer>
      <View style={styles.container}>
        <Loading visible={isLoading} />

        {/* Ledger Summary Banner */}
        <CustomHeader
          title="Purchase Ledger"
          rightIcon={
            <TouchableOpacity onPress={() => setShowCalendarModal(true)}>
              <Icon name="calendar-outline" size={22} color="#FCA311" />
            </TouchableOpacity>
          }
        />
        <View style={styles.ledgerBanner}>
          <Text style={styles.ledgerText}>Total Purchases</Text>
          <Text style={styles.balanceText}>₹{totalBalance.toFixed(2)}</Text>
        </View>

        {/* Purchase Entries */}
        <FlatList
          data={Object.keys(groupedPurchases)}
          renderItem={renderDateGroup}
          keyExtractor={(date) => date}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
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
              <Text style={styles.emptyText}>No purchase data found</Text>
              <Text style={styles.emptySubText}>
                Pull down to refresh or add a new purchase
              </Text>
            </View>
          }
        />

        {/* Add Purchase Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() =>
            (navigation as any).navigate(HomeNavigation.CREATE_PURCHASE)
          }
          activeOpacity={0.9}
        >
          <Icon name="add" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Purchase Details Modal */}
        <CustomModal
          visible={isModalVisible}
          onClose={closeModal}
          title="Purchase Details"
          modalStyle={styles.modalStyle}
        >
          {selectedPurchase && (
            <ScrollView
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Purchase Header */}
              <View style={styles.modalHeader}>
                <View style={styles.headerActions}>
                  <Text style={styles.purchaseTitle}>
                    {selectedPurchase.purchase_code}
                  </Text>
                  <Text style={styles.paymentMethod}>
                    {selectedPurchase.payment_method.charAt(0).toUpperCase() +
                      selectedPurchase.payment_method.slice(1) +
                      " Purchase"}
                  </Text>
                </View>
                {/* Edit and Delete Buttons */}
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={handleEditPurchase}
                  >
                    <Icon name="create-outline" size={18} color="#fff" />
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={handleDeleteClick}
                  >
                    <Icon name="trash-outline" size={18} color="#fff" />
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Vendor Details */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Vendor Details</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Vendor Name:</Text>
                  <Text style={styles.detailValue}>
                    {selectedPurchase.vendor_details?.name || "N/A"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Company Name:</Text>
                  <Text style={styles.detailValue}>
                    {selectedPurchase.vendor_details?.company_name || "N/A"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Email:</Text>
                  <Text style={styles.detailValue}>
                    {selectedPurchase.vendor_details?.email || "N/A"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Contact:</Text>
                  <Text style={styles.detailValue}>
                    {selectedPurchase.vendor_details?.contact || "N/A"}
                  </Text>
                </View>
                {selectedPurchase.vendor_details?.gst && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>GST:</Text>
                    <Text style={styles.detailValue}>
                      {selectedPurchase.vendor_details.gst}
                    </Text>
                  </View>
                )}
                {selectedPurchase.vendor_details?.state_details && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>State:</Text>
                    <Text style={styles.detailValue}>
                      {selectedPurchase.vendor_details.state_details.name}
                    </Text>
                  </View>
                )}
              </View>

              {/* Purchase Information */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Purchase Information</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Purchase Date:</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(selectedPurchase.purchase_date)}
                  </Text>
                </View>
                {selectedPurchase.supplier_invoice_date && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      Supplier Invoice Date:
                    </Text>
                    <Text style={styles.detailValue}>
                      {formatDate(selectedPurchase.supplier_invoice_date)}
                    </Text>
                  </View>
                )}
                {selectedPurchase.due_date && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Due Date:</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(selectedPurchase.due_date)}
                    </Text>
                  </View>
                )}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Payment Method:</Text>
                  <Text style={styles.detailValue}>
                    {selectedPurchase.payment_method.charAt(0).toUpperCase() +
                      selectedPurchase.payment_method.slice(1)}
                  </Text>
                </View>
              </View>

              {/* Items Details */}
              {selectedPurchase.items && selectedPurchase.items.length > 0 && (
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>
                    Items ({selectedPurchase.items.length})
                  </Text>
                  {selectedPurchase.items.map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemName}>
                          Product ID: {item.product}
                        </Text>
                        {item.amount && (
                          <Text style={styles.itemPrice}>
                            ₹{Number(item.amount).toFixed(2)}
                          </Text>
                        )}
                      </View>
                      {item.quantity && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Quantity:</Text>
                          <Text style={styles.detailValue}>
                            {item.quantity}
                          </Text>
                        </View>
                      )}
                      {item.price && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Unit Price:</Text>
                          <Text style={styles.detailValue}>
                            ₹{Number(item.price).toFixed(2)}
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}

              {/* Financial Summary */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Financial Summary</Text>
                {selectedPurchase.discount_amount &&
                  Number(selectedPurchase.discount_amount) > 0 && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        Discount ({selectedPurchase.discount_percentage}%):
                      </Text>
                      <Text style={styles.detailValue}>
                        ₹{Number(selectedPurchase.discount_amount).toFixed(2)}
                      </Text>
                    </View>
                  )}
                {Number(selectedPurchase.delivery_shipping_charges || 0) >
                  0 && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Shipping Charges:</Text>
                    <Text style={styles.detailValue}>
                      ₹
                      {Number(
                        selectedPurchase.delivery_shipping_charges
                      ).toFixed(2)}
                    </Text>
                  </View>
                )}
                {Number(selectedPurchase.packaging_charges || 0) > 0 && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Packaging Charges:</Text>
                    <Text style={styles.detailValue}>
                      ₹{Number(selectedPurchase.packaging_charges).toFixed(2)}
                    </Text>
                  </View>
                )}
                {Number(selectedPurchase.advance_amount || 0) > 0 && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Advance Amount:</Text>
                    <Text style={styles.detailValue}>
                      ₹{Number(selectedPurchase.advance_amount).toFixed(2)}
                    </Text>
                  </View>
                )}
                <View style={[styles.detailRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total Amount:</Text>
                  <Text style={styles.totalValue}>
                    ₹{calculatePurchaseTotal(selectedPurchase).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Balance Amount:</Text>
                  <Text style={[styles.detailValue, styles.balanceAmount]}>
                    ₹
                    {(
                      calculatePurchaseTotal(selectedPurchase) -
                      Number(selectedPurchase.advance_amount || 0)
                    ).toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Additional Details */}
              {(selectedPurchase.notes ||
                selectedPurchase.references ||
                selectedPurchase.eway_bill_no ||
                selectedPurchase.lr_no ||
                selectedPurchase.vehicle_no) && (
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Additional Details</Text>
                  {selectedPurchase.notes && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Notes:</Text>
                      <Text style={styles.detailValue}>
                        {selectedPurchase.notes}
                      </Text>
                    </View>
                  )}
                  {selectedPurchase.references && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>References:</Text>
                      <Text style={styles.detailValue}>
                        {selectedPurchase.references}
                      </Text>
                    </View>
                  )}
                  {selectedPurchase.eway_bill_no && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>E-Way Bill No:</Text>
                      <Text style={styles.detailValue}>
                        {selectedPurchase.eway_bill_no}
                      </Text>
                    </View>
                  )}
                  {selectedPurchase.lr_no && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>LR No:</Text>
                      <Text style={styles.detailValue}>
                        {selectedPurchase.lr_no}
                      </Text>
                    </View>
                  )}
                  {selectedPurchase.vehicle_no && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Vehicle No:</Text>
                      <Text style={styles.detailValue}>
                        {selectedPurchase.vehicle_no}
                      </Text>
                    </View>
                  )}
                  {selectedPurchase.transport_name && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Transport Name:</Text>
                      <Text style={styles.detailValue}>
                        {selectedPurchase.transport_name}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          )}
        </CustomModal>

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
                <Text style={styles.filterModalTitle}>
                  Filter by Date Range
                </Text>
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

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          visible={showDeleteModal}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Purchase"
          message="Are you sure you want to delete this purchase? This action cannot be undone."
          isLoading={isDeleting}
        />
      </View>
    </MainContainer>
  );
};

export default PurchaseLedger;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  ledgerBanner: {
    backgroundColor: "#FFF3E0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
  },
  ledgerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  balanceText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4CAF50",
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
    color: "#000",
    marginBottom: 12,
  },
  tableHeaders: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  tableHeader: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
  },
  entryContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ff9800",
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  tableCell: {
    flex: 1,
    alignItems: "center",
  },
  tableValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginTop: 4,
  },
  purchaseCodeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginTop: 4,
    // textAlign: "center",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  detailText: {
    fontSize: 12,
    color: "#666",
  },
  listContent: {
    paddingBottom: "70@s",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  modalStyle: {
    flex: 1,
    margin: 0,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    // flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  purchaseTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FCA311",
    textAlign: "center",
    marginBottom: 5,
  },
  paymentMethod: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  sectionContainer: {
    marginBottom: 20,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 5,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 2,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  balanceAmount: {
    color: "#F44336",
    fontWeight: "700",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "700",
  },
  itemContainer: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FCA311",
  },
  purchaseEntryTouchable: {
    marginBottom: 8,
  },
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
  headerActions: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    gap: 6,
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
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FCA311",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 20,
  },
});

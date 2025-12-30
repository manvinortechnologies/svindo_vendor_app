import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import MainContainer from "../CommonComponent/MainContainer";
import Headerwithback from "./Headerwithback";
import Loading from "../CommonComponent/Loading";
import CustomModal from "../Modals/CustomModal";
import CalendarModal from "../Modals/CalendarModal";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { HomeNavigation } from "../constants/app-routes.constants";
import Icon from "react-native-vector-icons/Ionicons";
import CustomHeader from "../CommonComponent/CustomHeader";
import moment from "moment";
import { ScaledSheet } from "react-native-size-matters";
import DeleteModal from "./DeleteModal";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
interface ProductDetails {
  id: number;
  print_variants: any[];
  customize_print_variants: any[];
  product_type: string;
  sale_type: string;
  food_type: string | null;
  name: string;
  wholesale_price: number | null;
  purchase_price: number | null;
  sales_price: number;
  mrp: number | null;
  unit: string;
  hsn: string | null;
  gst: number | null;
  sgst_rate: number | null;
  cgst_rate: number | null;
  track_serial_numbers: boolean;
  opening_stock: number;
  low_stock_alert: boolean;
  low_stock_quantity: number | null;
  stock: number;
  brand_name: string | null;
  color: string | null;
  size: string | null;
  batch_number: string | null;
  expiry_date: string | null;
  description: string;
  image: string | null;
  gallery_images: any[] | null;
}
interface SalesItem {
  product: number;
  quantity: number;
  price: number;
  amount: number;
  product_details: ProductDetails;
}
interface CompanyProfileDetails {
  id: number;
  company_name: string;
  brand_name: string;
  email: string;
  gstin: string;
  is_gst_registered: boolean;
  contact: string;
  billing_address: string;
  address_line_1: string | null;
  address_line_2: string | null;
  pan: string;
  upi_id: string;
  website: string;
  profile_image: string;
  signature: string | null;
  payment_qr: string | null;
  is_default: boolean;
  user: number;
}
interface SalesEntry {
  id: number;
  payment_method: string;
  company_profile: number;
  customer: number | null;
  company_profile_detials: CompanyProfileDetails;
  customer_details: any | null;
  discount_percentage: number;
  advance_amount: number;
  advance_bank: string | null;
  advance_bank_details: any | null;
  balance_amount: number;
  credit_date: string | null;
  is_wholesale_rate: boolean;
  items: SalesItem[];
  total_items: number;
  total_amount_before_discount: number;
  discount_amount: number;
  total_amount: number;
  wholesale_invoice_details: any | null;
  created_at?: string;
}

type RootStackParamList = {
  SalesLedger: {
    saleId?: number;
  };
};

const SalesLedger = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "SalesLedger">>();
  const insets = useSafeAreaInsets();
  const [salesData, setSalesData] = useState<SalesEntry[]>([]);
  const [onlineSalesData, setOnlineSalesData] = useState<SalesEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SalesEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // Date filter states
  const [showCalendarModal, setShowCalendarModal] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [filteredSalesData, setFilteredSalesData] = useState<SalesEntry[]>([]);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [calendarModel, setCalendarModel] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"Sales" | "Online Sales">("Sales");

  // Fetch sales data from API
  const fetchSalesData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await api.get(API_ROUTES.posSales);
      setSalesData(
        response.data.results.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ) || []
      );
      setOnlineSalesData(
        response.data.online_order_ledgers.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ) || []
      );
    } catch (error) {
      console.error("Error fetching sales data:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load sales data. Please try again.",
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
    fetchSalesData(true);
  };

  // Handle modal open/close
  const openModal = (sale: SalesEntry) => {
    setSelectedSale(sale);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedSale(null);
  };

  // Delete sale function
  const handleDeleteSale = async () => {
    if (!selectedSale) return;

    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`${API_ROUTES.posSales}${selectedSale?.id}/`);

      // Remove sale from local state based on active tab
      if (activeTab === "Online Sales") {
        setOnlineSalesData((prevSales) =>
          prevSales.filter((sale) => sale.id !== selectedSale?.id)
        );
      } else {
        setSalesData((prevSales) =>
          prevSales.filter((sale) => sale.id !== selectedSale?.id)
        );
      }

      // Update filtered data if it exists
      if (isFiltered) {
        setFilteredSalesData((prevFiltered) =>
          prevFiltered.filter((sale) => sale.id !== selectedSale?.id)
        );
      }

      // Close modal
      closeModal();

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Sale deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting sale:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to delete sale. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Date filtering functions
  const filterSalesByDateRange = (start: string, end: string) => {
    const dataSource =
      activeTab === "Online Sales" ? onlineSalesData : salesData;
    if (!start || !end) return dataSource;

    const startDateObj = new Date(start);
    const endDateObj = new Date(end);

    return dataSource.filter((sale) => {
      const saleDate = new Date(sale.created_at || "");
      return saleDate >= startDateObj && saleDate <= endDateObj;
    });
  };

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      const filtered = filterSalesByDateRange(startDate, endDate);
      setFilteredSalesData(filtered);
      setIsFiltered(true);
      setShowCalendarModal(false);
    }
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setFilteredSalesData([]);
    setIsFiltered(false);
    setShowCalendarModal(false);
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  useEffect(() => {
    if (route.params?.saleId && salesData.length > 0) {
      const sale = salesData.find((s) => s.id === route.params?.saleId);
      if (sale) {
        openModal(sale);
      }
      // Clear the param after opening modal
      navigation.setParams({ saleId: undefined } as any);
    }
  }, [route.params?.saleId, salesData]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Get the current data source based on active tab
  const getCurrentData = () => {
    if (activeTab === "Online Sales") {
      return isFiltered ? filteredSalesData : onlineSalesData;
    }
    return isFiltered ? filteredSalesData : salesData;
  };

  // Use filtered data if available, otherwise use all sales data based on active tab
  const currentSalesData = getCurrentData();

  const groupedSales = currentSalesData.reduce((groups, sale) => {
    const date = formatDate(sale.created_at || "");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(sale);
    return groups;
  }, {} as Record<string, SalesEntry[]>);

  const totalBalance = currentSalesData.reduce(
    (sum, sale) => sum + Number(sale?.total_amount || 0),
    0
  );

  const renderSalesEntry = ({ item }: { item: SalesEntry }) => {
    const totalItems = item.items.reduce((sum, item) => sum + item.quantity, 0);
    const orderType =
      item.payment_method.charAt(0).toUpperCase() +
      item.payment_method.slice(1) +
      " Sale";
    const status = (item.balance_amount || 0) > 0 ? "Pending" : "Paid";

    return (
      <View style={styles.entryContainer}>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.tableValue}>INV-{item.id}</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableValue}>
              ₹{Number(item.total_amount)?.toFixed(2)}
            </Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableValue}>
              ₹
              {item.payment_method === "credit"
                ? Number(
                    item.total_amount - (item.balance_amount || 0)
                  ).toFixed(2)
                : Number(item.total_amount).toFixed(2)}
            </Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableValue}>
              ₹
              {item.payment_method === "credit"
                ? Number(item.balance_amount || 0).toFixed(2)
                : "0.00"}
            </Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>
            {item?.customer_details?.name || "N/A"}
          </Text>
          <Text style={styles.detailText}>Qty: {totalItems}</Text>
          <Text style={styles.detailText}>{orderType}</Text>
          {/* <Text
            style={[
              styles.statusText,
              { color: status === "Paid" ? "#4CAF50" : "#F44336" },
            ]}
          >
            {status}
          </Text> */}
        </View>
      </View>
    );
  };

  const renderDateGroup = ({ item: date }: { item: string }) => (
    <View style={styles.dateGroup}>
      <Text style={styles.dateHeader}>{date}</Text>
      <View style={styles.tableHeaders}>
        <Text style={styles.tableHeader}>Invoice</Text>
        <Text style={styles.tableHeader}>Amount</Text>
        <Text style={styles.tableHeader}>Paid</Text>
        <Text style={styles.tableHeader}>Balance</Text>
      </View>
      {groupedSales[date].map((sale) => (
        <TouchableOpacity
          key={sale.id}
          onPress={() => openModal(sale)}
          style={styles.saleEntryTouchable}
        >
          {renderSalesEntry({ item: sale })}
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Loading visible={isLoading} />

      {/* Ledger Summary Banner */}
      <CustomHeader
        title="Sales"
        rightIcon={
          <TouchableOpacity onPress={() => setShowCalendarModal(true)}>
            <Icon name="calendar-outline" size={22} color="#FCA311" />
          </TouchableOpacity>
        }
      />
      <View style={styles.ledgerBanner}>
        <Text style={styles.ledgerText}>Total {activeTab}</Text>
        <Text style={styles.balanceText}>
          ₹{Number(totalBalance)?.toFixed(2)}
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Sales" && styles.activeTab]}
          onPress={() => {
            setActiveTab("Sales");
            setIsFiltered(false);
            setFilteredSalesData([]);
          }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Sales" && styles.activeTabText,
            ]}
          >
            Sales
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Online Sales" && styles.activeTab]}
          onPress={() => {
            setActiveTab("Online Sales");
            setIsFiltered(false);
            setFilteredSalesData([]);
          }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Online Sales" && styles.activeTabText,
            ]}
          >
            Online Sales
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sales Entries */}
      <FlatList
        data={Object.keys(groupedSales)}
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
            <Text style={styles.emptyText}>
              No {activeTab.toLowerCase()} data found
            </Text>
            <Text style={styles.emptySubText}>
              Pull down to refresh or add a new sale
            </Text>
          </View>
        }
      />

      {/* Add Sales Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          (navigation as any).navigate(HomeNavigation.PRODUCT_SELECTION, {
            navigateScreen: HomeNavigation.SALE_POS,
          })
        }
        activeOpacity={0.9}
      >
        <Icon name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Sale Details Modal */}
      <CustomModal
        visible={isModalVisible}
        onClose={closeModal}
        title="Sale Details"
        modalStyle={styles.modalStyle}
      >
        {selectedSale && (
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Invoice Header */}
            <View style={styles.modalHeader}>
              <View style={styles.headerActions}>
                <Text style={styles.invoiceTitle}>
                  Invoice #{selectedSale.id}
                </Text>
                <Text style={styles.paymentMethod}>
                  {selectedSale.payment_method.charAt(0).toUpperCase() +
                    selectedSale.payment_method.slice(1) +
                    " Sale"}
                </Text>
              </View>
              {/* Action Buttons */}
              <View style={styles.actionButtonsContainer}>
                {/* Edit Button */}
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    closeModal();
                    (navigation as any).navigate(HomeNavigation.SALE_POS, {
                      editMode: true,
                      saleData: selectedSale,
                    });
                  }}
                >
                  <Icon name="pencil" size={20} color="#fff" />
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>

                {/* Delete Button */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDeleteSale}
                  disabled={isDeleting}
                >
                  <Icon name="trash" size={20} color="#fff" />
                  <Text style={styles.deleteButtonText}>
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Company Details */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Company Details</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Company Name:</Text>
                <Text style={styles.detailValue}>
                  {selectedSale.company_profile_detials.company_name}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Brand Name:</Text>
                <Text style={styles.detailValue}>
                  {selectedSale.company_profile_detials.brand_name}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>
                  {selectedSale.company_profile_detials.email}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Contact:</Text>
                <Text style={styles.detailValue}>
                  {selectedSale.company_profile_detials.contact || "N/A"}
                </Text>
              </View>
            </View>

            {/* Customer Details */}
            {selectedSale.customer_details && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Customer Details</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Customer Name:</Text>
                  <Text style={styles.detailValue}>
                    {selectedSale.customer_details.name || "N/A"}
                  </Text>
                </View>
              </View>
            )}

            {/* Items Details */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>
                Items ({selectedSale.total_items})
              </Text>
              {selectedSale.items.map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemName}>
                      {item?.product_details.name}
                    </Text>
                    <Text style={styles.itemPrice}>
                      ₹{Number(item?.price).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.itemDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Quantity:</Text>
                      <Text style={styles.detailValue}>
                        {item.quantity} {item.product_details.unit}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Unit Price:</Text>
                      <Text style={styles.detailValue}>
                        ₹{Number(item.product_details.sales_price).toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Total Amount:</Text>
                      <Text style={styles.detailValue}>
                        ₹{Number(item.amount).toFixed(2)}
                      </Text>
                    </View>
                    {item.product_details.brand_name && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Brand:</Text>
                        <Text style={styles.detailValue}>
                          {item.product_details.brand_name}
                        </Text>
                      </View>
                    )}
                    {item.product_details.color && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Color:</Text>
                        <Text style={styles.detailValue}>
                          {item.product_details.color}
                        </Text>
                      </View>
                    )}
                    {item.product_details.size && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Size:</Text>
                        <Text style={styles.detailValue}>
                          {item.product_details.size}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>

            {/* Financial Summary */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Financial Summary</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  Total Amount (Before Discount):
                </Text>
                <Text style={styles.detailValue}>
                  ₹
                  {Number(selectedSale.total_amount_before_discount).toFixed(2)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  Discount ({selectedSale.discount_percentage}%):
                </Text>
                <Text style={styles.detailValue}>
                  ₹{Number(selectedSale.discount_amount).toFixed(2)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Advance Amount:</Text>
                <Text style={styles.detailValue}>
                  ₹{Number(selectedSale.advance_amount).toFixed(2)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Balance Amount:</Text>
                <Text style={[styles.detailValue, styles.balanceAmount]}>
                  ₹{Number(selectedSale.balance_amount).toFixed(2)}
                </Text>
              </View>
              <View style={[styles.detailRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalValue}>
                  ₹{Number(selectedSale.total_amount).toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Additional Details */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Additional Details</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Wholesale Rate:</Text>
                <Text style={styles.detailValue}>
                  {selectedSale.is_wholesale_rate ? "Yes" : "No"}
                </Text>
              </View>
              {selectedSale.payment_method === "credit" && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Credit Date:</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(selectedSale.credit_date || "")}
                  </Text>
                </View>
              )}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Created At:</Text>
                <Text style={styles.detailValue}>
                  {selectedSale.created_at
                    ? formatDate(selectedSale.created_at)
                    : "N/A"}
                </Text>
              </View>
            </View>
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

      <DeleteModal
        showDeleteModal={showDeleteModal}
        handleCancelDelete={handleCancelDelete}
        handleConfirmDelete={handleConfirmDelete}
        title="Delete Sale"
        message="Are you sure you want to delete this sale? This action cannot be undone."
        subMessage="This action cannot be undone and will permanently remove all sale data."
        buttonText="Cancel"
        buttonText2="Delete"
      />
    </View>
  );
};

export default SalesLedger;

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
  tabsContainer: {
    flexDirection: "row",
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: "#FCA311",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
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
    // backgroundColor: "#FAFAFA",
    // borderRadius: 8,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ff9800",
    // marginBottom: 8,
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
  statusText: {
    fontSize: 12,
    fontWeight: "600",
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
  // Modal styles
  modalStyle: {
    flex: 1,
    margin: 0,
    // maxHeight: "90%",
    // width: "95%",
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FCA311",
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
  itemDetails: {
    paddingLeft: 8,
  },
  saleEntryTouchable: {
    marginBottom: 8,
  },
  // Date Filter Modal Styles
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
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  editButton: {
    backgroundColor: "#FCA311",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    // flex: 1,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    // flex: 1,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  headerActions: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
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
  fabLabel: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    marginLeft: 4,
  },
});

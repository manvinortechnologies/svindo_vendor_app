import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
  TextInput,
  Modal,
  Alert,
  Platform,
  RefreshControl,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import CustomHeader from "../CommonComponent/CustomHeader";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import CustomDropdown from "../CommonComponent/CustomDropdown";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Swipeable } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import { s, ScaledSheet } from "react-native-size-matters";
import { formatOrderDate } from "../utils/dateandTime";
import Toast from "react-native-toast-message";
import { APP_CONSTANTS } from "../constants/app.constants";
import RNFS from "react-native-fs";
import { Buffer } from "buffer";

type OrderProductDetailsRouteParams = {
  orderId: string;
};

interface OrderItem {
  id: number;
  product_details: {
    product_type: string;
    name: string;
    description: string;
    image: string;
    mrp: number;
    sales_price: number;
    size_details: {
      name: string;
      id: string;
    };
    color: string;
  };
  quantity: number;
  sales_price: number;
  mrp: number;
  status?: string;
  tracking_link?: string;
  delivery_boy?: number | null;
  return_exchange?: {
    id: number;
    type: string;
    reason: string;
    image: string;
    created_at: string;
    updated_at: string;
  };
}

interface Order {
  instruction: string;
  print_summary: any;
  user_details: {
    first_name: string;
    mobile: string;
  };
  id: number;
  order_id: string;
  status: string;
  payment_mode: string;
  is_paid: boolean;
  delivery_type: string;
  item_total: number;
  shipping_fee: number;
  wallet_amount: number;
  cashback: number;
  coupon: number;
  total_amount: number;
  customer_name: string;
  customer_mobile: string;
  customer_address: string;
  created_at: string;
  delivery_boy: number | null;
  items: OrderItem[];
  address_details: {
    full_name: string;
    flat_building: string;
    area_street: string;
    landmark: string;
    town_city: string;
    state: string;
    pincode: string;
    mobile_number?: string;
  };
  coupon_details: {
    code: string;
    discount_amount: number;
  };
  uengage_task_id?: string;
  uengage_rider_name?: string | null;
  uengage_rider_contact?: string | null;
  delivery_boy_details?: {
    name: string;
    mobile: string;
  } | null;
  delivery_discount_amount: number;
}

interface PrintFile {
  id: number;
  file: string;
  number_of_copies: number;
  page_count: number;
  page_numbers: string;
  instructions: string;
}

const OrderProductDetails = ({ navigation }: any) => {
  const swipeableRef = useRef<Swipeable | null>(null);
  const readyToShipmentRef = useRef<Swipeable | null>(null);
  const route = useRoute();
  const { orderId } = route.params as OrderProductDetailsRouteParams;
  const insets = useSafeAreaInsets();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deliveryBoys, setDeliveryBoys] = useState<any[]>([]);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState<any>(null);
  const [trackingLinks, setTrackingLinks] = useState<{ [key: number]: string }>(
    {},
  );
  const [updatingTrackingLink, setUpdatingTrackingLink] = useState<{
    [key: number]: boolean;
  }>({});
  const [updatingStatus, setUpdatingStatus] = useState<{
    [key: number]: boolean;
  }>({});
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{
    itemId: number;
    newStatus: string;
  } | null>(null);
  const [deliveryMode, setDeliveryMode] = useState<{
    is_auto_assign_enabled: boolean;
    is_self_delivery_enabled: boolean;
  } | null>(null);
  const [downloadingFileId, setDownloadingFileId] = useState<number | null>(
    null,
  );
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleDownloadInvoice = async () => {
    if (!order) return;

    try {
      setIsDownloadingInvoice(true);

      // Request PDF as arraybuffer (binary data)
      const response = await api.get(`/customer/order-invoice/${order.id}/`, {
        responseType: "arraybuffer",
      });

      const headers = (response.headers || {}) as Record<string, string>;
      const contentType = headers["content-type"] || "application/pdf";
      const extension = contentType.includes("pdf")
        ? "pdf"
        : contentType.includes("zip")
        ? "zip"
        : "bin";
      const fileName = `Invoice_${order.order_id}.${extension}`;
      console.log("fileName", fileName);
      const filePath =
        Platform.OS === "android"
          ? `${RNFS.DownloadDirectoryPath}/${fileName.replaceAll("/", "_")}`
          : `${RNFS.DocumentDirectoryPath}/${fileName}`;

      // Convert ArrayBuffer to base64
      let base64Data: string;

      if (response.data instanceof ArrayBuffer) {
        // Handle ArrayBuffer response (binary data)
        const bytes = new Uint8Array(response.data);
        let binary = "";
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        // Convert binary string to base64 using Buffer
        base64Data = Buffer.from(binary, "binary").toString("base64");
      } else if (typeof response.data === "string") {
        // If response is a string (PDF content as text), convert to base64
        // First, we need to treat it as binary string
        base64Data = Buffer.from(response.data, "binary").toString("base64");
      } else {
        // Fallback: try to use Buffer directly
        base64Data = Buffer.from(response.data, "binary").toString("base64");
      }

      await RNFS.writeFile(filePath, base64Data, "base64");

      if (Platform.OS === "android") {
        await RNFS.scanFile(filePath);
      }

      // Show success message
      Toast.show({
        type: "success",
        text1: "Download Complete",
        text2: `Invoice saved to ${
          Platform.OS === "ios" ? "Documents" : "Downloads"
        }`,
      });
    } catch (error: any) {
      console.error("Error downloading invoice:", error);
      Toast.show({
        type: "error",
        text1: "Download Failed",
        text2: error.message || "Failed to download invoice. Please try again.",
      });
    } finally {
      setIsDownloadingInvoice(false);
    }
  };

  const fetchOrderDetails = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) setLoading(true);
      const response = await api.get(`${API_ROUTES.orders}${orderId}/`);
      setOrder(response.data);

      // Set selected delivery boy if order already has one assigned
      if (response.data.delivery_boy && deliveryBoys.length > 0) {
        const assignedDeliveryBoy = deliveryBoys.find(
          (db) => db.id === response.data.delivery_boy,
        );
        if (assignedDeliveryBoy) {
          setSelectedDeliveryBoy(assignedDeliveryBoy);
        }
      }

      // Initialize tracking links from order items
      if (response.data.items) {
        const initialTrackingLinks: { [key: number]: string } = {};
        response.data.items.forEach((item: OrderItem) => {
          if (item.tracking_link) {
            initialTrackingLinks[item.id] = item.tracking_link;
          }
        });
        setTrackingLinks(initialTrackingLinks);
      }

      if (!isRefreshing) setLoading(false);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      if (!isRefreshing) setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrderDetails(true);
    setRefreshing(false);
  };

  useEffect(() => {
    const fetchDeliveryBoys = async () => {
      try {
        const response = await api.get(API_ROUTES.deliveryBoys);
        setDeliveryBoys(response.data);
        // After delivery boys are loaded, fetch order details to initialize per-item delivery boys
        if (orderId) {
          fetchOrderDetails();
        }
      } catch (error) {
        console.error("Failed to fetch delivery boys:", error);
        // Still fetch order details even if delivery boys fail
        if (orderId) {
          fetchOrderDetails();
        }
      }
    };

    const fetchDeliveryMode = async () => {
      try {
        const response = await api.get("/vendor/deliverymode/");
        if (response.data?.delivery_mode) {
          setDeliveryMode(response.data.delivery_mode);
        }
      } catch (error) {
        console.error("Failed to fetch delivery mode:", error);
      }
    };

    if (orderId) {
      fetchOrderDetails();
      fetchDeliveryBoys();
      fetchDeliveryMode();
    }
  }, [orderId]);

  const handleCancelOrder = async () => {
    try {
      setLoading(true);
      const response = await api.post(
        `${API_ROUTES.ordersCancel.replace(":id", orderId)}`,
        {
          status: "cancelled_by_vendor",
        },
      );
      setOrder(response.data);
      setLoading(false);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Order cancelled successfully",
      });
    } catch (error) {
      console.error("Failed to cancel order:", error);
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (status: string) => {
    try {
      setLoading(true);
      const response = await api.put(`${API_ROUTES.orders}${orderId}/`, {
        status: status,
      });
      setOrder(response.data);
      setLoading(false);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Order accepted successfully",
      });
    } catch (error: any) {
      console.error("Failed to update order:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Failed to accept order",
      });
      setLoading(false);
    }
  };

  const handleReadyToShipment = async () => {
    try {
      setLoading(true);
      const response = await api.patch(`${API_ROUTES.orders}${orderId}/`, {
        status: "ready_to_shipment",
      });
      setOrder(response.data);
      setLoading(false);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Order marked as ready to shipment",
      });
    } catch (error: any) {
      console.error("Failed to update order status:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Failed to update order status",
      });
      setLoading(false);
    }
  };

  const handleAssignDeliveryBoy = async () => {
    if (!selectedDeliveryBoy?.id) {
      Alert.alert("Error", "Please select a delivery boy");
      return;
    }

    try {
      setLoading(true);

      // Create FormData for the request
      const formData = new FormData();
      formData.append("delivery_boy_id", selectedDeliveryBoy.id.toString());

      await api.post(
        `${API_ROUTES.assignDeliveryBoy.replace(":id", orderId)}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Delivery boy assigned successfully",
      });

      // Refresh order details to get updated delivery boy
      fetchOrderDetails();
    } catch (error: any) {
      console.error("Failed to assign delivery boy:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to assign delivery boy";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusButtonPress = (itemId: number, currentStatus: string) => {
    // Determine next status based on current status
    let newStatus: string;
    console.log("currentStatus", currentStatus);
    if (currentStatus === "pending" || !currentStatus) {
      newStatus = "ready_to_shipment";
    } else if (currentStatus === "ready_to_shipment") {
      newStatus = "intransit";
    } else if (currentStatus === "intransit") {
      newStatus = "delivered";
    }
    // Return Flow
    else if (currentStatus === "return_approved") {
      newStatus = "return_picked_up";
    } else if (currentStatus === "return_picked_up") {
      newStatus = "return_completed";
    }
    // Exchange Flow
    else if (currentStatus === "exchange_approved") {
      newStatus = "exchange_ready_to_shipment";
    } else if (currentStatus === "exchange_ready_to_shipment") {
      newStatus = "exchange_in_transit";
    } else if (currentStatus === "exchange_in_transit") {
      newStatus = "exchange_picked_up";
    } else if (currentStatus === "exchange_picked_up") {
      newStatus = "exchange_completed";
    } else {
      return; // Already delivered, no button should show
    }

    // Show confirmation modal
    setPendingStatusUpdate({ itemId, newStatus });
    setShowConfirmModal(true);
  };

  const handleConfirmStatusUpdate = async () => {
    if (!pendingStatusUpdate) return;

    const { itemId, newStatus } = pendingStatusUpdate;

    try {
      setUpdatingStatus((prev) => ({ ...prev, [itemId]: true }));
      await api.post(`/vendor/order-item-status/${itemId}/`, {
        status: newStatus,
      });

      // Update the order state with the new status
      if (order) {
        const updatedItems = order.items.map((item) =>
          item.id === itemId ? { ...item, status: newStatus } : item,
        );
        setOrder({ ...order, items: updatedItems });
      }

      setShowConfirmModal(false);
      setPendingStatusUpdate(null);
    } catch (error) {
      console.error("Failed to update item status:", error);
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleCancelStatusUpdate = () => {
    setShowConfirmModal(false);
    setPendingStatusUpdate(null);
  };

  const handleReturnExchangeAction = async (
    itemId: number,
    action: "approve" | "reject" | "complete",
  ) => {
    try {
      setUpdatingStatus((prev) => ({ ...prev, [itemId]: true }));

      const response = await api.patch(
        API_ROUTES.returnExchange + itemId + "/",
        {
          action: action,
        },
      );

      // Refresh order details to get updated status
      fetchOrderDetails();
    } catch (error: any) {
      console.error("Failed to process return/exchange:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to process return/exchange request";
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleUpdateTrackingLink = async (itemId: number) => {
    const trackingLink = trackingLinks[itemId];

    if (!trackingLink || !trackingLink.trim()) {
      Alert.alert("Error", "Please enter a tracking link");
      return;
    }

    try {
      setUpdatingTrackingLink((prev) => ({ ...prev, [itemId]: true }));

      // Call API with tracking_link and order_item_id
      await api.post(API_ROUTES.orderItemTracking + itemId + "/", {
        tracking_link: trackingLink.trim(),
      });

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Tracking link updated successfully",
      });

      // Update local state with the new tracking link
      if (order) {
        const updatedItems = order.items.map((item) =>
          item.id === itemId
            ? { ...item, tracking_link: trackingLink.trim() }
            : item,
        );
        setOrder({ ...order, items: updatedItems });
      }

      // Clear the input for this item
      setTrackingLinks((prev) => ({ ...prev, [itemId]: "" }));
    } catch (error: any) {
      console.error("Failed to update tracking link:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to update tracking link";
      Alert.alert("Error", errorMessage);
    } finally {
      setUpdatingTrackingLink((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleDownloadFile = async (file: PrintFile) => {
    try {
      setDownloadingFileId(file.id);

      // Construct file URL
      let fileUrl = file.file;
      if (!fileUrl.startsWith("http://") && !fileUrl.startsWith("https://")) {
        // If it's a relative URL, prepend the base URL
        fileUrl = `${APP_CONSTANTS.API_BASE_URL}${
          fileUrl.startsWith("/") ? "" : "/"
        }${fileUrl}`;
      }

      // Get file extension and name
      const fileName =
        file.file
          .split("/")
          .pop()
          ?.replace(/[^a-zA-Z0-9._-]/g, "_") || `file_${file.id}`;

      const downloadDest = `${RNFS.DownloadDirectoryPath}/${fileName}`;
      const exists = await RNFS.exists(downloadDest);
      if (!exists) {
        await RNFS.mkdir(downloadDest);
      }
      const download = RNFS.downloadFile({
        fromUrl: fileUrl,
        toFile: downloadDest,
        background: true,
        discretionary: true,
      });

      const result = await download.promise;

      if (result.statusCode === 200) {
        // Scan file to make it visible in gallery/downloads
        if (Platform.OS === "android") {
          await RNFS.scanFile(downloadDest);
        }

        Toast.show({
          type: "success",
          text1: "Download Complete",
          text2: `File saved to Downloads`,
        });
      } else {
        throw new Error("Download failed");
      }
    } catch (error: any) {
      console.log("Error downloading file:", error);
      Toast.show({
        type: "error",
        text1: "Download Failed",
        text2: error.message || "Failed to download file. Please try again.",
      });
    } finally {
      setDownloadingFileId(null);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Order not found</Text>
      </View>
    );
  }

  function RightAction() {
    return (
      <View style={styles.rightActionContainer}>
        {/* <Text style={styles.rightActionText}>Accept</Text> */}
      </View>
    );
  }

  const getDiliveryType = (type: string) => {
    if (type === "instant_delivery") {
      return "Instant Delivery";
    } else if (type === "general_delivery") {
      return "General Delivery";
    } else if (type === "on_shop_order") {
      return "On Shop Orders";
    } else if (type === "self_pickup") {
      return "Self Pickup";
    }
  };

  const formatCurrency = (value: any) => {
    if (value === undefined || value === null || value === "") return "₹0";
    const numberValue = Number(value);
    if (isNaN(numberValue)) return "₹0";
    return `₹${
      Number.isInteger(numberValue)
        ? numberValue.toFixed(0)
        : numberValue.toFixed(2)
    }`;
  };

  const extractFileName = (path: string | null | undefined) => {
    if (!path) return "File";
    const parts = path.split("/");
    return parts[parts.length - 1] || path;
  };

  const renderPrintJobCard = (item: any) => {
    const productDetails = item?.product_details || {};
    const printJob = item?.print_job || {};
    const files = Array.isArray(printJob?.files) ? printJob.files : [];
    const addons = Array.isArray(productDetails?.addons)
      ? productDetails.addons
      : [];
    const selectedAddonNames = addons
      .filter((addon: any) =>
        (printJob?.add_ons || []).includes(
          addon?.addon_details?.id || addon?.addon,
        ),
      )
      .map((addon: any) => addon?.addon_details);

    const variant =
      (productDetails?.print_variants || []).find(
        (variant: any) => variant?.id === printJob?.print_variant,
      ) || null;

    const totalPages = files.reduce(
      (sum: number, file: any) => sum + Number(file?.page_count || 0),
      0,
    );
    const totalCopies = files.reduce(
      (sum: number, file: any) => sum + Number(file?.number_of_copies || 0),
      0,
    );

    return (
      <View style={styles.printCard} key={`print-${item?.id}`}>
        <View style={styles.printHeader}>
          <Image
            source={
              productDetails?.image
                ? { uri: productDetails.image }
                : require("../assets/product.png")
            }
            style={styles.printImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.printTitle}>
              {productDetails?.name || "Print Product"}
            </Text>
            <Text style={styles.printSubtitle}>Print Product</Text>
            <Text style={styles.printSubtitle}>
              {productDetails?.store?.name || "Print service"}
            </Text>
          </View>
        </View>

        <View style={styles.printSection}>
          <View style={styles.printSectionHeader}>
            <Text style={styles.printSectionTitle}>Print Job Summary</Text>
          </View>
          <View style={styles.printSummaryRow}>
            <Text style={styles.printSummaryLabel}>Print Type:</Text>
            <Text style={styles.printSummaryValue}>
              {variant?.sided_display || "Single Side"}
            </Text>
          </View>
          {/* <View style={styles.printSummaryRow}>
            <Text style={styles.printSummaryLabel}>Instructions:</Text>
            <Text style={styles.printSummaryValue}>
              {printJob?.instructions
                ? printJob.instructions
                : "No additional instructions"}
            </Text>
          </View> */}
        </View>

        <View style={styles.printSection}>
          <View style={styles.printSectionHeader}>
            <Text style={styles.printSectionTitle}>
              Files ({files.length || 0})
            </Text>
          </View>
          {files.length === 0 ? (
            <Text style={styles.printSummaryValue}>No files available</Text>
          ) : (
            files.map((file: any) => (
              <View style={styles.printFileCard} key={file?.id || file?.file}>
                <View style={styles.printFileHeader}>
                  <Text style={styles.printFileName}>
                    File: {extractFileName(file?.file)}
                  </Text>
                  <TouchableOpacity
                    style={styles.downloadFileButton}
                    onPress={() => handleDownloadFile(file)}
                    disabled={downloadingFileId === file.id}
                  >
                    {downloadingFileId === file.id ? (
                      <ActivityIndicator size="small" color="#FCA311" />
                    ) : (
                      <Icon name="download-outline" size={20} color="#FCA311" />
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={styles.printFileMeta}>
                  Number of copies: {file?.number_of_copies || 0}
                </Text>
                <Text style={styles.printFileMeta}>
                  Page numbers: {file?.page_numbers || "-"}
                </Text>
                <Text style={styles.printFileMeta}>
                  Page count: {file?.page_count || 0}
                </Text>
                <Text style={styles.printFileMeta}>
                  Instructions: {file?.instructions || "-"}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.printSection}>
          <View style={styles.printSectionHeader}>
            <Text style={styles.printSectionTitle}>Add-ons</Text>
          </View>
          {selectedAddonNames.length === 0 ? (
            <Text style={styles.printSummaryValue}>No add-ons selected</Text>
          ) : (
            <View style={styles.addonChipContainer}>
              {selectedAddonNames.map((addon: any, index: number) => (
                <View style={styles.addonChip} key={`${addon?.id}-${index}`}>
                  <Text style={styles.addonChipText}>
                    {addon?.name} - {addon?.price_per_unit}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.printSection}>
          <View style={styles.printSectionHeader}>
            <Text style={styles.printSectionTitle}>Pricing Details</Text>
          </View>
          <View style={styles.printPricingRow}>
            <Text style={styles.printSummaryLabel}>Number of Pages:</Text>
            <Text style={styles.printSummaryValue}>{totalPages}</Text>
          </View>
          <View style={styles.printPricingRow}>
            <Text style={styles.printSummaryLabel}>Total Copies:</Text>
            <Text style={styles.printSummaryValue}>{totalCopies}</Text>
          </View>
          <View style={styles.printPricingRow}>
            <Text style={styles.printSummaryLabel}>Variant Selected:</Text>
            <Text style={styles.printSummaryValue}>
              {variant
                ? `${variant?.min_quantity || 0} - ${
                    variant?.max_quantity || 0
                  }`
                : "-"}
            </Text>
          </View>
          <View style={styles.printPricingRow}>
            <Text style={styles.printSummaryLabel}>Price per Page:</Text>
            <Text style={styles.printSummaryValue}>
              {variant ? formatCurrency(variant?.price) : "-"}
            </Text>
          </View>
          <View style={styles.printTotalRow}>
            <Text style={styles.printTotalLabel}>Total Amount</Text>
            <Text style={styles.printTotalValue}>
              {formatCurrency(printJob?.total_amount)}
            </Text>
          </View>
        </View>

        {/* Tracking Link Section - Only for general_delivery */}
        {order?.delivery_type === "general_delivery" &&
          item.status === "intransit" && (
            <View style={styles.trackingLinkContainer}>
              {item.tracking_link && (
                <View style={styles.existingTrackingLink}>
                  <Text style={styles.trackingLinkLabel}>
                    Current Tracking:
                  </Text>
                  <Text
                    style={styles.trackingLinkValue}
                    onPress={() => {
                      if (item.tracking_link) {
                        Linking.openURL(item.tracking_link);
                      }
                    }}
                  >
                    {item.tracking_link}
                  </Text>
                </View>
              )}
              <TextInput
                placeholder="Enter Tracking Link"
                placeholderTextColor="#ccc"
                style={styles.trackingLinkInput}
                value={trackingLinks[item.id] || ""}
                onChangeText={(text) =>
                  setTrackingLinks((prev) => ({ ...prev, [item.id]: text }))
                }
              />
              <TouchableOpacity
                style={[
                  styles.trackingLinkButton,
                  (!trackingLinks[item.id] || !trackingLinks[item.id].trim()) &&
                    styles.trackingLinkButtonDisabled,
                ]}
                onPress={() => handleUpdateTrackingLink(item.id)}
                disabled={
                  updatingTrackingLink[item.id] ||
                  !trackingLinks[item.id] ||
                  !trackingLinks[item.id].trim()
                }
              >
                {updatingTrackingLink[item.id] ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.trackingLinkButtonText}>
                    {item.tracking_link ? "Update" : "Add"} Tracking Link
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

        {/* Status Button */}
        {((order.delivery_type !== "instant_delivery" &&
          order.status === "accepted") ||
          (order.delivery_type === "instant_delivery" &&
            order.status === "ready_to_shipment")) &&
          item.status !== "delivered" && (
            <View style={styles.statusContainer}>
              <TouchableOpacity
                style={styles.statusButton}
                onPress={() =>
                  handleStatusButtonPress(item.id, item.status || "")
                }
                disabled={updatingStatus[item.id]}
              >
                {updatingStatus[item.id] ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.statusButtonText}>
                    {item.status === "intransit"
                      ? "Mark as Delivered"
                      : item.status === "ready_to_shipment"
                      ? "Mark as In Transit"
                      : "Mark as Ready to Shipment"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

        {/* Return/Exchange Details */}
        {(item.status === "returned/replaced_requested" ||
          item.status === "return_requested" ||
          item.status === "exchange_requested") &&
          item.return_exchange && (
            <View style={styles.returnDetailsContainer}>
              <Text style={styles.returnDetailsTitle}>
                {item.return_exchange.type === "return"
                  ? "Return Reason"
                  : "Exchange Reason"}
                :
              </Text>
              <Text style={styles.returnReason}>
                {item.return_exchange.reason}
              </Text>
              {item.return_exchange.image && (
                <View style={styles.returnImageContainer}>
                  <Text style={styles.returnDetailsTitle}>Proof Image:</Text>
                  <TouchableOpacity
                    onPress={() =>
                      setPreviewImage(item.return_exchange?.image || null)
                    }
                  >
                    <Image
                      source={{ uri: item.return_exchange.image }}
                      style={styles.returnImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
      </View>
    );
  };

  const renderRegularItem = (item: OrderItem) => (
    <View style={styles.itemRow} key={item.id}>
      <View style={styles.itemImgContainer}>
        {item?.product_details?.image ? (
          <Image
            source={{
              uri: item?.product_details?.image
                ? item?.product_details?.image
                : undefined,
            }}
            style={styles.itemImg}
          />
        ) : (
          <Icon name="image" size={s(40)} color="#ccc" />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>
          {item?.product_details?.name} | {item.quantity} Qty
        </Text>
        <Text style={styles.itemDesc}>
          {/* {item?.product_details?.description} */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>
              Rs {item?.product_details.sales_price}
            </Text>
            {item?.product_details?.mrp > item?.product_details.sales_price && (
              <Text style={styles.oldPrice}>
                Rs {item?.product_details?.mrp}
              </Text>
            )}
          </View>
        </Text>
        <Text style={styles.price}>
          Size: {item?.product_details?.size_details?.name}
        </Text>
        <Text style={styles.price}>Color: {item?.product_details?.color}</Text>
        {(item.status?.toLowerCase().includes("return") ||
          item.status?.toLowerCase().includes("exchange")) && (
          <Text style={styles.pickup}>
            {item.status
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </Text>
        )}

        {/* Tracking Link Section - Only for general_delivery */}
        {order?.delivery_type === "general_delivery" &&
          item.status === "intransit" && (
            <View style={styles.trackingLinkContainer}>
              {item.tracking_link && (
                <View style={styles.existingTrackingLink}>
                  <Text style={styles.trackingLinkLabel}>
                    Current Tracking:
                  </Text>
                  <Text
                    style={styles.trackingLinkValue}
                    onPress={() => {
                      if (item.tracking_link) {
                        Linking.openURL(item.tracking_link);
                      }
                    }}
                  >
                    {item.tracking_link}
                  </Text>
                </View>
              )}
              <TextInput
                placeholder="Enter Tracking Link"
                placeholderTextColor="#ccc"
                style={styles.trackingLinkInput}
                value={trackingLinks[item.id] || ""}
                onChangeText={(text) =>
                  setTrackingLinks((prev) => ({ ...prev, [item.id]: text }))
                }
              />
              <TouchableOpacity
                style={[
                  styles.trackingLinkButton,
                  (!trackingLinks[item.id] || !trackingLinks[item.id].trim()) &&
                    styles.trackingLinkButtonDisabled,
                ]}
                onPress={() => handleUpdateTrackingLink(item.id)}
                disabled={
                  updatingTrackingLink[item.id] ||
                  !trackingLinks[item.id] ||
                  !trackingLinks[item.id].trim()
                }
              >
                {updatingTrackingLink[item.id] ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.trackingLinkButtonText}>
                    {item.tracking_link ? "Update" : "Add"} Tracking Link
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

        {/* Status Button */}
        {/* Status Button */}
        {(((order.delivery_type !== "instant_delivery" &&
          order.status === "accepted") ||
          (order.delivery_type === "instant_delivery" &&
            order.status === "ready_to_shipment")) &&
          item.status !== "delivered" &&
          item.status !== "exchange_requested" &&
          item.status !== "return_requested" &&
          item.status !== "return_completed" &&
          item.status !== "exchange_completed" &&
          item.status !== "return_rejected" &&
          item.status !== "exchange_rejected" &&
          item.status !== "return_cancelled" &&
          item.status !== "exchange_cancelled") ||
        item.status === "return_approved" ||
        item.status === "return_ready_to_shipment" ||
        item.status === "return_in_transit" ||
        item.status === "return_approved" ||
        item.status === "return_picked_up" ||
        item.status === "return_in_transit" ||
        item.status === "return_ready_to_deliver" ||
        item.status === "exchange_approved" ||
        item.status === "exchange_ready_to_shipment" ||
        item.status === "exchange_picked_up" ||
        item.status === "exchange_in_transit" ||
        item.status === "returned/replaced_approved" ? (
          <View style={styles.statusContainer}>
            <TouchableOpacity
              style={styles.statusButton}
              onPress={() =>
                handleStatusButtonPress(item.id, item.status || "")
              }
              disabled={updatingStatus[item.id]}
            >
              {updatingStatus[item.id] ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.statusButtonText}>
                  {item.status === "intransit"
                    ? "Mark as Delivered"
                    : item.status === "ready_to_shipment"
                    ? "Mark as In Transit"
                    : // Return Flow
                    item.status === "return_approved"
                    ? "Mark as Return Picked Up"
                    : item.status === "return_picked_up"
                    ? "Mark as Return Completed"
                    : // Exchange Flow
                    item.status === "exchange_approved"
                    ? "Mark as Exchange Ready to Ship"
                    : item.status === "exchange_ready_to_shipment"
                    ? "Mark as Exchange In Transit"
                    : item.status === "exchange_picked_up"
                    ? "Mark as Exchange Completed"
                    : item.status === "exchange_in_transit"
                    ? "Mark as Exchange Picked Up"
                    : item.status === "returned/replaced_approved"
                    ? "Complete Return/Exchange"
                    : "Mark as Ready to Shipment"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          (item.status === "returned/replaced_requested" ||
            item.status === "return_requested" ||
            item.status === "exchange_requested") && (
            <View
              style={[
                styles.statusContainer,
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 10,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.returnButton}
                onPress={() => handleReturnExchangeAction(item.id, "approve")}
                disabled={updatingStatus[item.id]}
              >
                {updatingStatus[item.id] ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.statusButtonText}>Approve</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleReturnExchangeAction(item.id, "reject")}
                disabled={updatingStatus[item.id]}
              >
                {updatingStatus[item.id] ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.statusButtonText}>Reject</Text>
                )}
              </TouchableOpacity>
            </View>
          )
        )}

        {/* Return/Exchange Details */}
        {(item.status === "returned/replaced_requested" ||
          item.status === "return_requested" ||
          item.status === "exchange_requested") &&
          item.return_exchange && (
            <View style={styles.returnDetailsContainer}>
              <Text style={styles.returnDetailsTitle}>
                {item.return_exchange.type === "return"
                  ? "Return Reason"
                  : "Exchange Reason"}
                :
              </Text>
              <Text style={styles.returnReason}>
                {item.return_exchange.reason}
              </Text>
              {item.return_exchange.image && (
                <View style={styles.returnImageContainer}>
                  <Text style={styles.returnDetailsTitle}>Proof Image:</Text>
                  <TouchableOpacity
                    onPress={() =>
                      setPreviewImage(item.return_exchange?.image || null)
                    }
                  >
                    <Image
                      source={{ uri: item.return_exchange.image }}
                      style={styles.returnImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <CustomHeader
          title={order?.user_details?.first_name || order?.customer_name}
        />

        {/* Order status */}
        <View style={styles.orderStatusRow}>
          <Text
            style={[
              styles.statusText,
              order.status === "accepted"
                ? styles.acceptedStatus
                : styles.notAccepted,
            ]}
          >
            {(
              order.status.charAt(0).toUpperCase() +
              order.status.slice(1).toLowerCase()
            )
              .split("_")
              .join(" ")}
          </Text>
          {order.status !== "cancelled_by_vendor" &&
            order.status !== "completed" && (
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={handleCancelOrder}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
        </View>

        {/* Order details */}
        <View style={styles.orderDetails}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>Id - #{order.order_id}</Text>
            <Text style={styles.orderDate}>
              {formatOrderDate(order.created_at)}
            </Text>
          </View>
          <Text style={styles.pickup}>
            {getDiliveryType(order.delivery_type)}
          </Text>
          <View style={styles.paymentRow}>
            <Text
              style={[
                styles.paymentStatus,
                order.is_paid ? styles.paidStatus : styles.unpaidStatus,
              ]}
            >
              {order.is_paid ? "Paid" : "Unpaid"} / {order.payment_mode}
            </Text>
            {order.status === "completed" && (
              <TouchableOpacity
                style={styles.downloadBtn}
                onPress={handleDownloadInvoice}
                disabled={isDownloadingInvoice}
              >
                {isDownloadingInvoice ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.downloadText}>Download Bill</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
          {order.instruction && (
            <Text style={styles.instructionsText}>
              Instructions: {order.instruction}
            </Text>
          )}
        </View>

        {/* Items */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {order.items.length} Item(s) in this Order
          </Text>
          {order.items.length === 0 ? (
            <Text style={styles.noItemsText}>No items in this order</Text>
          ) : (
            order.items.map((item: any) =>
              item?.product_details?.product_type === "print"
                ? renderPrintJobCard(item)
                : renderRegularItem(item),
            )
          )}
        </View>

        {/* Delivery Boy Selection */}
        <View style={[styles.card, { zIndex: 3000 }]}>
          <Text style={styles.sectionTitle}>DELIVERY ASSIGNMENT</Text>
          {order?.delivery_type === "on_shop_order" ||
          order?.delivery_type === "self_pickup" ||
          (order?.delivery_type === "instant_delivery" &&
            deliveryMode?.is_auto_assign_enabled) ? null : (
            <View>
              <CustomDropdown
                placeholder="Select Delivery Boy"
                options={deliveryBoys.map((db) => ({
                  name: db.name,
                  id: db.id,
                }))}
                onSelect={(value) => setSelectedDeliveryBoy(value)}
                selectedValue={
                  selectedDeliveryBoy ? selectedDeliveryBoy?.id : ""
                }
              />
              {selectedDeliveryBoy && (
                <TouchableOpacity
                  style={[styles.statusButton, { marginTop: 10 }]}
                  onPress={handleAssignDeliveryBoy}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.statusButtonText}>
                      Assign Delivery Boy
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}
          {order.delivery_boy && (
            <Text style={styles.assignedText}>
              Currently assigned to:{" "}
              {deliveryBoys.find((db) => db.id === order.delivery_boy)?.name ||
                "Unknown"}
            </Text>
          )}
        </View>

        {/* Payment details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>PAYMENT DETAILS</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Item Total & GST</Text>
            <Text style={styles.paymentValue}>
              Rs {Number(order.item_total).toFixed(2)}
            </Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Shipping Fee</Text>
            <Text style={styles.paymentValue}>
              Rs {Number(order.shipping_fee || 0).toFixed(2)}
            </Text>
          </View>
          {/* <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Wallet Amount</Text>
            <Text style={styles.paymentValue}>
              Rs {Number(order.wallet_amount).toFixed(2)}
            </Text>
          </View> */}
          <View style={styles.paymentRow}>
            <Text
              style={[styles.paymentLabel, { maxWidth: s(200) }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Cashback{" "}
            </Text>
            <Text style={styles.paymentValue}>
              Rs{" "}
              {Math.round(Number(order.delivery_discount_amount || 0)).toFixed(
                2,
              )}
            </Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>
              Coupon{" "}
              {order.coupon_details && (
                <Text
                  style={{
                    borderWidth: 1,
                    borderColor: "red",
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  Coupon Code: {order?.coupon_details?.code}
                </Text>
              )}
            </Text>
            <Text style={styles.paymentValue}>
              Rs {Number(order.coupon || 0).toFixed(2)}
            </Text>
          </View>

          <View style={[styles.paymentRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>
              Rs {Number(order.total_amount).toFixed(2)}
            </Text>
          </View>
          <Text style={styles.taxNote}>Incl. all taxes and charges</Text>
          {!order.is_paid && (
            <View style={styles.cashLedgerNote}>
              <Text style={styles.cashLedgerNoteText}>
                Once order fulfilled, amount will be reflected in cash ledger
                for COD delivery
              </Text>
            </View>
          )}
        </View>

        {/* Delivery Details */}
        <View style={styles.deliveryCard}>
          <Text style={styles.deliveryTitle}>Delivery Details</Text>

          <View style={styles.deliverySection}>
            {(order.uengage_task_id || order.delivery_boy_details) && (
              <View style={[styles.deliverySection, { marginBottom: 20 }]}>
                <Text style={styles.deliveryLabel}>
                  Delivery Partner Details :
                </Text>
                <View>
                  <Text style={styles.addressText}>
                    Name:{" "}
                    {order.uengage_task_id
                      ? order.uengage_rider_name || "Assigning..."
                      : order.delivery_boy_details?.name}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.addressText}>
                      Mobile:{" "}
                      {order.uengage_task_id
                        ? order.uengage_rider_contact || "N/A"
                        : order.delivery_boy_details?.mobile}
                    </Text>
                    {(order.uengage_rider_contact ||
                      order.delivery_boy_details?.mobile) && (
                      <TouchableOpacity
                        style={[
                          styles.callButton,
                          {
                            marginLeft: 10,
                            paddingVertical: 4,
                            paddingHorizontal: 8,
                          },
                        ]}
                        onPress={() => {
                          const number = order.uengage_task_id
                            ? order.uengage_rider_contact
                            : order.delivery_boy_details?.mobile;
                          if (number) {
                            Linking.openURL(`tel:${number}`);
                          }
                        }}
                      >
                        <Icon name="call" size={14} color="#fff" />
                        <Text style={[styles.callButtonText, { fontSize: 12 }]}>
                          Call
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            )}

            <Text style={styles.deliveryLabel}>Address :</Text>
            <Text style={styles.addressText}>
              {order?.address_details?.full_name}
              {", "}
              {order.address_details?.flat_building}
              {", "}
              {order.address_details?.area_street}
              {", "}
              {order.address_details?.landmark}
              {", "}
              {order.address_details?.town_city}
              {", "}
              {order.address_details?.state}
              {", "}
              {order.address_details?.pincode}
            </Text>
            <Text style={styles.addressText}>{order.customer_address}</Text>
            <Text style={styles.addressText}>
              Mobile - {order.address_details?.mobile_number}
            </Text>
          </View>

          <View
            style={[
              styles.deliverySection,
              {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
            ]}
          >
            <Text style={styles.paymentModeLabel}>
              Payment Mode :{" "}
              <Text style={styles.paymentModeValue}>{order.payment_mode}</Text>
            </Text>
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => {
                Linking.openURL(`tel:${order.address_details?.mobile_number}`);
              }}
            >
              <Icon name="call" size={16} color="#fff" />
              <Text style={styles.callButtonText}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Image Preview Modal */}
      <Modal
        visible={!!previewImage}
        transparent={true}
        onRequestClose={() => setPreviewImage(null)}
      >
        <View style={styles.imageModalContainer}>
          <TouchableOpacity
            style={styles.closeImageButton}
            onPress={() => setPreviewImage(null)}
          >
            <Icon name="close" size={30} color="#fff" />
          </TouchableOpacity>
          {previewImage && (
            <Image
              source={{ uri: previewImage }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      {/* Accept Order - Swipeable */}
      {order.status === "not_accepted" && (
        <Swipeable
          ref={swipeableRef}
          containerStyle={[styles.swipeContainer, { bottom: insets.bottom }]}
          friction={2}
          enableTrackpadTwoFingerGesture
          rightThreshold={60}
          leftThreshold={60}
          renderLeftActions={RightAction}
          onSwipeableOpen={() => {
            handleAcceptOrder("accepted");
            swipeableRef.current?.close();
          }}
        >
          <TouchableOpacity
            style={styles.acceptBtn}
            // onPress={() => navigation.navigate("ProductDetails")}
          >
            <View style={styles.swipeIndicator}>
              <Icon name="arrow-forward-outline" size={20} color="#FF9800" />
            </View>
            <View style={styles.acceptTextContainer}>
              <Text style={styles.acceptText}>Accept Order</Text>
              <Text style={styles.acceptSub}>Swipe to change status</Text>
            </View>
          </TouchableOpacity>
        </Swipeable>
      )}

      {/* Ready to Shipment - Swipeable (Only for instant orders after accepted) */}
      {order.status === "accepted" &&
        order.delivery_type === "instant_delivery" && (
          <Swipeable
            ref={readyToShipmentRef}
            containerStyle={[styles.swipeContainer, { bottom: insets.bottom }]}
            friction={2}
            enableTrackpadTwoFingerGesture
            rightThreshold={60}
            leftThreshold={60}
            renderLeftActions={RightAction}
            onSwipeableOpen={() => {
              handleReadyToShipment();
              readyToShipmentRef.current?.close();
            }}
          >
            <TouchableOpacity style={styles.acceptBtn}>
              <View style={styles.swipeIndicator}>
                <Icon name="arrow-forward-outline" size={20} color="#FF9800" />
              </View>
              <View style={styles.acceptTextContainer}>
                <Text style={styles.acceptText}>Ready to Shipment</Text>
                <Text style={styles.acceptSub}>Swipe to change status</Text>
              </View>
            </TouchableOpacity>
          </Swipeable>
        )}

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelStatusUpdate}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Status Update</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to change the status to{" "}
              {pendingStatusUpdate?.newStatus
                ?.split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
              ?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelStatusUpdate}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmStatusUpdate}
                disabled={
                  pendingStatusUpdate?.itemId
                    ? updatingStatus[pendingStatusUpdate.itemId]
                    : false
                }
              >
                {pendingStatusUpdate?.itemId &&
                updatingStatus[pendingStatusUpdate.itemId] ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default OrderProductDetails;

const styles = ScaledSheet.create({
  rightActionContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: "#FF9800",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  rightActionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  swipeContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#FF9800",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  orderStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginHorizontal: 10,
  },
  statusText: {
    fontWeight: "600",
    fontSize: 16,
  },
  acceptedStatus: {
    color: "#2E7D32",
  },
  notAccepted: {
    color: "#492F99",
  },
  cancelBtn: {
    backgroundColor: "#FF0000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  cancelText: {
    color: "#fff",
    fontSize: 12,
  },
  orderDetails: {
    marginHorizontal: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  orderInfo: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    marginBottom: 8,
  },
  orderId: {
    fontWeight: "500",
    fontSize: 16,
    color: "#000",
  },
  orderDate: {
    color: "gray",
    fontWeight: "500",
    fontSize: 14,
  },
  pickup: {
    color: "#005A92",
    fontWeight: "500",
    marginBottom: 8,
    fontSize: 14,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  paymentStatus: {
    fontWeight: "500",
    fontSize: 14,
  },
  paidStatus: {
    color: "#2E7D32",
  },
  unpaidStatus: {
    color: "#FF0000",
  },
  downloadBtn: {
    backgroundColor: "#FFB800",
    padding: 6,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  downloadText: {
    color: "#fff",
    fontSize: 12,
  },
  card: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    zIndex: 1000,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
    color: "#000",
  },
  returnDetailsContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  returnDetailsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  returnReason: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  returnImageContainer: {
    marginTop: 5,
  },
  returnImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginTop: 5,
  },
  noItemsText: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
    padding: 20,
  },
  imageModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "80%",
  },
  closeImageButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  itemRow: {
    flexDirection: "row",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemImgContainer: {
    width: "60@s",
    height: "60@s",
    marginRight: "12@s",
    borderRadius: "8@s",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  itemImg: {
    width: "100%",
    height: "100%",
  },
  itemName: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  itemDesc: {
    color: "gray",
    fontSize: 12,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    color: "#333",
    fontWeight: "bold",
    marginRight: 10,
    fontSize: 14,
  },
  oldPrice: {
    textDecorationLine: "line-through",
    color: "#FF0000",
    fontWeight: "bold",
    fontSize: 12,
  },
  paymentLabel: {
    color: "#617C9D",
    fontWeight: "500",
    fontSize: 14,
  },
  paymentValue: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
    marginTop: 10,
  },
  totalLabel: {
    fontWeight: "bold",
    color: "#005A92",
    fontSize: 16,
  },
  totalValue: {
    fontWeight: "bold",
    color: "#005A92",
    fontSize: 16,
  },
  cashLedgerNote: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#FFF3CD",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FFC107",
  },
  cashLedgerNoteText: {
    fontSize: 13,
    color: "#856404",
    fontStyle: "italic",
    lineHeight: 18,
  },
  taxNote: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },
  assignedText: {
    color: "#2E7D32",
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    // justifyContent: "space-between",
    gap: 10,
    marginBottom: 8,
    alignItems: "center",
  },
  detailLabel: {
    fontWeight: "bold",
    color: "#333",
    // width: 100,
    fontSize: 14,
  },
  detailValue: {
    // flex: 1,
    color: "#666",
    fontSize: 14,
  },
  orderStatusBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF9800",
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
    // borderRadius: 12,
  },
  acceptBtn: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#FF9800",
    paddingVertical: 5,
    paddingHorizontal: 20,
    width: "100%",
    borderRadius: 12,
    // marginHorizontal: 10,
    // marginBottom: 10,
  },
  swipeIndicator: {
    width: 40,
    height: 40,
    backgroundColor: "#FFEAC8",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  acceptTextContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 2,
  },
  acceptSub: {
    color: "#FFE0B2",
    fontSize: 12,
    textAlign: "center",
  },
  deliveryCard: {
    backgroundColor: "#fff",
    margin: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    position: "relative",
  },
  deliveryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginVertical: 20,
  },
  deliverySection: {
    marginBottom: 15,
  },
  deliveryLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },

  customerNameText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
    marginBottom: 2,
  },
  addressText: {
    fontSize: 14,
    color: "#000",
    lineHeight: 20,
  },
  mobileLabel: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  mobileValue: {
    fontSize: 14,
    color: "#000",
    marginTop: 2,
  },
  paymentModeLabel: {
    fontSize: 14,
    color: "#888",
    // marginBottom: 5,
  },
  paymentModeValue: {
    fontSize: 14,
    color: "#000",
  },
  callButton: {
    // position: "absolute",
    // bottom: 15,
    // right: 15,
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  callButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 5,
  },
  chatButton: {
    // backgroundColor: "#FCA511",
    // borderRadius: 20,
    padding: 6,
  },
  statusContainer: {
    marginTop: 10,
    width: "100%",
  },
  statusButton: {
    flex: 1,
    backgroundColor: "#FCA311",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  returnButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#FF0000",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  statusButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: "#FCA311",
    marginLeft: 5,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  instructionsText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  printCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 16,
  },
  printHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  printImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginRight: 16,
    backgroundColor: "#F3F3F3",
  },
  printTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  printSubtitle: {
    fontSize: 13,
    color: "#7A7A7A",
    marginTop: 2,
  },
  printSection: {
    backgroundColor: "#F8F9FC",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  printSectionHeader: {
    marginBottom: 10,
  },
  printSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2B2B2B",
  },
  printSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  printPricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  printSummaryLabel: {
    fontSize: 13,
    color: "#6B6B6B",
  },
  printSummaryValue: {
    fontSize: 13,
    color: "#1F1F1F",
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  printFileCard: {
    borderWidth: 1,
    borderColor: "#E0E7FF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  printFileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  printFileName: {
    fontWeight: "700",
    color: "#1F1F1F",
    flex: 1,
  },
  downloadFileButton: {
    padding: 6,
    marginLeft: 8,
  },
  printFileMeta: {
    fontSize: 12,
    color: "#5C5C5C",
    marginBottom: 2,
  },
  addonChipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  addonChip: {
    backgroundColor: "#E6F2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addonChipText: {
    color: "#006EB2",
    fontWeight: "600",
    fontSize: 12,
  },
  printTotalRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  printTotalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  printTotalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#006EB2",
  },
  trackingLinkContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#F8F9FC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  existingTrackingLink: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#E6F2FF",
    borderRadius: 6,
  },
  trackingLinkLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  trackingLinkValue: {
    fontSize: 13,
    color: "#006EB2",
    textDecorationLine: "underline",
  },
  trackingLinkInput: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#FFF",
    color: "#000",
    marginBottom: 8,
  },
  trackingLinkButton: {
    backgroundColor: "#FCA511",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  trackingLinkButtonDisabled: {
    backgroundColor: "#CCC",
    opacity: 0.6,
  },
  trackingLinkButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  deliveryBoyContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#F8F9FC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  existingDeliveryBoy: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#E6F2FF",
    borderRadius: 6,
  },
  deliveryBoyLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  deliveryBoyValue: {
    fontSize: 13,
    color: "#006EB2",
    fontWeight: "600",
  },
  deliveryBoyButton: {
    backgroundColor: "#FCA511",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  deliveryBoyButtonDisabled: {
    backgroundColor: "#CCC",
    opacity: 0.6,
  },
  deliveryBoyButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

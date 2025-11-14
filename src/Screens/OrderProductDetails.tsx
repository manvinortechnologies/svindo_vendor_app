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
import { s } from "react-native-size-matters";
import { formatOrderDate } from "../utils/dateandTime";

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
  };
  quantity: number;
  sales_price: number;
  mrp: number;
  status?: string;
}

interface Order {
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
  instructions: string;
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
}

const OrderProductDetails = ({ navigation }: any) => {
  const swipeableRef = useRef<Swipeable | null>(null);
  const route = useRoute();
  const { orderId } = route.params as OrderProductDetailsRouteParams;
  const insets = useSafeAreaInsets();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deliveryBoys, setDeliveryBoys] = useState<any[]>([]);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState<any>(null);
  const [trackingLink, setTrackingLink] = useState<string>("");
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

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${API_ROUTES.orders}${orderId}/`);
      setOrder(response.data);

      // Set selected delivery boy if order already has one assigned
      if (response.data.delivery_boy) {
        const assignedDeliveryBoy = deliveryBoys.find(
          (db) => db.id === response.data.delivery_boy
        );
        if (assignedDeliveryBoy) {
          setSelectedDeliveryBoy(assignedDeliveryBoy);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchDeliveryBoys = async () => {
      try {
        const response = await api.get(API_ROUTES.deliveryBoys);
        setDeliveryBoys(response.data);
      } catch (error) {
        console.error("Failed to fetch delivery boys:", error);
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
      const response = await api.put(`${API_ROUTES.orders}${orderId}/`, {
        status: "not_accepted",
      });
      setOrder(response.data);
      setLoading(false);
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
        delivery_boy: selectedDeliveryBoy?.id,
      });
      setOrder(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to update order:", error);
      setLoading(false);
    }
  };

  const handleStatusButtonPress = (itemId: number, currentStatus: string) => {
    // Determine next status based on current status
    let newStatus: string;
    if (currentStatus === "pending" || !currentStatus) {
      newStatus = "intransit";
    } else if (currentStatus === "intransit") {
      newStatus = "delivered";
    } else if (currentStatus === "returned/replaced_approved") {
      newStatus = "completed";
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
          item.id === itemId ? { ...item, status: newStatus } : item
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
    action: "approve" | "reject" | "complete"
  ) => {
    try {
      setUpdatingStatus((prev) => ({ ...prev, [itemId]: true }));

      const response = await api.post(API_ROUTES.returnExchange, {
        id: itemId,
        action: action,
      });

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
          addon?.addon_details?.id || addon?.addon
        )
      )
      .map(
        (addon: any) =>
          addon?.addon_details?.name || addon?.addon_details?.title || "Add-on"
      );

    const variant =
      (productDetails?.print_variants || []).find(
        (variant: any) => variant?.id === printJob?.print_variant
      ) || null;

    const totalPages = files.reduce(
      (sum: number, file: any) => sum + Number(file?.page_count || 0),
      0
    );
    const totalCopies = files.reduce(
      (sum: number, file: any) => sum + Number(file?.number_of_copies || 0),
      0
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
          <View style={styles.printSummaryRow}>
            <Text style={styles.printSummaryLabel}>Instructions:</Text>
            <Text style={styles.printSummaryValue}>
              {printJob?.instructions
                ? printJob.instructions
                : "No additional instructions"}
            </Text>
          </View>
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
                <Text style={styles.printFileName}>
                  File: {extractFileName(file?.file)}
                </Text>
                <Text style={styles.printFileMeta}>
                  Number of copies: {file?.number_of_copies || 0}
                </Text>
                <Text style={styles.printFileMeta}>
                  Page numbers: {file?.page_numbers || "-"}
                </Text>
                <Text style={styles.printFileMeta}>
                  Page count: {file?.page_count || 0}
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
              {selectedAddonNames.map((addonName: string, index: number) => (
                <View style={styles.addonChip} key={`${addonName}-${index}`}>
                  <Text style={styles.addonChipText}>{addonName}</Text>
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
      </View>
    );
  };

  const renderRegularItem = (item: OrderItem) => (
    <View style={styles.itemRow} key={item.id}>
      <Image
        source={{
          uri: item?.product_details?.image
            ? item?.product_details?.image
            : undefined,
        }}
        style={styles.itemImg}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>
          {item?.product_details?.name} | {item.quantity} Qty
        </Text>
        <Text style={styles.itemDesc}>
          {item?.product_details?.description}
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

        {item.status === "returned/replaced_requested" && (
          <Text style={styles.pickup}>Requested Return/Exchange</Text>
        )}
        {/* Status Button */}
        {order.status === "accepted" &&
        item.status !== "delivered" &&
        item.status !== "returned/replaced_requested" ? (
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
                    : item.status === "returned/replaced_approved"
                    ? "Complete Return/Exchange"
                    : "Mark as In Transit"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          item.status === "returned/replaced_requested" && (
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
                  <Text style={styles.statusButtonText}>Cancel</Text>
                )}
              </TouchableOpacity>
            </View>
          )
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <CustomHeader
          title={order?.user_details?.first_name || order?.customer_name}
          // rightIcon={
          //   <TouchableOpacity
          //     onPress={() => {
          //       // Handle chat functionality
          //       console.log("Chat button pressed");
          //     }}
          //     style={styles.chatButton}
          //   >
          //     <Icon name="chatbox-ellipses" size={s(22)} color="#FCA511" />
          //   </TouchableOpacity>
          // }
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
          {/* {order.status !== "not_accepted" && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleCancelOrder}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )} */}
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
              <TouchableOpacity style={styles.downloadBtn}>
                <Text style={styles.downloadText}>Download Bill</Text>
              </TouchableOpacity>
            )}
          </View>
          {order.instructions && (
            <Text style={styles.instructionsText}>
              Instructions: {order.instructions}
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
                : renderRegularItem(item)
            )
          )}
        </View>

        {/* Delivery Boy Selection */}
        <View style={[styles.card, { zIndex: 3000 }]}>
          <Text style={styles.sectionTitle}>DELIVERY ASSIGNMENT</Text>
          {order?.delivery_type === "general_delivery" ? (
            <TextInput
              placeholder="Enter Tracking Link"
              placeholderTextColor="#ccc"
              style={styles.input}
              value={trackingLink}
              onChangeText={(text) => setTrackingLink(text)}
            />
          ) : order?.delivery_type === "on_shop_order" ||
            order?.delivery_type === "self_pickup" ||
            (order?.delivery_type === "instant_delivery" &&
              !deliveryMode?.is_auto_assign_enabled) ? null : (
            <CustomDropdown
              placeholder="Select Delivery Boy"
              options={deliveryBoys.map((db) => ({ name: db.name, id: db.id }))}
              onSelect={(value) => setSelectedDeliveryBoy(value)}
              selectedValue={
                selectedDeliveryBoy ? selectedDeliveryBoy.name : ""
              }
            />
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
              Rs {Number(order.shipping_fee).toFixed(2)}
            </Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Wallet Amount</Text>
            <Text style={styles.paymentValue}>
              Rs {Number(order.wallet_amount).toFixed(2)}
            </Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Cashback</Text>
            <Text style={styles.paymentValue}>
              Rs {Number(order.cashback).toFixed(2)}
            </Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Coupon</Text>
            <Text style={styles.paymentValue}>
              Rs {Number(order.coupon).toFixed(2)}
            </Text>
          </View>

          <View style={[styles.paymentRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>
              Rs {Number(order.total_amount).toFixed(2)}
            </Text>
          </View>
          <Text style={styles.taxNote}>Incl. all taxes and charges</Text>
        </View>

        {/* Delivery Details */}
        <View style={styles.deliveryCard}>
          <Text style={styles.deliveryTitle}>Delivery Details</Text>

          <View style={styles.deliverySection}>
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

      {/* Accept Order - Swipeable */}
      {
        order.status === "not_accepted" && (
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
        )
        //  (
        //   (order.delivery_type === "general_delivery" ||
        //     order.delivery_type === "instant_delivery") &&
        //   order.items.filter((item: OrderItem) => item.status === "delivered")
        //     .length === order.items.length &&
        //   order.status !== "completed" && (
        //     <TouchableOpacity
        //       style={styles.orderStatusBtn}
        //       onPress={() => handleAcceptOrder("completed")}
        //     >
        //       <View style={styles.acceptTextContainer}>
        //         <Text style={styles.acceptText}>Mark as Completed</Text>
        //       </View>
        //     </TouchableOpacity>
        //   )
        // )
      }

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
              {pendingStatusUpdate?.newStatus === "intransit"
                ? "In Transit"
                : "Delivered"}
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
    </SafeAreaView>
  );
};

export default OrderProductDetails;

const styles = StyleSheet.create({
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
    flexDirection: "row",
    justifyContent: "space-between",
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
  },
  noItemsText: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
    padding: 20,
  },
  itemRow: {
    flexDirection: "row",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemImg: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 8,
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
    color: "#333",
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
  printFileName: {
    fontWeight: "700",
    color: "#1F1F1F",
    marginBottom: 6,
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
});

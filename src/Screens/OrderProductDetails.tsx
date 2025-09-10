import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import CustomHeader from "../CommonComponent/CustomHeader";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import CustomDropdown from "../CommonComponent/CustomDropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import { Swipeable } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import { s } from "react-native-size-matters";

type OrderProductDetailsRouteParams = {
  orderId: string;
};

interface OrderItem {
  id: number;
  product: {
    name: string;
    description: string;
    images?: Array<{ image: string }>;
    mrp: number;
  };
  quantity: number;
  price: number;
}

interface Order {
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
}

const OrderProductDetails = ({ navigation }: any) => {
  const route = useRoute();
  const { orderId } = route.params as OrderProductDetailsRouteParams;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deliveryBoys, setDeliveryBoys] = useState<any[]>([]);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState<any>(null);
  const swipeableRef = useRef<Swipeable | null>(null);

  useEffect(() => {
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

    const fetchDeliveryBoys = async () => {
      try {
        const response = await api.get(API_ROUTES.deliveryBoys);
        setDeliveryBoys(response.data);
      } catch (error) {
        console.error("Failed to fetch delivery boys:", error);
      }
    };

    if (orderId) {
      fetchOrderDetails();
      fetchDeliveryBoys();
    }
  }, [orderId]);

  const handleAcceptOrder = async () => {
    try {
      setLoading(true);
      const response = await api.put(`${API_ROUTES.orders}${orderId}/`, {
        status: "accepted",
        delivery_boy: selectedDeliveryBoy?.id,
      });
      setOrder(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to update order:", error);
      setLoading(false);
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <CustomHeader
          title={order.customer_name}
          rightIcon={
            <TouchableOpacity
              onPress={() => {
                // Handle chat functionality
                console.log("Chat button pressed");
              }}
              style={styles.chatButton}
            >
              <Icon name="chatbox-ellipses" size={s(22)} color="#FCA511" />
            </TouchableOpacity>
          }
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
            {order.status.toUpperCase()}
          </Text>
          <TouchableOpacity style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Order details */}
        <View style={styles.orderDetails}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>Id - #{order.order_id}</Text>
            <Text style={styles.orderDate}>
              {new Date(order.created_at).toLocaleDateString()}
            </Text>
          </View>
          <Text style={styles.pickup}>{order.delivery_type}</Text>
          <View style={styles.paymentRow}>
            <Text
              style={[
                styles.paymentStatus,
                order.is_paid ? styles.paidStatus : styles.unpaidStatus,
              ]}
            >
              {order.is_paid ? "Paid" : "Unpaid"} / {order.payment_mode}
            </Text>
            <TouchableOpacity style={styles.downloadBtn}>
              <Text style={styles.downloadText}>Download Bill</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Items */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {order.items.length} Items in this Order
          </Text>
          {order.items.length === 0 ? (
            <Text style={styles.noItemsText}>No items in this order</Text>
          ) : (
            order.items.map((item: OrderItem) => (
              <View style={styles.itemRow} key={item.id}>
                <Image
                  source={{
                    uri:
                      item.product.images && item.product.images.length > 0
                        ? item.product.images[0].image
                        : undefined,
                  }}
                  style={styles.itemImg}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>
                    {item.product.name} | {item.quantity} Qty
                  </Text>
                  <Text style={styles.itemDesc}>
                    {item.product.description}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>Rs {item.price}</Text>
                    {item.product.mrp > item.price && (
                      <Text style={styles.oldPrice}>Rs {item.product.mrp}</Text>
                    )}
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Delivery Boy Selection */}
        <View style={[styles.card, { zIndex: 3000 }]}>
          <Text style={styles.sectionTitle}>DELIVERY ASSIGNMENT</Text>
          <CustomDropdown
            placeholder="Select Delivery Boy"
            options={deliveryBoys.map((db) => ({ name: db.name, id: db.id }))}
            onSelect={(value) => setSelectedDeliveryBoy(value)}
            selectedValue={selectedDeliveryBoy ? selectedDeliveryBoy.name : ""}
          />
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
            <Text style={styles.addressText}>{order.customer_name}</Text>
            <Text style={styles.addressText}>{order.customer_address}</Text>
            <Text style={styles.addressText}>
              Mobile - {order.customer_mobile}
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
            <TouchableOpacity style={styles.callButton}>
              <Icon name="call" size={16} color="#fff" />
              <Text style={styles.callButtonText}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Accept Order - Swipeable */}
      <Swipeable
        ref={swipeableRef}
        containerStyle={styles.swipeContainer}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={60}
        leftThreshold={60}
        renderLeftActions={RightAction}
        onSwipeableOpen={() => {
          handleAcceptOrder();
          swipeableRef.current?.close();
        }}
      >
        <TouchableOpacity
          style={styles.acceptBtn}
          onPress={() => navigation.navigate("ProductDetails")}
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
    fontWeight: "bold",
    fontSize: 16,
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
});

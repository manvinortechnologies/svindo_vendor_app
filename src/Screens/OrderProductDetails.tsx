import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import CustomHeader from "../CommonComponent/CustomHeader";

const OrderProductDetails = () => {
  // const route = useRoute();
  // const { order } = route.params;
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        {/* <View style={styles.header}>
          <Text style={styles.customerName}>Customer Name</Text>
          <TouchableOpacity style={styles.chatBtn}>
            <Text style={styles.chatText}>💬</Text>
          </TouchableOpacity>
        </View> */}

        <CustomHeader title="Customer Name" />

        {/* Order status */}
        <View style={styles.orderStatusRow}>
          <Text style={styles.notAccepted}>Order Not Accepted</Text>
          <TouchableOpacity style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Order details */}
        <View style={styles.orderDetails}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>Id - #SVINDO12345</Text>
            <Text style={styles.orderDate}>20 Jan 2025 | 1:15 PM</Text>
          </View>
          <Text style={styles.pickup}>Self Pickup</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.unpaid}>Unpaid / COD</Text>
            <TouchableOpacity style={styles.downloadBtn}>
              <Text style={styles.downloadText}>Download Bill</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Items */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>2 Items in this Order</Text>
          <View style={styles.itemRow}>
            <Image
              source={require("../assets/product/product7.png")}
              style={styles.itemImg}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>Flower Pots | 1 Qty</Text>
              <Text style={styles.itemDesc}>
                Set of 5 flower pots with colorful flower brown pots in material
              </Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>Rs 200.00</Text>
                <Text style={styles.oldPrice}>Rs 400.00</Text>
              </View>
            </View>
          </View>

          <View style={styles.itemRow}>
            <Image
              source={require("../assets/product/product7.png")}
              style={styles.itemImg}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>Flower Pots | 1 Qty</Text>
              <Text style={styles.itemDesc}>
                Set of 5 flower pots with colorful flower brown pots in material
              </Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>Rs 200.00</Text>
                <Text style={styles.oldPrice}>Rs 400.00</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>PAYMENT DETAILS</Text>
          {[
            { label: "Item Total & GST", value: "Rs 1000/" },
            { label: "Shipping Fee", value: "Rs 1000/" },
            { label: "Wallet Amount", value: "Rs 1000/" },
            { label: "Cashback", value: "Rs 1000/" },
            { label: "Coupon", value: "Rs 1000/" },
          ].map((item, index) => (
            <View style={styles.paymentRow} key={index}>
              <Text style={{ color: "#617C9D", fontWeight: "500" }}>
                {item.label}
              </Text>
              <Text style={styles.paymentValue}>{item.value}</Text>
            </View>
          ))}

          <View style={[styles.paymentRow, { borderTopWidth: 1 }]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>Rs 1000/</Text>
          </View>
          <Text style={styles.taxNote}>Incl. all taxes and charges</Text>
        </View>

        {/* Delivery Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <Text>Address : </Text>
          <Text>Mobile : 9999999999</Text>
          <Text>Payment Mode : COD</Text>
        </View>
      </ScrollView>

      {/* Accept Order Button */}
      <TouchableOpacity style={styles.acceptBtn}>
        <Text style={styles.acceptArrow}>→</Text>
        <View>
          <Text style={styles.acceptText}>Accept Order</Text>
          <Text style={styles.acceptSub}>Swipe to change status</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default OrderProductDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  customerName: { fontSize: 18, fontWeight: "bold" },
  chatBtn: { backgroundColor: "#FFB800", padding: 5, borderRadius: 5 },
  chatText: { fontSize: 18 },

  orderStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginHorizontal: 10,
  },
  notAccepted: { color: "#492F99", fontWeight: "600" },
  cancelBtn: {
    backgroundColor: "#FF0000",
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 5,
  },
  cancelText: { color: "#fff" },
  orderDetails: {
    marginHorizontal: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
  },

  orderInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    // borderWidth: 1,
    // borderColor: "#ddd",
  },
  orderId: { fontWeight: "bold" },
  orderDate: { color: "gray", fontWeight: "500" },

  pickup: {
    color: "#005A92",
    fontWeight: "500",
    paddingHorizontal: 15,
    marginVertical: 5,
  },
  unpaid: { color: "#FF0000", fontWeight: "500" },
  downloadBtn: { backgroundColor: "#FFB800", padding: 5, borderRadius: 5 },
  downloadText: { color: "#fff" },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    paddingHorizontal: 15,
  },

  card: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  sectionTitle: { fontWeight: "bold", marginBottom: 10, textAlign: "center" },

  itemRow: { flexDirection: "row", marginBottom: 15 },
  itemImg: { width: 50, height: 50, marginRight: 10 },
  itemName: { fontWeight: "bold" },
  itemDesc: { color: "gray", fontSize: 12 },
  priceRow: { flexDirection: "row", alignItems: "center" },
  price: { color: "gray", fontWeight: "bold", marginRight: 10 },
  oldPrice: {
    textDecorationLine: "line-through",
    color: "#FF0000",
    fontWeight: "bold",
  },

  paymentValue: { fontWeight: "bold" },
  totalLabel: { fontWeight: "bold", color: "#005A92", marginTop: 10 },
  totalValue: { fontWeight: "bold", color: "#005A92" },
  taxNote: { fontSize: 12, color: "#000", textAlign: "left", marginLeft: 10 },

  acceptBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF9800",
    paddingVertical: 12,
    paddingHorizontal: 20,
    position: "absolute",
    bottom: 10,
    width: "100%",
  },
  acceptArrow: {
    color: "#fff",
    fontSize: 22,
    marginRight: 10,
    fontWeight: "bold",
  },
  acceptText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  acceptSub: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
});

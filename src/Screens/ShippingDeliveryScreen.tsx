import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import CustomHeader from "../CommonComponent/CustomHeader";
import shippingAndDeliveryPolicy from "../CommonComponent/Policies/ShippingAndDeliveryPolicy";

const { width } = Dimensions.get("window");

const ShippingDeliveryScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Shipping & Delivery" showBackButton={true} />
      <View style={styles.webViewContainer}>
        <WebView
          source={{ html: shippingAndDeliveryPolicy }}
          style={styles.webView}
          scalesPageToFit={true}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webViewContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
    width: width,
  },
});

export default ShippingDeliveryScreen;

import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import CustomHeader from "../CommonComponent/CustomHeader";
import termsOfService from "../CommonComponent/Policies/TermsOfService";

const { width } = Dimensions.get("window");

const TermsScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <CustomHeader title="Terms & Conditions" showBackButton={true} />
      <View style={styles.webViewContainer}>
        <WebView
          source={{ html: termsOfService }}
          style={styles.webView}
          scalesPageToFit={true}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
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

export default TermsScreen;

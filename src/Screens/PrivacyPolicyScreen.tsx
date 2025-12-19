import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import CustomHeader from "../CommonComponent/CustomHeader";
import privacyPolicy from "../CommonComponent/Policies/PrivacyPolicy";

const { width } = Dimensions.get("window");

const PrivacyPolicyScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Privacy & Policy" showBackButton={true} />
      <View style={styles.webViewContainer}>
        <WebView
          source={{ html: privacyPolicy }}
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

export default PrivacyPolicyScreen;

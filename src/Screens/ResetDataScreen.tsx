import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import Headerwithback from "./Headerwithback";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StorageUtils } from "../utils/storage";
import { HomeNavigation } from "../constants/app-routes.constants";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import Toast from "react-native-toast-message";

const ResetDataScreen = () => {
  const navigation = useNavigation();
  const [isResetting, setIsResetting] = useState(false);
  const insets = useSafeAreaInsets();
  const handleReset = () => {
    Alert.alert(
      "Confirm Reset",
      "Are you absolutely sure you want to reset all data? \nThis action cannot be undone and will clear all your app data.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: confirmReset,
        },
      ]
    );
  };

  const confirmReset = async () => {
    try {
      setIsResetting(true);

      // Get company profile ID from storage
      const businessProfile = StorageUtils.getBusinessProfile();
      let companyId = null;

      if (businessProfile) {
        try {
          const profileData = JSON.parse(businessProfile);
          companyId = profileData.id || profileData.company_id;
        } catch (parseError) {
          console.error("Error parsing business profile:", parseError);
        }
      }

      // Call API to delete company profile if ID exists
      if (companyId) {
        try {
          await api.delete(`${API_ROUTES.companyProfle}/${companyId}/`);
        } catch (apiError) {
          console.error("Error deleting company profile:", apiError);
          // Continue with reset even if API call fails
        }
      }

      // Explicitly remove business profile from storage
      StorageUtils.removeBusinessProfile();

      // Show success message
      Alert.alert(
        "Data Reset Complete",
        "All data has been cleared successfully. You will be redirected to the signup screen.",
        [
          {
            text: "OK",
            onPress: () => {
              // Reset navigation to SignUpDetails
              (navigation as any).reset({
                index: 0,
                routes: [{ name: HomeNavigation.SIGNUP_DETAIL_SCREEN }],
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error resetting data:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to reset data. Please try again.",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* Header */}
      <Headerwithback title="Reset Data" />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Are You Sure You Want to Reset data ?</Text>
        <Text style={styles.description}>
          Resetting your data is permanent and cannot be undone. All your data,
          order history, and personal information will be removed from our
          system.
        </Text>

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            Warning: This action is irreversible. Once your account is deleted,
            you will lose access to all your purchases, saved items, and
            personal data.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.resetButton, isResetting && styles.disabledButton]}
          onPress={handleReset}
          disabled={isResetting}
        >
          {isResetting ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.resetButtonText}>Resetting...</Text>
            </View>
          ) : (
            <Text style={styles.resetButtonText}>Reset data</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResetDataScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
    lineHeight: 20,
  },
  warningBox: {
    borderWidth: 1,
    borderColor: "#ff3b30",
    backgroundColor: "#ffecec",
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
  },
  warningText: {
    fontSize: 13,
    color: "#d32f2f",
  },
  resetButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    width: "50%",
  },
  resetButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

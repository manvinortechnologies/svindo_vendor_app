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
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import { StorageUtils } from "../utils/storage";
import { useNavigation } from "@react-navigation/native";
import { HomeNavigation } from "../constants/app-routes.constants";

const DeleteAccountScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      "Confirm Account Deletion",
      "Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: confirmDeleteAccount,
        },
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    try {
      setIsLoading(true);

      const response = await api.delete(API_ROUTES.deleteUser);

      if (response.status === 200 || response.status === 204) {
        // Clear all stored data
        StorageUtils.clearAll();

        Alert.alert(
          "Account Deleted",
          "Your account has been successfully deleted. You will be redirected to the welcome screen.",
          [
            {
              text: "OK",
              onPress: () => {
                (navigation as any).reset({
                  index: 0,
                  routes: [{ name: HomeNavigation.WELCOME_SCREEN }],
                });
              },
            },
          ]
        );
      } else {
        throw new Error("Failed to delete account");
      }
    } catch (error) {
      console.error("Delete account error:", error);
      Alert.alert(
        "Error",
        "Failed to delete your account. Please try again later or contact support if the problem persists.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Headerwithback title="Delete Account" />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>
          Are You Sure You Want to Delete Your Account?
        </Text>
        <Text style={styles.description}>
          Deleting your account is permanent and cannot be undone. All your
          data, order history, and personal information will be removed from our
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
          style={[styles.deleteButton, isLoading && styles.disabledButton]}
          onPress={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.deleteButtonText}>Deleting...</Text>
            </View>
          ) : (
            <Text style={styles.deleteButtonText}>Delete My Account</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DeleteAccountScreen;

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
  deleteButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    width: "50%",
    alignSelf: "flex-end",
  },
  deleteButtonText: {
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

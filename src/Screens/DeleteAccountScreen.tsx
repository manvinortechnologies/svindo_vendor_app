import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import Headerwithback from "./Headerwithback";
import { SafeAreaView } from "react-native-safe-area-context";

const DeleteAccountScreen = () => {
  const handleDelete = () => {
    // Add delete logic here
    // alert('Account deletion requested.');
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

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete My Account</Text>
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
});

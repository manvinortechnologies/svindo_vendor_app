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

const ResetDataScreen = () => {
  const handleReset = () => {
    // Add reset logic here
    // alert('Data reset requested.');
  };

  return (
    <SafeAreaView style={styles.container}>
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

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset data</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
});

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import Headerwithback from "./Headerwithback";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

const SendNotifications = () => {
  const [redirect, setRedirect] = useState("store");

  return (
    <SafeAreaView style={styles.container}>
      <Headerwithback title={"Send Notification"} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Upload Banner */}
        <TouchableOpacity style={styles.uploadBox}>
          <Text style={styles.uploadText}>+</Text>
          <Text style={styles.uploadInfo}>Upload banner</Text>
          <Text style={styles.uploadInfo}>Size ~ less than 1 MB</Text>
          <Text style={styles.uploadInfo}>Ratio : 1:3</Text>
        </TouchableOpacity>

        {/* Campaign Name */}
        <Text style={styles.label}>Campaign name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter here"
          placeholderTextColor="#FCA311"
        />

        {/* On click redirect */}
        <Text style={styles.label}>On click redirect to</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>{redirect}</Text>
          <Icon name="arrow-drop-down" size={24} color="#333" />
        </TouchableOpacity>

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          placeholder="Under 90 letters"
          placeholderTextColor="#FCA311"
        />

        {/* Note */}
        <View style={styles.noteBox}>
          <Text style={styles.noteLabel}>Note:</Text>
          <Text style={styles.noteText}>
            This notification is pushed only to your followers, visible only for
            7 days after approval. At a time only 1 notification can be active.
            {"\n\n"}
            To send notification to wider audience contact svindo support.
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitText}>Submit for approval</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SendNotifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 20,
  },
  uploadText: {
    fontSize: 30,
    color: "#333",
  },
  uploadInfo: {
    fontSize: 12,
    color: "#555",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  dropdownText: {
    color: "#000",
    fontSize: 14,
  },
  noteBox: {
    backgroundColor: "#fff1dc",
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
  },
  noteLabel: {
    color: "#FCA311",
    fontWeight: "bold",
    marginBottom: 4,
  },
  noteText: {
    fontSize: 12,
    color: "#555",
  },
  submitButton: {
    backgroundColor: "#169729",
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 20,
  },
  submitText: {
    color: "#fff",
    fontWeight: "700",
  },
});

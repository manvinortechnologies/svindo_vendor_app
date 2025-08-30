import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import CustomHeader from "../CommonComponent/CustomHeader";

const ExpensesDetailScreen = () => {
  const [isPaid, setIsPaid] = useState(true);

  return (
    <View style={styles.container}>
      {/* Header */}
      <CustomHeader title="Details" />

      <ScrollView
        contentContainerStyle={{ padding: 15, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Expense Amount */}
        <Text style={styles.label}>Expense Amount</Text>
        <Text style={styles.value}>0.00</Text>

        {/* Category */}
        <Text style={styles.label}>Category Name</Text>
        <Text style={styles.value}>Category</Text>

        {/* Expense Date */}
        <Text style={styles.label}>Expense Date</Text>
        <Text style={styles.value}>14-02-2025</Text>

        {/* Mark as Paid */}
        <View style={styles.row}>
          <Text style={styles.label}>Mark as Paid</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.yesText}>{isPaid ? "Yes" : "No"}</Text>
            <Switch
              trackColor={{ false: "#ccc", true: "#FFB74D" }}
              thumbColor={isPaid ? "#FF9800" : "#f4f3f4"}
              onValueChange={() => setIsPaid((prev) => !prev)}
              value={isPaid}
            />
          </View>
        </View>

        {/* Select Type */}
        <Text style={styles.label}>
          Select Type<Text style={{ color: "red" }}> *</Text>
        </Text>
        <TouchableOpacity style={styles.typeBtn}>
          <Icon name="checkmark-circle" size={18} color="#fff" />
          <Text style={styles.typeBtnText}>Cash</Text>
        </TouchableOpacity>

        {/* Payment Date */}
        <Text style={styles.label}>Payment Date</Text>
        <Text style={styles.value}>14-02-2025</Text>

        {/* Bank Name */}
        <Text style={styles.label}>Bank Name</Text>
        <Text style={styles.value}>Bank Name</Text>

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <Text style={styles.valueGray}>Expense Description</Text>

        {/* Attachments */}
        <Text style={styles.label}>Attachments</Text>
        <View style={styles.attachmentBox}>
          <Image
            style={styles.attachmentImage}
            source={{ uri: "https://via.placeholder.com/100" }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ExpensesDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  headerActions: { flexDirection: "row", alignItems: "center" },
  editText: { fontSize: 12, color: "#FF9800", fontWeight: "500" },

  // Labels & Values
  label: { marginTop: 5, fontWeight: "600", fontSize: 14 },
  value: { fontSize: 14, marginTop: 5, color: "#777777" },
  valueGray: { fontSize: 14, marginTop: 5, color: "gray" },

  // Switch
  row: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF9800",
    padding: 1,
    borderRadius: 5,
    marginTop: 15,
  },
  yesText: { marginRight: 8, fontWeight: "bold", color: "#FF9800" },

  // Type Button
  typeBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF9800",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  typeBtnText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
  },

  // Attachment
  attachmentBox: {
    marginTop: 10,
    backgroundColor: "#D9D9D9",
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 110,
    height: 150,
  },
  attachmentImage: { width: "100%", height: "100%", borderRadius: 6 },
});

import React, { useState, useEffect } from "react";
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
import { ScaledSheet } from "react-native-size-matters";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import Loading from "../CommonComponent/Loading";
import DeleteConfirmationModal from "../Modals/DeleteConfirmationModal";
import { useNavigation, useRoute } from "@react-navigation/native";
import { HomeNavigation } from "../constants/app-routes.constants";

const ExpensesDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { expenseData: routeExpenseData } = (route.params as any) || {};

  const [expenseData, setExpenseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (routeExpenseData) {
      setExpenseData(routeExpenseData);
    } else {
      setError("No expense data available");
    }
  }, [routeExpenseData]);

  const handleDeleteExpense = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`${API_ROUTES.expense}${expenseData?.id}/`);
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Error deleting expense:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Details</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                (navigation as any).navigate(HomeNavigation.EXPENSES, {
                  editMode: true,
                  expenseData: expenseData,
                })
              }
            >
              <Text style={styles.editText}>View / Edit Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteExpense}
            >
              <Icon name="trash" size={20} color="#f44336" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              (navigation as any).navigate(HomeNavigation.EXPENSES, {
                editMode: true,
                expenseData: expenseData,
              })
            }
          >
            <Text style={styles.editText}>View / Edit Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteExpense}
          >
            <Icon name="trash" size={20} color="#f44336" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 15, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Expense Amount */}
        <Text style={styles.label}>Expense Amount</Text>
        <Text style={styles.value}>
          {expenseData?.amount ? `₹${expenseData.amount}` : "0.00"}
        </Text>

        {/* Category */}
        <Text style={styles.label}>Category Name</Text>
        <Text style={styles.value}>
          {expenseData?.category_details?.name || "N/A"}
        </Text>

        {/* Expense Date */}
        <Text style={styles.label}>Expense Date</Text>
        <Text style={styles.value}>
          {expenseData?.expense_date
            ? new Date(expenseData.expense_date).toLocaleDateString("en-GB")
            : "N/A"}
        </Text>

        {/* Mark as Paid */}
        <View style={styles.row}>
          <Text style={styles.label}>Is Paid</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.yesText}>
              {expenseData?.is_paid ? "Yes" : "No"}
            </Text>
            <Switch
              trackColor={{ false: "#ccc", true: "#FFFFFF" }}
              thumbColor={expenseData?.is_paid ? "#FF9800" : "#f4f3f4"}
              value={expenseData?.is_paid || false}
              disabled={true}
            />
          </View>
        </View>

        {/* Select Type */}
        <Text style={styles.label}>
          Payment Type<Text style={{ color: "red" }}> *</Text>
        </Text>
        <View style={styles.typeBtn}>
          <Icon name="checkmark-circle" size={18} color="#fff" />
          <Text style={styles.typeBtnText}>
            {expenseData?.payment_method.toUpperCase() || "Cash"}
          </Text>
        </View>

        {/* Payment Date */}
        <Text style={styles.label}>Payment Date</Text>
        <Text style={styles.value}>
          {expenseData?.payment_date
            ? new Date(expenseData.payment_date).toLocaleDateString("en-GB")
            : "N/A"}
        </Text>

        {/* Bank Name */}
        <Text style={styles.label}>Bank Name</Text>
        <Text style={styles.value}>
          {expenseData?.bank_details?.name || "N/A"}
        </Text>

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <Text style={styles.valueGray}>
          {expenseData?.description || "No description available"}
        </Text>

        {/* Attachments */}
        <Text style={styles.label}>Attachments</Text>
        <View style={styles.attachmentBox}>
          {expenseData?.attachment ? (
            <Image
              style={styles.attachmentImage}
              source={{ uri: expenseData.attachment }}
            />
          ) : (
            <Text style={styles.noAttachmentText}>No attachment</Text>
          )}
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        visible={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        isLoading={isDeleting}
      />
    </View>
  );
};

export default ExpensesDetailScreen;

const styles = ScaledSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Header styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF9800",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: "18@s",
    fontWeight: "bold",
    color: "#000",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  editButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  editText: {
    fontSize: "12@s",
    color: "#FF9800",
    fontWeight: "500",
  },
  deleteButton: {
    padding: 5,
  },

  // Labels & Values
  label: { marginTop: 5, fontWeight: "600", fontSize: "14@s", color: "#000" },
  value: { fontSize: "14@s", marginTop: 5, color: "#777777" },
  valueGray: { fontSize: "14@s", marginTop: 5, color: "gray" },

  // Switch
  row: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF9800",
    paddingHorizontal: "6@s",
    // paddingVertical: 8,
    borderRadius: 20,
    marginVertical: "10@s",
    alignSelf: "flex-start",
  },
  yesText: {
    // marginRight: 8,
    fontWeight: "bold",
    color: "#fff",
    fontSize: "14@s",
  },

  // Type Button
  typeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: "10@s",
    backgroundColor: "#FF9800",
    paddingVertical: "2@s",
    paddingHorizontal: "10@s",
    borderRadius: 6,
    marginTop: "8@s",
    alignSelf: "flex-start",
  },
  typeBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: "14@s",
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
  noAttachmentText: { color: "#777", fontSize: "12@s" },

  // Error handling styles
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: "16@s",
    color: "#f44336",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#FF9800",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: "14@s",
  },
});

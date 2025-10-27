import CustomModal from "../Modals/CustomModal";
import { StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native";

export default function DeleteModal({
  showDeleteModal,
  handleCancelDelete,
  handleConfirmDelete,
  title,
  message,
  subMessage,
  buttonText,
  buttonText2,
}: any) {
  return (
    <CustomModal
      visible={showDeleteModal}
      title={title}
      onClose={handleCancelDelete}
      modalStyle={styles.deleteModalStyle}
    >
      <View style={styles.deleteModalContent}>
        <View style={styles.deleteIconContainer}>
          <Icon name="warning" size={48} color="#F44336" />
        </View>

        <Text style={styles.deleteModalText}>{message}</Text>

        <Text style={styles.deleteModalSubText}>{subMessage}</Text>

        <View style={styles.deleteModalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelDeleteButton]}
            onPress={handleCancelDelete}
          >
            <Text style={styles.cancelDeleteButtonText}>{buttonText}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButton, styles.confirmDeleteButton]}
            onPress={handleConfirmDelete}
          >
            <Icon
              name="trash"
              size={16}
              color="#fff"
              style={styles.deleteButtonIcon}
            />
            <Text style={styles.confirmDeleteButtonText}>{buttonText2}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomModal>
  );
}

const styles = StyleSheet.create({
  deleteModalStyle: {
    width: "90%",
    maxWidth: 400,
  },
  deleteModalContent: {
    alignItems: "center",
    paddingVertical: 10,
  },
  deleteIconContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#FFEBEE",
    borderRadius: 50,
  },
  deleteModalText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  deleteModalSubText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  deleteModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 15,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelDeleteButton: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    flex: 1,
  },
  cancelDeleteButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmDeleteButton: {
    backgroundColor: "#F44336",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  confirmDeleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButtonIcon: {
    marginRight: 8,
  },
});

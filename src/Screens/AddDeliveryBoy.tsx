import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Headerwithback from "./Headerwithback";
import MainContainer from "../CommonComponent/MainContainer";
import ModalUpdatePhoto from "../Modals/ModalUpdatePhoto";
import Loading from "../CommonComponent/Loading";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import { DeliveryPerson } from "../type/common";
import DeleteModal from "./DeleteModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AddDeliveryBoy = () => {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [rating, setRating] = useState("");
  const [imageFile, setImageFile] = useState<any>();
  const [imageModel, setImageModel] = useState<boolean>(false);
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryPerson[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deliveryBoyId, setDeliveryBoyId] = useState<number | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    mobile?: string;
    imageFile?: string;
  }>({});
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(API_ROUTES.deliveryBoys);
      console.log(res);
      setDeliveryBoys(res.data);
    } catch (error) {
      console.error("Error fetching delivery boys:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: {
      name?: string;
      mobile?: string;
      imageFile?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = "Please enter delivery boy name";
    }
    if (!mobile.trim()) {
      newErrors.mobile = "Please enter mobile number";
    } else if (mobile.length !== 10) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }
    if (!imageFile) {
      newErrors.imageFile = "Please upload a photo of the delivery boy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateDeliveryBoy = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("mobile", mobile.trim());
      formData.append("is_active", "true");

      // Add photo if selected
      if (imageFile) {
        formData.append("photo", {
          uri: imageFile.uri,
          type: imageFile.type || "image/jpeg",
          name: imageFile.name || "delivery_boy_photo.jpg",
        });
      }

      const response = await api.post(API_ROUTES.deliveryBoys, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Delivery boy created successfully!",
        });
        // Reset form
        setName("");
        setMobile("");
        setRating("");
        setImageFile(null);
        setErrors({});
        // Refresh the list
        getData();
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to create delivery boy",
        });
      }
    } catch (error: any) {
      console.error("Error creating delivery boy:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.message ||
          "Failed to create delivery boy. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDeliveryBoy = (id: number) => {
    setShowDeleteModal(true);
    setDeliveryBoyId(id);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(deliveryBoyId);
      const response = await api.delete(
        `${API_ROUTES.deliveryBoys}${deliveryBoyId}/`
      );

      if (response.status === 200 || response.status === 204) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Delivery boy deleted successfully!",
        });
        // Refresh the list
        getData();
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to delete delivery boy",
        });
      }
    } catch (error: any) {
      console.error("Error deleting delivery boy:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.message ||
          "Failed to delete delivery boy. Please try again.",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditDeliveryBoy = (deliveryBoy: DeliveryPerson) => {
    setIsEditing(true);
    setEditingId(deliveryBoy.id);
    setName(deliveryBoy.name);
    setMobile(deliveryBoy.mobile);
    setRating(deliveryBoy.rating || "");

    // Set the existing photo if available
    if (deliveryBoy.photo) {
      setImageFile({
        uri: deliveryBoy.photo,
        type: "image/jpeg",
        name: "existing_photo.jpg",
      });
    } else {
      setImageFile(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setName("");
    setMobile("");
    setRating("");
    setImageFile(null);
    setErrors({});
  };

  const handleUpdateDeliveryBoy = async () => {
    if (!validateForm()) {
      return;
    }

    if (!editingId) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No delivery boy selected for editing",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("mobile", mobile.trim());
      formData.append("is_active", "true");

      // Add photo if selected
      if (imageFile) {
        formData.append("photo", {
          uri: imageFile.uri,
          type: imageFile.type || "image/jpeg",
          name: imageFile.name || "delivery_boy_photo.jpg",
        });
      }

      const response = await api.put(
        `${API_ROUTES.deliveryBoys}${editingId}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Delivery boy updated successfully!",
        });
        // Reset form and exit edit mode
        handleCancelEdit();
        // Refresh the list
        getData();
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to update delivery boy",
        });
      }
    } catch (error: any) {
      console.error("Error updating delivery boy:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.message ||
          "Failed to update delivery boy. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.mainContainer,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Headerwithback
        title={isEditing ? "Edit Delivery Boy" : "Add Own Delivery Boy"}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <ModalUpdatePhoto
          isVisible={imageModel}
          onClose={() => {
            setImageModel(false);
          }}
          onSelectedFile={(e) => {
            setImageFile(e);
            if (errors.imageFile) {
              setErrors((prev) => ({ ...prev, imageFile: undefined }));
            }
          }}
        />

        {/* Upload Photo */}
        <Text style={styles.label}>Photo</Text>
        <TouchableOpacity
          onPress={() => {
            setImageModel(true);
          }}
          style={[styles.uploadBox, errors.imageFile && styles.uploadBoxError]}
        >
          {imageFile?.uri ? (
            <Image
              source={{ uri: imageFile.uri }}
              style={styles.uploadedMedia}
              resizeMode="cover"
            />
          ) : (
            <>
              <Icon name="camera-plus" size={32} color="#FCA311" />
              <Text style={styles.uploadText}>Tap to Upload Photo</Text>
            </>
          )}
        </TouchableOpacity>
        {errors.imageFile && (
          <Text style={styles.errorText}>{errors.imageFile}</Text>
        )}

        {/* Name */}
        <Text style={styles.label}> Name</Text>
        <TextInput
          placeholder="Enter here"
          placeholderTextColor="#999"
          style={[styles.input, errors.name && styles.inputError]}
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (errors.name) {
              setErrors((prev) => ({ ...prev, name: undefined }));
            }
          }}
          autoCapitalize="words"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        {/* Mobile */}
        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          placeholder="Enter here"
          placeholderTextColor="#999"
          style={[styles.input, errors.mobile && styles.inputError]}
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={(text) => {
            setMobile(text);
            if (errors.mobile) {
              setErrors((prev) => ({ ...prev, mobile: undefined }));
            }
          }}
          maxLength={10}
        />
        {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}

        {/* Rating */}
        {/* <Text style={styles.label}>Rating</Text>
        <TextInput
          placeholder="Enter rating (0-5)"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType="decimal-pad"
          value={rating}
          onChangeText={setRating}
        /> */}

        {/* Create/Update Button */}
        <View style={styles.buttonContainer}>
          {isEditing && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleCancelEdit}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.createBtn}
            onPress={
              isEditing ? handleUpdateDeliveryBoy : handleCreateDeliveryBoy
            }
          >
            <Text style={styles.createBtnText}>
              {isEditing ? "Update" : "Create"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Delivery Boys List */}
        <Text style={styles.sectionTitle}>Delivery Boys</Text>
        <FlatList
          data={deliveryBoys}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }: { item: DeliveryPerson }) => (
            <View
              style={[
                styles.card,
                { backgroundColor: item.is_active ? "#D8FFDE" : "#D8FFDE" },
              ]}
            >
              {/* Status */}
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: item.is_active ? "#75FF89" : "#FFCCCC",
                    },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {item.is_active ? "Active" : "Pause"}
                  </Text>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    onPress={() => handleEditDeliveryBoy(item)}
                    style={styles.editButton}
                  >
                    <Icon name="pencil" size={18} color="#FCA311" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteDeliveryBoy(item.id)}
                    disabled={isDeleting === item.id}
                    style={styles.deleteButton}
                  >
                    {isDeleting === item.id ? (
                      <Icon name="loading" size={18} color="#ccc" />
                    ) : (
                      <Icon name="delete" size={18} color="red" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Content */}
              <View style={styles.contentRow}>
                <Image
                  source={
                    item.photo
                      ? { uri: item.photo }
                      : require("../assets/logo.png")
                  }
                  style={styles.logo}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.nameText}>Name: {item.name}</Text>
                  <Text style={styles.subText}>Mobile: {item.mobile}</Text>
                  <Text style={styles.subText}>
                    Total Deliveries - {item.total_deliveries}
                  </Text>
                  {/* <Text style={styles.subText}>Earnings - {item.earnings}</Text> */}
                  {/* <Text style={styles.subText}>Rating</Text>
                  <View style={styles.ratingRow}>
                    {Array.from({ length: parseInt(item.rating) }).map(
                      (_, idx) => (
                        <Icon key={idx} name="star" size={20} color="#FCA311" />
                      )
                    )}
                  </View> */}
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
        />
        <Loading visible={isLoading} />
        <DeleteModal
          showDeleteModal={showDeleteModal}
          handleCancelDelete={handleCancelDelete}
          handleConfirmDelete={handleConfirmDelete}
          title="Delete Delivery Boy"
          message="Are you sure you want to delete this delivery boy?"
          subMessage="This action cannot be undone and will permanently remove all delivery boy data."
          buttonText="Cancel"
          buttonText2="Delete"
        />
      </ScrollView>
    </View>
  );
};

export default AddDeliveryBoy;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: "#FCA311",
    borderStyle: "dashed",
    height: 120,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 30,
    width: "50%",
    alignSelf: "center",
    backgroundColor: "#FFF7DD",
  },
  uploadText: {
    color: "#FCA311",
    fontSize: 14,
    marginTop: 4,
    fontWeight: "500",
  },
  uploadSubText: {
    color: "#888",
    fontSize: 10,
    marginTop: 2,
    fontStyle: "italic",
  },
  label: {
    fontSize: 14,
    color: "#656565",
    fontWeight: "500",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#FFEFD5",
    color: "#000",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginVertical: 10,
    gap: 10,
  },
  createBtn: {
    backgroundColor: "#169729",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  createBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelBtn: {
    backgroundColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  cancelBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontWeight: "bold",
    color: "#FCA311",
    fontSize: 20,
    marginVertical: 10,
  },
  card: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: "20%",
    height: "80%",
    resizeMode: "cover",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  nameText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000",
  },
  subText: {
    fontSize: 12,
    color: "#000",
    fontWeight: "bold",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 2,
    alignSelf: "flex-end",
  },
  uploadedMedia: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editButton: {
    padding: 4,
    borderRadius: 4,
  },
  deleteButton: {
    padding: 4,
    borderRadius: 4,
  },
  inputError: {
    borderColor: "#FF0000",
  },
  uploadBoxError: {
    borderColor: "#FF0000",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
});

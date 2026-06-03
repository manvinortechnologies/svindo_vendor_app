import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Headerwithback from "./Headerwithback";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import ImageCropPicker from "react-native-image-crop-picker";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import Loading from "../CommonComponent/Loading";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import Toast from "react-native-toast-message";

interface ProductOption {
  id: number;
  name: string;
  image?: string;
  is_active?: boolean;
}

interface RootStackParamList {
  CreateOffer: { requestId: string; selectedTab: string };
}
const CreateOffer = () => {
  const route = useRoute<RouteProp<any, any>>();
  const requestId = route.params?.requestId;
  const selectedTab = route.params?.selectedTab;
  const navigation = useNavigation();
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await api.get(API_ROUTES.vendorProduct);
      const activeProducts = (response?.data?.results || []).filter(
        (product: ProductOption) => product?.is_active,
      );
      setProducts(activeProducts);
      if (formData.connected_product) {
        const alreadySelected = activeProducts.find(
          (item: ProductOption) =>
            item.id?.toString() === formData.connected_product,
        );
        if (alreadySelected) {
          setSelectedProduct(alreadySelected);
        }
      }
    } catch (error) {
      console.log("Failed to fetch products for CreateOffer:", error);
    } finally {
      setProductsLoading(false);
    }
  };

  const openProductModal = () => {
    if (!products.length) {
      fetchProducts().finally(() => setProductModalVisible(true));
      return;
    }
    setProductModalVisible(true);
  };

  const handleProductSelect = (product: ProductOption) => {
    setSelectedProduct(product);
    handleInputChange("connected_product", product.id.toString());
    setProductModalVisible(false);
  };

  // Form state
  const [formData, setFormData] = useState({
    heading: "",
    connected_product: "",
    selling_price: "",
    description: "",
  });

  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    heading: "",
    selling_price: "",
    description: "",
    image: "",
  });
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(
    null,
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle image picker
  const handleImagePicker = async () => {
    try {
      // Clear image error when user starts uploading
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: "" }));
      }

      const result = await ImageCropPicker.openPicker({
        mediaType: "photo",
        compressImageQuality: 0.8,
        cropping: true,
        includeBase64: false,
      });

      // Validate that we have a valid path
      if (!result.path) {
        setErrors((prev) => ({
          ...prev,
          image:
            "The selected image could not be processed. Please try selecting a different file.",
        }));
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (result.size && result.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          image:
            "The selected file is too large. Please choose a file smaller than 10MB.",
        }));
        return;
      }

      // Convert ImageCropPicker response to format expected by the rest of the app
      const asset = {
        uri: result.path,
        type: result.mime || "image/jpeg",
        fileName:
          result.filename || result.path?.split("/").pop() || "offer_image.jpg",
        fileSize: result.size,
      };

      setSelectedImage(asset);
    } catch (error: any) {
      // Check if user cancelled
      if (error.code === "E_PICKER_CANCELLED") {
        return; // User cancelled, don't show error
      }

      setErrors((prev) => ({
        ...prev,
        image:
          error.message || "Failed to access media library. Please try again.",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      heading: "",
      selling_price: "",
      description: "",
      image: "",
    };

    let isValid = true;

    if (!formData.heading.trim()) {
      newErrors.heading = "Please enter heading";
      isValid = false;
    }
    if (
      !formData.selling_price.trim() ||
      isNaN(Number(formData.selling_price))
    ) {
      newErrors.selling_price = "Please enter a valid selling price";
      isValid = false;
    }
    if (!formData.description.trim()) {
      newErrors.description = "Please enter description";
      isValid = false;
    }
    if (!selectedImage) {
      newErrors.image = "Please upload an image";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Create offer
  const createOffer = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("request", requestId);
      formDataToSend.append("heading", formData.heading);
      formDataToSend.append("product", formData.connected_product);
      formDataToSend.append("selling_price", formData.selling_price);
      formDataToSend.append("description", formData.description);

      if (selectedImage) {
        formDataToSend.append("media", {
          uri: selectedImage.uri,
          type: selectedImage.type || "image/jpeg",
          name: selectedImage.fileName || "offer_image.jpg",
        });
      }

      const response = await api.post(API_ROUTES.createOffer, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Offer created successfully!",
      });
      // Reset form
      setFormData({
        heading: "",
        connected_product: "",
        selling_price: "",
        description: "",
      });
      setSelectedImage(null);
      setSelectedProduct(null);
      setErrors({
        heading: "",
        selling_price: "",
        description: "",
        image: "",
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error creating offer:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to create offer. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => (
    <View style={styles.formContainer}>
      {/* Upload Media Box */}
      <TouchableOpacity
        style={[styles.uploadBox, errors.image && styles.inputError]}
        onPress={handleImagePicker}
      >
        {selectedImage ? (
          <Image
            source={{ uri: selectedImage.uri }}
            style={styles.selectedImage}
          />
        ) : (
          <>
            <Icon name="add" size={24} color="#727272" />
            <Text style={styles.uploadText}>Upload Media</Text>
            <Text style={styles.uploadNote}>
              For Photos keep the dimension ratio 1:1
            </Text>
          </>
        )}
      </TouchableOpacity>
      {errors.image ? (
        <Text style={styles.errorText}>{errors.image}</Text>
      ) : null}

      {/* Heading */}
      <Text style={styles.label}>Heading</Text>
      <TextInput
        placeholder="Enter here"
        placeholderTextColor="#ccc"
        style={[styles.input, errors.heading && styles.inputError]}
        value={formData.heading}
        onChangeText={(text) => handleInputChange("heading", text)}
      />
      {errors.heading ? (
        <Text style={styles.errorText}>{errors.heading}</Text>
      ) : null}

      {/* Select Product */}
      <Text style={styles.label}>
        Select Product to connect (Optional - for retail only)
      </Text>
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          selectedTab === "Wholesale" && {
            backgroundColor: "#F4F4F4",
            borderColor: "#F4F4F4",
          },
        ]}
        onPress={openProductModal}
        disabled={selectedTab === "Wholesale"}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.dropdownButtonText,
            !selectedProduct && { color: "#8b8b8b" },
          ]}
        >
          {selectedProduct?.name || "Select product"}
        </Text>
        <Icon name="arrow-drop-down" size={24} color="#333" />
      </TouchableOpacity>

      {/* Selling Price */}
      <Text style={styles.label}>Selling Price</Text>
      <TextInput
        placeholder="Enter Amount"
        placeholderTextColor="#ccc"
        style={[styles.input, errors.selling_price && styles.inputError]}
        keyboardType="numeric"
        value={formData.selling_price}
        onChangeText={(text) => handleInputChange("selling_price", text)}
      />
      {errors.selling_price ? (
        <Text style={styles.errorText}>{errors.selling_price}</Text>
      ) : null}

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        placeholder="Enter details"
        placeholderTextColor="#ccc"
        style={[styles.textArea, errors.description && styles.inputError]}
        multiline
        numberOfLines={4}
        value={formData.description}
        onChangeText={(text) => handleInputChange("description", text)}
      />
      {errors.description ? (
        <Text style={styles.errorText}>{errors.description}</Text>
      ) : null}

      {/* Note */}
      <Text style={styles.note}>
        Note:{"\n"}Use short description and lowest sales price to increase your
        chances of sales.{"\n"}Offer will be valid for 7 days.
      </Text>

      {/* Submit Offer Button */}
      <TouchableOpacity style={styles.submitButton} onPress={createOffer}>
        <Text style={styles.submitText}>Submit Offer</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <Headerwithback title={"Create Offer"} />
      <Loading visible={isLoading} />
      <FlatList
        data={["form"]}
        keyExtractor={(item) => item}
        renderItem={renderForm}
        contentContainerStyle={styles.listContainer}
      />
      <Modal
        visible={productModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setProductModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Product</Text>
              <TouchableOpacity onPress={() => setProductModalVisible(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
            {productsLoading ? (
              <View style={styles.modalLoadingContainer}>
                <ActivityIndicator size="small" color="#FCA311" />
              </View>
            ) : products.length === 0 ? (
              <View style={styles.modalLoadingContainer}>
                <Text style={styles.emptyStateText}>
                  No active products found
                </Text>
              </View>
            ) : (
              <FlatList
                data={products.filter(
                  (product: any) => product.sale_type === "both",
                )}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.productOption}
                    onPress={() => handleProductSelect(item)}
                  >
                    <Image
                      source={
                        item.image
                          ? { uri: item.image }
                          : require("../assets/product.png")
                      }
                      style={styles.productOptionImage}
                    />
                    <View style={styles.productOptionDetails}>
                      <Text style={styles.productOptionName} numberOfLines={1}>
                        {item.name || "Unnamed product"}
                      </Text>
                      <Text style={styles.productOptionId}>
                        #{item.id.toString()}
                      </Text>
                    </View>
                    {selectedProduct?.id === item.id && (
                      <Icon name="check-circle" size={20} color="#FCA311" />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => (
                  <View style={styles.productOptionSeparator} />
                )}
                contentContainerStyle={styles.productListContainer}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CreateOffer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingVertical: 20
  },
  listContainer: {
    padding: 16,
  },
  formContainer: {
    flex: 1,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: "#C7C7C7",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  uploadText: {
    color: "#727272",
    fontWeight: "600",
    marginTop: 4,
  },
  uploadNote: {
    color: "#727272",
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
  },
  label: {
    color: "#727272",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: "#FFF3E1",
    color: "#000",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: "top",
    backgroundColor: "#FFF3E1",
    color: "#000",
  },
  note: {
    fontSize: 12,
    color: "#727272",
    fontWeight: "600",
    marginBottom: 20,
  },
  submitButton: {
    width: "40%",
    alignSelf: "center",
    backgroundColor: "#FCA311",
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 12,
    backgroundColor: "#FFF3E1",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownButtonText: {
    color: "#000",
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: "cover",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  inputError: {
    borderColor: "#FF0000",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "70%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  modalCloseText: {
    color: "#FCA311",
    fontWeight: "600",
    fontSize: 14,
  },
  modalLoadingContainer: {
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    color: "#8b8b8b",
    fontSize: 14,
  },
  productOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  productOptionImage: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#F4F4F4",
  },
  productOptionDetails: {
    flex: 1,
    marginRight: 12,
  },
  productOptionName: {
    color: "#000",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 2,
  },
  productOptionId: {
    color: "#8b8b8b",
    fontSize: 12,
  },
  productOptionSeparator: {
    height: 1,
    backgroundColor: "#f1f1f1",
  },
  productListContainer: {
    paddingBottom: 24,
  },
});

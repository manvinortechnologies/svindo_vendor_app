import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import Toast from "react-native-toast-message";
import MainContainer from "../CommonComponent/MainContainer";
import Headerwithback from "./Headerwithback";
import { InputBox } from "../CommonComponent/InputBox";
import CustomDropdown from "../CommonComponent/CustomDropdown";
import ModalUpdatePhoto from "../Modals/ModalUpdatePhoto";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import Loading from "../CommonComponent/Loading";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { HomeNavigation } from "../constants/app-routes.constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AddonFormData {
  description: string;
  name: string;
  price_per_unit: string;
  product_category: string;
  image?: any;
}

interface CategoryOption {
  id: number;
  name: string;
}

const AddAddOns = () => {
  const navigation = useNavigation();
  const route =
    useRoute<
      RouteProp<{ params: { productId: string; isEdit: boolean } }, "params">
    >();
  const productId = route.params?.productId;
  const isEdit = route.params?.isEdit;
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState<AddonFormData>({
    description: "",
    name: "",
    price_per_unit: "",
    product_category: "",
    image: null,
  });
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [errors, setErrors] = useState<{
    name?: string;
    price_per_unit?: string;
    description?: string;
    product_category?: string;
  }>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    const response = await api.get(`${API_ROUTES.addons}${productId}/`);
    setFormData(response.data);
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("masters/get-product-category/");
      setCategories(response.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleInputChange = (field: keyof AddonFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageSelect = (file: any) => {
    setFormData((prev) => ({
      ...prev,
      image: {
        uri: file.uri,
        name: file.name || "banner.jpg",
        type: file.mime || "image/jpeg",
      },
    }));
    setIsImageModalVisible(false);
  };

  const handleSubmit = async () => {
    // Reset errors
    setErrors({});

    // Validate form data
    const newErrors: {
      name?: string;
      price_per_unit?: string;
      description?: string;
      product_category?: string;
    } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter addon name";
    }
    if (!formData.price_per_unit.trim()) {
      newErrors.price_per_unit = "Please enter price per unit";
    } else if (
      isNaN(parseFloat(formData.price_per_unit)) ||
      parseFloat(formData.price_per_unit) <= 0
    ) {
      newErrors.price_per_unit = "Please enter a valid price";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Please enter description";
    }
    if (!formData.product_category) {
      newErrors.product_category = "Please select a category";
    }

    // If there are errors, set them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      const formDatas = new FormData();
      formDatas.append("description", formData.description);
      formDatas.append("name", formData.name);
      formDatas.append("price_per_unit", formData.price_per_unit);
      formDatas.append("product_category", formData.product_category);
      if (formData?.image?.uri) {
        formDatas.append("image", formData.image);
      }

      const response = await api[isEdit ? "put" : "post"](
        `${API_ROUTES.addons}${productId ? `${productId}/` : ""}`,
        formDatas,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // Navigate to success screen with product details
      (navigation as any).replace(HomeNavigation.ADDON_SUCCESS, {
        productName: formData.name,
        productDescription: formData.description,
        productImage: formData.image?.uri,
        stock: 5, // Default stock or get from response
      });
    } catch (error: any) {
      console.error("Error creating addon:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Failed to create addon",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Headerwithback title="Enter Details" />
      <Loading visible={isLoading} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Addon Name Section */}
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Addon Name</Text>
            {/* <Text style={styles.highlightedText}>Addon</Text> */}
          </View>
          <InputBox
            placeholder="Enter addon name"
            background="#FFF8EB"
            value={formData.name}
            onChangeText={(text) => handleInputChange("name", text)}
            textInputStyle={errors.name ? styles.inputError : undefined}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* Category Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Category</Text>
          <CustomDropdown
            placeholder="Select Category"
            options={categories}
            onSelect={(option) => {
              handleInputChange("product_category", option.id);
              if (errors.product_category) {
                setErrors((prev) => ({
                  ...prev,
                  product_category: undefined,
                }));
              }
            }}
            selectedValue={formData.product_category}
            dropDownBoxStyle={[
              styles.inputField,
              errors.product_category && styles.dropdownError,
            ]}
          />
          {errors.product_category && (
            <Text style={styles.errorText}>{errors.product_category}</Text>
          )}
        </View>

        {/* Price per Unit Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Price per Unit</Text>
          <InputBox
            placeholder="Enter price per unit"
            background="#FFF8EB"
            value={formData.price_per_unit}
            onChangeText={(text) => handleInputChange("price_per_unit", text)}
            keyboardType="numeric"
            textInputStyle={
              errors.price_per_unit ? styles.inputError : undefined
            }
          />
          {errors.price_per_unit && (
            <Text style={styles.errorText}>{errors.price_per_unit}</Text>
          )}
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[
              styles.descriptionInput,
              errors.description && styles.descriptionInputError,
            ]}
            placeholder="Enter description here..."
            placeholderTextColor="#888"
            value={formData.description}
            onChangeText={(text) => handleInputChange("description", text)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
        </View>

        {/* Image Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Image (Optional)</Text>
          <TouchableOpacity
            style={styles.imagePlaceholder}
            onPress={() => setIsImageModalVisible(true)}
          >
            {formData.image ? (
              <Image
                source={{
                  uri: formData.image?.uri || formData.image,
                }}
                style={styles.imagePreview}
              />
            ) : (
              <Text style={styles.placeholderText}>Tap to select image</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      {/* Image Modal */}
      <ModalUpdatePhoto
        isVisible={isImageModalVisible}
        onClose={() => setIsImageModalVisible(false)}
        onSelectedFile={handleImageSelect}
      />
    </View>
  );
};

export default AddAddOns;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  section: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  highlightedText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FCA311",
    backgroundColor: "#FFF8EB",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  inputField: {
    backgroundColor: "#FFF8EB",
    borderColor: "#FCA311",
    borderRadius: 8,
    padding: 12,
  },
  descriptionInput: {
    backgroundColor: "#FFF8EB",
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    color: "#333",
  },
  descriptionInputError: {
    borderColor: "#FF0000",
  },
  inputError: {
    borderColor: "#FF0000",
  },
  dropdownError: {
    borderColor: "#FF0000",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  imagePlaceholder: {
    backgroundColor: "#FFF8EB",
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 8,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
  },
  imageText: {
    color: "#FCA311",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonContainer: {
    padding: 10,
    // backgroundColor: "#fff",
    // borderTopWidth: 1,
    // borderTopColor: "#E0E0E0",
  },
  submitButton: {
    width: "50%",
    alignSelf: "center",
    backgroundColor: "#FCA311",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

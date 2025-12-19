import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import Headerwithback from "./Headerwithback";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomDropdown from "../CommonComponent/CustomDropdown";
import ImageCropPicker from "react-native-image-crop-picker";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import Loading from "../CommonComponent/Loading";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const CreateRequestScreen = () => {
  const navigation = useNavigation();
  const [selectedType, setSelectedType] = useState<"Business" | "Personal">(
    "Business"
  );
  const [categoryList, setCategoryList] = useState<any>([]);
  const [subCategoryList, setSubCategoryList] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    productName: "",
    budget: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    productName: "",
    category: "",
    subCategory: "",
    budget: "",
    description: "",
    images: "",
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const [categoryRes, subCategoryRes] = await Promise.all([
        api.get(API_ROUTES.productCategory),
        api.get(API_ROUTES.productSubCategory),
      ]);

      setCategoryList(categoryRes.data);
      setSubCategoryList(subCategoryRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      "Select Image",
      "Choose an option",
      [
        { text: "Camera", onPress: () => openCamera() },
        { text: "Gallery", onPress: () => openImageLibrary() },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const openCamera = async () => {
    try {
      // Clear image error when user starts uploading
      if (errors.images) {
        setErrors((prev) => ({ ...prev, images: "" }));
      }

      const result = await ImageCropPicker.openCamera({
        mediaType: "photo",
        compressImageQuality: 0.8,
        cropping: true,
        includeBase64: false,
      });

      if (result.path) {
        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (result.size && result.size > maxSize) {
          setErrors((prev) => ({
            ...prev,
            images:
              "The selected file is too large. Please choose a file smaller than 10MB.",
          }));
          return;
        }

        setSelectedImages((prev) => [...prev, result.path]);
      }
    } catch (error: any) {
      console.log("ImageCropPicker camera error--->", error);

      // Check if user cancelled
      if (error.code === "E_PICKER_CANCELLED") {
        return; // User cancelled, don't show error
      }

      setErrors((prev) => ({
        ...prev,
        images: error.message || "Failed to access camera. Please try again.",
      }));
    }
  };

  const openImageLibrary = async () => {
    try {
      // Clear image error when user starts uploading
      if (errors.images) {
        setErrors((prev) => ({ ...prev, images: "" }));
      }

      // Calculate how many more images can be selected (max 5 total)
      const remainingSlots = 5 - selectedImages.length;
      if (remainingSlots <= 0) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "You can select a maximum of 5 images.",
        });
        return;
      }

      const result = await ImageCropPicker.openPicker({
        mediaType: "photo",
        compressImageQuality: 0.8,
        cropping: true,
        multiple: remainingSlots > 1, // Enable multiple selection if we can select more than 1
        maxFiles: remainingSlots,
        includeBase64: false,
      });

      // Handle both single and multiple results
      const results = Array.isArray(result) ? result : [result];
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes

      const validImages: string[] = [];
      for (const imageResult of results) {
        if (!imageResult.path) {
          continue;
        }

        // Validate file size
        if (imageResult.size && imageResult.size > maxSize) {
          setErrors((prev) => ({
            ...prev,
            images:
              "Some selected files are too large. Please choose files smaller than 10MB.",
          }));
          continue;
        }

        validImages.push(imageResult.path);
      }

      if (validImages.length > 0) {
        setSelectedImages((prev) => [...prev, ...validImages]);
      }
    } catch (error: any) {
      console.log("ImageCropPicker library error--->", error);

      // Check if user cancelled
      if (error.code === "E_PICKER_CANCELLED") {
        return; // User cancelled, don't show error
      }

      setErrors((prev) => ({
        ...prev,
        images:
          error.message || "Failed to access media library. Please try again.",
      }));
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category);
    if (errors.category) {
      setErrors((prev) => ({
        ...prev,
        category: "",
      }));
    }
    // Clear sub-category when category changes
    setSelectedSubCategory(null);
    if (errors.subCategory) {
      setErrors((prev) => ({
        ...prev,
        subCategory: "",
      }));
    }
  };

  const handleSubCategorySelect = (subCategory: any) => {
    setSelectedSubCategory(subCategory);
    if (errors.subCategory) {
      setErrors((prev) => ({
        ...prev,
        subCategory: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      productName: "",
      category: "",
      subCategory: "",
      budget: "",
      description: "",
      images: "",
    };

    let isValid = true;

    if (!formData.productName.trim()) {
      newErrors.productName = "Please enter product name";
      isValid = false;
    }
    if (!selectedCategory) {
      newErrors.category = "Please select a category";
      isValid = false;
    }
    if (!selectedSubCategory) {
      newErrors.subCategory = "Please select a sub-category";
      isValid = false;
    }
    if (!formData.budget.trim() || isNaN(Number(formData.budget))) {
      newErrors.budget = "Please enter a valid budget amount";
      isValid = false;
    }
    if (!formData.description.trim()) {
      newErrors.description = "Please enter description";
      isValid = false;
    }
    if (selectedImages.length === 0) {
      newErrors.images = "Please upload at least one image";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const createRequest = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      // Create FormData for multipart/form-data request
      const requestData = new FormData();

      // Add the required fields
      requestData.append(
        "type",
        selectedType === "Business" ? "business" : "personal"
      );
      requestData.append("product_name", formData.productName);
      requestData.append("category", selectedCategory.id.toString());
      requestData.append("sub_category", selectedSubCategory.id.toString());
      requestData.append("budget", formData.budget);
      requestData.append("description", formData.description);

      // Add images if any
      selectedImages.forEach((imageUri, index) => {
        requestData.append("photo", {
          uri: imageUri,
          type: "image/jpeg",
          name: `product_image_${index}.jpg`,
        });
      });

      const response = await api.post(
        API_ROUTES.customerRequests,
        requestData,
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
          text2:
            "Request created successfully! You will receive offers from vendors soon.",
        });
        setFormData({
          productName: "",
          budget: "",
          description: "",
        });
        setSelectedCategory(null);
        setSelectedSubCategory(null);
        setSelectedImages([]);
        setSelectedType("Business");
        setErrors({
          productName: "",
          category: "",
          subCategory: "",
          budget: "",
          description: "",
          images: "",
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error creating request:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to create request. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Headerwithback title={"Create Request"} />
      <Loading visible={isLoading} />

      <ScrollView contentContainerStyle={styles.listContainer}>
        <View style={styles.formContainer}>
          <Text
            style={{
              color: "#727272",
              marginBottom: 20,
              fontSize: 13,
              fontWeight: "600",
            }}
          >
            Create a product request and get multiple offers from both regional
            and national businesses. Happy Shopping !
          </Text>

          <View style={styles.typeRow}>
            <Text
              style={{
                color: "#727272",
                fontWeight: "600",
                fontSize: 16,
                marginTop: 5,
                marginRight: 10,
              }}
            >
              Type
            </Text>
            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === "Business" && styles.typeButtonSelected,
              ]}
              onPress={() => setSelectedType("Business")}
            >
              <Text
                style={[
                  styles.typeText,
                  selectedType === "Business" && styles.typeTextSelected,
                ]}
              >
                For Business
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === "Personal" && styles.typeButtonSelected,
              ]}
              onPress={async () => {
                const url = "https://svindo.com/store/";
                const supported = await Linking.canOpenURL(url);
                if (supported) {
                  await Linking.openURL(url);
                } else {
                  Alert.alert("Error", "Unable to open the link");
                }
              }}
            >
              <Text
                style={[
                  styles.typeText,
                  selectedType === "Personal" && styles.typeTextSelected,
                ]}
              >
                Personal use
              </Text>
            </TouchableOpacity>
          </View>

          {/* Product Name */}
          <Text style={styles.label}>Product Name</Text>
          <TextInput
            placeholder="Ex: Bulk military dress for school function"
            style={[styles.input, errors.productName && styles.inputError]}
            placeholderTextColor="#727272"
            value={formData.productName}
            onChangeText={(text) => handleInputChange("productName", text)}
          />
          {errors.productName ? (
            <Text style={styles.errorText}>{errors.productName}</Text>
          ) : null}

          {/* Category */}
          <Text style={styles.label}>Category</Text>
          <CustomDropdown
            placeholder="Select Category"
            options={categoryList}
            onSelect={handleCategorySelect}
            selectedValue={selectedCategory || null}
            dropDownBoxStyle={[
              styles.dropdownStyle,
              errors.category && styles.inputError,
            ]}
          />
          {errors.category ? (
            <Text style={styles.errorText}>{errors.category}</Text>
          ) : null}

          {/* Sub-Category */}
          <Text style={styles.label}>Sub-Category</Text>
          <CustomDropdown
            placeholder="Select Sub-Category"
            options={subCategoryList}
            onSelect={handleSubCategorySelect}
            selectedValue={selectedSubCategory || null}
            dropDownBoxStyle={[
              styles.dropdownStyle,
              errors.subCategory && styles.inputError,
            ]}
          />
          {errors.subCategory ? (
            <Text style={styles.errorText}>{errors.subCategory}</Text>
          ) : null}

          {/* Budget */}
          <Text style={styles.label}>Budget</Text>
          <TextInput
            placeholder="Enter amount"
            style={[styles.input, errors.budget && styles.inputError]}
            keyboardType="numeric"
            placeholderTextColor="#727272"
            value={formData.budget}
            onChangeText={(text) => handleInputChange("budget", text)}
          />
          {errors.budget ? (
            <Text style={styles.errorText}>{errors.budget}</Text>
          ) : null}

          {/* Description */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            placeholder="Enter full detail"
            style={[styles.textArea, errors.description && styles.inputError]}
            multiline
            numberOfLines={4}
            placeholderTextColor="#727272"
            value={formData.description}
            onChangeText={(text) => handleInputChange("description", text)}
          />
          {errors.description ? (
            <Text style={styles.errorText}>{errors.description}</Text>
          ) : null}

          {/* Upload Photos */}
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={showImagePicker}
          >
            <Text style={styles.uploadText}>Upload Photos</Text>
          </TouchableOpacity>
          {errors.images ? (
            <Text style={styles.errorText}>{errors.images}</Text>
          ) : null}

          {/* Display Selected Images */}
          {selectedImages.length > 0 && (
            <View style={styles.imagesContainer}>
              <Text style={styles.imagesLabel}>
                Selected Images ({selectedImages.length})
              </Text>
              <View style={styles.imagesGrid}>
                {selectedImages.map((imageUri, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.selectedImage}
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Text style={styles.removeImageText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Note */}
          <Text style={styles.note}>
            Note: Your contact details will remain private.
            {"\n"}Responses to your request will appear in the Spotlight
            section, where you can browse, like, chat, or shop — all without
            spam.
          </Text>

          {/* Submit Request */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={createRequest}
            disabled={isLoading}
          >
            <Text style={styles.submitText}>
              {isLoading ? "Creating Request..." : "Submit Request"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateRequestScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    flex: 1,
  },
  listContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  formContainer: {
    flex: 1,
  },
  typeRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#FCA311",
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  typeButtonSelected: {
    backgroundColor: "#FCA311",
  },
  typeText: {
    textAlign: "center",
    color: "#FCA311",
    fontWeight: "500",
  },
  typeTextSelected: {
    color: "#fff",
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
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: "#FFF3E1",
    color: "#000",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: "top",
    backgroundColor: "#FFF3E1",
    color: "#000",
  },
  uploadButton: {
    width: "30%",
    height: 100,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginBottom: 20,
  },
  uploadText: {
    color: "#FCA311",
    fontWeight: "500",
    textAlign: "center",
  },
  note: {
    fontSize: 12,
    color: "#727272",
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  submitButton: {
    width: "40%",
    alignSelf: "center",
    backgroundColor: "#FCA311",
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
    marginBottom: 40,
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
  },
  dropdownStyle: {
    borderColor: "#FCA311",
    backgroundColor: "#FFF3E1",
    marginBottom: 12,
  },
  imagesContainer: {
    marginBottom: 20,
  },
  imagesLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#727272",
    marginBottom: 10,
  },
  imagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  imageWrapper: {
    position: "relative",
    width: 80,
    height: 80,
  },
  selectedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FCA311",
  },
  removeImageButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF0000",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  removeImageText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
});

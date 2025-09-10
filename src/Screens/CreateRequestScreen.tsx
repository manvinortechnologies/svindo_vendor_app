import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import Headerwithback from "./Headerwithback";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomDropdown from "../CommonComponent/CustomDropdown";
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
  MediaType,
} from "react-native-image-picker";

const CreateRequestScreen = () => {
  const [selectedType, setSelectedType] = useState<"Business" | "Personal">(
    "Business"
  );
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // Sample data for dropdowns
  const categories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Fashion" },
    { id: 3, name: "Home & Garden" },
    { id: 4, name: "Sports" },
    { id: 5, name: "Books" },
    { id: 6, name: "Automotive" },
    { id: 7, name: "Health & Beauty" },
    { id: 8, name: "Toys & Games" },
  ];

  const subCategories = [
    { id: 1, name: "Mobile Phones" },
    { id: 2, name: "Computers" },
    { id: 3, name: "Audio" },
    { id: 4, name: "Accessories" },
    { id: 5, name: "Clothing" },
    { id: 6, name: "Shoes" },
    { id: 7, name: "Furniture" },
    { id: 8, name: "Kitchen" },
    { id: 9, name: "Fitness" },
    { id: 10, name: "Outdoor" },
  ];

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

  const openCamera = () => {
    const options = {
      mediaType: "photo" as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }
      if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        if (imageUri) {
          setSelectedImages((prev) => [...prev, imageUri]);
        }
      }
    });
  };

  const openImageLibrary = () => {
    const options = {
      mediaType: "photo" as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      selectionLimit: 5, // Allow multiple images
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }
      if (response.assets) {
        const imageUris = response.assets
          .map((asset) => asset.uri)
          .filter(Boolean) as string[];
        setSelectedImages((prev) => [...prev, ...imageUris]);
      }
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Headerwithback title={"Create Request"} />

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
              onPress={() => setSelectedType("Personal")}
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
            style={styles.input}
            placeholderTextColor="#727272"
          />

          {/* Category */}
          <Text style={styles.label}>Category</Text>
          <CustomDropdown
            placeholder="Select Category"
            options={categories}
            onSelect={setSelectedCategory}
            selectedValue={selectedCategory?.id || null}
            dropDownBoxStyle={styles.dropdownStyle}
          />

          {/* Sub-Category */}
          <Text style={styles.label}>Sub-Category</Text>
          <CustomDropdown
            placeholder="Select Sub-Category"
            options={subCategories}
            onSelect={setSelectedSubCategory}
            selectedValue={selectedSubCategory?.id || null}
            dropDownBoxStyle={styles.dropdownStyle}
          />

          {/* Budget */}
          <Text style={styles.label}>Budget</Text>
          <TextInput
            placeholder="Enter amount"
            style={styles.input}
            keyboardType="numeric"
            placeholderTextColor="#727272"
          />

          {/* Description */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            placeholder="Enter full detail"
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholderTextColor="#727272"
          />

          {/* Upload Photos */}
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={showImagePicker}
          >
            <Text style={styles.uploadText}>Upload Photos</Text>
          </TouchableOpacity>

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
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitText}>Submit Request</Text>
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
});

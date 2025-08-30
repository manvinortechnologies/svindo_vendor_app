import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import MainContainer from "../CommonComponent/MainContainer";
import Headerwithback from "./Headerwithback";
import { InputBox } from "../CommonComponent/InputBox";
import CustomDropdown from "../CommonComponent/CustomDropdown";
import ModalUpdatePhoto from "../Modals/ModalUpdatePhoto";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import Loading from "../CommonComponent/Loading";
import { useNavigation } from "@react-navigation/native";

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

  const [formData, setFormData] = useState<AddonFormData>({
    description: "",
    name: "",
    price_per_unit: "",
    product_category: "",
  });
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

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
  };

  const handleImageSelect = (file: any) => {
    console.log(file);

    setFormData((prev) => ({
      ...prev,
      image: {
        uri: file.uri,
        name: file.filename || "banner.jpg",
        type: file.mime || "image/jpeg",
      },
    }));
    setIsImageModalVisible(false);
  };

  const handleSubmit = async () => {
    // Validate form data
    if (!formData.name.trim()) {
      Alert.alert("Error", "Please enter addon name");
      return;
    }
    if (!formData.price_per_unit.trim()) {
      Alert.alert("Error", "Please enter price per unit");
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert("Error", "Please enter description");
      return;
    }
    if (!formData.product_category) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    try {
      setIsLoading(true);
      const formDatas = new FormData();
      formDatas.append("description", formData.description);
      formDatas.append("name", formData.name);
      formDatas.append("price_per_unit", formData.price_per_unit);
      formDatas.append("product_category", formData.product_category);
      if (formData?.image) {
        console.log(formData?.image);

        formDatas.append("image", formData.image);
      }

      const response = await api.post(API_ROUTES.addons, formDatas, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error creating addon:", error);
      Alert.alert("Error", "Failed to create addon");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainContainer>
      <View style={styles.container}>
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
              <Text style={styles.highlightedText}>Addon</Text>
            </View>
            <InputBox
              placeholder="Enter addon name"
              background="#FFF8EB"
              value={formData.name}
              onChangeText={(text) => handleInputChange("name", text)}
            />
          </View>

          {/* Category Section */}
          <View style={styles.section}>
            <Text style={styles.label}>Category</Text>
            <CustomDropdown
              placeholder="Select Category"
              options={categories}
              onSelect={(option) =>
                handleInputChange("product_category", option.id.toString())
              }
              selectedValue={formData.product_category}
              dropDownBoxStyle={styles.inputField}
            />
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
            />
          </View>

          {/* Description Section */}
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Enter description here..."
              value={formData.description}
              onChangeText={(text) => handleInputChange("description", text)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
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
                  source={{ uri: formData.image?.uri }}
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
    </MainContainer>
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
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  submitButton: {
    backgroundColor: "#FCA311",
    paddingVertical: 16,
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

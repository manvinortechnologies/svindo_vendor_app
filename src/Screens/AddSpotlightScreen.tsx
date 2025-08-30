import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Switch,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import Headerwithback from "./Headerwithback";
import CustomSwitch from "./CustomSwitch";
import CustomDropdown from "../CommonComponent/CustomDropdown";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import Loading from "../CommonComponent/Loading";

const { width } = Dimensions.get("window");

interface ProductOption {
  id: number;
  name: string;
}

interface SpotlightFormData {
  product: string;
  discount_tag: string;
  boost: boolean;
  budget: string;
}

interface FormErrors {
  product?: string;
  discount_tag?: string;
  budget?: string;
}

const AddSpotlightScreen = () => {
  const [formData, setFormData] = useState<SpotlightFormData>({
    product: "",
    discount_tag: "",
    boost: false,
    budget: "",
  });
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/vendor/product/");
      setProducts(response.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleInputChange = (
    field: keyof SpotlightFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing/selecting (only for fields with validation)
    if (field !== "boost" && errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field as keyof FormErrors]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.product) {
      newErrors.product = "Please select a product";
    }
    if (!formData.discount_tag.trim()) {
      newErrors.discount_tag = "Please enter discount tag";
    }
    if (!formData.budget.trim()) {
      newErrors.budget = "Please enter budget amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        product: parseInt(formData.product),
        discount_tag: formData.discount_tag,
        boost: formData.boost,
        budget: formData.budget,
      };

      const response = await api.post(API_ROUTES.spotlightProduct, payload);

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success", "Spotlight product submitted successfully");
        // Reset form
        setFormData({
          product: "",
          discount_tag: "",
          boost: false,
          budget: "",
        });
        setErrors({});
      } else {
        Alert.alert("Error", "Failed to submit spotlight product");
      }
    } catch (error) {
      console.error("Error submitting spotlight product:", error);
      Alert.alert("Error", "Failed to submit spotlight product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Headerwithback title={"Add Spotlight Product"} />
      <Loading visible={isLoading} />

      <View style={{ marginTop: 10 }}>
        {/* Select Product */}
        <Text style={styles.label}>Select Product</Text>
        <CustomDropdown
          placeholder="Search by Product name"
          options={products}
          onSelect={(option) =>
            handleInputChange("product", option.id.toString())
          }
          selectedValue={formData.product}
          dropDownBoxStyle={styles.dropdownStyle}
        />
        {errors.product && (
          <Text style={styles.errorText}>{errors.product}</Text>
        )}

        {/* Discount Tag */}
        <Text style={styles.label}>Discount Tag</Text>
        <TextInput
          style={styles.inputField}
          placeholder="Enter discount tag"
          placeholderTextColor="#555"
          value={formData.discount_tag}
          onChangeText={(text) => handleInputChange("discount_tag", text)}
        />
        {errors.discount_tag && (
          <Text style={styles.errorText}>{errors.discount_tag}</Text>
        )}

        {/* Boost Spotlight Product */}
        <View style={styles.boostRow}>
          <Text style={styles.boostText}>Boost Spotlight Product</Text>
          <CustomSwitch
            value={formData.boost}
            onValueChange={(value) => handleInputChange("boost", value)}
          />
        </View>

        {/* Budget */}
        <Text style={styles.budgetLabel}>Budget (Minimum - 10 Rupees)</Text>
        <TextInput
          style={styles.inputField}
          placeholder="Enter Amount"
          placeholderTextColor="#555"
          keyboardType="numeric"
          value={formData.budget}
          onChangeText={(text) => handleInputChange("budget", text)}
        />
        {errors.budget && <Text style={styles.errorText}>{errors.budget}</Text>}

        {/* Approximate Costing */}
        <View style={styles.costBox}>
          {/* Approximate Costing Title */}
          <Text
            style={[styles.costText, { fontWeight: "600", color: "#FCA311" }]}
          >
            Approximate Costing
          </Text>

          {/* Row with per view costs */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 4,
            }}
          >
            <Text>
              per view cost:{" "}
              <Text style={{ color: "#000", fontWeight: "600" }}>10 paisa</Text>
            </Text>
            <Text>
              per view cost:{" "}
              <Text style={{ color: "#000", fontWeight: "600" }}>10 paisa</Text>
            </Text>
          </View>

          {/* Caution */}
          <Text style={[styles.cautionText, { marginTop: 8 }]}>Caution:</Text>
          <Text style={styles.cautionDescription}>
            Please follow platforms{" "}
            <Text style={{ color: "#FF0000" }}>terms & conditions</Text> for
            speedy approval of campaigns
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit for approval</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddSpotlightScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  dropdownStyle: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "#FFEFD5",
    marginBottom: 16,
  },
  inputButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "#FFEFD5",
    marginBottom: 16,
  },
  placeholder: {
    color: "#555",
    fontSize: 15,
  },
  boostRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  boostText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  budgetLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  inputField: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "#FFEFD5",
    marginBottom: 20,
    fontSize: 15,
    color: "#000",
  },
  costBox: {
    borderWidth: 1,
    borderColor: "#C7C7C7",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 24,
  },
  costText: {
    fontSize: 14,
    color: "#000",
    marginBottom: 6,
  },
  cautionText: {
    fontSize: 12,
    color: "red",
    fontWeight: "600",
  },
  cautionDescription: {
    fontSize: 12,
    color: "#000",
  },
  submitButton: {
    marginHorizontal: 20,
    backgroundColor: "#169729",
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
});

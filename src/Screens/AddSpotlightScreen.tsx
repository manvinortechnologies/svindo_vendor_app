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
  Modal,
  FlatList,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import Headerwithback from "./Headerwithback";
import CustomSwitch from "./CustomSwitch";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import Loading from "../CommonComponent/Loading";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { ScaledSheet } from "react-native-size-matters";

type RootStackParamList = {
  AddSpotlight: {
    item?: any;
  };
};

type AddSpotlightRouteProp = RouteProp<RootStackParamList, "AddSpotlight">;

const { width } = Dimensions.get("window");

interface ProductOption {
  id: number;
  name: string;
  image?: string;
  is_active?: boolean;
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
  const navigation = useNavigation();
  const route = useRoute<AddSpotlightRouteProp>();
  const item = route.params?.item;
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState<SpotlightFormData>({
    product: item?.product || "",
    discount_tag: item?.discount_tag || "",
    boost: item?.boost || true,
    budget: "0",
  });
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showProductModal, setShowProductModal] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(
    null,
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get(API_ROUTES.vendorProduct);
      const activeProducts = response.data?.results?.filter(
        (product: any) => product.is_active,
      );
      setProducts(activeProducts || []);
      if (item?.product) {
        const foundProduct = activeProducts.find(
          (product: any) => product.id === item.product,
        );
        if (foundProduct) {
          setSelectedProduct(foundProduct);
          handleInputChange("product", foundProduct.id.toString());
        }
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const openProductPicker = async () => {
    try {
      setLoadingProducts(true);
      if (products.length === 0) {
        const res = await api.get(API_ROUTES.vendorProduct);
        const activeProducts = res.data.results?.filter(
          (product: any) => product.is_active,
        );
        setProducts(activeProducts);
        if (item?.product) {
          const foundProduct = activeProducts.find(
            (product: any) => product.id === item.product,
          );
          if (foundProduct) {
            setSelectedProduct(foundProduct);
          }
        }
      }
      setShowProductModal(true);
    } catch (e) {
      setProducts([]);
      setShowProductModal(true);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleInputChange = (
    field: keyof SpotlightFormData,
    value: string | boolean,
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
    // if (!formData.discount_tag.trim()) {
    //   newErrors.discount_tag = "Please enter discount tag";
    // }
    // if (!formData.budget.trim()) {
    //   newErrors.budget = "Please enter budget amount";
    // }

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

      const response = await api[item ? "patch" : "post"](
        API_ROUTES.spotlightProduct + (item?.id ? `/${item?.id}/` : ""),
        payload,
      );
      navigation.goBack();
      if (response.status === 200 || response.status === 201) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Spotlight product submitted successfully",
        });
        // Reset form
        setFormData({
          product: "",
          discount_tag: "",
          boost: false,
          budget: "",
        });
        setErrors({});
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to submit spotlight product",
        });
      }
    } catch (error) {
      console.error("Error submitting spotlight product:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to submit spotlight product",
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
      <Headerwithback title={"Add Spotlight Product"} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <Loading visible={isLoading} />

        <View style={{ marginTop: 10 }}>
          {/* Select Product */}
          <Text style={styles.label}>Select Product</Text>
          <TouchableOpacity
            onPress={openProductPicker}
            style={styles.productSelectButton}
          >
            {loadingProducts ? (
              <Text style={styles.productSelectButtonText}>Loading...</Text>
            ) : (
              <Text style={styles.productSelectButtonText}>
                {selectedProduct?.name
                  ? `Selected: ${selectedProduct.name}`
                  : "Select Product"}
              </Text>
            )}
          </TouchableOpacity>
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
          <Text style={styles.budgetLabel}>Budget (Minimum - 0 Rupees)</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Boosted by default"
            placeholderTextColor="#555"
            keyboardType="numeric"
            value={formData.budget}
            onChangeText={(text) => handleInputChange("budget", text)}
            editable={false}
          />
          {errors.budget && (
            <Text style={styles.errorText}>{errors.budget}</Text>
          )}

          {/* Approximate Costing */}
          <View style={styles.costBox}>
            <Text
              style={[styles.costText, { fontWeight: "600", color: "#FCA311" }]}
            >
              We are offering free boost post for limited time!
            </Text>
            {/* <Text
              style={[styles.costText, { fontWeight: "600", color: "#FCA311" }]}
            >
              Approximate Costing
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 4,
              }}
            >
              <Text>
                per view cost:{" "}
                <Text style={{ color: "#000", fontWeight: "600" }}>
                  10 paisa
                </Text>
              </Text>
              <Text>
                per click cost:{" "}
                <Text style={{ color: "#000", fontWeight: "600" }}>
                  10 paisa
                </Text>
              </Text>
            </View>
            <Text style={[styles.cautionText, { marginTop: 8 }]}>Caution:</Text>
            <Text style={styles.cautionDescription}>
              Please follow platforms{" "}
              <Text style={{ color: "#FF0000" }}>terms & conditions</Text> for
              speedy approval of campaigns
            </Text> */}
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit for approval</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Product Picker Modal */}
      <Modal visible={showProductModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Product</Text>
              <TouchableOpacity onPress={() => setShowProductModal(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
            {loadingProducts ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            ) : (
              <FlatList
                data={products.filter(
                  (product: any) => product.sale_type === "both",
                )}
                keyExtractor={(item) =>
                  item.id?.toString() || Math.random().toString()
                }
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={({ item: product }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedProduct(product);
                      handleInputChange("product", product.id.toString());
                      setShowProductModal(false);
                    }}
                    style={styles.productCard}
                  >
                    <Image
                      source={
                        product.image
                          ? { uri: product.image }
                          : require("../assets/product.png")
                      }
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.productName} numberOfLines={1}>
                      {product.name || "Unnamed"}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddSpotlightScreen;

const styles = ScaledSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: "12@s",
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
  productSelectButton: {
    backgroundColor: "#006EB2",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  productSelectButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "92%",
    borderRadius: 12,
    padding: 12,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  modalCloseText: {
    color: "#006EB2",
    fontWeight: "700",
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadingText: {
    color: "#666",
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  productCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 110,
  },
  productName: {
    padding: 8,
    color: "#000",
  },
});

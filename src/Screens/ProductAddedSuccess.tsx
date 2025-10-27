import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../CommonComponent/CustomHeader";
import CustomSwitch from "../CommonComponent/CustomSwitch";
import { API_ROUTES } from "../constants/api-routes.constants";
import api from "../services/api/api";
import { HomeNavigation } from "../constants/app-routes.constants";
import Loading from "../CommonComponent/Loading";

interface ProductAddedSuccessProps {
  navigation: any;
  route: {
    params: {
      productId: string;
      productName: string;
      productDescription: string;
      productImage?: string;
      stock?: number;
      payload?: any;
    };
  };
}

const ProductAddedSuccess: React.FC<ProductAddedSuccessProps> = ({
  navigation,
  route,
}) => {
  const {
    // productId,
    productName,
    productDescription,
    productImage,
    stock,
    payload,
  } = route.params || {};

  const [isSpotlightEnabled, setIsSpotlightEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddVariant = () => {
    navigation.navigate(HomeNavigation.ADD_PRODUCT_SCREEN, {
      productId: payload.parent || payload.id,
    });
    // Navigate to add variant screen
    console.log("Add Variant pressed");
    console.log("payload--->", payload);
  };

  const handleContinue = async () => {
    // Navigate back to home or product list
    try {
      setIsLoading(true);
      if (isSpotlightEnabled) {
        const payloads = {
          product: parseInt(payload.id),
          discount_tag: "",
          boost: isSpotlightEnabled,
          budget: payload.sales_price,
        };
        const response = await api.post(API_ROUTES.spotlightProduct, payloads);
      }
      navigation.navigate({ name: HomeNavigation.BOTTOM_NAVIGATION });
    } catch (error) {
      console.log("error--->", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Product Added successfully" />
      <Loading visible={isLoading} />
      <View style={styles.content}>
        {/* Product Card */}
        <View style={styles.productCard}>
          {/* Product Image */}
          <View style={styles.imageContainer}>
            {productImage ? (
              <Image
                source={{ uri: productImage }}
                style={styles.productImage}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>No Image</Text>
              </View>
            )}

            {/* Stock Indicator */}
            {stock && stock > 0 && (
              <View style={styles.stockBadge}>
                <Text style={styles.stockText}>{stock} Pieces Left</Text>
              </View>
            )}
          </View>

          {/* Product Details */}
          <View style={styles.productDetails}>
            <Text style={styles.productName}>
              {productName || "Product Name"}
            </Text>
            <Text style={styles.productDescription}>
              {productDescription || "Product description"}
            </Text>
          </View>
        </View>

        {/* Spotlight Toggle */}
        <View style={styles.spotlightSection}>
          <Text style={styles.spotlightLabel}>Add to Spotlight products</Text>
          <CustomSwitch
            value={isSpotlightEnabled}
            onValueChange={setIsSpotlightEnabled}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {payload.product_type === "product" && (
            <TouchableOpacity
              style={styles.addVariantButton}
              onPress={handleAddVariant}
            >
              <Text style={styles.buttonText}>Add Variant</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProductAddedSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
  },
  stockBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  stockText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  productDetails: {
    padding: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  spotlightSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
    paddingHorizontal: 4,
  },
  spotlightLabel: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: "auto",
  },
  addVariantButton: {
    flex: 1,
    backgroundColor: "#FCA311",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  continueButton: {
    flex: 1,
    backgroundColor: "#FCA311",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

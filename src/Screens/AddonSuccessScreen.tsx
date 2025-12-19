import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "../CommonComponent/CustomHeader";
import { HomeNavigation } from "../constants/app-routes.constants";
import { ScaledSheet } from "react-native-size-matters";
interface AddonSuccessScreenProps {
  route?: {
    params?: {
      productName?: string;
      productDescription?: string;
      productImage?: string;
      stock?: number;
    };
  };
  navigation: any;
}

const AddonSuccessScreen: React.FC<AddonSuccessScreenProps> = ({
  route,
  navigation,
}) => {
  // Default values or from route params
  const productName = route?.params?.productName || "White T shirt";
  const productDescription =
    route?.params?.productDescription || "White cotton logo print";
  const productImage = route?.params?.productImage;
  const stock = route?.params?.stock || 5;

  const handleContinue = () => {
    // Navigate back or to next screen
    navigation.replace(HomeNavigation.STOCK_SCREEN);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Addon Added successfully" />

      <View style={styles.content}>
        {/* Product Card */}
        <View style={styles.productCard}>
          {/* Product Image Container */}
          <View style={styles.imageContainer}>
            <Image
              source={
                productImage && typeof productImage === "string"
                  ? { uri: productImage }
                  : require("../assets/product/product1.png")
              }
              style={styles.productImage}
              resizeMode="cover"
            />

            {/* Stock Badge */}
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>{stock} Pieces Left</Text>
            </View>
          </View>

          {/* Product Details */}
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{productName}</Text>
            <Text style={styles.productDescription}>{productDescription}</Text>
          </View>
        </View>
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AddonSuccessScreen;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: "center",
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 0,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 300,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  stockBadge: {
    position: "absolute",
    top: 15,
    left: 15,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  stockText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  productDetails: {
    padding: 20,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: "#FCA311",
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

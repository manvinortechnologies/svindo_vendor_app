import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { s, ScaledSheet } from "react-native-size-matters";
import CustomSwitch from "./CustomSwitch";

interface Product {
  id: string;
  name: string;
  stock: number;
  description: string;
  image?: string;
  price: number;
  category?: string;
  subcategory?: string;
  color?: string;
  size?: string;
  sale_type?: string;
  is_active?: boolean;
  parent?: string | null;
  variants?: Product[];
}

interface ProductItemProps {
  product: Product;
  selectedType: string;
  onPress: (product: Product) => void;
  onEdit: (productId: string) => void;
  onDelete: (productId: string) => void;
  onActiveChange: (productId: string, value: boolean) => void;
  showStock?: boolean;
  showActions?: boolean;
  showSwitch?: boolean;
  isActiveLoading?: boolean;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  selectedType,
  onPress,
  onEdit,
  onDelete,
  onActiveChange,
  showStock = true,
  showActions = true,
  showSwitch = true,
  isActiveLoading = false,
}) => {
  const hasVariants = product.variants && product.variants.length > 0;

  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => onPress(product)}
      activeOpacity={0.7}
    >
      {selectedType === "Product/Service" && showStock && (
        <View style={styles.stockBadgeAbove}>
          <Text style={styles.stockText}>{product.stock} Pieces Left</Text>
        </View>
      )}

      {showActions && (
        <>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(product.id)}
          >
            <Icon name="trash" size={16} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEdit(product.id)}
          >
            <Icon name="create" size={16} color="#fff" />
          </TouchableOpacity>
        </>
      )}

      <Image
        source={
          product.image && typeof product.image === "string"
            ? { uri: product.image }
            : product.image || require("../assets/product.png")
        }
        style={styles.productImage}
      />

      <View style={styles.bottomRow}>
        <View style={styles.productdetails}>
          <Text style={styles.productName} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={styles.variantsText}>
            {product.variants?.length} Variants
          </Text>
          <Text style={styles.productDesc} numberOfLines={1}>
            {product.description || "-------"}
          </Text>
        </View>
        {showSwitch &&
          (isActiveLoading ? (
            <ActivityIndicator size="small" color="#FCA311" />
          ) : (
            <CustomSwitch
              value={product?.is_active || false}
              onValueChange={(value) => onActiveChange(product.id, value)}
              disabled={isActiveLoading}
            />
          ))}
      </View>
    </TouchableOpacity>
  );
};

export default ProductItem;

const styles = ScaledSheet.create({
  productCard: {
    width: "47%",
    backgroundColor: "#fff",
    margin: "1.5%",
    borderRadius: 10,
    elevation: 3,
    padding: 10,
    position: "relative",
  },
  stockBadgeAbove: {
    backgroundColor: "#ffffff80",
    alignSelf: "flex-start",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    marginBottom: -20,
    zIndex: 1,
  },
  stockText: {
    fontSize: 10,
    color: "#000",
    fontWeight: "bold",
  },
  deleteButton: {
    position: "absolute",
    top: "116@s",
    right: "11@s",
    backgroundColor: "#FF3B30",
    width: "24@s",
    height: "24@s",
    borderRadius: "4@s",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  editButton: {
    position: "absolute",
    top: "10@s",
    right: "11@s",
    backgroundColor: "#006EB2b3",
    width: "24@s",
    height: "24@s",
    borderRadius: "4@s",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  variantsBadge: {
    position: "absolute",
    top: "8@s",
    left: "8@s",
    backgroundColor: "#FCA311",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 5,
  },
  variantsText: {
    fontSize: 8,
    color: "#000",
    fontWeight: "bold",
  },
  productImage: {
    width: "100%",
    height: "135@s",
    borderRadius: 10,
    resizeMode: "cover",
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    color: "#000",
  },
  productDesc: {
    fontSize: 12,
    color: "#777",
    marginBottom: 5,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },
  productdetails: {
    flex: 1,
    marginRight: 10,
  },
});

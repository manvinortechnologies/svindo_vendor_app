import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { ScaledSheet } from "react-native-size-matters";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import Loading from "../CommonComponent/Loading";
import CustomSwitch from "../CommonComponent/CustomSwitch";
import SearchBar from "../CommonComponent/SearchBar";
import CustomHeader from "../CommonComponent/CustomHeader";
import ProductItem from "../CommonComponent/ProductItem";
import { HomeNavigation } from "../constants/app-routes.constants";
import DeleteModal from "./DeleteModal";

interface ProductVariant {
  id: string;
  name: string;
  description: string;
  image?: string;
  stock: number;
  is_active?: boolean;
  price: number;
  category?: string;
  subcategory?: string;
  color?: string;
  size?: string;
  sale_type?: string;
  parent?: string | null;
  variants?: ProductVariant[];
}

const VariantsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { product, variants: passedVariants } = (route.params as any) || {};

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [filteredVariants, setFilteredVariants] = useState<ProductVariant[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (passedVariants && passedVariants.length > 0) {
      // Use passed variants data
      const transformedVariants = passedVariants.map((variant: any) => ({
        id: variant.id?.toString(),
        name: variant.name || "Unknown Variant",
        description: variant.description || "",
        image:
          variant.image ||
          "https://via.placeholder.com/150x150/8B4513/FFFFFF?text=Variant",
        stock: variant.stock || 0,
        is_active: variant.is_active || false,
        price: parseFloat(variant.price || 0),
        category: variant.category,
        subcategory: variant.subcategory,
        color: variant.color,
        size: variant.size,
        sale_type: variant.sale_type,
        parent: variant.parent,
        variants: variant.variants,
      }));
      setVariants(transformedVariants);
    }
  }, [passedVariants]);

  useEffect(() => {
    filterVariants();
  }, [searchQuery, variants]);

  const filterVariants = () => {
    if (!searchQuery.trim()) {
      setFilteredVariants(variants);
    } else {
      const filtered = variants.filter(
        (variant) =>
          variant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          variant.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredVariants(filtered);
    }
  };

  const handleToggleActive = (id: string) => {
    setVariants((prevVariants) =>
      prevVariants.map((variant) =>
        variant.id === id
          ? { ...variant, is_active: !variant.is_active }
          : variant
      )
    );
  };

  const handleDeleteVariant = async (id: string) => {
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const confirmDeleteVariant = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await api.delete(`${API_ROUTES.deleteProduct}${id}/`);

      if (response.status === 200 || response.status === 204) {
        // Remove variant from local state
        setVariants((prevVariants) =>
          prevVariants.filter((variant) => variant.id !== id)
        );
      } else {
        throw new Error("Failed to delete variant");
      }
    } catch (error) {
      console.error("Error deleting variant:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    // Navigate to add product screen
    (navigation as any).navigate(HomeNavigation.ADD_PRODUCT_SCREEN, {
      productId: product.id,
      // product: product,
    });
  };

  const handleVariantPress = (product: ProductVariant) => {
    // Handle variant press - could navigate to edit screen or show details
    console.log("Variant pressed:", product);
    // You can add navigation logic here if needed
  };

  const handleEditVariant = (productId: string) => {
    (navigation as any).navigate(HomeNavigation.ADD_PRODUCT_SCREEN, {
      productId: productId,
      isEdit: true,
    });
  };

  const renderVariantCard = ({ item }: { item: ProductVariant }) => (
    <ProductItem
      product={item}
      selectedType="Product/Service"
      onPress={handleVariantPress}
      onEdit={handleEditVariant}
      onDelete={handleDeleteVariant}
      onActiveChange={handleToggleActive}
      showActions={true}
      showSwitch={true}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <CustomHeader title={product?.name || "Variants"} />

      {/* Search Bar */}
      <SearchBar
        placeholder="Searched Product/Service"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Variants Grid */}
      <FlatList
        data={filteredVariants}
        renderItem={renderVariantCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No variants found</Text>
            </View>
          ) : null
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
        <Text style={styles.addButtonText}>Add Variant</Text>
      </TouchableOpacity>

      <Loading visible={isLoading} />
      <DeleteModal
        showDeleteModal={showDeleteModal}
        handleCancelDelete={handleCancelDelete}
        handleConfirmDelete={confirmDeleteVariant}
        title="Delete Variant"
        message="Are you sure you want to delete this variant? This action cannot be undone."
        subMessage="This action cannot be undone and will permanently remove all variant data."
        buttonText="Cancel"
        buttonText2="Delete"
      />
    </SafeAreaView>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: "10@s",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  headerSpacer: {
    width: 32, // Same width as back button to center the title
  },
  gridContainer: {
    paddingHorizontal: 10,
    paddingBottom: 80,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
  },
  toggleSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  addButton: {
    position: "absolute",
    bottom: "20@s",
    right: "20@s",
    backgroundColor: "#FCA311",
    paddingHorizontal: "20@s",
    paddingVertical: "12@s",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default VariantsScreen;

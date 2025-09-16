import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/MaterialIcons";

import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";
import { HomeNavigation } from "../constants/app-routes.constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScaledSheet } from "react-native-size-matters";

// Constants
const INITIAL_QUANTITY = 1;
const MIN_QUANTITY = 0;

// Types
interface Product {
  id: number;
  name: string;
  desc: string;
  price: number;
  image: string;
  quantity?: number;
}

interface CartItem {
  id: number;
  quantity: number;
}

type RootStackParamList = {
  ProductSelection: {
    selectedProducts: Product[];
    navigateScreen: string;
  };
};

type ProductSelectionRouteProp = RouteProp<
  RootStackParamList,
  "ProductSelection"
>;
type ProductSelectionNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ProductSelection"
>;

/**
 * ProductSelectionScreen - Screen for selecting products and managing quantities
 * Features:
 * - Product search and filtering
 * - Quantity management with increment/decrement buttons
 * - Direct quantity input
 * - Cart state management
 * - Integration with parent component's selected products
 */
const ProductSelectionScreen: React.FC = () => {
  const navigation = useNavigation<ProductSelectionNavigationProp>();
  const route = useRoute<ProductSelectionRouteProp>();
  const { selectedProducts = [], navigateScreen } = route.params || {};

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchText, setSearchText] = useState("");
  const [productList, setProductList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Initialize cart with selectedProducts quantities
  useEffect(() => {
    if (selectedProducts.length > 0) {
      const initialCart = selectedProducts
        .filter((product) => product.quantity && product.quantity > 0)
        .map((product) => ({
          id: product.id,
          quantity: product.quantity || 0,
        }));
      setCart(initialCart);
    }
  }, [selectedProducts]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("vendor/product/"); // Replace with your API URL
      const data = res.data?.map((item: any) => ({
        id: item.id,
        name: item.name || item.product_name,
        desc: item.description || "",
        price: item.sales_price || 0,
        image: item.image || "https://via.placeholder.com/150",
        ...item,
      }));
      setProductList(data);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cart Management Functions
  /**
   * Finds a cart item by its ID
   * @param id - Product ID to search for
   * @returns CartItem if found, undefined otherwise
   */
  const findCartItem = useCallback(
    (id: number): CartItem | undefined => {
      return cart.find((item) => item.id === id);
    },
    [cart]
  );

  /**
   * Updates the quantity of a cart item or removes it if quantity is 0
   * @param id - Product ID
   * @param quantity - New quantity value
   */
  const updateCartItemQuantity = useCallback((id: number, quantity: number) => {
    setCart((prev) => {
      if (quantity <= MIN_QUANTITY) {
        return prev.filter((item) => item.id !== id);
      }

      const existingItem = prev.find((item) => item.id === id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );
      } else {
        return [...prev, { id, quantity }];
      }
    });
  }, []);

  /**
   * Increments the quantity of a product in the cart
   * @param id - Product ID to increment
   */
  const increment = useCallback(
    (id: number) => {
      const currentItem = findCartItem(id);
      const newQuantity = currentItem
        ? currentItem.quantity + 1
        : INITIAL_QUANTITY;
      updateCartItemQuantity(id, newQuantity);
    },
    [findCartItem, updateCartItemQuantity]
  );

  /**
   * Decrements the quantity of a product in the cart
   * @param id - Product ID to decrement
   */
  const decrement = useCallback(
    (id: number) => {
      const currentItem = findCartItem(id);
      if (currentItem) {
        const newQuantity = currentItem.quantity - 1;
        updateCartItemQuantity(id, newQuantity);
      }
    },
    [findCartItem, updateCartItemQuantity]
  );

  // Search and Filter Functions
  /**
   * Filters products based on search text
   * @returns Filtered array of products
   */
  // Merge productList with selectedProducts to show accurate quantities
  const mergedProductList = useMemo(() => {
    const productMap = new Map(productList.map((p) => [p.id, p]));

    // Update products with quantities from selectedProducts
    selectedProducts.forEach((selectedProduct) => {
      const existing = productMap.get(selectedProduct.id);
      if (existing) {
        productMap.set(selectedProduct.id, {
          ...existing,
          quantity: selectedProduct.quantity || 0,
        });
      }
    });

    return Array.from(productMap.values());
  }, [productList, selectedProducts]);

  const filteredProducts = useCallback(() => {
    if (!searchText.trim()) {
      return mergedProductList;
    }
    return mergedProductList.filter((product: Product) =>
      product.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [mergedProductList, searchText]);

  const handleSearchChange = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  /**
   * Handles quantity change from text input
   * @param itemId - Product ID
   * @param text - Input text value
   */
  const handleQuantityChange = useCallback(
    (itemId: number, text: string) => {
      const quantity = parseInt(text) || 0;
      if (quantity >= 0) {
        updateCartItemQuantity(itemId, quantity);
      }
    },
    [updateCartItemQuantity]
  );

  const renderQuantityControls = useCallback(
    (item: Product, quantity: number) => {
      if (quantity === 0) {
        return (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => increment(item.id)}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        );
      }

      return (
        <View style={styles.qtyRow}>
          <TouchableOpacity onPress={() => decrement(item.id)}>
            <Text style={styles.qtyBtn}>-</Text>
          </TouchableOpacity>
          <TextInput
            key={`qty-${item.id}-${quantity}`}
            style={styles.qtyInput}
            value={quantity.toString()}
            onChangeText={(text) => handleQuantityChange(item.id, text)}
            keyboardType="numeric"
            selectTextOnFocus
          />
          <TouchableOpacity onPress={() => increment(item.id)}>
            <Text style={styles.qtyBtn}>+</Text>
          </TouchableOpacity>
        </View>
      );
    },
    [increment, decrement, handleQuantityChange]
  );

  const renderItem = useCallback(
    ({ item }: { item: Product }) => {
      // Prioritize cart quantity over item quantity for real-time updates
      const cartQuantity = findCartItem(item.id)?.quantity;
      const quantity =
        cartQuantity !== undefined ? cartQuantity : item.quantity || 0;

      return (
        <View style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.desc}>{item.desc}</Text>
          <View style={styles.bottomRow}>
            {renderQuantityControls(item, quantity)}
            <Text style={styles.price}>₹ {item.price}</Text>
          </View>
        </View>
      );
    },
    [findCartItem, renderQuantityControls, cart]
  );

  const convertCartToProducts = useCallback((): Product[] => {
    return cart
      .map((cartItem) => {
        const product = mergedProductList.find(
          (item: Product) => item.id === cartItem.id
        );
        return product ? { ...product, quantity: cartItem.quantity } : null;
      })
      .filter((product) => product !== null) as Product[];
  }, [cart, mergedProductList]);

  const mergeProductsWithCart = useCallback(
    (existingProducts: Product[], cartProducts: Product[]): Product[] => {
      // Create a map of existing products for quick lookup
      const existingMap = new Map(existingProducts.map((p) => [p.id, p]));

      // Update existing products with cart quantities
      cartProducts.forEach((cartProduct) => {
        const existing = existingMap.get(cartProduct.id);
        if (existing) {
          existingMap.set(cartProduct.id, {
            ...existing,
            quantity: cartProduct.quantity,
          });
        } else {
          existingMap.set(cartProduct.id, cartProduct);
        }
      });

      return Array.from(existingMap.values());
    },
    []
  );

  const handleProceed = useCallback(() => {
    const cartProducts = convertCartToProducts();
    const mergedProducts = mergeProductsWithCart(
      selectedProducts,
      cartProducts
    );

    navigation.replace(navigateScreen as any, {
      selectedProducts: mergedProducts,
    });
  }, [
    convertCartToProducts,
    mergeProductsWithCart,
    selectedProducts,
    navigateScreen,
    navigation,
  ]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TextInput
          placeholder="Search Product/Service"
          placeholderTextColor="#ccc"
          style={styles.searchInput}
          value={searchText}
          onChangeText={handleSearchChange}
        />
      </View>

      <FlatList
        data={filteredProducts()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      <View style={styles.footer}>
        <View style={styles.scanRow}>
          <TouchableOpacity style={styles.scanBtn}>
            <Icon name="qr-code-scanner" size={20} color="#fff" />
            <Text style={styles.scanText}>Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addProductBtn}
            onPress={() =>
              navigation.navigate(HomeNavigation.ADD_PRODUCT_SCREEN as any)
            }
          >
            <Text style={styles.addProductText}>Add Product</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.proceedBtn} onPress={handleProceed}>
          <Text style={styles.proceedText}>Proceed</Text>
        </TouchableOpacity>
      </View>
      <Loading visible={isLoading} />
    </SafeAreaView>
  );
};

export default ProductSelectionScreen;

const styles = ScaledSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: "10@s" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: "#F3F3F3",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 40,
    color: "#000",
  },
  list: {
    paddingBottom: 130,
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
    padding: 8,
  },
  image: {
    height: 100,
    borderRadius: 8,
    resizeMode: "cover",
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
    marginVertical: 4,
  },
  desc: {
    fontSize: 12,
    color: "#777",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  addButton: {
    backgroundColor: "#FFA500",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFA500",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  qtyBtn: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 6,
  },
  qtyInput: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    maxWidth: 60,
    paddingHorizontal: 2,
    paddingVertical: 0,
  },
  price: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#FF9900",
  },
  footer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
  },
  scanRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  scanBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFA500",
    padding: 10,
    borderRadius: 6,
  },
  scanText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  addProductBtn: {
    backgroundColor: "#FFA500",
    padding: 10,
    borderRadius: 6,
  },
  addProductText: {
    color: "#fff",
    fontWeight: "bold",
  },
  proceedBtn: {
    backgroundColor: "#A5F5B0",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    width: "50%",
    alignSelf: "center",
    marginBottom: "10@s",
  },
  proceedText: {
    fontWeight: "bold",
    color: "#000",
  },
});

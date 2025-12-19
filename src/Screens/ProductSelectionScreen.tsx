import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import CustomModal from "../Modals/CustomModal";
import ScanProductModal, { VerifiedProduct } from "../Modals/ScanProductModal";

import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";
import { HomeNavigation } from "../constants/app-routes.constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScaledSheet } from "react-native-size-matters";
import Toast from "react-native-toast-message";

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
  stock?: number;
  product_type?: string;
  track_stock?: boolean;
}

interface CartItem {
  id: number;
  quantity: number;
}

type RootStackParamList = {
  ProductSelection: {
    selectedProducts: Product[];
    editMode: boolean;
    saleData: any;
    navigateScreen: string;
    formData?: any; // Add form data preservation
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
  const {
    selectedProducts = [],
    navigateScreen,
    editMode,
    saleData,
    formData,
  } = route.params || {};

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchText, setSearchText] = useState("");
  const [productList, setProductList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPrintLimitModal, setShowPrintLimitModal] =
    useState<boolean>(false);
  const [selectedPrintProductId, setSelectedPrintProductId] = useState<
    number | null
  >(null);
  const [showScanModal, setShowScanModal] = useState<boolean>(false);

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

  const hasAnotherPrintSelected = useCallback(
    (currentId?: number): boolean => {
      // Build a set of product ids in cart with qty > 0
      const selectedIds = new Set(
        cart.filter((c) => c.quantity > 0).map((c) => c.id)
      );
      // Iterate over selected products and see if any other print item exists
      for (const id of selectedIds) {
        if (currentId !== undefined && id === currentId) continue;
        const prod = productList.find((p) => p.id === id);
        if (prod?.product_type === "print") return true;
      }
      return false;
    },
    [cart, productList]
  );

  const handleSelectPrintProduct = useCallback(() => {
    console.log(
      "selectedPrintProductId",
      hasAnotherPrintSelected(selectedPrintProductId as number)
    );
    if (
      selectedPrintProductId &&
      hasAnotherPrintSelected(selectedPrintProductId)
    ) {
      setShowPrintLimitModal(false);
      return;
    } else {
      const currentItem = findCartItem(selectedPrintProductId as number);
      const product = productList.find((p) => p.id === selectedPrintProductId);
      const stock = Number(product?.stock ?? 0);
      const currentQty = currentItem ? currentItem.quantity : 0;
      const nextQty = currentQty === 0 ? INITIAL_QUANTITY : currentQty + 1;
      updateCartItemQuantity(selectedPrintProductId as number, nextQty);
      setSelectedPrintProductId(null);
      setShowPrintLimitModal(false);
    }
  }, [
    findCartItem,
    updateCartItemQuantity,
    productList,
    selectedPrintProductId,
    hasAnotherPrintSelected,
  ]);
  /**
   * Increments the quantity of a product in the cart
   * @param id - Product ID to increment
   */
  const increment = useCallback(
    (id: number) => {
      const currentItem = findCartItem(id);
      const product = productList.find((p) => p.id === id);
      const stock = Number(product?.stock ?? 0);
      const trackStock = product?.track_stock !== false; // Default to true if not specified
      const currentQty = currentItem ? currentItem.quantity : 0;
      const nextQty = currentQty === 0 ? INITIAL_QUANTITY : currentQty + 1;
      const isPrintProduct = product?.product_type === "print";

      if (isPrintProduct) {
        setShowPrintLimitModal(true);
        setSelectedPrintProductId(id);
        return;
      }

      // If track_stock is false, allow unlimited increments
      if (trackStock === false) {
        updateCartItemQuantity(id, nextQty);
      } else {
        // If track_stock is true, check if current quantity < stock
        if (currentQty < stock) {
          updateCartItemQuantity(id, nextQty);
        }
      }
    },
    [findCartItem, updateCartItemQuantity, productList, selectedPrintProductId]
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
      const product = productList.find((p) => p.id === itemId);
      const stock = Number(product?.stock ?? 0);
      const trackStock = product?.track_stock !== false; // Default to true if not specified

      // If track_stock is false, allow any quantity (no limit)
      // If track_stock is true, bound by stock
      const boundedQty =
        trackStock && stock > 0 ? Math.min(quantity, stock) : quantity;

      if (boundedQty >= 0) {
        updateCartItemQuantity(itemId, boundedQty);
      }
    },
    [updateCartItemQuantity, productList]
  );

  const renderQuantityControls = useCallback(
    (item: Product, quantity: number) => {
      const stock = Number(item?.stock ?? 0);
      const trackStock = item?.track_stock !== false; // Default to true if not specified
      const isPrintProduct = item?.product_type === "print";
      // If no stock, hide Add/quantity controls entirely
      // if ((!stock || stock <= 0) && !isPrintProduct) {
      //   return null;
      // }

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

      // If track_stock is false, allow unlimited increments
      // If track_stock is true, check if quantity < stock
      const canIncrement = trackStock === false ? true : quantity < stock;

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
          <TouchableOpacity
            onPress={() => canIncrement && increment(item.id)}
            disabled={!canIncrement || isPrintProduct}
          >
            <Text
              style={[styles.qtyBtn, !canIncrement && styles.qtyBtnDisabled]}
            >
              +
            </Text>
          </TouchableOpacity>
        </View>
      );
    },
    [increment, decrement, handleQuantityChange]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Product; index: number }) => {
      // Prioritize cart quantity over item quantity for real-time updates
      const cartQuantity = findCartItem(item.id)?.quantity;
      const quantity =
        cartQuantity !== undefined ? cartQuantity : item.quantity || 0;

      return (
        <View style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.title}>{item.name}</Text>
          {item.desc && <Text style={styles.desc}>{item.desc}</Text>}
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
    if (cart.length === 0) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please add products to the cart",
      });
      return;
    }
    const cartProducts = convertCartToProducts();
    const mergedProducts = mergeProductsWithCart(
      selectedProducts,
      cartProducts
    );

    navigation.popTo(navigateScreen as any, {
      selectedProducts: mergedProducts,
      editMode: editMode,
      saleData: saleData,
      formData: formData, // Return the form data back
    });
  }, [
    convertCartToProducts,
    mergeProductsWithCart,
    selectedProducts,
    navigateScreen,
    navigation,
    formData, // Add formData to dependencies
  ]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Add verified product to cart
  const addVerifiedProductToCart = useCallback(
    (verifiedProduct: {
      productId: number;
      name: string;
      price: number;
      stock?: number;
      product_type?: string;
      track_stock?: boolean;
      quantity?: number;
    }) => {
      const productId = verifiedProduct.productId;
      const productVerified = productList.find((p) => p.id === productId);
      const currentItem = findCartItem(productId);
      const currentQty = currentItem ? currentItem.quantity : 0;
      const scannedQty = verifiedProduct.quantity || 1;
      const stock = Number(verifiedProduct.stock ?? 0);
      const trackStock = verifiedProduct.track_stock !== false;
      const isPrintProduct = verifiedProduct.product_type === "print";

      if (isPrintProduct) {
        setShowPrintLimitModal(true);
        setSelectedPrintProductId(productId);
        return true;
      } else {
        // Add the scanned quantity to current quantity
        const nextQty = currentQty + scannedQty;
        // If track_stock is false, allow unlimited quantity
        if (!productVerified?.track_stock) {
          updateCartItemQuantity(productId, nextQty);
          return true;
        } else if (
          productVerified?.track_stock &&
          productVerified?.stock &&
          productVerified?.stock > 0 &&
          nextQty > productVerified?.stock
        ) {
          // Cap at stock limit
          updateCartItemQuantity(productId, productVerified.stock);
          return false;
        } else {
          updateCartItemQuantity(productId, nextQty);
          return true;
        }
      }
    },
    [findCartItem, updateCartItemQuantity, productList]
  );

  const handleScanBarcode = useCallback(() => {
    // Show ScanProductModal instead of navigating
    setShowScanModal(true);
  }, []);

  const handleProductsScanned = useCallback(
    (verifiedProducts: VerifiedProduct[]) => {
      if (!verifiedProducts || verifiedProducts.length === 0) {
        return;
      }

      let addedCount = 0;
      let failedCount = 0;
      let totalQuantity = 0;

      // Add each verified product to cart with its quantity
      verifiedProducts.forEach((verifiedProduct) => {
        if (verifiedProduct.verified) {
          const success = addVerifiedProductToCart({
            productId: verifiedProduct.productId,
            name: verifiedProduct.name,
            price: verifiedProduct.price,
            stock: verifiedProduct.stock,
            product_type: verifiedProduct.product_type,
            track_stock: verifiedProduct.track_stock,
            quantity: verifiedProduct.quantity || 1,
          });

          if (success) {
            addedCount++;
            totalQuantity += verifiedProduct.quantity || 1;
          } else {
            failedCount++;
          }
        } else {
          failedCount++;
        }
      });

      // Show appropriate toast message
      if (addedCount > 0 && failedCount === 0) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: `${totalQuantity} item(s) added to cart`,
        });
      } else if (addedCount > 0 && failedCount > 0) {
        Toast.show({
          type: "info",
          text1: "Partial Success",
          text2: `${totalQuantity} items added, ${failedCount} failed`,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Failed",
          text2: "No products could be added to cart",
        });
      }
    },
    [addVerifiedProductToCart]
  );

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
        <TouchableOpacity style={styles.scanBtn} onPress={handleScanBarcode}>
          <Icon name="qr-code-scanner" size={20} color="#fff" />
          <Text style={styles.scanText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.proceedBtn} onPress={handleProceed}>
          <Text style={styles.proceedText}>Proceed</Text>
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
      <Loading visible={isLoading} />
      <CustomModal
        visible={showPrintLimitModal}
        title="Notice"
        onClose={() => setShowPrintLimitModal(false)}
      >
        <View style={{ padding: 16 }}>
          <Text style={{ color: "#000", textAlign: "center" }}>
            Only one print product can be select
          </Text>
          <View style={{ height: 12 }} />
          <TouchableOpacity
            onPress={handleSelectPrintProduct}
            style={{
              alignSelf: "center",
              backgroundColor: "#FCA311",
              paddingHorizontal: 20,
              paddingVertical: 8,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>OK</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>
      <ScanProductModal
        visible={showScanModal}
        onClose={() => setShowScanModal(false)}
        onProductsScanned={handleProductsScanned}
      />
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
    color: "#000",
  },
  desc: {
    fontSize: 12,
    color: "#000",
    marginBottom: "6@s",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
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
  qtyBtnDisabled: {
    opacity: 0.4,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: "10@s",
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
  },
  proceedText: {
    fontWeight: "bold",
    color: "#000",
  },
});

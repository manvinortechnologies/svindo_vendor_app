import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import CustomHeader from "../CommonComponent/CustomHeader";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import { ScaledSheet } from "react-native-size-matters";
import { HomeNavigation } from "../constants/app-routes.constants";

const { width } = Dimensions.get("window");

const dummyProducts = [
  {
    id: "1",
    name: "White T shirt",
    price: 700,
    image: require("../assets/product.png"),
  },
  {
    id: "2",
    name: "Blue Jeans",
    price: 1200,
    image: require("../assets/product.png"),
  },
  {
    id: "3",
    name: "Shoes",
    price: 2500,
    image: require("../assets/product.png"),
  },
  { id: "4", name: "Cap", price: 300, image: require("../assets/product.png") },
  {
    id: "5",
    name: "Hoodie",
    price: 1500,
    image: require("../assets/product.png"),
  },
  {
    id: "6",
    name: "Watch",
    price: 2200,
    image: require("../assets/product.png"),
  },
];

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
  stock?: number;
}

const PosScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ROUTES.vendorProduct);

      // Transform API response to match our Product interface
      const transformedProducts = response.data.map((item: any) => ({
        id: item.id?.toString() || item.product_id?.toString(),
        name: item.name || item.product_name || "Unknown Product",
        price: parseFloat(item.price || item.sales_price || 0),
        image: item.image || item.product_image,
        description: item.description,
        category: item.category,
        stock: item.stock || item.quantity,
      }));

      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      // Fallback to dummy data if API fails
      setProducts(dummyProducts);
      setFilteredProducts(dummyProducts);
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleRemove = (id: string) => {
    setCart((prev) => {
      if (prev[id] > 1) {
        return { ...prev, [id]: prev[id] - 1 };
      } else {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
    });
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const quantity = cart[item.id] || 0;
    return (
      <View style={styles.card}>
        <Image
          source={
            item.image && typeof item.image === "string"
              ? { uri: item.image }
              : item.image || require("../assets/product.png")
          }
          style={styles.productImage}
          resizeMode="contain"
        />
        <View style={styles.cardContent}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>Rs {item.price}</Text>
        </View>

        {quantity === 0 ? (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => handleAdd(item.id)}
          >
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.counter}>
            <TouchableOpacity onPress={() => handleRemove(item.id)}>
              <Text style={styles.counterBtn}>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterText}>{quantity}</Text>
            <TouchableOpacity onPress={() => handleAdd(item.id)}>
              <Text style={styles.counterBtn}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <CustomHeader title="Sales & POS" />
      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <Icon
          name="search"
          size={20}
          color="#555"
          style={{ marginHorizontal: 6 }}
        />
        <TextInput
          placeholder="Search Product/Service"
          placeholderTextColor="#ccc"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Loading State */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FCA311" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : (
        /* Product Grid */
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          }
        />
      )}

      {/* Floating Buttons */}
      <View style={styles.fabWrapper}>
        <TouchableOpacity style={styles.scanBtn}>
          <Icon name="barcode-outline" size={20} color="#FF914D" />
          <Text style={styles.scanText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addProductBtn}
          onPress={() => navigation.navigate(HomeNavigation.ADD_PRODUCT_SCREEN)}
        >
          <Text style={styles.addProductText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      {/* Proceed Button */}
      <TouchableOpacity
        style={styles.proceedBtn}
        onPress={() => navigation.navigate("SalePOS")}
      >
        <Text style={styles.proceedText}>Proceed</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PosScreen;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    margin: 10,
    borderRadius: 25,
    paddingHorizontal: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  card: {
    flex: 1,
    margin: 8,
    marginHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    paddingBottom: 10,
  },
  productImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: 4,
    paddingHorizontal: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#000",
  },
  productPrice: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FCA311",
  },
  addBtn: {
    backgroundColor: "#FCA311",
    marginHorizontal: 8,
    borderRadius: 4,
    paddingVertical: 4,
    alignItems: "center",
  },
  addText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 8,
    backgroundColor: "#FCA311",
    borderRadius: 4,
    paddingVertical: 4,
  },
  counterBtn: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
  counterText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 10,
  },
  fabWrapper: {
    position: "absolute",
    bottom: "60@s",
    right: "15@s",
    alignItems: "center",
  },
  scanBtn: {
    alignItems: "center",
    backgroundColor: "#FFF5EB",
    borderRadius: 10,
    padding: 4,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FCA311",
  },
  scanText: {
    marginLeft: 5,
    color: "#FCA311",
    fontWeight: "600",
  },
  addProductBtn: {
    backgroundColor: "#FCA311",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 4,
    elevation: 10,
  },
  addProductText: {
    color: "#fff",
    fontWeight: "600",
  },
  proceedBtn: {
    position: "absolute",
    bottom: "25@s",
    alignSelf: "center",
    backgroundColor: "#92F1A0",
    width: width * 0.3,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  proceedText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
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
    textAlign: "center",
  },
});

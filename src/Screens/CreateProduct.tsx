import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NavigationButton from "./NavigationButton";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import Loading from "../CommonComponent/Loading";
import { s, ScaledSheet } from "react-native-size-matters";
import { HomeNavigation } from "../constants/app-routes.constants";

const CreateProduct = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search query
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product: any) =>
          product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ROUTES.superCatalogue);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product: any) => {
    (navigation as any).navigate(HomeNavigation.ADD_PRODUCT_SCREEN, {
      product: product, // Pass product data to prefill form
    });
  };

  const renderProductItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
    >
      <View style={styles.productImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.productImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Icon name="image" size={40} color="#ccc" />
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name || "Unnamed Product"}
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: s(2),
            marginTop: 8,
          }}
        >
          {item.color ? (
            <View
              style={{
                backgroundColor: "#FFF7DD",
                borderRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text
                style={{ color: "#FCA311", fontWeight: "bold", fontSize: 13 }}
              >
                Color: {item.color}
              </Text>
            </View>
          ) : null}
          {item.size ? (
            <View
              style={{
                backgroundColor: "#EDF4FF",
                borderRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text
                style={{ color: "#163881", fontWeight: "bold", fontSize: 13 }}
              >
                Size: {item.size}
              </Text>
            </View>
          ) : null}
          {item.unit ? (
            <View
              style={{
                backgroundColor: "#E8FFFB",
                borderRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text
                style={{ color: "#0A8263", fontWeight: "bold", fontSize: 13 }}
              >
                Unit: {item.unit}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button and Search Bar */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Image
            source={require("../assets/search.png")}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Searched Product/Service"
            placeholderTextColor="#666"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.contentContainer}>
        {filteredProducts.length > 0 ? (
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item: any) =>
              item.id?.toString() || Math.random().toString()
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="package-variant" size={60} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery
                ? "No products found matching your search"
                : "No products available"}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery
                ? "Try a different search term"
                : "Create your first product to get started"}
            </Text>
          </View>
        )}
      </View>
      <Loading visible={loading} />
      <View style={[styles.floatingButtons, { bottom: insets.bottom + s(30) }]}>
        <NavigationButton
          screen="AddProductScreen"
          label="Create New"
          color="#000"
          fontSize={16}
          fontWeight="bold"
          buttonStyle={styles.addButtonGreen as ViewStyle}
          textStyle={styles.buttongreen as TextStyle}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = ScaledSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#FFF",
    flex: 1,
  },
  floatingButtons: {
    position: "absolute",
    bottom: "30@s",
    right: "20@s",
    flexDirection: "column",
    gap: 10,
  },
  addButtonGreen: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D7FFE7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#00630F",
  },
  buttongreen: { color: "#00630F", fontWeight: "bold" },
  backButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#FF9800",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7DD",
    paddingHorizontal: 15,
    borderRadius: 25,
    height: 45,
    borderWidth: 1,
    borderColor: "#FFB74D",
  },

  searchIcon: {
    width: 20,
    height: 20,
    tintColor: "#000",
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    color: "#000",
    fontSize: 16,
    fontWeight: "400",
  },
  addsection: {
    flexDirection: "row",
  },
  sublabel: {
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  // New styles for product display
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
  contentContainer: {
    flex: 1,
  },
  productsList: {
    padding: 10,
    paddingBottom: "60@s",
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    width: "48%",
  },
  productImageContainer: {
    width: "100%",
    height: "120@s",
    marginRight: 15,
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  productDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FCA311",
  },
  stockContainer: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockText: {
    fontSize: 12,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 15,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    textAlign: "center",
  },
});

export default CreateProduct;

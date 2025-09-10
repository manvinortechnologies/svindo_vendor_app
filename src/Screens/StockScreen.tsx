import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  Platform,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Header from "./Header";
import { StatusBar } from "react-native";
import Bottomnavigation from "./Bottomnavigation";
import NavigationButton from "./NavigationButton";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import { s, ScaledSheet } from "react-native-size-matters";
import { HomeNavigation } from "../constants/app-routes.constants";

const products = [
  {
    id: "1",
    name: "White T Shirt",
    stock: 5,
    description: "White cotton logo print",
    image: require("../assets/product.png"),
    price: 10,
  },
  {
    id: "2",
    name: "White T Shirt",
    stock: 5,
    description: "White cotton logo print",
    image: require("../assets/product.png"),
    price: 10,
  },
  {
    id: "3",
    name: "White T Shirt",
    stock: 5,
    description: "White cotton logo print",
    image: require("../assets/product.png"),
    price: 10,
  },
  {
    id: "4",
    name: "White T Shirt",
    stock: 5,
    description: "White cotton logo print",
    image: require("../assets/product.png"),
    price: 10,
  },
];

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
}

interface Addon {
  id: string;
  name: string;
  description: string;
  price_per_unit: number;
  image?: string;
  product_category?: string;
}

const orderTypes = ["Product/Service", " | ", "Add Ons"];
const StockScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedType, setSelectedType] = useState("Product/Service");
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    category: "",
    subcategory: "",
    color: "",
    size: "",
    price: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    category: "",
    subcategory: "",
    color: "",
    size: "",
    price: "",
  });

  // Filter options data
  const filterOptions = {
    category: ["Electronics", "Fashion", "Home & Garden", "Sports", "Books"],
    subcategory: [
      "Mobile Phones",
      "Computers",
      "Audio",
      "Accessories",
      "Clothing",
    ],
    color: ["Red", "Blue", "Green", "Black", "White", "Yellow", "Pink"],
    size: ["XS", "S", "M", "L", "XL", "XXL"],
    price: [
      "Under ₹500",
      "₹500-₹1000",
      "₹1000-₹2000",
      "₹2000-₹5000",
      "Above ₹5000",
    ],
  };

  // Fetch products from vendorProduct API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ROUTES.vendorProduct);

      const transformedProducts = response.data.map((item: any) => ({
        id: item.id?.toString() || item.product_id?.toString(),
        name: item.name || item.product_name || "Unknown Product",
        stock: item.stock || item.quantity || 0,
        description: item.description || "",
        image: item.image || item.product_image,
        price: parseFloat(item.price || item.sales_price || 0),
        category: item.category,
        subcategory: item.subcategory,
        color: item.color,
        size: item.size,
        sale_type: item.sale_type || "offline", // Default to offline if not specified
      }));

      setProducts(transformedProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      // Fallback to dummy data
      setProducts([
        {
          id: "1",
          name: "White T Shirt",
          stock: 5,
          description: "White cotton logo print",
          image: require("../assets/product.png"),
          price: 10,
          category: "Fashion",
          subcategory: "Clothing",
          color: "White",
          size: "M",
          sale_type: "online",
        },
        {
          id: "2",
          name: "Blue Jeans",
          stock: 3,
          description: "Blue denim jeans",
          image: require("../assets/product.png"),
          price: 25,
          category: "Fashion",
          subcategory: "Clothing",
          color: "Blue",
          size: "L",
          sale_type: "offline",
        },
        {
          id: "3",
          name: "Smartphone",
          stock: 2,
          description: "Latest smartphone model",
          image: require("../assets/product.png"),
          price: 1500,
          category: "Electronics",
          subcategory: "Mobile Phones",
          color: "Black",
          size: "M",
          sale_type: "online",
        },
        {
          id: "4",
          name: "Laptop",
          stock: 1,
          description: "High-performance laptop",
          image: require("../assets/product.png"),
          price: 3500,
          category: "Electronics",
          subcategory: "Computers",
          color: "Silver",
          size: "L",
          sale_type: "offline",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch addons from addons API
  const fetchAddons = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ROUTES.addons);

      const transformedAddons = response.data.map((item: any) => ({
        id: item.id?.toString(),
        name: item.name || "Unknown Addon",
        description: item.description || "",
        price_per_unit: parseFloat(item.price_per_unit || 0),
        image: item.image,
        product_category: item.product_category,
      }));

      setAddons(transformedAddons);
    } catch (error) {
      console.error("Failed to fetch addons:", error);
      // Fallback to dummy data
      setAddons([
        {
          id: "1",
          name: "Extra Cheese",
          description: "Add extra cheese to your order",
          price_per_unit: 2.5,
        },
        {
          id: "2",
          name: "Premium Packaging",
          description: "Premium gift packaging",
          price_per_unit: 5.0,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data based on selected type
  useEffect(() => {
    if (selectedType === "Product/Service") {
      fetchProducts();
    } else if (selectedType === "Add Ons") {
      fetchAddons();
    }
  }, [selectedType]);

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const getFilteredData = (): (Product | Addon)[] => {
    let data: (Product | Addon)[] =
      selectedType === "Product/Service" ? products : addons;

    // Apply sale_type filter for products
    if (selectedType === "Product/Service" && selectedFilter !== "All") {
      data = data.filter((item) => {
        const product = item as Product;
        return (
          product.sale_type?.toLowerCase() === selectedFilter.toLowerCase()
        );
      });
    }

    // Apply advanced filters (only for products)
    if (selectedType === "Product/Service") {
      data = data.filter((item) => {
        const product = item as Product;

        // Category filter
        if (
          appliedFilters.category &&
          product.category !== appliedFilters.category
        ) {
          return false;
        }

        // Subcategory filter
        if (
          appliedFilters.subcategory &&
          product.subcategory !== appliedFilters.subcategory
        ) {
          return false;
        }

        // Color filter
        if (appliedFilters.color && product.color !== appliedFilters.color) {
          return false;
        }

        // Size filter
        if (appliedFilters.size && product.size !== appliedFilters.size) {
          return false;
        }

        // Price filter
        if (appliedFilters.price) {
          const price = parseFloat(product.price.toString());
          switch (appliedFilters.price) {
            case "Under ₹500":
              if (price >= 500) return false;
              break;
            case "₹500-₹1000":
              if (price < 500 || price > 1000) return false;
              break;
            case "₹1000-₹2000":
              if (price < 1000 || price > 2000) return false;
              break;
            case "₹2000-₹5000":
              if (price < 2000 || price > 5000) return false;
              break;
            case "Above ₹5000":
              if (price <= 5000) return false;
              break;
          }
        }

        return true;
      });
    }

    // Apply search filter
    if (searchQuery.trim() !== "") {
      data = data.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return data;
  };

  const updateQuantity = (id: string, amount: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + amount),
    }));
  };

  const handleFilterSelect = (
    filterType: keyof typeof selectedFilters,
    value: string
  ) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType] === value ? "" : value,
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      category: "",
      subcategory: "",
      color: "",
      size: "",
      price: "",
    });
    setAppliedFilters({
      category: "",
      subcategory: "",
      color: "",
      size: "",
      price: "",
    });
  };

  const applyFilters = () => {
    setAppliedFilters({ ...selectedFilters });
    setFilterModalVisible(false);
  };

  const openFilterModal = () => {
    setSelectedFilters({ ...appliedFilters });
    setFilterModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Stock"
        backgroundColor="#FFF"
        textColor="#333"
        borderBottomColor="#ccc"
      />
      <ScrollView style={styles.midcontent}>
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
            onChangeText={handleSearch}
          />
        </View>
        <View style={styles.filterContainer}>
          {selectedType === "Product/Service" && (
            <View style={styles.filterButtons}>
              {["All", "Online", "Offline"].map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterButton,
                    selectedFilter === filter && styles.selectedFilter,
                  ]}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedFilter === filter && styles.selectedFilterText,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <TouchableOpacity
            style={styles.filterDropdown}
            onPress={openFilterModal}
          >
            <Text style={styles.filterText}>Filters ▼</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FCA311" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <FlatList
            data={getFilteredData()}
            numColumns={2}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.productList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No{" "}
                  {selectedType === "Product/Service" ? "products" : "addons"}{" "}
                  found
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.productCard}>
                {selectedType === "Product/Service" && (
                  <View style={styles.stockBadgeAbove}>
                    <Text style={styles.stockText}>
                      {(item as Product).stock} Pieces Left
                    </Text>
                  </View>
                )}
                <Image
                  source={
                    item.image && typeof item.image === "string"
                      ? { uri: item.image }
                      : item.image || require("../assets/product.png")
                  }
                  style={styles.productImage}
                />

                <View style={styles.bottomRow}>
                  <View style={styles.productdetails}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.productDesc} numberOfLines={1}>
                      {item.description}
                    </Text>
                  </View>
                  <Text style={styles.priceText}>
                    Rs{" "}
                    {selectedType === "Product/Service"
                      ? (item as Product).price
                      : (item as unknown as Addon).price_per_unit}
                  </Text>
                </View>
                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, -1)}
                    style={styles.quantityButton}
                  >
                    <Text style={[styles.quantityButtonText, { color: "red" }]}>
                      ➖
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>
                    {quantities[item.id] || 0}
                  </Text>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, 1)}
                    style={styles.quantityButton}
                  >
                    <Text style={[styles.quantityButtonText, { color: "red" }]}>
                      ➕
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Options</Text>
              <TouchableOpacity
                onPress={() => setFilterModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}>
              {/* Category Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Category</Text>
                <View style={styles.filterOptionsContainer}>
                  {filterOptions.category.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.filterOption,
                        selectedFilters.category === option &&
                          styles.selectedFilterOption,
                      ]}
                      onPress={() => handleFilterSelect("category", option)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          selectedFilters.category === option &&
                            styles.selectedFilterOptionText,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Subcategory Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Subcategory</Text>
                <View style={styles.filterOptionsContainer}>
                  {filterOptions.subcategory.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.filterOption,
                        selectedFilters.subcategory === option &&
                          styles.selectedFilterOption,
                      ]}
                      onPress={() => handleFilterSelect("subcategory", option)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          selectedFilters.subcategory === option &&
                            styles.selectedFilterOptionText,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Color Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Color</Text>
                <View style={styles.filterOptionsContainer}>
                  {filterOptions.color.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.filterOption,
                        selectedFilters.color === option &&
                          styles.selectedFilterOption,
                      ]}
                      onPress={() => handleFilterSelect("color", option)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          selectedFilters.color === option &&
                            styles.selectedFilterOptionText,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Size Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Size</Text>
                <View style={styles.filterOptionsContainer}>
                  {filterOptions.size.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.filterOption,
                        selectedFilters.size === option &&
                          styles.selectedFilterOption,
                      ]}
                      onPress={() => handleFilterSelect("size", option)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          selectedFilters.size === option &&
                            styles.selectedFilterOptionText,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Price Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Price Range</Text>
                <View style={styles.filterOptionsContainer}>
                  {filterOptions.price.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.filterOption,
                        selectedFilters.price === option &&
                          styles.selectedFilterOption,
                      ]}
                      onPress={() => handleFilterSelect("price", option)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          selectedFilters.price === option &&
                            styles.selectedFilterOptionText,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearAllFilters}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={applyFilters}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.ButtonContainer}>
        <View style={styles.floatingButtons}>
          <NavigationButton
            screen={
              selectedType === "Product/Service"
                ? HomeNavigation.CREATE_PRODUCT
                : HomeNavigation.CREATE_ADDONS
            }
            label={
              selectedType === "Product/Service" ? "Add Product" : "Add Add Ons"
            }
            color="#00630F"
            fontSize={16}
            fontWeight="bold"
            buttonStyle={styles.addButtonGreen}
            textStyle={styles.buttongreen}
          />
        </View>
        <View style={styles.typeButtonWrapper}>
          {orderTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                selectedType === type && styles.selectedType,
              ]}
              onPress={() => setSelectedType(type)}
            >
              <Text
                style={[
                  styles.typeText,
                  selectedType === type && styles.selectedTypeText,
                ]}
              >
                {type}{" "}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StockScreen;

const styles = ScaledSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: 10,
  },
  floatingButtons: {
    position: "absolute",
    top: s(-30),
    right: 10,
    // bottom: "25%",
    // right: 20,
    zIndex: 100,
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
  buttongreen: { color: "#00630F", marginLeft: 5, fontWeight: "bold" },
  addButtonBlue: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E7F3FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#006EB2",
  },
  buttonblue: { color: "#006EB2", marginLeft: 5, fontWeight: "bold" },
  midcontent: {
    padding: 10,
  },
  searchBarContainer: {
    marginBottom: 10,
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
  micIcon: {
    width: 18,
    height: 18,
    tintColor: "red",
    marginLeft: 5,
  },
  productdetails: {
    maxWidth: "60%",
  },
  productList: {
    paddingBottom: 80,
  },
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
    alignSelf: "flex-start",

    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    marginBottom: -20,
    zIndex: 1,
  },
  stockText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
  },
  productImage: {
    width: "100%",
    height: 150,
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
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  quantityControl: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    padding: 2,
    borderRadius: 5,
    borderColor: "#FCA511",
  },
  quantityButton: {
    padding: 4,
    backgroundColor: "#FFF7DD",
    borderRadius: 5,
  },
  quantityButtonText: {
    fontSize: 6,
    fontWeight: "bold",
    color: "#fff",
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  ButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    margin: "10@s",
    paddingHorizontal: "18@s",
    backgroundColor: "#fff",
    elevation: 2,
    // overflow: "hidden",
    borderRadius: "10@s",
  },

  typeButtonWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 40,
    borderColor: "#C3C3C3",
    // borderWidth: 1,
    // overflow: "hidden",
  },

  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginHorizontal: 10,
  },

  selectedType: {
    backgroundColor: "#fff",
  },

  typeText: {
    color: "#333",
    fontWeight: "bold",
  },

  selectedTypeText: {
    color: "#ffb347",
  },
  filterButtons: {
    flexDirection: "row",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#BEBEBE",
  },
  selectedFilter: {
    backgroundColor: "#FFA500",
    borderColor: "#fff",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  selectedFilterText: {
    color: "#fff",
  },
  filterDropdown: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#BEBEBE",
    alignSelf: "flex-end",
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
  priceText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FCA311",
    marginTop: 2,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  closeButton: {
    padding: 5,
  },
  modalScrollView: {
    maxHeight: 400,
  },
  // Filter Section Styles
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 10,
  },
  filterOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  selectedFilterOption: {
    backgroundColor: "#FCA311",
    borderColor: "#FCA311",
  },
  filterOptionText: {
    fontSize: 14,
    color: "#333",
  },
  selectedFilterOptionText: {
    color: "#fff",
    fontWeight: "600",
  },
  // Action Buttons
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  clearButton: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  clearButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#FCA311",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
});

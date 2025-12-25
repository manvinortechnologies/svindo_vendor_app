import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Header from "./Header";
import NavigationButton from "./NavigationButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import { s, ScaledSheet } from "react-native-size-matters";
import { HomeNavigation } from "../constants/app-routes.constants";
import CustomDropdown, {
  DropDownOption,
} from "../CommonComponent/CustomDropdown";
import CustomSwitch from "./CustomSwitch";
import SearchBar from "../CommonComponent/SearchBar";
import ProductItem from "../CommonComponent/ProductItem";
import DeleteModal from "./DeleteModal";
import CustomModal from "../Modals/CustomModal";
import Toast from "react-native-toast-message";
import { ProductType } from "../CommonComponent/ProductItem";

interface Addon {
  id: string;
  batch_number?: string;
  name: string;
  description: string;
  price_per_unit: number;
  image?: string;
  product_category?: string;
  is_active?: boolean;
}

const orderTypes = ["Product/Service", " | ", "Add Ons"];
// Static color and price, but size is now from API
const staticFilterOptions = {
  color: [
    { id: "red", name: "Red" },
    { id: "blue", name: "Blue" },
    { id: "green", name: "Green" },
    { id: "black", name: "Black" },
    { id: "white", name: "White" },
    { id: "yellow", name: "Yellow" },
    { id: "pink", name: "Pink" },
  ],
  price: [
    { id: "low-to-high", name: "Low to High" },
    { id: "high-to-low", name: "High to Low" },
  ],
};

const StockScreen = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedType, setSelectedType] = useState("Product/Service");
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [products, setProducts] = useState<ProductType[]>([]);
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

  // API data states
  const [categoryList, setCategoryList] = useState<DropDownOption[]>([]);
  const [subCategoryList, setSubCategoryList] = useState<DropDownOption[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const [showActiveModal, setShowActiveModal] = useState(false);
  const [pendingActiveChange, setPendingActiveChange] = useState<{
    id: string;
    value: boolean;
  } | null>(null);
  const [updatingActiveStatus, setUpdatingActiveStatus] = useState<
    string | null
  >(null);

  // Sizes from API
  const [sizeOptions, setSizeOptions] = useState<DropDownOption[]>([]);
  const [loadingSizes, setLoadingSizes] = useState(false);

  useEffect(() => {
    setLoadingSizes(true);
    api
      .get(API_ROUTES.productSizes)
      .then((resp) => {
        if (Array.isArray(resp?.data)) {
          setSizeOptions(
            resp.data.map((sz: any) => ({
              id: sz.id,
              name: sz.name,
            }))
          );
        }
      })
      .catch((err) => setSizeOptions([]))
      .finally(() => setLoadingSizes(false));
  }, []);

  // Organize products hierarchically
  const organizeProductsHierarchically = (
    products: ProductType[]
  ): ProductType[] => {
    const parentProducts: ProductType[] = [];
    const childProducts: ProductType[] = [];

    // Separate parent and child products
    products.forEach((product) => {
      if (product.parent === null || product.parent === undefined) {
        parentProducts.push(product);
      } else {
        childProducts.push(product);
      }
    });

    // Group child products under their parents
    childProducts.forEach((child) => {
      const parent = parentProducts.find((p) => p.id === child.parent);
      if (parent) {
        parent.variants = parent.variants || [];
        parent.variants.push(child);
      }
    });

    return products;
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
        parent: item.parent || null,
        ...item,
      }));

      // Organize products hierarchically
      const organizedProducts =
        organizeProductsHierarchically(transformedProducts);
      setProducts(organizedProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      // Fallback to dummy data
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
        ...item,
      }));

      setAddons(transformedAddons);
    } catch (error) {
      console.error("Failed to fetch addons:", error);
      // Fallback to dummy data
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories and subcategories from API
  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const [categoryRes, subCategoryRes] = await Promise.all([
        api.get(API_ROUTES.productCategory),
        api.get(API_ROUTES.productSubCategory),
      ]);

      setCategoryList(categoryRes.data || []);
      setSubCategoryList(subCategoryRes.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoadingCategories(false);
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

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle type selection
  const handleTypeSelection = (type: string) => {
    setSelectedType(type);

    // Clear color filter when switching to Add Ons
    if (type === "Add Ons") {
      setSelectedFilters((prev) => ({
        ...prev,
        color: "",
      }));
      setAppliedFilters((prev) => ({
        ...prev,
        color: "",
      }));
    }
  };

  const getFilteredData = (): (ProductType | Addon)[] => {
    let data: (ProductType | Addon)[] =
      selectedType === "Product/Service" ? products : addons;

    // Apply sale_type filter for products
    if (selectedType === "Product/Service" && selectedFilter !== "All") {
      data = data.filter((item) => {
        const product = item as ProductType;
        return (
          product.sale_type?.toLowerCase() === selectedFilter.toLowerCase()
        );
      });
    }
    // Apply advanced filters (only for products)\
    let productsArr: ProductType[] = data as ProductType[];
    productsArr = productsArr.filter((product: ProductType) => {
      // Category filter
      if (
        appliedFilters.category &&
        selectedType === "Product/Service" &&
        product.category !== appliedFilters.category
      ) {
        return false;
      }

      // Subcategory filter
      if (
        appliedFilters.subcategory &&
        product.sub_category !== appliedFilters.subcategory &&
        selectedType === "Product/Service"
      ) {
        return false;
      }

      // Color filter
      if (
        appliedFilters.color &&
        product.color !== appliedFilters.color &&
        selectedType === "Product/Service"
      ) {
        return false;
      }

      // Size filter
      if (
        appliedFilters.size &&
        product.size !== appliedFilters.size &&
        selectedType === "Product/Service"
      ) {
        return false;
      }

      // Price filter
      // if (appliedFilters.price) {
      //   const price = parseFloat(product.price.toString());
      //   switch (appliedFilters.price) {
      //     case "Under ₹500":
      //       if (price >= 500) return false;
      //       break;
      //     case "₹500-₹1000":
      //       if (price < 500 || price > 1000) return false;
      //       break;
      //     case "₹1000-₹2000":
      //       if (price < 1000 || price > 2000) return false;
      //       break;
      //     case "₹2000-₹5000":
      //       if (price < 2000 || price > 5000) return false;
      //       break;
      //     case "Above ₹5000":
      //       if (price <= 5000) return false;
      //       break;
      //   }
      // }

      return true;
    });
    // Price order (sort)
    if (appliedFilters.price === "low-to-high") {
      const addOnsArr = data.map((item: any) => ({
        ...item,
        price:
          item.price !== undefined && item.price !== null
            ? item.price
            : item.price_per_unit,
      }));
      productsArr = [
        ...(selectedType === "Product/Service" ? productsArr : addOnsArr),
      ].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (appliedFilters.price === "high-to-low") {
      const addOnsArr = data.map((item: any) => ({
        ...item,
        price:
          item.price !== undefined && item.price !== null
            ? item.price
            : item.price_per_unit,
      }));
      productsArr = [
        ...(selectedType === "Product/Service" ? productsArr : addOnsArr),
      ].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }
    data = productsArr;

    // Apply search filter
    if (searchQuery.trim() !== "") {
      data = data.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item?.batch_number?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    console.log(data, "data");
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

  const handleActiveChange = (id: string, value: boolean) => {
    setPendingActiveChange({ id, value });
    setShowActiveModal(true);
  };

  const handleConfirmActiveChange = async () => {
    if (!pendingActiveChange) return;

    setUpdatingActiveStatus(pendingActiveChange.id);

    try {
      await api.patch(`${API_ROUTES.vendorProduct}${pendingActiveChange.id}/`, {
        is_active: pendingActiveChange.value,
      });

      // Update local state
      setProducts((prev) =>
        prev.map((item) =>
          item.id === pendingActiveChange.id
            ? { ...item, is_active: pendingActiveChange.value }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to update product active status:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update product status. Please try again.",
      });
    } finally {
      setUpdatingActiveStatus(null);
      setShowActiveModal(false);
      setPendingActiveChange(null);
    }
  };

  const handleCancelActiveChange = () => {
    setShowActiveModal(false);
    setPendingActiveChange(null);
  };

  const handleDeleteProduct = async (id: string) => {
    setShowDeleteModal(true);
    setSelectedProduct(id);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const confirmDeleteProduct = async () => {
    try {
      setLoading(true);
      const response = await api.delete(
        `${API_ROUTES.deleteProduct}${selectedProduct}/`
      );

      if (response.status === 200 || response.status === 204) {
        // Remove product from local state
        setProducts((prev) =>
          prev.filter((item) => item.id !== selectedProduct)
        );
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setLoading(false);
      setSelectedProduct(null);
      setShowDeleteModal(false);
    }
  };

  const handleProductPress = (product: ProductType) => {
    if (selectedType === "Product/Service") {
      // Navigate to VariantsScreen with product data
      (navigation as any).navigate(HomeNavigation.VARIANTS_SCREEN, {
        product: product,
        variants: product.variants || [],
      });
    }
  };

  const handleEditProduct = (id: string) => {
    (navigation as any).navigate(
      selectedType === "Product/Service"
        ? HomeNavigation.ADD_PRODUCT_SCREEN
        : HomeNavigation.ADD_ADDONS,
      {
        productId: id,
        isEdit: true,
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Stock"
        backgroundColor="#FFF"
        textColor="#333"
        borderBottomColor="#ccc"
      />
      <ScrollView contentContainerStyle={styles.midcontent}>
        <SearchBar
          placeholder="Product/Service/Batch Number"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <View style={styles.filterContainer}>
          {selectedType === "Product/Service" && (
            <View style={styles.filterButtons}>
              {["All", "Online", "Offline"].map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterButton,
                    (selectedFilter === "both" ? "Online" : selectedFilter) ===
                      filter && styles.selectedFilter,
                  ]}
                  onPress={() =>
                    setSelectedFilter(filter === "Online" ? "both" : filter)
                  }
                >
                  <Text
                    style={[
                      styles.filterText,
                      (selectedFilter === "both"
                        ? "Online"
                        : selectedFilter) === filter &&
                        styles.selectedFilterText,
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
            renderItem={({ item }) => {
              const product = item as ProductType;

              return (
                <ProductItem
                  product={product}
                  selectedType={selectedType}
                  onPress={handleProductPress}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  onActiveChange={handleActiveChange}
                  showActions={true}
                  showSwitch={selectedType === "Product/Service"}
                  isActiveLoading={updatingActiveStatus === product.id}
                />
              );
            }}
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
                {isLoadingCategories ? (
                  <View style={styles.filterLoadingContainer}>
                    <ActivityIndicator size="small" color="#FCA311" />
                    <Text style={styles.filterLoadingText}>
                      Loading categories...
                    </Text>
                  </View>
                ) : (
                  <CustomDropdown
                    placeholder="Select Category"
                    options={categoryList}
                    onSelect={(option) =>
                      handleFilterSelect("category", option.id)
                    }
                    selectedValue={
                      categoryList.find(
                        (cat) => cat.id === selectedFilters.category
                      )?.id || null
                    }
                    dropDownBoxStyle={styles.dropdown}
                  />
                )}
              </View>

              {/* Color Filter - Only show for Product/Service */}
              {selectedType === "Product/Service" && (
                <>
                  {/* Subcategory Filter */}
                  <View style={styles.filterSection}>
                    <Text style={styles.filterSectionTitle}>Subcategory</Text>
                    {isLoadingCategories ? (
                      <View style={styles.filterLoadingContainer}>
                        <ActivityIndicator size="small" color="#FCA311" />
                        <Text style={styles.filterLoadingText}>
                          Loading subcategories...
                        </Text>
                      </View>
                    ) : (
                      <CustomDropdown
                        placeholder="Select Subcategory"
                        options={subCategoryList}
                        onSelect={(option) =>
                          handleFilterSelect("subcategory", option.id)
                        }
                        selectedValue={
                          subCategoryList.find(
                            (sub) => sub.id === selectedFilters.subcategory
                          )?.id || null
                        }
                        dropDownBoxStyle={styles.dropdown}
                      />
                    )}
                  </View>
                  <View style={styles.filterSection}>
                    <Text style={styles.filterSectionTitle}>Color</Text>
                    <CustomDropdown
                      placeholder="Select Color"
                      options={staticFilterOptions.color}
                      onSelect={(option) =>
                        handleFilterSelect("color", option.name)
                      }
                      selectedValue={
                        staticFilterOptions.color.find(
                          (color) => color.name === selectedFilters.color
                        )?.id || null
                      }
                      dropDownBoxStyle={styles.dropdown}
                    />
                  </View>
                  {/* Size Filter */}
                  <View style={styles.filterSection}>
                    <Text style={styles.filterSectionTitle}>Size</Text>
                    <CustomDropdown
                      placeholder={loadingSizes ? "Loading..." : "Select Size"}
                      options={sizeOptions}
                      onSelect={(option) =>
                        handleFilterSelect("size", option.id)
                      }
                      selectedValue={selectedFilters.size || null}
                      dropDownBoxStyle={styles.dropdown}
                    />
                  </View>
                </>
              )}
              {/* Price Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Price</Text>
                <CustomDropdown
                  placeholder="Select Price Sort"
                  options={staticFilterOptions.price}
                  onSelect={(option) => handleFilterSelect("price", option.id)}
                  selectedValue={selectedFilters.price || null}
                  dropDownBoxStyle={styles.dropdown}
                />
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

      <CustomModal
        visible={showActiveModal}
        title={
          pendingActiveChange?.value
            ? "Show in Online Store?"
            : "Hide from Online Store?"
        }
        onClose={handleCancelActiveChange}
      >
        <Text
          style={{
            fontSize: 16,
            textAlign: "center",
            marginBottom: 20,
            color: "#000",
          }}
        >
          {pendingActiveChange?.value
            ? "This product will visible in your online store. Continue?"
            : "This product will hide from your online store. Continue?"}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 12,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#E0E0E0",
              borderRadius: 8,
              paddingVertical: 10,
              paddingHorizontal: 24,
            }}
            onPress={handleCancelActiveChange}
          >
            <Text style={{ color: "#555", fontWeight: "bold" }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#FCA311",
              borderRadius: 8,
              paddingVertical: 10,
              paddingHorizontal: 24,
            }}
            onPress={handleConfirmActiveChange}
          >
            {updatingActiveStatus === pendingActiveChange?.id ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Confirm</Text>
            )}
          </TouchableOpacity>
        </View>
      </CustomModal>

      <View style={styles.ButtonContainer}>
        <View style={styles.floatingButtons}>
          <NavigationButton
            screen={
              selectedType === "Product/Service"
                ? HomeNavigation.CREATE_PRODUCT
                : HomeNavigation.ADD_ADDONS
            }
            label={
              selectedType === "Product/Service" ? "Add Product" : "Add Add Ons"
            }
            color="#00630F"
            fontSize={16}
            fontWeight="bold"
            buttonStyle={styles.addButtonGreen as any}
            textStyle={styles.buttongreen as any}
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
              onPress={() => handleTypeSelection(type)}
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

      <DeleteModal
        showDeleteModal={showDeleteModal}
        handleCancelDelete={handleCancelDelete}
        handleConfirmDelete={confirmDeleteProduct}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        subMessage="This action cannot be undone and will permanently remove all product data."
        buttonText="Cancel"
        buttonText2="Delete"
      />
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
    // position: "absolute",
    // top: s(-30),
    // right: 10,
    // bottom: "25%",
    // right: 20,
    zIndex: 100,
    alignSelf: "flex-end",
    right: "10@s",
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
    paddingBottom: "30@s",
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
  },

  typeButtonWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5@s",
    marginHorizontal: "10@s",
    marginVertical: "6@s",
    // paddingHorizontal: "18@s",
    backgroundColor: "#fff",
    elevation: 2,
    // overflow: "hidden",
    borderRadius: "10@s",
    borderWidth: 1,
    borderColor: "#BEBEBE",
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
    fontSize: "12@s",
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
  // Dropdown styles
  dropdown: {
    marginBottom: 8,
  },
  // Loading container styles for filter modal
  filterLoadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 8,
    backgroundColor: "#FFF8EB",
  },
  filterLoadingText: {
    marginLeft: 8,
    color: "#FCA311",
    fontSize: 14,
  },
  // Variants badge styles
  variantsBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  variantsText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  variantsInfo: {
    fontSize: 12,
    color: "#FCA311",
    fontStyle: "italic",
    marginTop: 2,
  },
});

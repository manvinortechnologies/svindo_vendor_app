import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  Alert,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Headerwithback from "./Headerwithback";
import { s, ScaledSheet } from "react-native-size-matters";
import Carousel from "react-native-reanimated-carousel";
import CustomDropdown from "../CommonComponent/CustomDropdown";
import { vs } from "react-native-size-matters";
import { HomeNavigation } from "../constants/app-routes.constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import Loading from "../CommonComponent/Loading";
import { APP_CONSTANTS } from "../constants/app.constants";
import ImagePreviewModal from "../Modals/ImagePreviewModal";

const { width } = Dimensions.get("window");

const tabs = ["Wholesale", "Retail", "Requested"];

const offersForYou = [
  {
    id: "1",
    productName: "iPhone 14 Pro",
    category: "Electronics",
    subCategory: "Mobile Phones",
    vendorId: "vendor_12345",
    vendorName: "TechStore Mumbai",
    city: "Mumbai",
    description:
      "Brand new iPhone 14 Pro with 256GB storage. Still under warranty. Perfect condition.",
    offerPrice: "85000",
    originalPrice: "95000",
    discount: "10%",
    image: require("../assets/product/product1.png"),
    rating: 4.8,
    reviews: 156,
  },
  {
    id: "2",
    productName: "MacBook Pro M2",
    category: "Electronics",
    subCategory: "Computers",
    vendorId: "vendor_67890",
    vendorName: "Apple Store Delhi",
    city: "Delhi",
    description:
      "Latest MacBook Pro with M2 chip, 16GB RAM, 512GB SSD. Excellent for professional work.",
    offerPrice: "120000",
    originalPrice: "140000",
    discount: "14%",
    image: require("../assets/product/product2.png"),
    rating: 4.9,
    reviews: 89,
  },
  {
    id: "3",
    productName: "Rolex Submariner",
    category: "Fashion",
    subCategory: "Accessories",
    vendorId: "vendor_11111",
    vendorName: "Luxury Watches Bangalore",
    city: "Bangalore",
    description:
      "Authentic Rolex Submariner with original box and papers. Serviced recently.",
    offerPrice: "450000",
    originalPrice: "500000",
    discount: "10%",
    image: require("../assets/product/product3.png"),
    rating: 4.7,
    reviews: 23,
  },
  {
    id: "4",
    productName: "Sony WH-1000XM4",
    category: "Electronics",
    subCategory: "Audio",
    vendorId: "vendor_22222",
    vendorName: "Audio World Chennai",
    city: "Chennai",
    description:
      "Premium noise-cancelling headphones with excellent sound quality and comfort.",
    offerPrice: "18000",
    originalPrice: "22000",
    discount: "18%",
    image: require("../assets/product/product5.png"),
    rating: 4.6,
    reviews: 203,
  },
];

type RootStackParamList = {
  BuyersRequest: undefined;
  CreateRequest: undefined;
  CreateOffer: { requestId: string };
  RequestOffers: { requestId?: string };
};

type BuyersRequestScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  HomeNavigation.CREATEOFFER,
  HomeNavigation.REQUESTOFFERS
>;

const BuyersRequestScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  const [selectedTab, setSelectedTab] = useState("Wholesale");
  const [selectedToggle, setSelectedToggle] = useState("Your Request");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  const [selectedNearby, setSelectedNearby] = useState<any>(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const navigation = useNavigation<BuyersRequestScreenNavigationProp>();

  // API state management
  const [customerRequests, setCustomerRequests] = useState<any[]>([]);
  const [wholesaleRequests, setWholesaleRequests] = useState<any[]>([]);
  const [retailRequests, setRetailRequests] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingWholesale, setLoadingWholesale] = useState(false);
  const [loadingRetail, setLoadingRetail] = useState(false);
  const [loadingOffers, setLoadingOffers] = useState(false);

  // Handle image press to show fullscreen modal
  const handleImagePress = (item: any) => {
    setSelectedImage(item);
    setIsImageModalVisible(true);
  };

  // Fetch customer requests from API
  const fetchCustomerRequests = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(API_ROUTES.customerRequests);
      const requests = response.data || [];
      setCustomerRequests(requests);
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      Alert.alert("Error", "Failed to load requests. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch wholesale requests (business type)
  const fetchWholesaleRequests = async () => {
    try {
      setLoadingWholesale(true);
      const response = await api.get(API_ROUTES.wholesaleRetailRequests);
      const requests = response.data || [];
      setWholesaleRequests(
        requests.filter((request: any) => request.type === "business")
      );
      setRetailRequests(
        requests.filter((request: any) => request.type === "personal")
      );
    } catch (error) {
      console.error("Error fetching wholesale requests:", error);
      Alert.alert(
        "Error",
        "Failed to load wholesale requests. Please try again."
      );
    } finally {
      setLoadingWholesale(false);
    }
  };

  // Delete request function
  const deleteRequest = async (requestId: string) => {
    try {
      setIsLoading(true);
      const deleteUrl = API_ROUTES.deleteCustomerRequest.replace(
        ":id",
        requestId
      );
      await api.delete(deleteUrl);

      // Remove from all relevant state arrays
      setCustomerRequests((prev) =>
        prev.filter((request) => request.id.toString() !== requestId)
      );
      setWholesaleRequests((prev) =>
        prev.filter((request) => request.id.toString() !== requestId)
      );
      setRetailRequests((prev) =>
        prev.filter((request) => request.id.toString() !== requestId)
      );

      Alert.alert("Success", "Request deleted successfully");
    } catch (error) {
      console.error("Error deleting request:", error);
      Alert.alert("Error", "Failed to delete request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm delete function
  const confirmDeleteRequest = (requestId: string, productName: string) => {
    Alert.alert(
      "Delete Request",
      `Are you sure you want to delete "${productName}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteRequest(requestId),
        },
      ]
    );
  };

  // Fetch offers for a specific request
  const fetchOffers = async (requestId: string) => {
    try {
      setLoadingOffers(true);
      const response = await api.get(`${API_ROUTES.getOffers}`);
      const offersData = response.data || [];
      setOffers(offersData);
    } catch (error) {
      console.error("Error fetching offers:", error);
      Alert.alert("Error", "Failed to load offers. Please try again.");
    } finally {
      setLoadingOffers(false);
    }
  };

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([fetchCustomerRequests(), fetchWholesaleRequests()]);
    } catch (error) {
      console.error("Error fetching all data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    // If we're viewing offers, refresh offers too
    if (
      selectedTab === "Requested" &&
      selectedToggle === "Offers for you" &&
      customerRequests.length > 0
    ) {
      await fetchOffers(customerRequests[0].id.toString());
    }
    setRefreshing(false);
  };

  // Load data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Handle show offers button click
  const handleShowOffers = (requestId: string) => {
    navigation.navigate(HomeNavigation.REQUESTOFFERS, { requestId });
  };

  // Fetch data when tab changes
  useEffect(() => {
    if (
      (selectedTab === "Wholesale" || selectedTab === "Retail") &&
      (wholesaleRequests.length === 0 || retailRequests.length === 0)
    ) {
      fetchWholesaleRequests();
    }
  }, [selectedTab]);

  // Fetch offers when switching to "Offers for you" toggle
  useEffect(() => {
    if (
      selectedTab === "Requested" &&
      selectedToggle === "Offers for you" &&
      offers.length === 0
    ) {
      // If we have customer requests, fetch offers for the first one
      if (customerRequests.length > 0) {
        fetchOffers(customerRequests[0].id.toString());
      }
    }
  }, [selectedToggle, selectedTab]);

  // Transform API data to match component structure
  const transformRequestData = (request: any) => {
    return {
      id: request.id.toString(),
      productName: request.product_name,
      category: request.category_details?.name || "Unknown",
      subCategory: request.sub_category_details?.name || "Unknown",
      userId:
        request.user_details?.first_name +
          " " +
          request.user_details?.last_name || "Unknown User",
      city: request.user_details?.pincode?.toString() || "Unknown",
      description: request.description,
      budget: request.budget,
      image: request.photo
        ? {
            uri: request.photo.includes("http")
              ? request.photo
              : APP_CONSTANTS.API_BASE_URL + request.photo,
          }
        : require("../assets/product/product4.png"),
      type: request.type,
      created_at: request.created_at,
      user_details: request.user_details,
      category_details: request.category_details,
      sub_category_details: request.sub_category_details,
    };
  };

  // Transform offers data to match component structure
  const transformOfferData = (offer: any) => {
    return {
      id: offer.id.toString(),
      productName: offer.heading || "Special Offer",
      category: offer.request_details?.category_details?.name || "Unknown",
      subCategory:
        offer.request_details?.sub_category_details?.name || "Unknown",
      vendorId: offer.vendor_details?.id?.toString() || "Unknown",
      vendorName: offer.vendor_details?.company_name || "Unknown Vendor",
      city: offer.vendor_details?.city || "Unknown",
      description: offer.description,
      offerPrice: offer.selling_price?.toString() || "0",
      originalPrice: offer.request_details?.budget?.toString() || "0",
      discount: offer.discount || "0%",
      image: offer.media
        ? {
            uri: offer.media.includes("http")
              ? offer.media
              : APP_CONSTANTS.API_BASE_URL + offer.media,
          }
        : require("../assets/product/product1.png"),
      rating: offer.rating || 4.5,
      reviews: offer.reviews_count || 0,
      created_at: offer.created_at,
      vendor_details: offer.seller_user_details,
      store_details: offer.store,
      request_details: offer.request_details,
    };
  };

  // Get filtered requests based on selected tab and toggle
  const getFilteredRequests = () => {
    if (selectedTab === "Requested" && selectedToggle === "Your Request") {
      return customerRequests.map(transformRequestData);
    } else if (
      selectedTab === "Requested" &&
      selectedToggle === "Offers for you"
    ) {
      // Show offers from API
      return offers.map(transformOfferData);
    } else if (selectedTab === "Retail") {
      // Show retail requests from API
      return retailRequests.map(transformRequestData);
    } else if (selectedTab === "Wholesale") {
      // Show wholesale requests from API
      return wholesaleRequests.map(transformRequestData);
    }
  };

  // Sample data for dropdowns
  const categories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Fashion" },
    { id: 3, name: "Home & Garden" },
    { id: 4, name: "Sports" },
    { id: 5, name: "Books" },
  ];

  const subCategories = [
    { id: 1, name: "Mobile Phones" },
    { id: 2, name: "Computers" },
    { id: 3, name: "Audio" },
    { id: 4, name: "Accessories" },
    { id: 5, name: "Clothing" },
  ];

  const nearbyOptions = [
    { id: 1, name: "Within 5km" },
    { id: 2, name: "Within 10km" },
    { id: 3, name: "Within 20km" },
    { id: 4, name: "Within 50km" },
    { id: 5, name: "Any distance" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Reuse your Headerwithback */}
      <Headerwithback title="Buyers Request" />
      <View>
        <Loading visible={isLoading} />
      </View>
      {selectedTab === "Wholesale" && loadingWholesale && (
        <View style={styles.tabLoadingContainer}>
          <Text style={styles.tabLoadingText}>
            Loading wholesale requests...
          </Text>
        </View>
      )}
      {selectedTab === "Retail" && loadingRetail && (
        <View style={styles.tabLoadingContainer}>
          <Text style={styles.tabLoadingText}>Loading retail requests...</Text>
        </View>
      )}
      {selectedTab === "Requested" &&
        selectedToggle === "Offers for you" &&
        loadingOffers && (
          <View style={styles.tabLoadingContainer}>
            <Text style={styles.tabLoadingText}>Loading offers...</Text>
          </View>
        )}

      {/* Filter Button */}
      <TouchableOpacity
        style={[styles.filterTopButton, { top: insets.top + s(12) }]}
        onPress={() => setFilterModalVisible(true)}
      >
        <Text style={styles.filterTopText}>Filter</Text>
        <Icon name="chevron-down" size={20} color="#000" />
      </TouchableOpacity>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.tabSelected]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextSelected,
              ]}
            >
              {tab}
            </Text>
            {/* Show data count for each tab */}
            {/* {tab === "Wholesale" && wholesaleRequests.length > 0 && (
              <Text style={styles.tabCountText}>
                ({wholesaleRequests.length})
              </Text>
            )}
            {tab === "Retail" && retailRequests.length > 0 && (
              <Text style={styles.tabCountText}>({retailRequests.length})</Text>
            )}
            {tab === "Requested" && customerRequests.length > 0 && (
              <Text style={styles.tabCountText}>
                ({customerRequests.length})
              </Text>
            )} */}
          </TouchableOpacity>
        ))}
      </View>

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

            {/* Category Dropdown */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Category</Text>
              <CustomDropdown
                placeholder="Select Category"
                options={categories}
                onSelect={setSelectedCategory}
                selectedValue={selectedCategory?.id || null}
              />
            </View>

            {/* Sub Category Dropdown */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Sub Category</Text>
              <CustomDropdown
                placeholder="Select Sub Category"
                options={subCategories}
                onSelect={setSelectedSubCategory}
                selectedValue={selectedSubCategory?.id || null}
              />
            </View>

            {/* Nearby Dropdown */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Nearby</Text>
              <CustomDropdown
                placeholder="Select Distance"
                options={nearbyOptions}
                onSelect={setSelectedNearby}
                selectedValue={selectedNearby?.id || null}
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setSelectedCategory(null);
                  setSelectedSubCategory(null);
                  setSelectedNearby(null);
                }}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => {
                  // Apply filters logic here
                  console.log("Applied filters:", {
                    category: selectedCategory?.name,
                    subCategory: selectedSubCategory?.name,
                    nearby: selectedNearby?.name,
                  });
                  setFilterModalVisible(false);
                }}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Buyer Requests - Full Screen Paging */}
      <Carousel
        vertical={true}
        pagingEnabled={true}
        loop={false}
        width={width}
        height={Dimensions.get("window").height}
        data={getFilteredRequests() || []}
        onProgressChange={() => {}}
        renderItem={({ item }: { item: any }) => (
          <View style={styles.fullScreenCard}>
            {/* Product Image */}
            <View style={styles.imageContainer}>
              <TouchableOpacity
                onPress={() =>
                  handleImagePress({
                    ...item,
                    budget:
                      selectedTab === "Requested" &&
                      selectedToggle === "Offers for you"
                        ? item.offerPrice
                        : item.budget,
                  })
                }
                activeOpacity={0.8}
              >
                <Image
                  source={item.image}
                  style={styles.fullScreenProductImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              {selectedTab === "Requested" &&
                selectedToggle === "Your Request" && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                      // Handle delete functionality
                      confirmDeleteRequest(item.id, item.productName);
                    }}
                  >
                    <Icon name="delete" size={20} color="#fff" />
                  </TouchableOpacity>
                )}
            </View>

            {/* Customer wants to buy */}
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <Text style={styles.customerText}>
                  {selectedTab === "Requested"
                    ? selectedToggle === "Your Request"
                      ? "You want to buy"
                      : "Store : " + item.store_details?.name
                    : "Customer wants to buy"}
                </Text>
                {/* {item.type && (
                  <View
                    style={[
                      styles.requestTypeBadge,
                      {
                        backgroundColor:
                          item.type === "personal" ? "#4CAF50" : "#2196F3",
                      },
                    ]}
                  >
                    <Text style={styles.requestTypeText}>
                      {item.type === "personal" ? "Personal" : "Business"}
                    </Text>
                  </View>
                )} */}
              </View>
              <TouchableOpacity
                style={styles.sellButton}
                onPress={() => {
                  if (
                    selectedTab === "Requested" &&
                    selectedToggle === "Your Request"
                  ) {
                    // Show offers for your request
                    handleShowOffers(item.id);
                  } else if (
                    selectedTab === "Requested" &&
                    selectedToggle === "Offers for you"
                  ) {
                    // Buy now for offers
                    console.log("Buy now:", item.id);
                  } else if (selectedTab !== "Requested") {
                    // Sell now for other tabs
                    navigation.navigate(HomeNavigation.CREATEOFFER, {
                      requestId: item.id,
                    });
                  }
                }}
              >
                <Text style={styles.sellButtonText}>
                  {selectedTab === "Requested"
                    ? selectedToggle === "Your Request"
                      ? "Show offers"
                      : "Chat"
                    : selectedTab === "Retail"
                    ? "Offer now"
                    : "Sell now"}
                </Text>
                {/* <Text style={styles.sellButtonText}>
                  {selectedTab === "Requested" &&
                  selectedToggle === "Your Request"
                    ? "Show offers"
                    : selectedTab === "Requested" &&
                      selectedToggle === "Offers for you"
                    ? "Chat"
                    : "Sell now"}
                </Text> */}
              </TouchableOpacity>
            </View>

            {/* Product Name */}
            {<Text style={styles.productName}>{item.productName}</Text>}

            {/* Details */}
            <View style={styles.detailsRow}>
              {/* {selectedTab === "Requested" && ( */}
              {/* // Your request or other tabs details */}
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: s(10),
                  }}
                >
                  <View>
                    <Text style={styles.label}>
                      Category{"\n"}
                      <Text style={styles.subLabel}>{item.category}</Text>
                    </Text>
                  </View>
                  <Text style={styles.budgetText}>
                    ₹
                    {selectedTab === "Requested" &&
                    selectedToggle === "Offers for you"
                      ? item.offerPrice
                      : item.budget}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: s(10),
                  }}
                >
                  <View>
                    <Text style={styles.label}>Sub Category</Text>
                    <Text style={styles.subLabel}>{item.subCategory}</Text>
                  </View>
                  {selectedTab === "Wholesale" && (
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={styles.label}>User</Text>
                      <Text style={styles.subLabel}>{item.userId}</Text>
                    </View>
                  )}
                  {/* Show Offer Coupon button only for non-Requested tabs */}
                  {selectedTab !== "Requested" && (
                    <TouchableOpacity style={styles.couponButton}>
                      <Text style={styles.couponButtonText}>Offer Coupon</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View>
                  <Text style={[styles.label]}>Description</Text>
                  <Text style={styles.descriptionText}>{item.description}</Text>
                </View>
              </>
              {/* )} */}
            </View>
          </View>
        )}
      />

      {/* Toggle buttons for Your Request & Offers for you */}
      {selectedTab === "Requested" && (
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedToggle === "Your Request" && styles.toggleButtonSelected,
            ]}
            onPress={() => setSelectedToggle("Your Request")}
          >
            <Text
              style={[
                styles.toggleButtonText,
                selectedToggle === "Your Request" &&
                  styles.toggleButtonTextSelected,
              ]}
            >
              Your Request
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedToggle === "Offers for you" &&
                styles.toggleButtonSelected,
            ]}
            onPress={() => setSelectedToggle("Offers for you")}
          >
            <Text
              style={[
                styles.toggleButtonText,
                selectedToggle === "Offers for you" &&
                  styles.toggleButtonTextSelected,
              ]}
            >
              Offers for you
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Request Stock */}
      <View style={styles.requestStockContainer}>
        <Text style={styles.swipeText}>
          <Icon name="arrow-up" size={24} color="#FFE8C1" /> Swipe up to see
          more
        </Text>
        <TouchableOpacity
          style={styles.requestStockButton}
          onPress={() => navigation.navigate("CreateRequest")}
        >
          <Text style={styles.requestStockText}>Request Stock</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={[
            styles.requestStockButton,
            { backgroundColor: "#4CAF50", marginLeft: 10 },
          ]}
          onPress={onRefresh}
        >
          <Text style={styles.requestStockText}>Refresh</Text>
        </TouchableOpacity> */}
      </View>

      {/* Fullscreen Image Modal */}
      <ImagePreviewModal
        isImageModalVisible={isImageModalVisible}
        setIsImageModalVisible={setIsImageModalVisible}
        selectedImage={selectedImage}
      />
    </SafeAreaView>
  );
};

export default BuyersRequestScreen;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  filterTopButton: {
    position: "absolute",
    right: "10@s",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#F59E0B",
    borderRadius: 6,
    marginLeft: "auto", // push to right
  },
  filterTopText: {
    fontSize: 13,
    color: "#000",
    fontWeight: "600",
    marginRight: 2,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  filterText: {
    fontSize: 13,
    color: "#000",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#FFF5E5",
  },
  tabSelected: {
    backgroundColor: "#F59E0B",
  },
  tabText: {
    fontSize: 13,
    color: "#F59E0B",
    fontWeight: "600",
  },
  tabTextSelected: {
    color: "#FFF",
    fontWeight: "600",
  },
  tabCountText: {
    fontSize: 10,
    color: "#FFF",
    fontWeight: "500",
    marginLeft: 4,
  },
  tabLoadingContainer: {
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 10,
    alignItems: "center",
    zIndex: 10,
  },
  tabLoadingText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#FFFAF2",
    margin: 12,
    borderRadius: 8,
    padding: 10,
  },
  fullScreenCard: {
    backgroundColor: "#FFFAF2",
    marginHorizontal: 12,
    // marginVertical: 6,
    borderRadius: 12,
    padding: 15,
    height: Dimensions.get("window").height - vs(120), // Exact height for paging
    // justifyContent: "space-between",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 12,
    height: "250@s",
    // backgroundColor: "red",
  },
  fullScreenProductImage: {
    width: "100%",
    height: "100%",
    // backgroundColor: "yellow",
    borderRadius: 20,
  },
  deleteButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  customerText: {
    color: "#F59E0B",
    fontSize: 20,
    fontWeight: "600",
  },
  requestTypeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  requestTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  sellButton: {
    backgroundColor: "#F59E0B",
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    // borderWidth: 1,
    // borderColor: "#000",
    minWidth: "100@s",
    alignItems: "center",
    justifyContent: "center",
  },
  sellButtonText: {
    fontSize: "14@s",
    color: "#fff",
    fontWeight: "600",
  },
  productName: {
    fontSize: "18@s",
    fontWeight: "600",
    color: "#000",
    marginVertical: 8,
  },
  detailsRow: {
    marginTop: 6,
  },
  detailsLeft: {
    flex: 1,
    gap: 5,
  },
  label: {
    fontSize: "10@s",
    color: "#727272",

    fontWeight: "600",
  },
  subLabel: {
    fontSize: "14@s",
    fontWeight: "500",
    color: "#000",
  },
  descriptionText: {
    fontSize: "12@s",
    fontWeight: "500",
    color: "#000",
  },
  detailsRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  budgetText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 6,
  },
  couponButton: {
    backgroundColor: "#F59E0B",
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#000",
  },
  couponButtonText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
  },
  deleteButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  requestStockContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    marginHorizontal: 10,
  },
  swipeText: {
    fontSize: 14,
    color: "#727272",
    marginBottom: 4,
  },
  requestBox: {
    position: "absolute",
    bottom: 60,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFF3E1CC",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F59E0B",
    zIndex: 5,
  },
  requestTabButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  requestTabText: {
    color: "#fff",
    fontWeight: "600",
  },
  // Toggle button styles
  toggleContainer: {
    position: "absolute",
    bottom: 60,
    // left: 20,
    // right: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 6,
    borderRadius: 8,
    // borderWidth: 1,
    // borderColor: "#F59E0B",
    zIndex: 5,
    padding: 4,
    paddingHorizontal: 12,
    elevation: 2,
  },
  toggleButton: {
    // flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  toggleButtonSelected: {
    backgroundColor: "#F59E0B",
  },
  toggleButtonText: {
    fontSize: 14,
    color: "#F59E0B",
    fontWeight: "600",
  },
  toggleButtonTextSelected: {
    color: "#FFF",
    fontWeight: "600",
  },
  // Offers for you styles
  priceContainer: {
    alignItems: "flex-end",
  },
  offerPriceText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#22C55E",
    marginBottom: 2,
  },
  originalPriceText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#9CA3AF",
    textDecorationLine: "line-through",
    marginBottom: 2,
  },
  discountText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#EF4444",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingContainer: {
    alignItems: "flex-end",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    marginLeft: 4,
  },
  requestStockButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  requestStockText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "800",
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
  // Dropdown Styles
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
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
    backgroundColor: "#F59E0B",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  // Fullscreen Image Modal Styles
  imageModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  imageModalOverlay: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    paddingHorizontal: 20,
  },
  imageCloseButton: {
    position: "absolute",
    top: "20@s",
    right: "25@s",
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  imageModalImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  fullscreenImage: {
    // maxWidth: "100%",
    // maxHeight: "100%",
    borderRadius: "10@s",
    overflow: "hidden",
  },
  imageInfo: {
    // position: "absolute",
    // bottom: 50,
    // left: 20,
    // right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 15,
    marginBottom: "30@s",
    borderRadius: 10,
  },
  imageProductName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
  },
  imageProductDesc: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    opacity: 0.8,
    marginBottom: 5,
  },
  imageProductBudget: {
    fontSize: 16,
    color: "#FCA311",
    textAlign: "center",
    fontWeight: "600",
  },
});

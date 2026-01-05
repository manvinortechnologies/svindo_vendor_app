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
  Linking,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Headerwithback from "./Headerwithback";
import { s, ScaledSheet } from "react-native-size-matters";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import CustomDropdown from "../CommonComponent/CustomDropdown";
import { vs } from "react-native-size-matters";
import { HomeNavigation } from "../constants/app-routes.constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import Loading from "../CommonComponent/Loading";
import { APP_CONSTANTS } from "../constants/app.constants";
import ImagePreviewModal from "../Modals/ImagePreviewModal";
import Toast from "react-native-toast-message";
import ReadMoreText from "../CommonComponent/ReadMoreText";

const { width } = Dimensions.get("window");

const tabs = ["Wholesale", "Retail", "Requested"];

type RootStackParamList = {
  BuyersRequest: undefined;
  CreateRequest: undefined;
  CreateOffer: { requestId: string; selectedTab: string };
  RequestOffers: { requestId?: string };
  ChatScreenStream: {
    userId: string;
    token?: string;
    channelId?: string; // Optional - will be determined after checking for existing channel
    otherUserId: string;
  };
  AllChatUserScreen: undefined;
  CreateCoupon: { customer: any };
};

type BuyersRequestScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  HomeNavigation.CREATEOFFER,
  HomeNavigation.REQUESTOFFERS
>;

const BuyersRequestScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const carouselRef = useRef<ICarouselInstance>(null);

  const [selectedTab, setSelectedTab] = useState("Wholesale");
  const [selectedToggle, setSelectedToggle] = useState("Your Request");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);
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

  // Categories and subcategories state
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

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
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load requests. Please try again.",
      });
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
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load wholesale requests. Please try again.",
      });
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

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Request deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting request:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to delete request. Please try again.",
      });
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
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load offers. Please try again.",
      });
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

  // Fetch categories and subcategories from API
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const [categoryRes, subCategoryRes] = await Promise.all([
        api.get(API_ROUTES.productCategory),
        api.get(API_ROUTES.productSubCategory),
      ]);

      setCategories(categoryRes.data || []);
      setSubCategories(subCategoryRes.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load categories. Please try again.",
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchAllData();
    fetchCategories();
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

  // Clear city filter when tab changes (keep category and subcategory)
  useEffect(() => {
    if (selectedTab !== "Retail") {
      setSelectedCity(null);
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
      userName: "USR" + request.user_details?.id,
      storeName: request.store?.name || `SVNDO${request.store?.user}`,
      storeId: request.store?.user,
      // store: request?.store_details,
      city: request?.city || "Unknown",
      description: request.description,
      budget: request.budget,
      image: request.photo
        ? {
            uri: request.photo.includes("http")
              ? request.photo
              : APP_CONSTANTS.API_BASE_URL + request.photo,
          }
        : require("../assets/product/product4.png"),
      photos: request.photos.map((photo: any) => ({
        uri: photo.includes("http")
          ? photo
          : APP_CONSTANTS.API_BASE_URL + photo,
      })),
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
      ...offer,
    };
  };

  // Apply filters to requests
  const applyFilters = (requests: any[]) => {
    let filtered = requests;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((request: any) => {
        const requestCategoryId =
          request.category_details?.id || request.category;
        return (
          requestCategoryId?.toString() === selectedCategory.id?.toString()
        );
      });
    }

    // Filter by subcategory
    if (selectedSubCategory) {
      filtered = filtered.filter((request: any) => {
        const requestSubCategoryId =
          request.sub_category_details?.id || request.sub_category;
        return (
          requestSubCategoryId?.toString() ===
          selectedSubCategory.id?.toString()
        );
      });
    }

    // Filter by city (only for Retail tab)
    if (selectedTab === "Retail" && selectedCity) {
      filtered = filtered.filter((request: any) => {
        const requestCity = request.city || "Unknown";
        return requestCity === selectedCity.name;
      });
    }

    return filtered;
  };

  // Apply filters to offers (offers have request_details nested)
  const applyFiltersToOffers = (offersList: any[]) => {
    let filtered = offersList;

    // Filter by category (check request_details.category_details)
    if (selectedCategory) {
      filtered = filtered.filter((offer: any) => {
        const requestCategoryId =
          offer.request_details?.category_details?.id ||
          offer.request_details?.category;
        return (
          requestCategoryId?.toString() === selectedCategory.id?.toString()
        );
      });
    }

    // Filter by subcategory (check request_details.sub_category_details)
    if (selectedSubCategory) {
      filtered = filtered.filter((offer: any) => {
        const requestSubCategoryId =
          offer.request_details?.sub_category_details?.id ||
          offer.request_details?.sub_category;
        return (
          requestSubCategoryId?.toString() ===
          selectedSubCategory.id?.toString()
        );
      });
    }

    return filtered;
  };

  // Get filtered requests based on selected tab and toggle
  const getFilteredRequests = () => {
    let requests: any[] = [];

    if (selectedTab === "Requested" && selectedToggle === "Your Request") {
      requests = customerRequests;
    } else if (
      selectedTab === "Requested" &&
      selectedToggle === "Offers for you"
    ) {
      // For offers, we need to check the request_details
      requests = offers;
    } else if (selectedTab === "Retail") {
      requests = retailRequests;
    } else if (selectedTab === "Wholesale") {
      requests = wholesaleRequests;
    }

    // Apply filters
    let filtered: any[];
    if (selectedTab === "Requested" && selectedToggle === "Offers for you") {
      // Use special filter for offers (they have nested request_details)
      filtered = applyFiltersToOffers(requests);
      return filtered.map(transformOfferData);
    } else {
      // Use regular filter for requests
      filtered = applyFilters(requests);
      return filtered.map(transformRequestData);
    }
  };

  // Filter subcategories based on selected category
  const getFilteredSubCategories = () => {
    if (!selectedCategory) {
      return subCategories;
    }
    return subCategories.filter(
      (sub: any) => sub.category?.toString() === selectedCategory.id?.toString()
    );
  };

  // Get unique cities from retailRequests
  const getCityOptions = () => {
    const cities = new Set<string>();
    retailRequests.forEach((request: any) => {
      const city = request.city;
      if (city && city !== "Unknown") {
        cities.add(city);
      }
    });
    return Array.from(cities)
      .sort()
      .map((city, index) => ({ id: index + 1, name: city }));
  };

  const handleOfferCoupon = (item: any) => {
    navigation.navigate(HomeNavigation.CREATECOUPON, {
      customer: item.user_details,
    });
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
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
            onPress={() => {
              setSelectedTab(tab);
              carouselRef?.current?.scrollTo({ index: 0 });
            }}
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
                onSelect={(category) => {
                  setSelectedCategory(category);
                  // Reset subcategory when category changes
                  setSelectedSubCategory(null);
                }}
                selectedValue={selectedCategory?.id || null}
                disabled={loadingCategories}
              />
            </View>

            {/* Sub Category Dropdown */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Sub Category</Text>
              <CustomDropdown
                placeholder="Select Sub Category"
                options={getFilteredSubCategories()}
                onSelect={setSelectedSubCategory}
                selectedValue={selectedSubCategory?.id || null}
                disabled={!selectedCategory || loadingCategories}
              />
            </View>

            {/* City Dropdown - Only show for Retail tab */}
            {selectedTab === "Retail" && (
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>City</Text>
                <CustomDropdown
                  placeholder="Select City"
                  options={getCityOptions()}
                  onSelect={setSelectedCity}
                  selectedValue={selectedCity?.id || null}
                />
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setSelectedCategory(null);
                  setSelectedSubCategory(null);
                  setSelectedCity(null);
                }}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => {
                  // Filters are applied automatically via getFilteredRequests
                  // Just close the modal and reset carousel to first item
                  setFilterModalVisible(false);
                  if (carouselRef.current) {
                    carouselRef.current.scrollTo({ index: 0 });
                  }
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
        ref={carouselRef}
        vertical={true}
        pagingEnabled={true}
        loop={false}
        width={width}
        height={Dimensions.get("window").height - insets.bottom}
        data={getFilteredRequests() || []}
        onProgressChange={() => {}}
        renderItem={({ item }: { item: any }) => {
          return (
            <View
              style={[
                styles.fullScreenCard,
                {
                  height:
                    Dimensions.get("window").height - (insets.bottom + vs(120)),
                },
              ]}
            >
              {/* Product Image */}
              <View
                style={[
                  styles.imageContainer,
                  !item?.photos.length && {
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                {item?.photos.length > 0 ? (
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
                      source={item?.photos[0]}
                      style={styles.fullScreenProductImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ) : (
                  <Icon name="image" size={s(150)} color="#000" />
                )}
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
                      // navigation.navigate(HomeNavigation.ALL_CHAT_USER_SCREEN);
                      navigation.navigate(HomeNavigation.CHAT_SCREEN_STREAM, {
                        userId: item.userId,
                        otherUserId: item.seller_user_details.id,
                      });
                      console.log("Buy now:", item.id);
                    } else if (selectedTab !== "Requested") {
                      // Sell now for other tabs
                      navigation.navigate(HomeNavigation.CREATEOFFER, {
                        requestId: item.id,
                        selectedTab,
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

                    {/* Show Offer Coupon button only for non-Requested tabs */}
                    {selectedTab === "Retail" && (
                      <TouchableOpacity
                        style={styles.couponButton}
                        onPress={() => handleOfferCoupon(item)}
                      >
                        <Text style={styles.couponButtonText}>
                          Offer Coupon
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {selectedTab !== "Requested" && (
                    <View style={{ marginBottom: s(10) }}>
                      <Text style={styles.label}>User</Text>
                      <TouchableOpacity
                        onPress={() =>
                          Linking.openURL(
                            `https://svindo.com/store/${item.storeId}`
                          )
                        }
                        disabled={selectedTab === "Retail"}
                      >
                        <Text style={styles.subLabel}>
                          {selectedTab === "Wholesale"
                            ? item.storeName
                            : item.userName}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {selectedTab == "Retail" && (
                    <View style={{ marginBottom: s(10) }}>
                      <Text style={styles.label}>City</Text>
                      <Text style={styles.subLabel}>{item.city}</Text>
                    </View>
                  )}
                  <View>
                    <Text style={[styles.label]}>Description</Text>
                    <ReadMoreText
                      text={item.description || "No description provided"}
                      numberOfLines={3}
                      title="Description"
                      triggerLabel="Show full description"
                      textStyle={styles.descriptionText}
                      triggerTextStyle={styles.readMoreTrigger}
                    />
                  </View>
                </>
                {/* )} */}
              </View>
            </View>
          );
        }}
      />

      {/* Toggle buttons for Your Request & Offers for you */}
      {selectedTab === "Requested" && (
        <View
          style={[styles.toggleContainer, { bottom: insets.bottom + s(50) }]}
        >
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
      <View style={[styles.requestStockContainer, { bottom: insets.bottom }]}>
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
    </View>
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

    borderWidth: 1,
    borderColor: "#000",
    borderRadius: "20@s",
    overflow: "hidden",
    // backgroundColor: "red",
  },
  fullScreenProductImage: {
    width: "100%",
    height: "100%",
    // backgroundColor: "yellow",
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
  readMoreTrigger: {
    color: "#F59E0B",
    fontSize: "12@s",
    fontWeight: "600",
    marginTop: "4@s",
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

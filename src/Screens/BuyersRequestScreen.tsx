import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  SafeAreaView,
} from "react-native";
import React, { useRef, useState } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Headerwithback from "./Headerwithback";
import { s, ScaledSheet } from "react-native-size-matters";
import Carousel from "react-native-reanimated-carousel";
import CustomDropdown from "../CommonComponent/CustomDropdown";
import { vs } from "react-native-size-matters";
import { HomeNavigation } from "../constants/app-routes.constants";

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

const buyersRequests = [
  {
    id: "1",
    productName: "Premium Smartphone",
    category: "Electronics",
    subCategory: "Mobile Phones",
    userId: "svindouser_12345",
    city: "Mumbai",
    description:
      "Looking for latest smartphone with good camera quality and long battery life. Must be in excellent condition.",
    budget: "25000",
    image: require("../assets/product/product4.png"),
  },
  {
    id: "2",
    productName: "Gaming Laptop",
    category: "Electronics",
    subCategory: "Computers",
    userId: "svindouser_67890",
    city: "Delhi",
    description:
      "Need a high-performance gaming laptop for professional work and gaming. Prefer RTX graphics card.",
    budget: "80000",
    image: require("../assets/product/product4.png"),
  },
  {
    id: "3",
    productName: "Designer Watch",
    category: "Fashion",
    subCategory: "Accessories",
    userId: "svindouser_11111",
    city: "Bangalore",
    description:
      "Looking for luxury watch for special occasions. Must be authentic and in perfect working condition.",
    budget: "15000",
    image: require("../assets/product/product4.png"),
  },
  {
    id: "4",
    productName: "Home Speaker System",
    category: "Electronics",
    subCategory: "Audio",
    userId: "svindouser_22222",
    city: "Chennai",
    description:
      "Want wireless speaker system for home entertainment. Should have good bass and clear sound quality.",
    budget: "12000",
    image: require("../assets/product/product4.png"),
  },
];

type RootStackParamList = {
  BuyersRequest: undefined;
  CreateRequest: undefined;
  CreateOffer: undefined;
};

type BuyersRequestScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreateRequest"
>;

const BuyersRequestScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("Wholesale");
  const [selectedToggle, setSelectedToggle] = useState("Your Request");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  const [selectedNearby, setSelectedNearby] = useState<any>(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const navigation = useNavigation<BuyersRequestScreenNavigationProp>();

  // Handle image press to show fullscreen modal
  const handleImagePress = (item: any) => {
    setSelectedImage(item);
    setIsImageModalVisible(true);
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

      {/* Filter Button */}
      <TouchableOpacity
        style={styles.filterTopButton}
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
        data={
          selectedTab === "Requested" && selectedToggle === "Offers for you"
            ? (offersForYou as any)
            : buyersRequests
        }
        onProgressChange={() => {}}
        renderItem={({ item }: { item: any }) => (
          <View style={styles.fullScreenCard}>
            {/* Product Image */}
            <View style={styles.imageContainer}>
              <TouchableOpacity
                onPress={() => handleImagePress(item)}
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
                      console.log("Delete request:", item.id);
                    }}
                  >
                    <Icon name="delete" size={20} color="#fff" />
                  </TouchableOpacity>
                )}
            </View>

            {/* Customer wants to buy */}
            <View style={styles.rowBetween}>
              <Text style={styles.customerText}>
                {selectedTab === "Requested"
                  ? selectedToggle === "Your Request"
                    ? "You want to buy"
                    : "Shop Name"
                  : "Customer wants to buy"}
              </Text>
              <TouchableOpacity
                style={styles.sellButton}
                onPress={() => {
                  if (
                    selectedTab === "Requested" &&
                    selectedToggle === "Your Request"
                  ) {
                    // Show offers for your request
                    console.log("Show offers for request:", item.id);
                  } else if (
                    selectedTab === "Requested" &&
                    selectedToggle === "Offers for you"
                  ) {
                    // Buy now for offers
                    console.log("Buy now:", item.id);
                  } else if (selectedTab !== "Requested") {
                    // Sell now for other tabs
                    navigation.navigate(HomeNavigation.CREATEOFFER);
                  }
                }}
              >
                <Text style={styles.sellButtonText}>
                  {selectedTab === "Requested" &&
                  selectedToggle === "Your Request"
                    ? "Show offers"
                    : selectedTab === "Requested" &&
                      selectedToggle === "Offers for you"
                    ? "Chat"
                    : "Sell now"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Product Name */}
            {selectedTab !== "Requested" &&
              selectedToggle === "Your Request" && (
                <Text style={styles.productName}>{item.productName}</Text>
              )}

            {/* Details */}
            <View style={styles.detailsRow}>
              {selectedTab === "Requested" && (
                // Your request or other tabs details
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
                        Category {"\n"}
                        <Text style={styles.label}> {item.subCategory}</Text>
                      </Text>
                    </View>
                    <Text style={styles.budgetText}>Budget</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: s(10),
                    }}
                  >
                    <View>
                      <Text style={styles.label}>User id</Text>
                      <Text style={styles.subLabel}>{item.city}</Text>
                    </View>
                    <Text style={styles.subLabel}>{item.userId}</Text>
                    {/* Show Offer Coupon button only for non-Requested tabs */}
                    {selectedTab !== "Requested" && (
                      <TouchableOpacity style={styles.couponButton}>
                        <Text style={styles.couponButtonText}>
                          Offer Coupon
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View>
                    <Text style={[styles.label]}>Description</Text>
                    <Text style={styles.subLabel}>{item.description}</Text>
                  </View>
                </>
              )}
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
      </View>

      {/* Fullscreen Image Modal */}
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsImageModalVisible(false)}
      >
        <SafeAreaView style={styles.imageModalContainer}>
          <View style={styles.imageModalOverlay}>
            <TouchableOpacity
              style={styles.imageCloseButton}
              onPress={() => setIsImageModalVisible(false)}
            >
              <Icon name="close" size={30} color="#fff" />
            </TouchableOpacity>

            <View style={styles.imageModalImageContainer}>
              <Image
                source={selectedImage?.image}
                style={[
                  styles.fullscreenImage,
                  { width, height: Dimensions.get("window").height * 0.8 },
                ]}
                resizeMode="contain"
              />
            </View>

            <View style={styles.imageInfo}>
              <Text style={styles.imageProductName}>
                {selectedImage?.productName}
              </Text>
              {selectedImage?.description && (
                <Text style={styles.imageProductDesc}>
                  {selectedImage.description}
                </Text>
              )}
              <Text style={styles.imageProductBudget}>
                Budget: ₹{selectedImage?.budget}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
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
    right: 10,
    top: 15,
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
  sellButton: {
    backgroundColor: "#F59E0B",
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  sellButtonText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  productName: {
    fontSize: 18,
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
    fontSize: 12,
    color: "#000",
    fontWeight: "600",
  },
  subLabel: {
    fontWeight: "500",
    color: "#727272",
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
    alignItems: "center",
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
    // justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  fullscreenImage: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
  imageInfo: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 15,
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

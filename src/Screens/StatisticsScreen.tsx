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
  Alert,
  PermissionsAndroid,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icons from "react-native-vector-icons/FontAwesome";

import Bottomnavigation from "./Bottomnavigation";
import NavigationButton from "./NavigationButton";
import CustomSwitch from "./CustomSwitch";
import RequestFromBuyers from "../CommonComponent/RequestFromBuyers";
import GroupedBars from "./BarChart";
import LineCharts from "./LineChart";
import { HomeNavigation } from "../constants/app-routes.constants";
import { API_ROUTES } from "../constants/api-routes.constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { s, ScaledSheet } from "react-native-size-matters";
import CustomDropdown from "../CommonComponent/CustomDropdown";
import api from "../services/api/api";
import { useIsFocused } from "@react-navigation/native";
NavigationButton;

const screenWidth = Dimensions.get("window").width - 20;
interface Product {
  id: string;
  name: string;
  image: any;
}

interface CompanyProfile {
  id: number;
  company_name: string;
  logo?: string;
  business_id?: string;
  email?: string;
  phone?: string;
  address?: string;
}

const recentActivity = [
  {
    id: "1",
    userid: "@user65641",
    Comment: "liked your products",
    image: require("../assets/profile.png"),
  },
  {
    id: "3",
    userid: "@user67890",
    Comment: "shared your product",
    image: require("../assets/profile.png"),
  },
  {
    id: "4",
    userid: "@user67890",
    Comment: "shared your product",
    image: require("../assets/profile.png"),
  },
];

const notification = [
  {
    id: "1",
    date: "8 feb 2025",
    notify: "Lorem Ipsum is simply dummy text of the printing and typesetting",
    image: require("../assets/notification.png"),
  },
  {
    id: "3",
    date: "8 feb 2025",
    notify: "Lorem Ipsum is simply dummy text of the printing and typesetting",
    image: require("../assets/notification.png"),
  },
  {
    id: "4",
    date: "8 feb 2025",
    notify: "Lorem Ipsum is simply dummy text of the printing and typesetting",
    image: require("../assets/notification.png"),
  },
];

const products = [
  {
    id: "1",
    name: "Product 1",
    description: "This is product 1",
    price: "10",
    image: require("../assets/product.png"),
    type: "Top Liked",
  },
  {
    id: "2",
    name: "Product 2",
    description: "This is product 2",
    price: "20",
    image: require("../assets/product.png"),
    type: "Top Liked",
  },
  {
    id: "3",
    name: "Product 3",
    description: "This is product 3",
    price: "30",
    image: require("../assets/product.png"),
    type: "Top Liked",
  },
  {
    id: "4",
    name: "Product 4",
    description: "This is product 4",
    price: "40",
    image: require("../assets/product.png"),
    type: "Top Rated",
  },
  {
    id: "5",
    name: "Product 5",
    description: "This is product 5",
    price: "50",
    image: require("../assets/product.png"),
    type: "Top Rated",
  },
  {
    id: "6",
    name: "Product 6",
    description: "This is product 6",
    price: "60",
    image: require("../assets/product.png"),
    type: "Top Rated",
  },
  {
    id: "7",
    name: "Product 7",
    description: "This is product 7",
    price: "70",
    image: require("../assets/product.png"),
    type: "Most Bought",
  },
  {
    id: "8",
    name: "Product 8",
    description: "This is product 8",
    price: "80",
    image: require("../assets/product.png"),
    type: "Most Bought",
  },
  {
    id: "9",
    name: "Product 9",
    description: "This is product 9",
    price: "90",
    image: require("../assets/product.png"),
    type: "Most Bought",
  },
  {
    id: "10",
    name: "Product 10",
    description: "This is product 9",
    price: "90",
    image: require("../assets/product.png"),
    type: "Low Stock",
  },
  {
    id: "11",
    name: "Product 11",
    description: "This is product 9",
    price: "90",
    image: require("../assets/product.png"),
    type: "Low Stock",
  },
  {
    id: "12",
    name: "Product 12",
    description: "This is product 9",
    price: "90",
    image: require("../assets/product.png"),
    type: "Low Stock",
  },
  {
    id: "13",
    name: "Product 13",
    description: "This is product 9",
    price: "90",
    image: require("../assets/product.png"),
    type: "Low Stock",
  },
  {
    id: "14",
    name: "Product 14",
    description: "This is product 9",
    price: "90",
    image: require("../assets/product.png"),
    type: "Low Stock",
  },
  {
    id: "15",
    name: "Product 15",
    description: "This is product 9",
    price: "90",
    image: require("../assets/product.png"),
    type: "Low Stock",
  },
];

const getFilteredProducts = (type: string) => {
  return products
    .filter((product) => product.type === type)
    .slice(0, type === "Low Stock" ? 6 : 3);
};

const StatisticsScreen = ({ navigation }: any) => {
  const [deliveryDiscountEnabled, setDeliveryDiscountEnabled] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState({
    name: "Today",
    id: "Today",
  });
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filters = ["Today", "This Week", "This Month", "This Year"];

  // Company profile state
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(
    null
  );
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const isFocused = useIsFocused();

  // Navigation state management
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationError, setNavigationError] = useState<string | null>(null);

  // Fetch company profile
  const fetchCompanyProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const response = await api.get(API_ROUTES.companyProfle);
      setCompanyProfile(response.data[0]);
    } catch (error) {
      console.error("Error fetching company profile:", error);
      // Set default values if API fails
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Permission request functions
  const requestNotificationPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: "Notification Permission",
            message:
              "This app needs notification permission to send you important updates about your business.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
      } catch (err) {
        console.warn("Error requesting notification permission:", err);
      }
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message:
              "This app needs location permission to provide location-based services and analytics.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
      } catch (err) {
        console.warn("Error requesting location permission:", err);
      }
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message:
              "This app needs camera permission to scan QR codes and take product photos.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
      } catch (err) {
        console.warn("Error requesting camera permission:", err);
      }
    }
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        ]);

        if (
          granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log("Storage permissions granted");
        } else {
          console.log("Storage permissions denied");
        }
      } catch (err) {
        console.warn("Error requesting storage permissions:", err);
      }
    }
  };

  const requestSmsPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
          PermissionsAndroid.PERMISSIONS.READ_SMS,
        ]);

        if (
          granted[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.READ_SMS] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log("SMS permissions granted");
        } else {
          console.log("SMS permissions denied");
        }
      } catch (err) {
        console.warn("Error requesting SMS permissions:", err);
      }
    }
  };

  // Navigation helper functions with condition checking
  const navigateWithCondition = async (
    screenName: string,
    params: any = {},
    conditions: { [key: string]: boolean } = {}
  ) => {
    try {
      setIsNavigating(true);
      setNavigationError(null);

      // Check all conditions before navigation
      const failedConditions = Object.entries(conditions).filter(
        ([condition, isMet]) => !isMet
      );

      if (failedConditions.length > 0) {
        const failedConditionNames = failedConditions.map(([name]) => name);
        setNavigationError(
          `Cannot navigate: ${failedConditionNames.join(
            ", "
          )} conditions not met`
        );
        Alert.alert(
          "Navigation Blocked",
          `Please complete the following: ${failedConditionNames.join(", ")}`
        );
        return;
      }

      // Navigate if all conditions are met
      navigation.navigate(screenName, params);
    } catch (error) {
      console.error("Navigation error:", error);
      setNavigationError("Navigation failed. Please try again.");
      Alert.alert("Error", "Navigation failed. Please try again.");
    } finally {
      setIsNavigating(false);
    }
  };

  // Specific navigation functions with business logic conditions
  const navigateToExpenses = () => {
    navigateWithCondition(
      HomeNavigation.EXPENESES_SCREEN,
      {},
      {
        // Add conditions here if needed
        // userLoggedIn: true,
        // hasBusinessProfile: true,
      }
    );
  };

  const navigateToPayments = () => {
    navigateWithCondition(
      HomeNavigation.PAYMENTSCREEN,
      {},
      {
        // Add conditions here if needed
        // hasBankAccounts: true,
        // hasCustomers: true,
      }
    );
  };

  const navigateToPOS = () => {
    navigation.navigate(HomeNavigation.PRODUCT_SELECTION as any, {
      selectedProducts: [],
      navigateScreen: HomeNavigation.SALE_POS,
    });
  };

  const navigateToDayBook = () => {
    navigateWithCondition(
      HomeNavigation.DAY_BOOK_SCREEN,
      {},
      {
        // Add conditions here if needed
        // hasTransactions: true,
      }
    );
  };

  const navigateToStockScreen = () => {
    navigateWithCondition(
      HomeNavigation.STOCK_SCREEN,
      {},
      {
        // Add conditions here if needed
        // hasProducts: true,
      }
    );
  };

  const navigateToReports = () => {
    navigateWithCondition(
      HomeNavigation.REPORTS,
      {},
      {
        // Add conditions here if needed
        // hasData: true,
      }
    );
  };

  const navigateToStoreScreen = () => {
    navigateWithCondition(
      HomeNavigation.STORE_SCREEN,
      {},
      {
        // Add conditions here if needed
        // hasStoreSetup: true,
      }
    );
  };

  const navigateToNotifications = () => {
    navigateWithCondition(
      HomeNavigation.NOTIFICATION_SCREEN,
      {},
      {
        // Add conditions here if needed
        // hasNotifications: true,
      }
    );
  };

  // Request all permissions when component mounts
  useEffect(() => {
    const requestAllPermissions = async () => {
      try {
        await Promise.all([
          requestNotificationPermission(),
          requestLocationPermission(),
          requestCameraPermission(),
          requestStoragePermission(),
          requestSmsPermission(),
        ]);
      } catch (error) {
        console.warn("Error requesting permissions:", error);
      }
    };

    requestAllPermissions();
  }, []);

  // Fetch company profile when component mounts or screen comes into focus
  useEffect(() => {
    if (isFocused) {
      fetchCompanyProfile();
    }
  }, [isFocused]);
  return (
    <SafeAreaView style={styles.container}>
      {/* Navigation Error Display */}
      {navigationError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{navigationError}</Text>
          <TouchableOpacity
            style={styles.errorCloseButton}
            onPress={() => setNavigationError(null)}
          >
            <Icon name="close" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.header}>
        <View style={styles.headerleft}>
          <Image
            source={
              companyProfile?.profile_image
                ? { uri: companyProfile.profile_image }
                : require("../assets/Logo_Icon.png")
            }
            style={styles.logo}
            resizeMode="cover"
          />
          <View style={styles.titlecontent}>
            <Text style={styles.headerTitle}>
              {isLoadingProfile
                ? "Loading..."
                : companyProfile?.company_name || "Business Name"}
            </Text>
            <Text style={styles.subTitle}>
              ID:{" "}
              {isLoadingProfile
                ? "Loading..."
                : companyProfile?.id || "12345678"}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <CustomSwitch
            value={deliveryDiscountEnabled}
            onValueChange={setDeliveryDiscountEnabled}
          />
          <TouchableOpacity
            onPress={navigateToNotifications}
            disabled={isNavigating}
          >
            <Icon
              name="bell-outline"
              size={28}
              color="#000"
              style={styles.notificationIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={{ paddingHorizontal: 10 }}>
        <RequestFromBuyers />
        <View style={styles.titleRow}>
          <Text style={styles.title}>Statistics</Text>
          <CustomDropdown
            placeholder="Select Filter"
            options={filters.map((filter) => ({
              name: filter,
              id: filter,
            }))}
            onSelect={setSelectedFilter}
            selectedValue={selectedFilter.id}
            styles={{ width: s(100), height: s(30) }}
          />
        </View>
        <View style={styles.chartPlaceholder}>
          <GroupedBars />
        </View>

        <View style={styles.cardsContainer}>
          {[
            {
              title: "Total Purchases",
              value: "2,50,000",
              icon: "shopping-outline",
              change: "+0.50",
              changeColor: "green",
              changeIcon: "arrow-up",
            },
            {
              title: "Total Orders",
              value: "2,50,000",
              icon: "cart-outline",
              change: "-0.20",
              changeColor: "red",
              changeIcon: "arrow-down",
            },
            {
              title: "Total Expense",
              value: "2,50,000",
              icon: "file-document-edit-outline",
              change: "+0.50",
              changeColor: "green",
              changeIcon: "arrow-up",
            },
            {
              title: "Total Stock Value",
              value: "2,50,000",
              icon: "chart-line",
              change: "+0.50",
              changeColor: "green",
              changeIcon: "arrow-up",
            },
            {
              title: "Total Cash in Hand",
              value: "2,50,000",
              icon: "cash",
              change: "+0.50",
              changeColor: "green",
              changeIcon: "arrow-up",
            },
            {
              title: "Total Bank Balance",
              value: "2,50,000",
              icon: "bank",
              change: "+0.50",
              changeColor: "green",
              changeIcon: "arrow-up",
            },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => {
                // Navigate to appropriate screen based on card type
                switch (item.title) {
                  case "Total Purchases":
                    // navigateToReports();
                    break;
                  case "Total Orders":
                    navigateWithCondition(HomeNavigation.ORDERS, {}, {});
                    break;
                  case "Total Expense":
                    navigateToExpenses();
                    break;
                  case "Total Stock Value":
                    navigateToStockScreen();
                    break;
                  case "Total Cash in Hand":
                    navigateWithCondition(HomeNavigation.CASH_IN_HAND, {}, {});
                    break;
                  case "Total Bank Balance":
                    navigateWithCondition(HomeNavigation.BANK_ACCOUNTS, {}, {});
                    break;
                  default:
                    console.log("No navigation defined for:", item.title);
                }
              }}
              disabled={isNavigating}
            >
              <View style={styles.cardContent}>
                <Icon
                  name={item.icon}
                  size={24}
                  color="#333"
                  style={styles.cardIcon}
                />
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardValue}>Rs {item.value}</Text>
                  <View style={styles.changeContainer}>
                    <Icon
                      name={item.changeIcon}
                      size={16}
                      color={item.changeColor}
                    />
                    <Text
                      style={[styles.changeValue, { color: item.changeColor }]}
                    >
                      {item.change}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterText}>
                  {item.title.split(" ")[1]}
                </Text>
                <Icon name="chevron-right" size={16} color="#333" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Day Book */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
            borderWidth: 1,
            borderColor: "#BCBCBC",
            borderRadius: 10,
            marginVertical: 10,
          }}
          onPress={navigateToDayBook}
          disabled={isNavigating}
        >
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Icon name="book-open-variant" size={20} color="#000" />
            <Text style={{ color: "#000", fontWeight: "600" }}>Day Book</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#000" />
        </TouchableOpacity>

        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>Store Insights</Text>
          <View style={styles.insightCard}>
            <View style={styles.chartPlaceholder}>
              <LineCharts />
            </View>
            <View style={styles.categoryTitlesection}>
              <Text style={styles.insightLabel}>Followers</Text>
              <Text style={styles.viewall}>View all</Text>
            </View>
          </View>
          <View style={styles.insightCard}>
            <View style={styles.chartPlaceholder}>
              <LineCharts color="#FCA311" />
            </View>
            <View style={styles.categoryTitlesection}>
              <Text style={styles.insightLabel}>Shop Visits</Text>
              <Text style={styles.viewall}>View all</Text>
            </View>
          </View>
        </View>

        <View style={styles.productcontainer}>
          {["Top Liked", "Top Rated", "Most Bought"].map((category) => (
            <View key={category} style={styles.categoryContainer}>
              <View style={styles.productRow}>
                {getFilteredProducts(category).map((product) => (
                  <View key={product.id} style={styles.productCard}>
                    <Image source={product.image} style={styles.productImage} />
                    <View style={styles.productDetails}>
                      <View style={styles.productTextContainer}>
                        <Text style={styles.productName}>{product.name}</Text>
                        <Text style={styles.productDescription}>
                          {product.description.slice(0, 15)}...
                        </Text>
                      </View>
                      <Text style={styles.productPrice}>
                        Rs {product.price}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
              <View style={styles.categoryTitlesection}>
                <Text style={styles.categoryTitle}>{category} Products</Text>
                <Text style={styles.viewall}>View all</Text>
              </View>
            </View>
          ))}
        </View>

        <View>
          <Text style={styles.title}>Recent Store Activity</Text>
          <View style={styles.recentActivityContainer}>
            {recentActivity.map((activity) => (
              <View key={activity.id} style={styles.activityRow}>
                <View style={styles.activityTextContainer}>
                  <Text style={styles.userid}>{activity.userid}</Text>
                  <Text style={styles.comment}>{activity.Comment}</Text>
                </View>
                <Image source={activity.image} style={styles.activityImage} />
              </View>
            ))}
          </View>
        </View>
        <View style={styles.productcontainer}>
          {["Low Stock"].map((category) => (
            <View key={category} style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>{category} Products</Text>
              <View style={styles.productRow}>
                {getFilteredProducts(category).map((product) => (
                  <View key={product.id} style={styles.productCard}>
                    <Image source={product.image} style={styles.productImage} />
                    <View style={styles.productDetails}>
                      <View style={styles.productTextContainer}>
                        <Text style={styles.productName}>{product.name}</Text>
                        <Text style={styles.productDescription}>
                          {product.description.slice(0, 15)}...
                        </Text>
                      </View>
                      <Text style={styles.productPrice}>{product.price}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View>
          <Text style={styles.title}>Reminders</Text>
          <View style={styles.recentActivityContainer}>
            {notification.map((notifications) => (
              <View key={notifications.id} style={styles.notificationcontain}>
                <View style={styles.activityTextContainer}>
                  <Image
                    source={notifications.image}
                    style={styles.activityImage}
                  />
                  <Text style={styles.notificationtext}>
                    {notifications.notify}
                  </Text>
                </View>
                <View style={styles.datesection}>
                  <Text style={styles.datentext}>{notifications.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.floatingButtons}>
        <TouchableOpacity
          style={[styles.addButtonRed, isNavigating && styles.disabledButton]}
          onPress={navigateToExpenses}
          disabled={isNavigating}
        >
          <Icon name="file-document-outline" size={18} color="#000" />
          <Text style={styles.buttonText}> + Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.paymentButtonBlue,
            isNavigating && styles.disabledButton,
          ]}
          onPress={navigateToPayments}
          disabled={isNavigating}
        >
          <Icon name="file-document-outline" size={18} color="#000" />
          <Text style={styles.buttonBlue}> Payments</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.addButtonGreen, isNavigating && styles.disabledButton]}
          onPress={navigateToPOS}
          disabled={isNavigating}
        >
          <Icon name="cart-outline" size={18} color="#000" />
          <Text style={styles.buttongreen}>+ New Sale</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Dropdown Modal */}
      <Modal
        visible={showFilterDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFilterDropdown(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowFilterDropdown(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownContainer}>
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.dropdownItem,
                    selectedFilter === filter && styles.selectedDropdownItem,
                  ]}
                  onPress={() => {
                    setSelectedFilter(filter);
                    setShowFilterDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      selectedFilter === filter && styles.selectedDropdownText,
                    ]}
                  >
                    {filter}
                  </Text>
                  {selectedFilter === filter && (
                    <Icon name="check" size={18} color="#FCA311" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = ScaledSheet.create({
  container: {
    // padding: 10,
    backgroundColor: "#FFF",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 1000,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#292D32" },
  headerleft: { flexDirection: "row", alignItems: "center" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  subTitle: { color: "#555" },
  titlecontent: { paddingHorizontal: 10 },
  notificationIcon: { marginLeft: 10 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  chartPlaceholder: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  logo: {
    width: "40@s",
    height: "40@s",
    borderRadius: "25@s",
    resizeMode: "cover",
  },

  changeContainer: { flexDirection: "row", alignItems: "center" },
  changeValue: { fontSize: 14, fontWeight: "bold", marginLeft: 5 },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardContent: { flexDirection: "row", alignItems: "center" },
  cardIcon: { marginRight: 10 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: "bold", color: "#6B6B6B" },
  cardValue: { fontSize: 16, fontWeight: "bold", color: "#111" },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  cardFooterText: { fontSize: 12, fontWeight: "bold", color: "#666" },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  selectedFilter: {},
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  filterText: { fontSize: 16, marginRight: 5 },
  floatingButtons: {
    position: "absolute",
    alignSelf: "center",
    width: "100%",
    // right: "16@s",
    flexDirection: "row",
    justifyContent: "space-around",
    // gap: "20@s",
    bottom: "10@s",
  },
  viewall: { fontSize: 16 },
  categoryTitlesection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addButtonGreen: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D7FFE7",
    paddingHorizontal: "5@s",
    paddingVertical: "2@s",
    borderRadius: "5@s",
    borderWidth: 1,
    borderColor: "#00630F",
  },
  addButtonRed: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFDADA",
    padding: "8@s",
    borderRadius: "5@s",
    paddingVertical: "2@s",
    borderWidth: 1,
    borderColor: "#AA0000",
  },
  paymentButtonBlue: {
    backgroundColor: "#E5EEFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#163881",
  },
  section: { marginVertical: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#FCA311",
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  productcontainer: {},
  categoryContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,

    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    padding: 10,
  },
  productCard: {
    width: screenWidth / 3 - 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    resizeMode: "cover",
  },

  productDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
  },
  productTextContainer: { flex: 1 },
  productName: { fontSize: 14, fontWeight: "bold", textAlign: "left" },
  productDescription: {
    fontSize: 12,
    textAlign: "left",
    color: "#555",
    marginHorizontal: 5,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
    color: "#FCA311",
  },
  buttonText: { color: "#AA0000", marginLeft: 5, fontWeight: "bold" },
  buttonBlue: {
    color: "#163881",
    marginLeft: 5,
    fontWeight: "bold",
  },
  buttongreen: { color: "#00630F", fontWeight: "bold" },
  insightsContainer: { marginTop: 20 },
  insightsTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  insightCard: { marginBottom: 20 },
  insightLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#FCA311",
  },
  recentActivityContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  activityTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    borderColor: "#C3C3C3",
  },
  activityTextContainer: { flex: 1, flexDirection: "row" },
  userid: { fontSize: 14, fontWeight: "bold" },
  comment: {
    fontSize: 14,
    color: "#555",
    paddingHorizontal: 5,
    fontWeight: "bold",
  },
  activityImage: { width: 40, height: 40, borderRadius: 20, marginLeft: 10 },
  notificationtext: { fontSize: 12, paddingHorizontal: 10, marginRight: 10 },
  datesection: { alignItems: "flex-end", justifyContent: "flex-end" },

  notificationcontain: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  datentext: { fontSize: 12 },
  errorContainer: {
    backgroundColor: "#f44336",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "#fff",
    flex: 1,
    fontSize: 14,
  },
  errorCloseButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 100,
    paddingRight: 20,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    minWidth: 150,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedDropdownItem: {
    backgroundColor: "#FFF8EB",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  selectedDropdownText: {
    color: "#FCA311",
    fontWeight: "600",
  },

  // Business Info Card Styles
  businessInfoCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  businessInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  businessInfoItem: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  businessInfoLabel: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 4,
    marginBottom: 2,
    fontWeight: "500",
  },
  businessInfoValue: {
    fontSize: 14,
    color: "#212529",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default StatisticsScreen;

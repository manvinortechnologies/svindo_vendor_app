import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  PermissionsAndroid,
  Modal,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icons from "react-native-vector-icons/Ionicons";
import NavigationButton from "./NavigationButton";
import CustomSwitch from "./CustomSwitch";
import RequestFromBuyers from "../CommonComponent/RequestFromBuyers";
import GroupedBars from "./BarChart";
import LineCharts from "./LineChart";
import { HomeNavigation } from "../constants/app-routes.constants";
import { API_ROUTES } from "../constants/api-routes.constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { s, ScaledSheet } from "react-native-size-matters";
import api from "../services/api/api";
import { useIsFocused } from "@react-navigation/native";
import { StorageUtils } from "../utils/storage";
import {
  useGetVendorStoresQuery,
  useUpdateVendorStoreMutation,
} from "../services/api/state-api-slice";
import { APP_CONSTANTS } from "../constants/app.constants";
NavigationButton;
import Toast from "react-native-toast-message";
import moment from "moment";

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
  profile_image?: string;
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

const StatisticsScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState({
    name: "Online",
    id: "Online",
  });
  const filters = ["Online", "Offline"];

  // Company profile state
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(
    null
  );
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const isFocused = useIsFocused();

  // Navigation state management
  const [isNavigating, setIsNavigating] = useState(false);
  const [disabletab, setdisable] = useState(true);
  const [navigationError, setNavigationError] = useState<string | null>(null);
  const [showStoreStatusModal, setShowStoreStatusModal] = useState(false);

  // Dashboard statistics state
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Top products state
  const [topProducts, setTopProducts] = useState<any>({
    top_liked: [],
    top_rated: [],
    most_bought: [],
    low_stock: [],
  });
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const {
    data: storeData,
    error,
    isLoading,
    refetch,
  } = useGetVendorStoresQuery();
  const [updateVendorStore, { isLoading: isUpdating }] =
    useUpdateVendorStoreMutation();

  // Fetch dashboard statistics
  const fetchDashboardData = async () => {
    try {
      setIsLoadingDashboard(true);
      const response = await api.get(API_ROUTES.vendorDashboard);
      if (response.data) {
        // Exclude top_liked_products and low_stock_products from API response
        const {
          top_liked_products,
          low_stock_products,
          ...dashboardDataWithoutProducts
        } = response.data;
        setDashboardData(dashboardDataWithoutProducts);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load statistics. Please try again.",
      });
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  // Fetch top products (top liked, top rated, most bought, low stock)
  const fetchTopProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await api.get(API_ROUTES.topRatedProducts);
      if (response.data) {
        setTopProducts({
          top_liked: response.data.top_liked?.results || [],
          top_rated: response.data.top_rated?.results || [],
          most_bought: response.data.most_bought?.results || [],
          low_stock: response.data.low_stock?.results || [],
        });
      }
    } catch (error) {
      console.error("Error fetching top products:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load products. Please try again.",
      });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Fetch company profile
  const fetchCompanyProfile = async () => {
    try {
      setIsLoadingProfile(true);

      // Try to load from storage first
      const storedProfile = StorageUtils.getCompanyProfile();
      if (storedProfile) {
        setCompanyProfile(storedProfile);
        setIsLoadingProfile(false);
      }

      // Fetch from API and update storage
      try {
        const response = await api.get(API_ROUTES.companyProfle);
        if (response.data && response.data.length > 0) {
          const profile = response.data[0];
          setCompanyProfile(profile);
          StorageUtils.setCompanyProfile(profile);
        }
      } catch (error) {
        console.error("Error fetching company profile from API:", error);
        // If API fails and we have stored profile, keep using it
        if (!storedProfile) {
          console.error("No stored profile available");
        }
      }
    } catch (error) {
      console.error("Error in fetchCompanyProfile:", error);
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

  // const requestStoragePermission = async () => {
  //   if (Platform.OS === "android") {
  //     try {
  //       const granted = await PermissionsAndroid.requestMultiple([
  //         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //         PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
  //         PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
  //       ]);

  //       if (
  //         granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
  //           PermissionsAndroid.RESULTS.GRANTED &&
  //         granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
  //           PermissionsAndroid.RESULTS.GRANTED &&
  //         granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
  //           PermissionsAndroid.RESULTS.GRANTED &&
  //         granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
  //           PermissionsAndroid.RESULTS.GRANTED
  //       ) {
  //         console.log("Storage permissions granted");
  //       } else {
  //         console.log("Storage permissions denied");
  //       }
  //     } catch (err) {
  //       console.warn("Error requesting storage permissions:", err);
  //     }
  //   }
  // };

  // const requestSmsPermission = async () => {
  //   if (Platform.OS === "android") {
  //     try {
  //       const granted = await PermissionsAndroid.requestMultiple([
  //         PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
  //         PermissionsAndroid.PERMISSIONS.READ_SMS,
  //       ]);

  //       if (
  //         granted[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] ===
  //           PermissionsAndroid.RESULTS.GRANTED &&
  //         granted[PermissionsAndroid.PERMISSIONS.READ_SMS] ===
  //           PermissionsAndroid.RESULTS.GRANTED
  //       ) {
  //         console.log("SMS permissions granted");
  //       } else {
  //         console.log("SMS permissions denied");
  //       }
  //     } catch (err) {
  //       console.warn("Error requesting SMS permissions:", err);
  //     }
  //   }
  // };

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
        Toast.show({
          type: "error",
          text1: "Error",
          text2: `Cannot navigate: ${failedConditionNames.join(
            ", "
          )} conditions not met`,
        });
        return;
      }

      // Navigate if all conditions are met
      navigation.navigate(screenName, params);
    } catch (error) {
      console.error("Navigation error:", error);
      setNavigationError("Navigation failed. Please try again.");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Navigation failed. Please try again.",
      });
    } finally {
      setIsNavigating(false);
    }
  };

  // Specific navigation functions with business logic conditions
  const navigateToExpenses = () => {
    navigateWithCondition(
      HomeNavigation.EXPENSES,
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
      HomeNavigation.PURCHASE_LEDGER,
      {},
      {
        // Add conditions here if needed
        // hasData: true,
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

  const toggleDisable = () => {
    setShowStoreStatusModal(true);
  };

  const handleConfirmStoreStatus = async () => {
    try {
      const formData = new FormData();
      formData.append("is_offline", (!disabletab).toString());
      await updateVendorStore(formData).unwrap();
      Toast.show({
        text1: disabletab
          ? "Store closed successfully"
          : "Store opened successfully",
        type: "success",
      });
      // setdisable(!disabletab);
      setShowStoreStatusModal(false);
    } catch (error) {
      console.error("Error updating store status:", error);
      Toast.show({
        text1: "Failed to update store status",
        type: "error",
      });
    }
  };

  const handleCancelStoreStatus = () => {
    setShowStoreStatusModal(false);
  };

  // Format number with commas
  const formatNumber = (value: number | string | null | undefined): string => {
    if (value === null || value === undefined) return "0";
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return "0";
    return num.toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    });
  };

  const groupedByDate = (data: any) =>
    data?.reduce((acc: any, item: any) => {
      const date =
        item?.visited_at?.split("T")[0] || item?.followed_at?.split("T")[0]; // YYYY-MM-DD

      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(item);
      return acc;
    }, {});

  // Get filtered products from API data
  const getFilteredProducts = (type: string) => {
    let productList: any[] = [];

    switch (type) {
      case "Top Liked":
        productList = topProducts.top_liked || [];
        break;
      case "Top Rated":
        productList = topProducts.top_rated || [];
        break;
      case "Most Bought":
        productList = topProducts.most_bought || [];
        break;
      case "Low Stock":
        productList = topProducts.low_stock || [];
        break;
      default:
        productList = [];
    }

    // Transform API product data to display format
    return productList
      .slice(0, type === "Low Stock" ? 6 : 3)
      .map((product: any) => {
        // Handle product with variants - use first variant or main product data
        const imageUrl = product.image;

        return {
          id: product.id,
          name: product.name,
          description: product.description || "",
          price: product.sales_price || "0",
          image: imageUrl
            ? {
                uri: imageUrl.startsWith("http")
                  ? imageUrl
                  : `https://vendor.svindo.com${imageUrl}`,
              }
            : require("../assets/product.png"),
          type: type,
        };
      });
  };

  // Get statistics cards data from API
  const getStatisticsCards = () => {
    if (!dashboardData) {
      // Return default values if data not loaded
      return [
        {
          title: "Total Purchases",
          value: "0",
          icon: "shopping-outline",
          change: "0",
          changeColor: "green",
          changeIcon: "arrow-up",
        },
        {
          title: "Total Sales",
          value: "0",
          icon: "cart-outline",
          change: "0",
          changeColor: "green",
          changeIcon: "arrow-up",
        },
        {
          title: "Total Expense",
          value: "0",
          icon: "file-document-edit-outline",
          change: "0",
          changeColor: "green",
          changeIcon: "arrow-up",
        },
        {
          title: "Total Stock Value",
          value: "0",
          icon: "chart-line",
          change: "0",
          changeColor: "green",
          changeIcon: "arrow-up",
        },
        {
          title: "Total Cash in Hand",
          value: "0",
          icon: "cash",
          change: "0",
          changeColor: "green",
          changeIcon: "arrow-up",
        },
        {
          title: "Total Bank Balance",
          value: "0",
          icon: "bank",
          change: "0",
          changeColor: "green",
          changeIcon: "arrow-up",
        },
      ];
    }

    // Map API response to statistics cards based on actual API structure
    // API provides: total_sales, total_purchases, total_expenses
    // Stock value, cash, and bank balance need to be fetched from other APIs or calculated
    return [
      {
        title: "Total Purchases",
        value: formatNumber(dashboardData?.total_purchases || 0),
        icon: "shopping-outline",
        change: "0",
        changeColor: "green",
        changeIcon: "arrow-up",
      },
      {
        title: "Total Sales",
        value: formatNumber(dashboardData?.total_sales || 0),
        icon: "cart-outline",
        change: "0",
        changeColor: "green",
        changeIcon: "arrow-up",
      },
      {
        title: "Total Expense",
        value: formatNumber(dashboardData?.total_expenses || 0),
        icon: "file-document-edit-outline",
        change: "0",
        changeColor: "green",
        changeIcon: "arrow-up",
      },
      {
        title: "Total Stock Value",
        value: formatNumber(dashboardData?.total_stock_value || 0),
        icon: "chart-line",
        change: "0",
        changeColor: "green",
        changeIcon: "arrow-up",
      },
      {
        title: "Total Cash in Hand",
        value: formatNumber(
          dashboardData?.total_cash || dashboardData?.cash_in_hand || 0
        ),
        icon: "cash",
        change: "0",
        changeColor: "green",
        changeIcon: "arrow-up",
      },
      {
        title: "Total Bank Balance",
        value: formatNumber(
          dashboardData?.total_bank_balance || dashboardData?.bank_balance || 0
        ),
        icon: "bank",
        change: "0",
        changeColor: "green",
        changeIcon: "arrow-up",
      },
    ];
  };

  // Request all permissions when component mounts
  useEffect(() => {
    const requestAllPermissions = async () => {
      try {
        await Promise.all([
          requestNotificationPermission(),
          requestLocationPermission(),
          requestCameraPermission(),
          // requestStoragePermission(),
          // requestSmsPermission(),
        ]);
      } catch (error) {
        console.warn("Error requesting permissions:", error);
      }
    };

    requestAllPermissions();
  }, []);

  const handleReminderPress = (reminder: any) => {
    if (reminder.purchase) {
      // Navigate to Purchase Ledger with purchase ID
      navigation.navigate(HomeNavigation.PURCHASE_LEDGER, {
        purchaseId: reminder.purchase,
      });
    } else if (reminder.sale) {
      // Navigate to Bill Details with sale ID
      navigation.navigate(HomeNavigation.SALES_LEDGER, {
        saleId: reminder.sale,
      });
    } else if (reminder.product) {
      // Navigate to Product Details or Stock Screen
      navigation.navigate(HomeNavigation.STOCK_SCREEN, {
        productId: reminder.product,
      });
    } else {
      // Default: show reminder details modal or stay on screen
      navigation.navigate(HomeNavigation.MODEL_REMINDER_SCREEN, {
        reminder: reminder,
      });
    }
  };

  // Fetch company profile and dashboard data when component mounts or screen comes into focus
  useEffect(() => {
    if (isFocused) {
      fetchCompanyProfile();
      fetchDashboardData();
      fetchTopProducts();
    }
  }, [isFocused]);

  // Pull to refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchCompanyProfile(),
        fetchDashboardData(),
        fetchTopProducts(),
        refetch(),
      ]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleActivityPress = (user: any) => {
    navigation.navigate(HomeNavigation.CREATECOUPON, {
      customer: user,
    });
  };

  useEffect(() => {
    if (storeData) {
      setdisable(storeData.is_offline);
    }
  }, [storeData]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
          <TouchableOpacity
            onPress={() => navigation.navigate(HomeNavigation.COMPANY_PROFILE)}
            style={styles.logoContainer}
          >
            <Image
              source={
                companyProfile?.profile_image
                  ? {
                      uri: companyProfile?.profile_image?.includes("http")
                        ? companyProfile?.profile_image
                        : APP_CONSTANTS.API_BASE_URL +
                          companyProfile.profile_image,
                    }
                  : require("../assets/logo.png")
              }
              style={styles.logo}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <View style={styles.titlecontent}>
            <Text
              style={styles.headerTitle}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {isLoadingProfile
                ? "Loading..."
                : companyProfile?.company_name || "Business Name"}{" "}
            </Text>
            {/* <Text style={styles.subTitle}>
              ID:{" "}
              {isLoadingProfile
                ? "Loading..."
                : companyProfile?.id || "12345678"}
            </Text> */}
          </View>
        </View>
        <View style={styles.headerRight}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#ff9900" />
          ) : (
            <CustomSwitch value={disabletab} onValueChange={toggleDisable} />
          )}

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
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(HomeNavigation.ALL_CHAT_USER_SCREEN)
            }
            style={{ marginLeft: s(10) }}
          >
            <Icons name="chatbox-ellipses" size={s(26)} color="#FCA311" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 60 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FCA311"]}
            tintColor="#FCA311"
          />
        }
      >
        {dashboardData?.activity?.top_product_requests?.length > 0 && (
          <RequestFromBuyers
            requests={dashboardData?.activity?.top_product_requests || []}
            totalCount={
              dashboardData?.activity?.total_product_requests_count || 0
            }
          />
        )}
        {dashboardData?.sales_expense_chart?.combined?.length > 0 && (
          <>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Statistics</Text>
              {/* <CustomDropdown
                placeholder="Select Filter"
                options={filters.map((filter) => ({
                  name: filter,
                  id: filter,
                }))}
                onSelect={setSelectedFilter}
                selectedValue={selectedFilter.id}
                styles={{ width: s(70), height: s(30), marginRight: 10 }}
                isSearchable={false}
              /> */}
            </View>
            <View style={styles.chartPlaceholder}>
              <GroupedBars
                data={dashboardData?.sales_expense_chart?.combined || []}
              />
            </View>
          </>
        )}

        <View style={styles.cardsContainer}>
          {getStatisticsCards().map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => {
                // Navigate to appropriate screen based on card type
                switch (item.title) {
                  case "Total Purchases":
                    navigateToReports();
                    break;
                  case "Total Sales":
                    navigateWithCondition(HomeNavigation.SALES_LEDGER, {}, {});
                    break;
                  case "Total Expense":
                    navigateWithCondition(
                      HomeNavigation.EXPENESES_SCREEN,
                      {},
                      {}
                    );
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
                  {/* <View style={styles.changeContainer}>
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
                  </View> */}
                </View>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterText}>
                  {item.title?.split(" ")[1]}
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

        {(dashboardData?.store_insights?.store_visits_by_month?.length > 0 ||
          dashboardData?.store_insights?.followers_by_month?.length > 0) && (
          <View style={styles.insightsContainer}>
            <Text style={styles.insightMainLabel}>Store Insights</Text>
            <View style={styles.insightCard}>
              <View style={styles.chartPlaceholder}>
                <LineCharts
                  color="#FCA311"
                  data={
                    dashboardData?.store_insights?.followers_by_month
                      ? dashboardData.store_insights.followers_by_month.map(
                          (monthData: any) => ({
                            value: monthData.count || 0,
                            label: moment(
                              monthData.month_key || monthData.month,
                              "YYYY-MM"
                            ).format("MMM"),
                          })
                        )
                      : []
                  }
                />
              </View>
              <View style={styles.categoryTitlesection}>
                <Text style={styles.insightLabel}>Followers</Text>
                {/* <Text style={styles.viewall}>View all</Text> */}
              </View>
            </View>
            <View style={styles.insightCard}>
              <View style={styles.chartPlaceholder}>
                <LineCharts
                  color="#FCA311"
                  data={
                    dashboardData?.store_insights?.store_visits_by_month
                      ? dashboardData.store_insights.store_visits_by_month.map(
                          (monthData: any) => ({
                            value: monthData.count || 0,
                            label: moment(
                              monthData.month_key || monthData.month,
                              "YYYY-MM"
                            ).format("MMM"),
                          })
                        )
                      : []
                  }
                />
              </View>
              <View style={styles.categoryTitlesection}>
                <Text style={styles.insightLabel}>Shop Visits</Text>
                {/* <Text style={styles.viewall}>View all</Text> */}
              </View>
            </View>
          </View>
        )}

        <View style={styles.productcontainer}>
          {["Top Liked", "Top Rated", "Most Bought"].map(
            (category) =>
              getFilteredProducts(category)?.length > 0 && (
                <View key={category} style={styles.categoryContainer}>
                  <FlatList
                    data={getFilteredProducts(category)}
                    numColumns={3}
                    renderItem={({ item }) => (
                      <View key={item.id} style={styles.productCard}>
                        <Image
                          source={item.image}
                          style={styles.productImage}
                        />
                        <View style={styles.productDetails}>
                          <View style={styles.productTextContainer}>
                            <Text
                              style={styles.productName}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {item.name}
                            </Text>
                            {item.description && (
                              <Text
                                style={styles.productDescription}
                                numberOfLines={1}
                              >
                                {item.description.slice(0, 15)}
                              </Text>
                            )}
                          </View>
                          <Text style={styles.productPrice}>
                            Rs {item.price}
                          </Text>
                        </View>
                      </View>
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.productRow}
                  />

                  <View style={styles.categoryTitlesection}>
                    <Text style={styles.categoryTitle}>
                      {category} Products
                    </Text>
                    {/* <Text style={styles.viewall}>View all</Text> */}
                  </View>
                </View>
              )
          )}
        </View>

        {dashboardData?.activity?.activities?.length > 0 && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.title}>Recent Store Activity</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate(HomeNavigation.NOTIFICATION_SCREEN)}
                style={styles.viewAllButton}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <Icons name="chevron-forward" size={16} color="#FCA311" />
              </TouchableOpacity>
            </View>
            <View style={styles.recentActivityContainer}>
              <View style={styles.noteContainer}>
                <Icon name="information-outline" size={18} color="#FCA311" />
                <Text style={styles.noteText}>
                  You can generate coupon codes using user id (USR : 4)
                  mentioned.
                </Text>
              </View>
              {dashboardData?.activity?.activities?.map((activity: any) => (
                <TouchableOpacity
                  key={activity.id}
                  style={styles.activityRow}
                  onPress={() => handleActivityPress(activity.user)}
                >
                  <View style={styles.activityTextContainer}>
                    {/* <Text style={styles.userid}>{activity.userid}</Text> */}
                    <Text style={styles.comment}>{activity.message}</Text>
                  </View>
                  <Image source={activity.image} style={styles.activityImage} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        {getFilteredProducts("Low Stock").length > 0 && (
          <View style={styles.productcontainer}>
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>Low Stock Products</Text>
              <View style={styles.productRow}>
                {getFilteredProducts("Low Stock").map((product) => (
                  <View key={product.id} style={styles.productCard}>
                    <Image source={product.image} style={styles.productImage} />
                    <View style={styles.productDetails}>
                      <View style={styles.productTextContainer}>
                        <Text style={styles.productName}>{product.name}</Text>
                        <Text
                          style={styles.productDescription}
                          numberOfLines={1}
                        >
                          {product.description.slice(0, 15)}...
                        </Text>
                      </View>
                      <Text style={styles.productPrice}>{product.price}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {dashboardData?.top_reminders?.length > 0 && (
          <View>
            <Text style={styles.title}>Reminders</Text>
            <View style={styles.recentActivityContainer}>
              {dashboardData?.top_reminders &&
              dashboardData?.top_reminders?.length > 0 ? (
                dashboardData?.top_reminders?.map((reminder: any) => (
                  <TouchableOpacity
                    key={reminder.id}
                    style={styles.notificationcontain}
                    onPress={() => handleReminderPress(reminder)}
                  >
                    <View style={styles.activityTextContainer}>
                      <Image
                        source={require("../assets/notification.png")}
                        style={styles.activityImage}
                      />
                      <Text style={styles.notificationtext} numberOfLines={2}>
                        {reminder.message || reminder.title || "Reminder"}
                      </Text>
                    </View>
                    <View style={styles.datesection}>
                      <Text style={styles.datentext}>
                        {reminder.created_at
                          ? moment(reminder.created_at).format("DD MMM YYYY")
                          : reminder.due_date
                          ? moment(reminder.due_date).format("DD MMM YYYY")
                          : "N/A"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No reminders available</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Store Status Confirmation Modal */}
      <Modal
        visible={showStoreStatusModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelStoreStatus}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.storeStatusModalContainer}>
            <View style={styles.storeStatusModalHeader}>
              <Icon
                name={disabletab ? "store-off-outline" : "store-check-outline"}
                size={40}
                color={disabletab ? "#FF6B6B" : "#4CAF50"}
              />
              <Text style={styles.storeStatusModalTitle}>
                {disabletab ? "Close Store?" : "Open Store?"}
              </Text>
            </View>

            <View style={styles.storeStatusModalContent}>
              <Text style={styles.storeStatusModalMessage}>
                {disabletab
                  ? "Your store will be closed and customers won't be able to place orders until you enable it again."
                  : "Your store will be opened and customers will be able to place orders."}
              </Text>
            </View>

            <View style={styles.storeStatusModalButtons}>
              <TouchableOpacity
                style={[
                  styles.storeStatusModalButton,
                  styles.storeStatusModalCancelButton,
                ]}
                onPress={handleCancelStoreStatus}
              >
                <Text style={styles.storeStatusModalCancelButtonText}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.storeStatusModalButton,
                  disabletab
                    ? styles.storeStatusModalDisableButton
                    : styles.storeStatusModalEnableButton,
                ]}
                onPress={handleConfirmStoreStatus}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.storeStatusModalActionButtonText}>
                    {disabletab ? "Close Store" : "Open Store"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    </View>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#292D32",
  },
  headerleft: { flexDirection: "row", alignItems: "center" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  subTitle: { color: "#555" },
  titlecontent: {
    paddingHorizontal: 10,
    maxWidth: "80%",
  },
  notificationIcon: { marginLeft: 10 },
  title: {
    fontSize: 22,
    // marginBottom: 10,
    color: "#000",
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: "#FCA311",
    fontWeight: "600",
  },
  chartPlaceholder: {
    height: "190@vs",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: "10@s",
    marginBottom: "10@s",
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
    marginTop: "10@s",
  },
  logoContainer: {
    width: "40@s",
    height: "40@s",
    borderRadius: "25@s",
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
  },
  logo: {
    width: "100%",
    height: "100%",
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
  viewall: { fontSize: 16, color: "#FCA311" },
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
    // flexDirection: "row",
    // justifyContent: "space-between",
    // flexWrap: "wrap",
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
    width: "30%",
    marginHorizontal: "1.5%",
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
    // flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVTop: 10,
  },
  productTextContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "left",
    color: "#000",
  },
  productDescription: {
    fontSize: 10,
    textAlign: "left",
    color: "#555",
    // marginHorizontal: 5,
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
  insightMainLabel: {
    fontSize: "16@s",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: "#000",
  },
  insightLabel: {
    fontSize: "14@s",
    fontWeight: "bold",
    marginBottom: 5,
    color: "#FCA311",
  },
  recentActivityContainer: {
    marginVertical: 20,
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
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8EB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: "#FCA311",
  },
  noteText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 8,
    flex: 1,
    fontWeight: "500",
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
  activityTextContainer: {
    flex: 1,
    flexDirection: "row",
  },
  userid: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  comment: {
    fontSize: 14,
    color: "#555",
    paddingHorizontal: 5,
    fontWeight: "bold",
  },
  activityImage: {
    width: "24@s",
    height: "24@s",
    marginLeft: "10@s",
  },
  notificationtext: {
    fontSize: 12,
    paddingHorizontal: 10,
    // marginRight: 10,
    color: "#000",
    maxWidth: "90%",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
  },
  datesection: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },

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
  datentext: { fontSize: 12, color: "#000" },
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  storeStatusModalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  storeStatusModalHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  storeStatusModalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#292D32",
    marginTop: 12,
    textAlign: "center",
  },
  storeStatusModalContent: {
    marginBottom: 24,
  },
  storeStatusModalMessage: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    textAlign: "center",
  },
  storeStatusModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  storeStatusModalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
  },
  storeStatusModalCancelButton: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  storeStatusModalCancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  storeStatusModalEnableButton: {
    backgroundColor: "#4CAF50",
  },
  storeStatusModalDisableButton: {
    backgroundColor: "#FF6B6B",
  },
  storeStatusModalActionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
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

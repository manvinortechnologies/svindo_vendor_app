import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import MainContainer from "../CommonComponent/MainContainer";
import Headerwithback from "./Headerwithback";
import CustomSwitch from "../CommonComponent/CustomSwitch";
import api from "../services/api/api"; // Your API service
import { Coupon } from "../type/Coupan";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { ScaledSheet } from "react-native-size-matters";
import { HomeNavigation } from "../constants/app-routes.constants";
import { API_ROUTES } from "../constants/api-routes.constants";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import moment from "moment";

const { width } = Dimensions.get("window");

type RootStackParamList = {
  CouponsScreen: undefined;
  CreateCoupon: undefined;
};

type CouponsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CouponsScreen"
>;

type CouponsScreenProps = {
  navigation: CouponsScreenNavigationProp;
  route: RouteProp<RootStackParamList, "CouponsScreen">;
};

const CouponsScreen: React.FC<CouponsScreenProps> = ({ navigation }: any) => {
  const [deliveryDiscountEnabled, setDeliveryDiscountEnabled] = useState(true);
  const [percentage, setPercentage] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("");
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState({
    percentage: "",
    minOrderValue: "",
  });

  const fetchDeliveryDiscount = async () => {
    try {
      const response = await api.get(API_ROUTES.deliveryDiscount);

      // Response might be an array or object
      const discountData = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      if (discountData) {
        if (discountData.discount_percent !== undefined) {
          setPercentage(discountData.discount_percent.toString());
        }
        if (discountData.min_cart_value !== undefined) {
          setMinOrderValue(discountData.min_cart_value.toString());
        }
        if (discountData.is_enabled !== undefined) {
          setDeliveryDiscountEnabled(discountData.is_enabled);
        }
      }
    } catch (error) {
      console.log("Error fetching delivery discount:", error);
      // Don't show error toast on initial load if no data exists
    }
  };

  const getAllCoupons = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("vendor/coupon/"); // Replace with your actual endpoint
      if (Array.isArray(response.data)) {
        setCoupons(response.data);
      }
    } catch (error) {
      console.log("Error fetching coupons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllCoupons();
    fetchDeliveryDiscount();
  }, []);

  const deleteCoupon = async (id: string) => {
    try {
      const response = await api.delete(`vendor/coupon/${id}/`);
      getAllCoupons();
    } catch (error) {
      console.log("Error deleting coupon:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  const saveDeliveryDiscount = async () => {
    // Clear previous errors
    setErrors({
      percentage: "",
      minOrderValue: "",
    });

    // Validate inputs
    let hasErrors = false;
    const newErrors = {
      percentage: "",
      minOrderValue: "",
    };

    if (!percentage.trim()) {
      newErrors.percentage = "Please enter discount percentage";
      hasErrors = true;
    } else {
      const discountPercent = parseFloat(percentage);
      if (isNaN(discountPercent) || discountPercent <= 0) {
        newErrors.percentage = "Please enter a valid discount percentage";
        hasErrors = true;
      }
    }

    if (!minOrderValue.trim()) {
      newErrors.minOrderValue = "Please enter minimum order value";
      hasErrors = true;
    } else {
      const minCartValue = parseFloat(minOrderValue);
      if (isNaN(minCartValue) || minCartValue <= 0) {
        newErrors.minOrderValue = "Please enter a valid minimum order value";
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    const discountPercent = parseFloat(percentage);
    const minCartValue = parseFloat(minOrderValue);

    try {
      setIsSaving(true);
      const payload = {
        discount_percent: discountPercent.toFixed(2),
        min_cart_value: minCartValue.toFixed(2),
        is_enabled: deliveryDiscountEnabled,
      };

      const response = await api.post(API_ROUTES.deliveryDiscount, payload);

      if (response.status === 200 || response.status === 201) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Delivery discount settings saved successfully",
        });
        // Clear errors on success
        setErrors({
          percentage: "",
          minOrderValue: "",
        });
      } else {
        throw new Error("Failed to save delivery discount");
      }
    } catch (error: any) {
      console.error("Error saving delivery discount:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error?.response?.data?.message ||
          "Failed to save delivery discount. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderCoupon = ({ item }: { item: Coupon }) => {
    const discountText = item.discount_percentage
      ? `Discount Amount - Rs ${item.discount_percentage}`
      : `Discount Amount - Rs ${item.discount_amount}`;

    const formatDateTime = (dateStr: string) => {
      const date = new Date(dateStr);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes < 10 ? "0" + minutes : minutes;

      return `${month}/${day}/${year}, ${displayHours}:${displayMinutes}${ampm}`;
    };

    return (
      <View style={styles.couponCard}>
        <View style={styles.couponRow}>
          {/* Left: Brand Logo Section */}
          <View style={styles.brandSection}>
            {item.is_active && (
              <View style={styles.statusTag}>
                <Text style={styles.statusText}>Active</Text>
              </View>
            )}
            <Image
              source={
                item.image ? { uri: item.image } : require("../assets/logo.png")
              }
              style={styles.couponImage}
              resizeMode="cover"
            />
          </View>

          {/* Right: Details Section */}
          <View style={styles.detailsSection}>
            <Text style={styles.detailText}>Name: {item.title}</Text>
            <Text style={styles.detailText}>
              Type : {item.coupon_type.split("_").join(" ").toUpperCase()}
            </Text>
            <View style={styles.discountContainer}>
              <Text style={styles.discountText}>{discountText}</Text>
            </View>
            <Text style={styles.detailText}>
              Start: {formatDateTime(item.start_date)}
            </Text>
            <Text style={styles.detailText}>
              End: {formatDateTime(item.end_date)}
            </Text>

            {/* Action Button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => deleteCoupon(item.id.toString())}
            >
              <Icon name="trash" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <MainContainer>
      <Headerwithback title="Coupons / Discounts" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Delivery Discount Section */}
        <View style={styles.discountBox}>
          <View style={styles.discountHeader}>
            <Text style={styles.discountTitle}>Delivery Discounts</Text>
            <CustomSwitch
              value={deliveryDiscountEnabled}
              onValueChange={setDeliveryDiscountEnabled}
            />
          </View>
          <Text style={styles.discountText}>
            This option helps you to boost your sales on svindo app by providing
            delivery discount to customers. Enter the percentage of total bill
            amount you want to provide as a delivery discount to your customer.
          </Text>

          <View style={styles.inputRow}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#727272" }}>Pecentage</Text>
              <TextInput
                style={[
                  styles.input,
                  deliveryDiscountEnabled &&
                    errors.percentage &&
                    styles.inputError,
                ]}
                placeholder="Ex: 5"
                value={percentage}
                onChangeText={(text) => {
                  setPercentage(text);
                  // Clear error when user starts typing
                  if (errors.percentage) {
                    setErrors((prev) => ({ ...prev, percentage: "" }));
                  }
                }}
                keyboardType="numeric"
                placeholderTextColor="#aaa"
              />
              {deliveryDiscountEnabled && errors.percentage && (
                <Text style={styles.errorText}>{errors.percentage}</Text>
              )}
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ color: "#727272" }}>Minimum Order Value</Text>
              <TextInput
                style={[
                  styles.input,
                  deliveryDiscountEnabled &&
                    errors.minOrderValue &&
                    styles.inputError,
                ]}
                placeholder="Ex: 100"
                value={minOrderValue}
                onChangeText={(text) => {
                  setMinOrderValue(text);
                  // Clear error when user starts typing
                  if (errors.minOrderValue) {
                    setErrors((prev) => ({ ...prev, minOrderValue: "" }));
                  }
                }}
                keyboardType="numeric"
                placeholderTextColor="#aaa"
              />
              {deliveryDiscountEnabled && errors.minOrderValue && (
                <Text style={styles.errorText}>{errors.minOrderValue}</Text>
              )}
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={saveDeliveryDiscount}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Coupons */}
        <Text style={styles.sectionTitle}>Active Coupons</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#FCA311" />
        ) : (
          <FlatList
            data={coupons}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCoupon}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
          />
        )}
      </ScrollView>

      {/* Floating Button */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate(HomeNavigation.CREATECOUPON)}
      >
        <Text style={styles.addBtnText}>Add Coupon</Text>
      </TouchableOpacity>
    </MainContainer>
  );
};

export default CouponsScreen;

const styles = ScaledSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
  },
  discountBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  discountHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  discountTitle: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  discountDescriptionText: {
    fontSize: 13,
    color: "#555",
    marginTop: 10,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  input: {
    backgroundColor: "#FFEFD5",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    borderColor: "#FCA311",
    borderWidth: 1,
    color: "#000",
  },
  inputError: {
    borderColor: "#FF0000",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginVertical: 10,
  },
  couponCard: {
    backgroundColor: "#C2FFCB", // Light green background
    padding: "12@s",
    borderRadius: "12@s",
    marginBottom: "16@s",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  couponRow: {
    flexDirection: "row",
    // height: 120,
  },
  brandSection: {
    width: "40%",
    height: "100@s",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  statusTag: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#C2FFCB",
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 8,
    alignSelf: "flex-start",
    zIndex: 10,
  },
  couponImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },
  statusText: {
    color: "#000",
    fontSize: "10@s",
    fontWeight: "600",
  },
  brandLogo: {
    alignItems: "center",
  },
  brandNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  brandName: {
    color: "#FF0000",
    fontSize: 16,
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "#000",
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  brandCollection: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 4,
  },
  brandSubtitle: {
    color: "#666",
    fontSize: 10,
    textAlign: "center",
  },
  detailsSection: {
    flex: 1,
    backgroundColor: "#C2FFCB",
    padding: 12,
    borderRadius: 8,
    justifyContent: "space-between",
  },
  detailText: {
    fontSize: "10@s",
    color: "#000",
    marginBottom: 4,
  },
  discountContainer: {
    backgroundColor: "#FFEB3B", // Yellow background for discount
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginVertical: 4,
  },
  discountText: {
    fontSize: "10@s",
    color: "#000",
    fontWeight: "600",
  },
  actionButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 25,
    height: 25,
    backgroundColor: "#FF0000",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  actionIcon: {
    width: 8,
    height: 8,
    backgroundColor: "#fff",
    borderRadius: 1,
  },
  addBtn: {
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "#1A9443",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 5,
    zIndex: 999,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#FCA311",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    // alignSelf: "center",
    // minWidth: 120,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

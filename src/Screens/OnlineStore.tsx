import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { StackNavigationProp } from "@react-navigation/stack";
import Header from "./Header";
import CustomSwitch from "./CustomSwitch";
import CustomButton from "../CommonComponent/CustomeButton";
import Loading from "../CommonComponent/Loading";
import api from "../services/api/api";
import MainContainer from "../CommonComponent/MainContainer";
import { API_ROUTES } from "../constants/api-routes.constants";
import CustomHeader from "../CommonComponent/CustomHeader";
import Toast from "react-native-toast-message";
import {
  useGetVendorStoresQuery,
  useUpdateVendorStoreMutation,
} from "../services/api/state-api-slice";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeNavigation } from "../constants/app-routes.constants";

// ✅ Define the type for the navigation stack
type RootStackParamList = {
  OnlineStoreSettings: undefined;
  StoreTimings: undefined;
  VerificationPayment: undefined;
  EnableSvindoGateway: undefined;
  AddPaymentGateway: undefined;
  MarketingTools: undefined;
  OnlineStore: undefined;
  StoreWorkingHours: undefined;
  DeliveryArea: undefined;
};

//  Define the type for navigation prop
export type SecurityScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "OnlineStoreSettings"
>;

const OnlineStore = ({ navigation }: any) => {
  const [isEnabled, setEnable] = useState(true);
  const [location, setLocation] = useState<boolean>(true);
  const [display, setDisplay] = useState<boolean>(true);
  const [isPrivate, setIsPrivate] = useState<boolean>(true);
  const [isGlobalStore, setIsGlobalStore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCatalogConfirmModal, setShowCatalogConfirmModal] = useState(false);
  const [pendingDisplayValue, setPendingDisplayValue] =
    useState<boolean>(false);

  const {
    data: storeData,
    // error,
    // isLoading: isLoadingStore,
    refetch,
  } = useGetVendorStoresQuery();

  const [updateVendorStore, { isLoading: isUpdating }] =
    useUpdateVendorStoreMutation();

  useEffect(() => {
    if (storeData) {
      setEnable(storeData.is_online);
      setLocation(storeData.is_location);
      setDisplay(storeData.display_as_catalog);
      setIsPrivate(storeData.private_catalog);
      setIsGlobalStore(storeData.global_supplier || false);
    }
  }, [storeData]);

  const handleConfirmStoreStatus = async (
    key: string,
    value: boolean,
    title: string
  ) => {
    try {
      const formData = new FormData();
      formData.append(key, (!value).toString());
      await updateVendorStore(formData).unwrap();
      Toast.show({
        text1: value
          ? `${title} disabled successfully`
          : `${title} enabled successfully`,
        type: "success",
      });
      if (key === "is_online") {
        setEnable(!value);
      } else if (key === "is_location") {
        setLocation(!value);
      } else if (key === "display_as_catalog") {
        setDisplay(!value);
        // Close modal after successful update
        setShowCatalogConfirmModal(false);
        setPendingDisplayValue(false);
      } else if (key === "private_catalog") {
        setIsPrivate(!value);
      } else if (key === "global_supplier") {
        setIsGlobalStore(!value);
      }
      refetch();
    } catch (error) {
      console.error("Error updating store status:", error);
      Toast.show({
        text1: `Failed to update ${title} status`,
        type: "error",
      });
      // Close modal on error as well
      if (key === "display_as_catalog") {
        setShowCatalogConfirmModal(false);
        setPendingDisplayValue(false);
      }
    }
  };

  const handelUpdateSetting = async () => {
    try {
      setIsLoading(true);
      const data = {
        store_page_visible: isEnabled,
        store_location_visible: location,
        display_as_catalog: display,
        private_catalog: isPrivate,
      };
      console.log("data-->", data);
      const res = await api.post(API_ROUTES.storeOnlineSetting, data);
      console.log("ressss->", res);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Online Store Setting updated successfully",
      });
    } catch (error) {
      console.log("error-->", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Online Store Setting" />
      {/* <Headerwithback title="Online Store Setting" /> */}

      <ScrollView>
        <View style={styles.storepage}>
          <View style={styles.storecontent}>
            <Icon name="storefront-outline" size={24} color="#000" />
            <Text style={styles.mytext}>Store Page</Text>
          </View>
          <View>
            <Text style={{ marginLeft: 28, color: "#000" }}>
              This option helps you hide/ un-hide your store and product on
              svindo app
            </Text>
            <View style={styles.switchstorecontent}>
              <Text style={styles.switchtext}>visible on svindo</Text>
              <CustomSwitch
                value={isEnabled}
                onValueChange={() =>
                  handleConfirmStoreStatus("is_online", isEnabled, "Store Page")
                }
                activeColor="#FCA311"
                inactiveColor="#999"
                borderColor="#999"
              />
            </View>
          </View>
        </View>

        {/* Global Store Container */}
        <View style={styles.storepage}>
          <View style={styles.storecontent}>
            <Icon name="earth" size={24} color="#000" />
            <Text style={styles.mytext}>Global Store</Text>
          </View>
          <View>
            <Text style={{ marginLeft: 28, color: "#000" }}>
              Verify GST to enable Global store
            </Text>
            <View style={styles.switchstorecontent}>
              <Text style={styles.switchtext}>Enable Global Store</Text>
              <CustomSwitch
                value={isGlobalStore}
                onValueChange={() =>
                  handleConfirmStoreStatus(
                    "global_supplier",
                    isGlobalStore,
                    "Global Store"
                  )
                }
                disabled={!storeData?.is_gstin_verified}
                activeColor="#FCA311"
                inactiveColor="#999"
                borderColor="#999"
              />
            </View>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.menuItem}
              onPress={() => item.screen && navigation.navigate(item.screen)} // ✅ Corrected navigation
            >
              <Icon name={item.icon} size={24} color="#000" />
              <Text style={styles.menuText}>{item.title}</Text>
              <Icon
                name="chevron-right"
                size={24}
                color="#000"
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.storepage}>
          <View style={styles.storecontent}>
            <Ionicons name="location-sharp" size={24} color="#000" />
            <Text style={styles.mytext}>Store Location </Text>
          </View>
          <View>
            <Text style={{ marginLeft: 28, color: "#000" }}>
              This option helps you to Hide / Un-hide your store location on
              svindo app.
            </Text>
            <View style={styles.switchstorecontent}>
              <Text style={styles.switchtext}>visible on svindo</Text>
              <CustomSwitch
                value={location}
                onValueChange={() =>
                  handleConfirmStoreStatus(
                    "is_location",
                    location,
                    "Store Location"
                  )
                }
                activeColor="#FCA311"
                inactiveColor="#999"
                borderColor="#999"
              />
            </View>
          </View>
        </View>
        <View style={styles.storepage}>
          <View
            style={[styles.storecontent, { justifyContent: "space-between" }]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon
                name="chevron-right"
                size={24}
                color="#000"
                style={{ marginLeft: "auto" }}
              />
              <Text style={styles.mytext}>Display products as Catalog </Text>
            </View>
            <View>
              <CustomSwitch
                value={display}
                onValueChange={(newValue) => {
                  setPendingDisplayValue(newValue);
                  setShowCatalogConfirmModal(true);
                }}
                activeColor="#FCA311"
                inactiveColor="#999"
                borderColor="#999"
              />
            </View>
          </View>
          <View>
            <Text style={{ marginLeft: 28, color: "#000" }}>
              Enabling this option, makes the products posted online into a
              catalog that is the customer will not be able to place order. But
              can enquire through chat box. .
            </Text>
          </View>
          <View
            style={[
              styles.storecontent,
              { justifyContent: "space-between", marginTop: 10 },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="eye-off-sharp"
                size={24}
                color="#000"
                style={{ marginLeft: "auto" }}
              />
              <Text style={styles.mytext}>Private Catalog </Text>
            </View>
            <View>
              <CustomSwitch
                value={isPrivate}
                onValueChange={() =>
                  handleConfirmStoreStatus(
                    "private_catalog",
                    isPrivate,
                    "Private Catalog"
                  )
                }
                activeColor="#FCA311"
                inactiveColor="#999"
                borderColor="#999"
              />
            </View>
          </View>
          <View>
            <Text style={{ marginLeft: 28, color: "#000" }}>
              Enabling this option, makes the products posted online into a
              catalog that is the customer will not be able to place order. But
              can enquire through chat box. .
            </Text>
          </View>
        </View>
        <CustomButton
          containerStyle={{ padding: 8 }}
          title="Update Settings"
          onPress={handelUpdateSetting}
        />
      </ScrollView>
      <Loading visible={isLoading} />

      {/* Confirmation Modal for Display as Catalog */}
      <Modal
        visible={showCatalogConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          if (!isUpdating) {
            setShowCatalogConfirmModal(false);
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {pendingDisplayValue
                ? "Enable Display as Catalog"
                : "Disable Display as Catalog"}
            </Text>
            <Text style={styles.modalMessage}>
              {pendingDisplayValue
                ? "Enabling this option will make your products appear as a catalog. Customers will not be able to place orders directly but can enquire through the chat box. Do you want to continue?"
                : "Disabling this option will allow customers to place orders directly on your products. Do you want to continue?"}
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.cancelButton,
                  isUpdating && styles.disabledButton,
                ]}
                onPress={() => {
                  if (!isUpdating) {
                    setShowCatalogConfirmModal(false);
                    setPendingDisplayValue(false);
                  }
                }}
                disabled={isUpdating}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.confirmButton,
                  isUpdating && styles.disabledButton,
                ]}
                onPress={() => {
                  if (!isUpdating) {
                    handleConfirmStoreStatus(
                      "display_as_catalog",
                      display,
                      "Display products as Catalog"
                    );
                  }
                }}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={[styles.confirmButtonText, { marginLeft: 8 }]}>
                      Updating...
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Menu items with navigation screens
type MenuItemType = {
  title: string;
  icon: string;
  screen?: keyof RootStackParamList;
};

// ✅ Ensure screen names match the navigation stack
const menuItems: MenuItemType[] = [
  {
    title: "Store working hours",
    icon: "calendar-clock",
    screen: "StoreWorkingHours",
  },
  {
    title: "Verification Tag & Online Payment",
    icon: "store-check-outline",
    screen: "VerificationPayment",
  },
  {
    title: "Visibility & Instant Delivery Area",
    icon: "map-marker-outline",
    screen: HomeNavigation.DELIVERY_AREA,
  },
  // { title: 'Enable svindo Payment Gateway', icon: 'credit-card-check', screen: 'EnableSvindoGateway' },
  // {
  //   title: "Add your Payment Gateway",
  //   icon: "credit-card-plus",
  //   screen: "AddPaymentGateway",
  // },
];
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  menuContainer: {
    marginHorizontal: 10,
    backgroundColor: "#fff",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#BCBCBC",
    marginVertical: 10,
    borderRadius: 10,
  },

  menuText: { fontSize: 14, marginLeft: 8, fontWeight: "600", color: "#000" },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
    borderTopWidth: 0.5,
    borderTopColor: "#ccc",
  },
  navItem: { alignItems: "center" },
  navText: { fontSize: 12, marginTop: 4 },
  activeText: { color: "#007bff" },
  bottomcontainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 4,
    marginHorizontal: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  optionText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: "#ccc",
    marginHorizontal: 12,
  },
  storepage: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#BCBCBC",
    marginVertical: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  storecontent: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchstorecontent: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    paddingHorizontal: 5,
  },
  switchtext: {
    paddingHorizontal: 10,
    color: "#FCA311",
    fontWeight: "600",
    fontSize: 16,
  },
  mytext: {
    paddingHorizontal: 5,
    fontWeight: "600",
    color: "#000",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  confirmButton: {
    backgroundColor: "#FCA311",
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default OnlineStore;

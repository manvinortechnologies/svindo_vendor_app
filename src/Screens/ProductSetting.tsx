import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import MainContainer from "../CommonComponent/MainContainer";
import Headerwithback from "./Headerwithback";
import SettingItem from "../CommonComponent/SettingItem";
import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";
import { API_ROUTES } from "../constants/api-routes.constants";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// UI Display Arrays
const productSettings = [
  // "Wholesale price",
  "Stock",
  "IMEI / Serial Number",
  "Low Stock Alert",
  // "Category",
  // "Sub category",
  "Brand Name",
  "Color",
  "Size",
  "Batch Number",
  "Expiry Date",
  "Description",
  "Image",
  // "Tax",
  "Food",
];

const deliveryDetails = ["Instant Delivery", "Self Pickup", "General Delivery"];

const policies = [
  "Return",
  "COD",
  "Replacement",
  "Shop Exchange",
  "Shop Warranty",
  "Brand Warranty",
  "On shop orders",
];

// UI Label to API Key Map
const settingKeyMap: { [key: string]: string } = {
  // Product Fields
  // "Wholesale price": "wholesale_price",
  Stock: "stock",
  "IMEI / Serial Number": "imei",
  "Low Stock Alert": "low_stock_alert",
  // Category: "category",
  // "Sub category": "sub_category",
  "Brand Name": "brand_name",
  Color: "color",
  Size: "size",
  "Batch Number": "batch_number",
  "Expiry Date": "expiry_date",
  Description: "description",
  Image: "image",
  // Tax: "tax",
  Food: "food",

  // Delivery
  "Instant Delivery": "instant_delivery",
  "Self Pickup": "self_pickup",
  "General Delivery": "general_delivery",

  // Policies
  Return: "return_policy",
  COD: "cod",
  Replacement: "replacement",
  "Shop Exchange": "shop_exchange",
  "Shop Warranty": "shop_warranty",
  "Brand Warranty": "brand_warranty",
  "On shop orders": "shop_orders",

  // Catalog
  // "Online Catalog only": "online_catalog_only",
};

// Combine all labels for initializing state
const allSettingsLabels = [
  ...productSettings,
  ...deliveryDetails,
  ...policies,
  // "Online Catalog only",
];

const ProductSetting = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Initialize all values to true
  const [settings, setSettings] = useState<{ [key: string]: boolean }>(() => {
    const initial: { [key: string]: boolean } = {};
    allSettingsLabels.forEach((label) => {
      initial[label] = true;
    });
    return initial;
  });
  const [originalSettings, setOriginalSettings] = useState<{
    [key: string]: boolean;
  }>({});

  const loadProductSettings = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(API_ROUTES.getProductSettings);
      const data = res?.data || {};
      const loadedSettings: { [key: string]: boolean } = {};
      allSettingsLabels.forEach((label) => {
        const apiKey = settingKeyMap[label];
        if (apiKey in data) {
          loadedSettings[label] = Boolean(data[apiKey]);
        } else {
          loadedSettings[label] = true; // Default to true if not in API response
        }
      });
      setSettings(loadedSettings);
      setOriginalSettings(loadedSettings);
    } catch (error) {
      console.error("Failed to load product settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProductSettings();
  }, []);

  const handleToggle = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const hasChanges = () => {
    return JSON.stringify(settings) !== JSON.stringify(originalSettings);
  };

  const buildPayload = () => {
    const payload: { [key: string]: boolean } = {};
    Object.entries(settings).forEach(([uiLabel, value]) => {
      const apiKey = settingKeyMap[uiLabel];
      if (apiKey) payload[apiKey] = value;
    });
    return payload;
  };

  const updateProductSettings = async () => {
    try {
      setIsLoading(true);
      const payload = buildPayload();

      // Uncomment this when API is ready
      const response = await api.post(API_ROUTES.productSettings, payload);
      if (response.status === 200 || response.status === 201) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Product Settings updated successfully",
        });
      } else {
      }
    } catch (error) {
      console.error("Failed to update settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProductSettings = async () => {
    try {
      setIsLoading(true);
      const payload = buildPayload();
      // Expected payload shape:
      // {
      //   wholesale_price: true, stock: true, imei: true, low_stock_alert: true,
      //   category: true, sub_category: false, brand_name: true, color: true, size: false,
      //   batch_number: true, expiry_date: false, description: true, image: true, tax: true, food: false,
      //   instant_delivery: true, self_pickup: true, general_delivery: false,
      //   return_policy: true, cod: true, replacement: false, shop_exchange: false,
      //   shop_warranty: false, brand_warranty: true, online_catalog_only: false
      // }
      const res = await api.post(API_ROUTES.productSettings, payload);
      if (res.status === 200 || res.status === 201) {
        setOriginalSettings({ ...settings });
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Product Settings saved successfully",
        });
      } else {
        console.warn("Unexpected response while saving:", res);
      }
    } catch (error) {
      console.error("Failed to save product settings:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to save product settings",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderSection = (title: string, items: string[]) => (
    <View style={styles.section} key={title}>
      {title !== "" && <Text style={styles.sectionTitle}>{title}</Text>}
      <View>
        {items.map((item) => (
          <SettingItem
            key={item}
            title={item}
            value={settings[item]}
            onToggle={() => handleToggle(item)}
          />
        ))}
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Headerwithback
        title="Product Settings"
        rightIcons={
          hasChanges()
            ? [
                <TouchableOpacity
                  key="save"
                  onPress={saveProductSettings}
                  style={styles.saveButton}
                  disabled={isLoading}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>,
              ]
            : []
        }
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderSection("", productSettings)}
        {renderSection("Delivery Details", deliveryDetails)}
        {renderSection("Policies", policies)}

        {/* <View style={styles.section}>
            <SettingItem
              title="Online Catalog only"
              value={settings["Online Catalog only"]}
              onToggle={() => handleToggle("Online Catalog only")}
            />
            <Text style={styles.note}>
              Note: Enabling this option will only post a catalog product to
              your svindo web page, where only images and product description is
              shown to the users.
            </Text>
          </View> */}
        <Loading visible={isLoading} />
      </ScrollView>
    </View>
  );
};

export default ProductSetting;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingHorizontal: 10,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#FCA311",
    marginBottom: 10,
  },
  note: {
    fontSize: 12,
    color: "#555",
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: "#FCA311",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

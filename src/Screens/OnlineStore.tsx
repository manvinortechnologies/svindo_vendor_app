import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icons from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";

import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import Bottomnavigation from "./Bottomnavigation";
import Header from "./Header";
import CustomSwitch from "./CustomSwitch";
import CustomButton from "../CommonComponent/CustomeButton";
import Loading from "../CommonComponent/Loading";
import api from "../services/api/api";
import Headerwithback from "./Headerwithback";
import MainContainer from "../CommonComponent/MainContainer";
import { API_ROUTES } from "../constants/api-routes.constants";
import CustomHeader from "../CommonComponent/CustomHeader";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(API_ROUTES.storeOnlineSetting);
      if (res.status == 200) {
        const data = res.data;
        console.log(data);
        setEnable(data.store_page_visible);
        setLocation(data.store_location_visible);
        setDisplay(data.display_as_catalog);
        setIsPrivate(data.private_catalog);
      }
    } catch (error) {
      console.log("error-->", error);
    } finally {
      setIsLoading(false);
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
      if (res.status == 200) {
        Alert.alert("Success", "Online Store Setting updated successfully");
      }
    } catch (error) {
      console.log("error-->", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <MainContainer>
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
                  onValueChange={setEnable}
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
                  onValueChange={setLocation}
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
                  onValueChange={setDisplay}
                  activeColor="#FCA311"
                  inactiveColor="#999"
                  borderColor="#999"
                />
              </View>
            </View>
            <View>
              <Text style={{ marginLeft: 28, color: "#000" }}>
                Enabling this option, makes the products posted online into a
                catalog that is the customer will not be able to place order.
                But can enquire through chat box. .
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
                  onValueChange={setIsPrivate}
                  activeColor="#FCA311"
                  inactiveColor="#999"
                  borderColor="#999"
                />
              </View>
            </View>
            <View>
              <Text style={{ marginLeft: 28, color: "#000" }}>
                Enabling this option, makes the products posted online into a
                catalog that is the customer will not be able to place order.
                But can enquire through chat box. .
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
      </SafeAreaView>
    </MainContainer>
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
  // { title: 'Enable svindo Payment Gateway', icon: 'credit-card-check', screen: 'EnableSvindoGateway' },
  {
    title: "Add your Payment Gateway",
    icon: "credit-card-plus",
    screen: "AddPaymentGateway",
  },
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
});

export default OnlineStore;

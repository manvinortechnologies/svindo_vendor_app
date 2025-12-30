import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import Bottomnavigation from "./Bottomnavigation";
import CustomHeader from "../CommonComponent/CustomHeader";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

// ✅ Define the type for the navigation stack
type RootStackParamList = {
  BannerAds: undefined;
  PromoteStore: undefined;
  DiscountCoupons: undefined;
  DeliveryCashback: undefined;
  ManageNotification: undefined;
  SendNotifications: undefined;
  CouponsScreen: undefined;
};

// ✅ Define the type for navigation prop
export type SecurityScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SendNotifications"
>;

const BoostSales = () => {
  const navigation = useNavigation<SecurityScreenNavigationProp>(); // ✅ Corrected navigation type
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <CustomHeader title="Promotions" />
      <ScrollView>
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
      </ScrollView>
    </View>
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
  // { title: "Banner Ads", icon: "image-outline", screen: "BannerAds" },
  // {
  //   title: "Promote Store / Products / Posts",
  //   icon: "storefront-outline",
  //   screen: "PromoteStore",
  // },
  // {
  //   title: "Discount Coupons",
  //   icon: "ticket-percent-outline",
  //   screen: "CouponsScreen",
  // },
  // {
  //   title: "Delivery Cashback Amount",
  //   icon: "cash-refund",
  //   screen: "DeliveryCashback",
  // },
  {
    title: "Send Notifications on svindo app",
    icon: "bell-outline",
    screen: "ManageNotification",
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
});

export default BoostSales;

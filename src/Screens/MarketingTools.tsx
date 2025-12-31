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
import Icons from "react-native-vector-icons/AntDesign";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import Header from "./Header";
import { HomeNavigation } from "../constants/app-routes.constants";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { s } from "react-native-size-matters";

// ✅ Define the type for the navigation stack
type RootStackParamList = {
  [HomeNavigation.ONLINE_STORE]: undefined;
  [HomeNavigation.ONLINE_SALE_WALLET]: undefined;
  [HomeNavigation.AD_WALLET]: undefined;
  [HomeNavigation.MANAGENOTIFICATION]: undefined;
  [HomeNavigation.CUSTOMER_FEEDBACK]: undefined;
  [HomeNavigation.CHATS]: undefined;
  [HomeNavigation.DOWNLOAD_QR_CODE]: undefined;
  [HomeNavigation.WHATSAPP_MESSAGE]: undefined;
  [HomeNavigation.SMS_SCREEN]: undefined;
  [HomeNavigation.EMAILS]: undefined;
  [HomeNavigation.MANAGE_DELIVERY]: undefined;
  [HomeNavigation.TRANSACTION_MESSAGES]: undefined;
  [HomeNavigation.MARKETING_TOOLS]: undefined;
  [HomeNavigation.COUPONS_SCREEN]: undefined;
  [HomeNavigation.ALL_CHAT_USER_SCREEN]: undefined;
};

// ✅ Define the type for navigation prop (fixed)
export type MarketingToolsNavigationProp = StackNavigationProp<
  RootStackParamList,
  HomeNavigation.MARKETING_TOOLS
>;

const MarketingTools = () => {
  const navigation = useNavigation<MarketingToolsNavigationProp>();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Header
        title="Marketing Tools"
        backgroundColor="#FFF"
        textColor="#333"
        borderBottomColor="#ccc"
        paddingTop={s(10)}
      />

      <ScrollView>
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.menuItem}
              onPress={() => item.screen && navigation.navigate(item.screen)}
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

const menuItems: MenuItemType[] = [
  {
    title: "Online Store Settings",
    icon: "store-settings",
    screen: HomeNavigation.ONLINE_STORE,
  },
  {
    title: "Online Sale Ledger",
    icon: "wallet",
    screen: HomeNavigation.ONLINE_SALE_WALLET,
  },
  // {
  //   title: "Ad Wallet",
  //   icon: "wallet-membership",
  //   screen: HomeNavigation.AD_WALLET,
  // },
  {
    title: "Send Notifications on svindo app",
    icon: "bell-outline",
    screen: HomeNavigation.MANAGENOTIFICATION,
  },
  {
    title: "Coupons / Discounts",
    icon: "ticket-percent-outline",
    screen: HomeNavigation.COUPONS_SCREEN,
  },
  {
    title: "Customer Feedback",
    icon: "star-circle",
    screen: HomeNavigation.CUSTOMER_FEEDBACK,
  },
  { title: "Chats", icon: "chat", screen: HomeNavigation.ALL_CHAT_USER_SCREEN },
  {
    title: "Automated Notification for Online Orders",
    icon: "bell",
    screen: HomeNavigation.TRANSACTION_MESSAGES,
  },
  {
    title: "Download Shop QR Code",
    icon: "qrcode",
    screen: HomeNavigation.DOWNLOAD_QR_CODE,
  },
  // {
  //   title: "WhatsApp Message",
  //   icon: "whatsapp",
  //   screen: HomeNavigation.WHATSAPP_MESSAGE,
  // },
  // {
  //   title: "SMS",
  //   icon: "message-text-outline",
  //   screen: HomeNavigation.SMS_SCREEN,
  // },
  // { title: "Emails", icon: "email-outline", screen: HomeNavigation.EMAILS },
  {
    title: "Manage Delivery",
    icon: "truck-delivery-outline",
    screen: HomeNavigation.MANAGE_DELIVERY,
  },
  {
    title: "Transaction Messages",
    icon: "message-text-outline",
    screen: HomeNavigation.SMS_SCREEN,
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 40 : 0,
  },
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

export default MarketingTools;

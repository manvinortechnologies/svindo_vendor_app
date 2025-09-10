import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icons from "react-native-vector-icons/AntDesign";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import Bottomnavigation from "./Bottomnavigation";
import Header from "./Header";
import { HomeNavigation } from "../constants/app-routes.constants";

// ✅ Define the type for the navigation stack
type RootStackParamList = {
  OnlineStore: undefined;
  OnlineSaleWallet: undefined;
  AdWallet: undefined;
  BoostSales: undefined;
  CustomerFeedback: undefined;
  Chats: undefined;
  DownloadQRCode: undefined;
  WhatsAppMessage: undefined;
  SmsScreen: undefined;
  Emails: undefined;
  ManageDelivery: undefined;
  TransactionMessages: undefined;
  MarketingTools: undefined;
};

// ✅ Define the type for navigation prop (fixed)
export type MarketingToolsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "MarketingTools"
>;

const MarketingTools = () => {
  const navigation = useNavigation<MarketingToolsNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Marketing Tools"
        backgroundColor="#FFF"
        textColor="#333"
        borderBottomColor="#ccc"
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
    </SafeAreaView>
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
    screen: "OnlineStore",
  },
  { title: "Online Sale Wallet", icon: "wallet", screen: "OnlineSaleWallet" },
  { title: "Ad Wallet", icon: "wallet-membership", screen: "AdWallet" },
  { title: "Boost your Sales", icon: "trending-up", screen: "BoostSales" },
  {
    title: "Customer Feedback",
    icon: "star-circle",
    screen: "CustomerFeedback",
  },
  { title: "Chats", icon: "chat", screen: "Chats" },
  { title: "Download Shop QR Code", icon: "qrcode", screen: "DownloadQRCode" },
  { title: "WhatsApp Message", icon: "whatsapp", screen: "WhatsAppMessage" },
  { title: "SMS", icon: "message-text-outline", screen: "SmsScreen" },
  { title: "Emails", icon: "email-outline", screen: "Emails" },
  {
    title: "Manage Delivery",
    icon: "truck-delivery-outline",
    screen: "ManageDelivery",
  },
  {
    title: "Transaction Messages",
    icon: "message-text-outline",
    screen: "TransactionMessages",
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

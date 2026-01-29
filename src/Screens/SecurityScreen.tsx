import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { s } from "react-native-size-matters";
import CustomHeader from "../CommonComponent/CustomHeader";
import { HomeNavigation } from "../constants/app-routes.constants";

type RootStackParamList = {
  ReturnExchange: undefined;
  ShippingDelivery: undefined;
  PrivacyPolicyScreen: undefined;
  TermsScreen: undefined;
  Support: undefined;
  DeleteAccountScreen: undefined;
  VendorAgreement: undefined;
  VendorSettlementPolicy: undefined;
};

export type SecurityScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ReturnExchange"
>;

type MenuItemType = {
  title: string;
  icon: string;
  screen?: keyof RootStackParamList;
};

const menuItems: MenuItemType[] = [
  {
    title: "Return & Exchange",
    icon: "aspect-ratio",
    screen: "ReturnExchange",
  },
  {
    title: "Shipping & Delivery",
    icon: "truck-delivery",
    screen: "ShippingDelivery",
  },
  {
    title: "Privacy & Policy",
    icon: "security",
    screen: "PrivacyPolicyScreen",
  },
  {
    title: "Terms & Conditions",
    icon: "book-check",
    screen: "TermsScreen",
  },
  {
    title: "Vendor Service Agreement",
    icon: "file-document-outline",
    screen: "VendorAgreement",
  },
  {
    title: "Vendor Settlement Policy",
    icon: "bank-outline",
    screen: "VendorSettlementPolicy",
  },
  //   {
  //     title: "Help & Support",
  //     icon: "help-circle",
  //     screen: "Support",
  //   },
  //   {
  //     title: "Delete Account",
  //     icon: "account-remove",
  //     screen: "DeleteAccountScreen",
  //   },
];

const SecurityScreen = () => {
  const navigation = useNavigation<SecurityScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <CustomHeader title="Security & Policy" showBackButton={true} />

      <ScrollView>
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.menuItem}
              onPress={() =>
                item.screen && (navigation as any).navigate(item.screen)
              }
            >
              <Icon name={item.icon} size={s(24)} color="#FCA311" />
              <Text style={styles.menuText}>{item.title}</Text>
              <Icon
                name="chevron-right"
                size={s(24)}
                color="#FCA311"
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  menuContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: s(16),
    paddingTop: s(16),
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: s(16),
    paddingHorizontal: s(16),
    backgroundColor: "#fff",
    borderWidth: s(1),
    borderColor: "#ddd",
    borderRadius: s(8),
    marginBottom: s(12),
  },
  menuText: {
    fontSize: s(16),
    marginLeft: s(12),
    fontWeight: "600",
    color: "#000",
    flex: 1,
  },
});

export default SecurityScreen;

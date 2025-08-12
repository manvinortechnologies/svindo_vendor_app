import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Header from "./Header";
import Bottomnavigation from "./Bottomnavigation";

type RootStackParamList = {
  SalePOS: undefined;
  CreatePurchase: undefined;
  ExpensesScreen: undefined;
  PaymentScreen: undefined;
  CompanyProfile: undefined;
  UserProfile: undefined;
  ManageCompanies: undefined;
  DayBookScreen: undefined;
  BankAccounts: undefined;
  CashInHand: undefined;
  Cheques: undefined;
  LoanAccounts: undefined;
  ManageCustomers: undefined;
  ManageVendors: undefined;
  RecycleBinScreen: undefined;
  CloseYearScreen: undefined;
  SettingsScreen: undefined;
  InvoiceSettings: undefined;
  RemindersScreen: undefined;
  WebAppScreen: undefined;
  Barcode: undefined;
  Reports: undefined;
  ManageRoles: undefined;
  ImportExportScreen: undefined;
  BackupToPhone: undefined;
  RestoreBackup: undefined;
  MessageSupportScreen: undefined;
  CallSupportScreen: undefined;
  RateUsScreen: undefined;
  PrivacyPolicyScreen: undefined;
  PremiumScreen: undefined;
};

const Erp = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const topTabs = [
    { label: "Sale & POS", icon: "cart-outline", screen: "SalePOS" },
    { label: "Purchases", icon: "cart-arrow-down", screen: "CreatePurchase" },
    { label: "Expenses", icon: "file-document-outline", screen: "ExpensesScreen" },
    { label: "Payments", icon: "cash-multiple", screen: "PaymentScreen" },
  ];

  const menuItems = [
    { title: "Company Profile", icon: "office-building-outline", screen: "CompanyProfile" },
    { title: "User Profile", icon: "account-outline", screen: "UserProfile" },
    { title: "Manage Companies", icon: "account-group-outline", screen: "ManageCompanies" },
    { title: "Day Book", icon: "book-open-variant", screen: "DayBookScreen" },
    { title: "Bank Accounts", icon: "bank-outline", screen: "BankAccounts" },
    { title: "Cash in Hand", icon: "cash-multiple", screen: "CashInHand" },
    { title: "Cheques", icon: "credit-card-outline", screen: "Cheques" },
    { title: "Loan Accounts", icon: "badge-account-horizontal-outline", screen: "LoanAccounts" },
    { title: "Manage Customers", icon: "account-group", screen: "ManageCustomers" },
    { title: "Manage Vendors", icon: "account-tie-outline", screen: "ManageVendors" },
    { title: "Recycle Bin", icon: "delete-restore", screen: "RecycleBinScreen" },
    { title: "Close Financial Year", icon: "calendar-plus", screen: "CloseYearScreen" },
    { title: "Settings", icon: "cog-outline", screen: "SettingsScreen" },
    { title: "Invoice Settings", icon: "file-document-outline", screen: "InvoiceSettings" },
    { title: "Reminders", icon: "bell-alert-outline", screen: "RemindersScreen" },
  ];

  const webItems = [
    { title: "Login to Svindo Business Web", icon: "web", screen: "WebAppScreen" },
    { title: "Barcode Generator", icon: "barcode-scan", screen: "Barcode" },
    { title: "Reports", icon: "file-chart-outline", screen: "Reports" },
    { title: "Manage Roles", icon: "account-cog-outline", screen: "ManageRoles" },
    { title: "Import / Export Data", icon: "swap-horizontal-bold", screen: "ImportExportScreen" },
    { title: "Backup / Restore", icon: "cloud-outline", screen: undefined }, // This can be expanded
  ];

  const helpItems = [
    { title: "WhatsApp", icon: "whatsapp", screen: "MessageSupportScreen" },
    { title: "Email", icon: "email-outline", screen: "MessageSupportScreen" },
    { title: "Message", icon: "message-outline", screen: "MessageSupportScreen" },
    { title: "Call", icon: "phone-outline", screen: "CallSupportScreen" },
  ];

  const bottomItems = [
    { title: "Rate Us on Playstore", icon: "star-outline", screen: "RateUsScreen" },
    { title: "Privacy Policy", icon: "shield-lock-outline", screen: "PrivacyPolicyScreen" },
    { title: "Svindo Business Premium", icon: "crown-outline", screen: "PremiumScreen" },
  ];

  return (
    <View style={styles.container}>
      <Header title="ERP" backgroundColor="#FFF" textColor="#000" borderBottomColor="#ccc" 
      paddingTop={50}
       />

      <ScrollView>

        {/* Box Container */}
        <View style={{borderWidth: 1, borderColor: '#CBCBCB', width: '95%', height: 100, margin: 10, borderRadius: 12}}></View>


        {/* Top Tabs */}
        <View style={styles.topTabContainer}>
  {topTabs.map((tab) => (
    <View key={tab.label} style={styles.tabItem}>
      <TouchableOpacity
        style={styles.topTab}
        onPress={() => tab.screen && navigation.navigate(tab.screen)}
      >
        <Icon name={tab.icon} size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.topTabText}>{tab.label}</Text>
    </View>
  ))}
        </View>


        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.menuItem}
              onPress={() => item.screen && navigation.navigate(item.screen)}
            >
              <Icon name={item.icon} size={22} color="#000" />
              <Text style={styles.menuText}>{item.title}</Text>
              <Icon name="chevron-right" size={22} color="#000" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Web Items */}
        <View style={styles.menuContainer}>
          {webItems.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.menuItem}
              onPress={() => item.screen && navigation.navigate(item.screen)}
            >
              <Icon name={item.icon} size={22} color="#000" />
              <Text style={styles.menuText}>{item.title}</Text>
              <Icon name="chevron-right" size={22} color="#000" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Help & Support */}
        <View style={{borderWidth: 1, borderColor: '#ddd', margin: 8, borderRadius: 10}}>
          <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#ECECEC'}}>
        <Text style={styles.sectionTitle}>Help & Support</Text>
        <Icon name="chevron-right" size={22} color="#000" style={{ marginLeft: 'auto' , marginTop: 5, marginRight: 10}} />
        </TouchableOpacity>
        <View style={styles.helpContainer}>
          {helpItems.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.helpItem}
              onPress={() => item.screen && navigation.navigate(item.screen)}
            >
              <Icon name={item.icon} size={22} color="#FCA311" />
              <Text style={styles.helpText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        </View>

        {/* Bottom Items */}
        <View style={styles.menuContainer}>
          {bottomItems.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.menuItem}
              onPress={() => item.screen && navigation.navigate(item.screen)}
            >
              <Icon name={item.icon} size={22} color="#000" />
              <Text style={styles.menuText}>{item.title}</Text>
              <Icon name="chevron-right" size={22} color="#000" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Bottomnavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  topTabContainer: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  paddingVertical: 10,
},

tabItem: {
  alignItems: 'center',
},

topTab: {
  padding: 10,
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
},

topTabText: {
  fontSize: 12, 
  marginTop: 4, 
  fontWeight: "600" 
},

  menuContainer: { marginHorizontal: 10 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    marginVertical: 5,
    borderRadius: 8,
  },
  menuText: { fontSize: 14, marginLeft: 8, fontWeight: "600" },
  sectionTitle: { marginLeft: 16, marginVertical: 10, fontWeight: "700", color: "#000" },
  helpContainer: {
    margin: 6,
    justifyContent: "space-around",
  },
  helpItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    margin: 2,
  },
  helpText: { marginLeft: 6, color: "#FCA311", fontWeight: "600" },
});

export default Erp;

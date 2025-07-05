import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Bottomnavigation from './Bottomnavigation';
import Header from './Header';

type RootStackParamList = {
  CompanyProfile: undefined;
  UserProfile: undefined;
  ManageCompanies: undefined;
  SalePOS: undefined;
  CreatePurchase: undefined;
  Barcode: undefined;
  Expenses: undefined;
  Reports: undefined;
  BankAccounts: undefined;
  CashInHand: undefined;
  Cheques: undefined;
  LoanAccounts: undefined;
  ManageCustomers: undefined;
  ManageVendors: undefined;
  ManageRoles: undefined;
  BackupToPhone: undefined;
  RestoreBackup: undefined;
  ImportExportScreen: undefined;
  RecycleBinScreen: undefined;
  CloseYearScreen: undefined;
  SettingsScreen: undefined;
  InvoiceSettings: undefined;
  RemindersScreen: undefined;
  MessageSupportScreen: undefined;
  CallSupportScreen: undefined;
  RateUsScreen: undefined;
  PrivacyPolicyScreen: undefined;
  PremiumScreen: undefined;
  AttendanceScreen: undefined;
  DeliveryChallan: undefined;
  WebAppScreen: undefined;
  ProductSetting:undefined;
};

type MenuItemType = {
  title: string;
  icon: string;
  screen?: keyof RootStackParamList;
  children?: MenuItemType[];
};

const menuItems: MenuItemType[] = [
  { title: 'Company Profile', icon: 'office-building-outline', screen: 'CompanyProfile' },
  { title: 'User Profile', icon: 'account-outline', screen: 'UserProfile' },
  { title: 'Manage Companies', icon: 'account-group-outline', screen: 'ManageCompanies' },
  { title: 'Sale & POS', icon: 'cart-outline', screen: 'SalePOS' },
  { title: 'Purchase', icon: 'cart-arrow-down', screen: 'CreatePurchase' },
  { title: 'Barcode Generator', icon: 'barcode-scan', screen: 'Barcode' },
  { title: 'Expenses', icon: 'file-document-outline', screen: 'Expenses' },
  { title: 'Reports', icon: 'file-chart-outline', screen: 'Reports' },
  { title: 'Bank Accounts', icon: 'bank-outline', screen: 'BankAccounts' },
  { title: 'Cash in-Hand', icon: 'cash-multiple', screen: 'CashInHand' },
  { title: 'Cheques', icon: 'credit-card-outline', screen: 'Cheques' },
  { title: 'Loan Accounts', icon: 'badge-account-horizontal-outline', screen: 'LoanAccounts' },
  { title: 'Manage Customers', icon: 'account-group', screen: 'ManageCustomers' },
  { title: 'Manage Parties / Vendors', icon: 'account-tie-outline', screen: 'ManageVendors' },
  { title: 'Manage Roles', icon: 'account-cog-outline', screen: 'ManageRoles' },
  {
    title: 'Backup / Restore',
    icon: 'cloud-outline',
    children: [
      { title: 'Backup to phone', icon: 'cloud-upload-outline', screen: 'BackupToPhone' },
      { title: 'Restore backup', icon: 'cloud-download-outline', screen: 'RestoreBackup' },
    ],
  },
  { title: 'Import / Export Data', icon: 'swap-horizontal-bold', screen: 'ImportExportScreen' },
  { title: 'Recycle Bin', icon: 'delete-restore', screen: 'RecycleBinScreen' },
  { title: 'Close Financial Year', icon: 'calendar-plus', screen: 'CloseYearScreen' },
  { title: 'Settings', icon: 'cog-outline', screen: 'SettingsScreen' },
  { title: 'Invoice Settings', icon: 'file-document-outline', screen: 'InvoiceSettings' },
   { title: 'Product Settings', icon: 'file-document-outline', screen: 'ProductSetting' },
  { title: 'Reminders', icon: 'bell-alert-outline', screen: 'RemindersScreen' },
  {
    title: 'Help & Support',
    icon: 'help-circle-outline',
    children: [
      { title: 'Message', icon: 'message-outline', screen: 'MessageSupportScreen' },
      { title: 'Call', icon: 'phone-outline', screen: 'CallSupportScreen' },
    ],
  },
  { title: 'Rate Us', icon: 'star-outline', screen: 'RateUsScreen' },
  { title: 'Privacy Policy', icon: 'shield-lock-outline', screen: 'PrivacyPolicyScreen' },
  { title: 'svindo Business Premium', icon: 'crown-outline', screen: 'PremiumScreen' },
  { title: 'Get our Web app', icon: 'web', screen: 'WebAppScreen' },
  { title: 'Attendence management', icon: 'calendar-check-outline', screen: 'AttendanceScreen' },
  { title: 'Targeted offers for birthday and anniversary', icon: 'gift-outline', screen: 'DeliveryChallan' },
];

const Erp = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="ERP Dashboard"
        backgroundColor="#FCA311"
        textColor="#fff"
        borderBottomColor="#ccc"
        paddingTop={50}
      />

      <ScrollView>
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <View key={item.title}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  if (item.children) {
                    toggleMenu(item.title);
                  } else if (item.screen) {
                    navigation.navigate(item.screen as any);
                  }
                }}
              >
                <Icon name={item.icon} size={24} color="#000" />
                <Text style={styles.menuText}>{item.title}</Text>
                <Icon
                  name={
                    item.children
                      ? expandedMenus.includes(item.title)
                        ? 'chevron-up'
                        : 'chevron-down'
                      : 'chevron-right'
                  }
                  size={24}
                  color="#000"
                  style={{ marginLeft: 'auto' }}
                />
              </TouchableOpacity>

              {item.children && expandedMenus.includes(item.title) && (
                <View style={styles.subMenuContainer}>
                  {item.children.map((subItem) => (
                    <TouchableOpacity
                      key={subItem.title}
                      style={styles.subMenuItem}
                      onPress={() => subItem.screen && navigation.navigate(subItem.screen as any)}
                    >
                      <Icon name={subItem.icon} size={22} color="#FCA311" />
                      <Text style={[styles.menuText,{ color: '#FCA311' }]}>{subItem.title}</Text>
                      <Icon name="chevron-right" size={22} color="#FCA311" style={{ marginLeft: 'auto' }} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <Bottomnavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  menuContainer: {
    marginHorizontal: 10,
    backgroundColor: '#fff',
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#BCBCBC',
    marginVertical: 6,
    borderRadius: 10,
  },

  menuText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '600',
  },

  subMenuContainer: {
    marginLeft: 20,
    marginTop: 6,
    marginBottom: 6,
  },

  subMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginVertical: 4,
    color:"#FCA311",
  },
});

export default Erp;

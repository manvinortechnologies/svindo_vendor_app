import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import SignupScreen from "../Screens/SignupScreen";
import OtpScreen from "../Screens/OtpScreen";
import SignupDetailScreen from "../Screens/SignupDetailScreen";
import SelectLocationScreen from "../Screens/SelectLocationScreen";
import Statistics from "../Statistics";
import StatisticsScreen from "../Screens/StatisticsScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import DraftScreen from "../Screens/DraftScreen";
import Orders from "../Screens/Orders";
import StockScreen from "../Screens/StockScreen";
import VariantsScreen from "../Screens/VariantsScreen";
import CreateProduct from "../Screens/CreateProduct";
import AddProductScreen from "../Screens/AddProductScreen";
import ProductAddedSuccess from "../Screens/ProductAddedSuccess";
import ProductSelectionScreen from "../Screens/ProductSelectionScreen";
import Storescreen from "../Screens/Storescreen";
import MarketingTools from "../Screens/MarketingTools";
import TransactionMessages from "../Screens/TransactionMessages";
import OnlineStore from "../Screens/OnlineStore";
import BoostSales from "../Screens/BoostSales";
import AdWallet from "../Screens/AdWallet";
import OnlineSaleWallet from "../Screens/OnlineSaleWallet";
import SearchHeader from "../Screens/SearchHeader";
import CustomerFeedback from "../Screens/CustomerFeedback";
import Chats from "../Screens/Chats";
import DownloadQRCode from "../Screens/DownloadQRCode";
import WhatsAppMessage from "../Screens/WhatsAppMessage";
import Emails from "../Screens/Emails";
import ManageDelivery from "../Screens/ManageDelivery";
import Erp from "../Screens/Erp";
import CompanyProfile from "../Screens/CompanyProfile";
import UserProfile from "../Screens/UserProfile";
import ManageCompanies from "../Screens/ManageCompanies";
import SalePOS from "../Screens/SalePOS";
import CreatePurchase from "../Screens/CreatePurchase";
import Barcode from "../Screens/Barcode";
import Expenses from "../Screens/Expenses";
import Reports from "../Screens/Reports";
import SaleReportScreen from "../Screens/SaleReportScreen";
import PurchaseReportScreen from "../Screens/PurchaseReportScreen";
import DayBookScreen from "../Screens/DayBookScreen";
import ProfitLossScreen from "../Screens/ProfitLossScreen";
import AllTransactionsScreen from "../Screens/AllTransactionsScreen";
import PartyStatementScreen from "../Screens/PartyStatementScreen";
import StockSummaryScreen from "../Screens/StockSummaryScreen";
import StockDetailScreen from "../Screens/StockDetailScreen";
import GSTR1Screen from "../Screens/GSTR1Screen";
import ExpenseTransactionScreen from "../Screens/ExpenseTransactionScreen";
import CashInHand from "../Screens/CashInHand";
import BankAccounts from "../Screens/BankAccounts";
import ManageCustomers from "../Screens/ManageCustomers";
import ManageVendors from "../Screens/ManageVendors";
import ManageRoles from "../Screens/ManageRoles";
import RecycleBinScreen from "../Screens/RecycleBinScreen";
import CloseYearScreen from "../Screens/CloseYearScreen";
import SettingsScreen from "../Screens/SettingsScreen";
import PreferencesScreen from "../Screens/PreferencesScreen";
import Sales from "../Screens/Sales";
import Purchase from "../Screens/Purchase";
import DiscountSettings from "../Screens/DiscountSettings";
import TaxesAndGST from "../Screens/TaxesAndGST ";
import InvoiceSettings from "../Screens/InvoiceSettings";
import InvoiceTemplates from "../Screens/InvoiceTemplates";
import RemindersScreen from "../Screens/RemindersScreen";
import RateUsScreen from "../Screens/RateUsScreen";
import PrivacyPolicyScreen from "../Screens/PrivacyPolicyScreen";
import DeleteAccountScreen from "../Screens/DeleteAccountScreen";
import ResetDataScreen from "../Screens/ResetDataScreen";
import CreateInvoice from "../Screens/CreateInvoice";
import CreateCreditNote from "../Screens/CreateCreditNote";
import CreateQuation from "../Screens/CreateQuation";
import CreateproFarmaInvoice from "../Screens/CreateproFarmaInvoice";
import DeliveryChallan from "../Screens/DeliveryChallan";
import SplashScreen from "../Screens/SplashScreen";
import { HomeNavigation } from "../constants/app-routes.constants";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { THomeNavigation } from "../type";
import WelcomeScreen from "../Screens/WelcomeScreen";
import AdminProfile from "../Screens/AdminProfile";
import ProductSetting from "../Screens/ProductSetting";
import StoreWorkingHours from "../Screens/StoreWorkingHours";
import CouponsScreen from "../Screens/CouponsScreen";
import ExpensesScreen from "../Screens/ExpensesScreen";
import CreateCouponScreen from "../Screens/CreateCouponScreen";
import AddPostScreen from "../Screens/AddPostScreen";
import BuyersRequestScreen from "../Screens/BuyersRequestScreen";
import CreateRequestScreen from "../Screens/CreateRequestScreen";
import CreateOffer from "../Screens/CreateOffer";
import BannerAds from "../Screens/BannerAds";
import AddBannerScreen from "../Screens/AddBannerScreen";
import AddSpotlightScreen from "../Screens/AddSpotlightScreen";
import SelectSpotlightProduct from "../Screens/SelectSpotlightProduct";
import VerificationPaymentsScreen from "../Screens/VerificationPaymentsScreen";
import AddCustomer from "../Screens/AddCustomer";
import AddVendor from "../Screens/AddVendor";
import DeliverySettingsScreen from "../Screens/DeliverySettingsScreen";
import PaymentsScreen from "../Screens/PaymentsScreen";
import PaymentsList from "../Screens/PaymentsList";
import SendNotifications from "../Screens/SendNotifications";
import PromoteStore from "../Screens/PromoteStore";
import AutoAssignDelivery from "../Screens/AutoAssignDelivery";
import AssignOwnDeliveryBoy from "../Screens/AssignOwnDeliveryBoy";
import AddDeliveryBoy from "../Screens/AddDeliveryBoy";
import WholesaleScreen from "../Screens/WholesaleScreen";
import BillDetails from "../Screens/BillDetails";
import OrderProductDetails from "../Screens/OrderProductDetails";
import ReminderScreen from "../Screens/ReminderSettingScreen";
import SalesLedger from "../Screens/SalesLedger";
import AddAddOns from "../Screens/AddAddOns";
import ProductDetails from "../Screens/ProductDetails";
import BankNameScreen from "../Screens/BankNameScreen";
import ExpensesDetailScreen from "../Screens/ExpensesDetailScreen";
import NotificationScreen from "../Screens/NotificationScreen";
import ModelReminderScreen from "../Screens/ModelReminderScreen";
import CustomerLedger from "../Screens/CustomerLedger";
import VendorLedger from "../Screens/VendorLedger";
import SmsScreen from "../Screens/SmsScreen";
import BoostPostSpotlight from "../Screens/BoostPostSpotlight";
import ManageNotification from "../Screens/ManageNotification";
import PosScreen from "../Screens/PosScreen";
import AddonSuccessScreen from "../Screens/AddonSuccessScreen";
import SelectAddonsScreen from "../Screens/SelectAddonsScreen";
import CreateAddons from "../Screens/CreateAddons";
import ScanBarcode from "../Screens/ScanBarcode";
import Support from "../Screens/Support";
import ChatScreen from "../Screens/ChatScreen";
import RequestOffers from "../Screens/RequestOffers";

const Stack = createNativeStackNavigator<THomeNavigation>();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={HomeNavigation.SPLASH_SCREEN}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name={HomeNavigation.SPLASH_SCREEN}
          component={SplashScreen}
        />
        <Stack.Screen
          name={HomeNavigation.WELCOME_SCREEN}
          component={WelcomeScreen}
        />
        <Stack.Screen
          name={HomeNavigation.SIGNUP_SCREEN}
          component={SignupScreen}
        />
        <Stack.Screen name={HomeNavigation.OTP_SCREEN} component={OtpScreen} />
        <Stack.Screen
          name={HomeNavigation.SIGNUP_DETAIL_SCREEN}
          component={SignupDetailScreen}
        />
        <Stack.Screen
          name={HomeNavigation.SELECT_LOCATION_SCREEN}
          component={SelectLocationScreen}
        />
        <Stack.Screen name={HomeNavigation.STATISTICS} component={Statistics} />
        <Stack.Screen
          name={HomeNavigation.REQUESTOFFERS}
          component={RequestOffers}
        />
        <Stack.Screen
          name={HomeNavigation.NOTIFICATION_SCREEN}
          component={NotificationScreen}
        />
        <Stack.Screen
          name={HomeNavigation.MODEL_REMINDER_SCREEN}
          component={ModelReminderScreen}
        />

        <Stack.Screen
          name={HomeNavigation.BOTTOM_NAVIGATION}
          component={BottomTabNavigator}
        />
        <Stack.Screen
          name={HomeNavigation.DRAFT_SCREEN}
          component={DraftScreen}
        />
        <Stack.Screen name={HomeNavigation.ORDERS} component={Orders} />
        <Stack.Screen
          name={HomeNavigation.ORDERPRODUCTDETAILS}
          component={OrderProductDetails}
        />
        <Stack.Screen
          name={HomeNavigation.PRODUCTDETAILS}
          component={ProductDetails}
        />
        <Stack.Screen
          name={HomeNavigation.SALES_LEDGER}
          component={SalesLedger}
        />
        <Stack.Screen
          name={HomeNavigation.STOCK_SCREEN}
          component={StockScreen}
        />
        <Stack.Screen
          name={HomeNavigation.VARIANTS_SCREEN}
          component={VariantsScreen}
        />
        <Stack.Screen
          name={HomeNavigation.CREATE_PRODUCT}
          component={CreateProduct}
        />
        <Stack.Screen
          name={HomeNavigation.SCAN_BARCODE}
          component={ScanBarcode}
        />
        <Stack.Screen
          name={HomeNavigation.CREATE_ADDONS}
          component={CreateAddons}
        />
        <Stack.Screen
          name={HomeNavigation.ADD_PRODUCT_SCREEN}
          component={AddProductScreen}
        />
        <Stack.Screen
          name={HomeNavigation.PRODUCT_ADDED_SUCCESS}
          component={ProductAddedSuccess as any}
        />
        <Stack.Screen
          name={HomeNavigation.PRODUCT_SELECTION}
          component={ProductSelectionScreen}
        />

        <Stack.Screen
          name={HomeNavigation.ONLINE_STORE}
          component={OnlineStore}
        />
        <Stack.Screen
          name={HomeNavigation.TRANSACTION_MESSAGES}
          component={TransactionMessages}
        />

        <Stack.Screen name={HomeNavigation.AD_WALLET} component={AdWallet} />
        <Stack.Screen
          name={HomeNavigation.BOOST_SALES}
          component={BoostSales}
        />
        <Stack.Screen
          name={HomeNavigation.ONLINE_SALE_WALLET}
          component={OnlineSaleWallet}
        />
        <Stack.Screen
          name={HomeNavigation.SEARCH_HEADER}
          component={SearchHeader}
        />
        <Stack.Screen
          name={HomeNavigation.CUSTOMER_FEEDBACK}
          component={CustomerFeedback}
        />
        <Stack.Screen name={HomeNavigation.CHATS} component={Chats} />
        <Stack.Screen
          name={HomeNavigation.DOWNLOAD_QR_CODE}
          component={DownloadQRCode}
        />
        <Stack.Screen
          name={HomeNavigation.WHATSAPP_MESSAGE}
          component={WhatsAppMessage}
        />
        <Stack.Screen name={HomeNavigation.SMS_SCREEN} component={SmsScreen} />
        <Stack.Screen name={HomeNavigation.EMAILS} component={Emails} />
        <Stack.Screen
          name={HomeNavigation.MANAGE_DELIVERY}
          component={ManageDelivery}
        />
        <Stack.Screen name={HomeNavigation.ERP} component={Erp} />
        <Stack.Screen
          name={HomeNavigation.WHOLESALE}
          component={WholesaleScreen}
        />
        <Stack.Screen
          name={HomeNavigation.BILLDETAILS}
          component={BillDetails}
        />
        <Stack.Screen
          name={HomeNavigation.COMPANY_PROFILE}
          component={CompanyProfile}
        />
        <Stack.Screen
          name={HomeNavigation.USER_PROFILE}
          component={UserProfile}
        />
        <Stack.Screen
          name={HomeNavigation.MANAGE_COMPANIES}
          component={ManageCompanies}
        />
        <Stack.Screen name={HomeNavigation.POSSCREEN} component={PosScreen} />
        <Stack.Screen name={HomeNavigation.SALE_POS} component={SalePOS} />
        <Stack.Screen
          name={HomeNavigation.CREATE_PURCHASE}
          component={CreatePurchase}
        />
        <Stack.Screen name={HomeNavigation.BARCODE} component={Barcode} />
        <Stack.Screen name={HomeNavigation.EXPENSES} component={Expenses} />
        <Stack.Screen name={HomeNavigation.REPORTS} component={Reports} />
        <Stack.Screen
          name={HomeNavigation.SALE_REPORT_SCREEN}
          component={SaleReportScreen}
        />
        <Stack.Screen
          name={HomeNavigation.PURCHASE_REPORT_SCREEN}
          component={PurchaseReportScreen}
        />
        <Stack.Screen
          name={HomeNavigation.DAY_BOOK_SCREEN}
          component={DayBookScreen}
        />
        <Stack.Screen
          name={HomeNavigation.PROFIT_LOSS_SCREEN}
          component={ProfitLossScreen}
        />

        <Stack.Screen
          name={HomeNavigation.ALL_TRANSACTIONS_SCREEN}
          component={AllTransactionsScreen}
        />
        <Stack.Screen
          name={HomeNavigation.PARTY_STATEMENT_SCREEN}
          component={PartyStatementScreen}
        />
        <Stack.Screen
          name={HomeNavigation.STOCK_SUMMARY_SCREEN}
          component={StockSummaryScreen}
        />
        <Stack.Screen
          name={HomeNavigation.STOCK_DETAIL_SCREEN}
          component={StockDetailScreen}
        />
        <Stack.Screen
          name={HomeNavigation.GSTR1_SCREEN}
          component={GSTR1Screen}
        />
        <Stack.Screen
          name={HomeNavigation.EXPENSE_TRANSACTION_SCREEN}
          component={ExpenseTransactionScreen}
        />
        <Stack.Screen
          name={HomeNavigation.CASH_IN_HAND}
          component={CashInHand}
        />
        <Stack.Screen
          name={HomeNavigation.BANK_ACCOUNTS}
          component={BankAccounts}
        />
        <Stack.Screen
          name={HomeNavigation.BANK_NAME}
          component={BankNameScreen}
        />
        <Stack.Screen
          name={HomeNavigation.MANAGE_CUSTOMERS}
          component={ManageCustomers}
        />
        <Stack.Screen
          name={HomeNavigation.CUSTOMER_LEDGER}
          component={CustomerLedger}
        />
        <Stack.Screen
          name={HomeNavigation.MANAGE_VENDORS}
          component={ManageVendors}
        />
        <Stack.Screen
          name={HomeNavigation.VENDOR_LEDGER}
          component={VendorLedger}
        />
        <Stack.Screen
          name={HomeNavigation.MANAGE_ROLES}
          component={ManageRoles}
        />
        <Stack.Screen
          name={HomeNavigation.RECYCLE_BIN_SCREEN}
          component={RecycleBinScreen}
        />
        <Stack.Screen
          name={HomeNavigation.CLOSE_YEAR_SCREEN}
          component={CloseYearScreen}
        />
        <Stack.Screen
          name={HomeNavigation.SETTINGS_SCREEN}
          component={SettingsScreen}
        />
        <Stack.Screen
          name={HomeNavigation.PREFERENCES_SCREEN}
          component={PreferencesScreen}
        />
        <Stack.Screen name={HomeNavigation.SALES} component={Sales} />
        <Stack.Screen name={HomeNavigation.PURCHASE} component={Purchase} />
        <Stack.Screen
          name={HomeNavigation.DISCOUNT_SETTINGS}
          component={DiscountSettings}
        />
        <Stack.Screen
          name={HomeNavigation.TAXES_AND_GST}
          component={TaxesAndGST}
        />
        <Stack.Screen
          name={HomeNavigation.INVOICE_SETTINGS}
          component={InvoiceSettings}
        />
        <Stack.Screen
          name={HomeNavigation.INVOICE_TEMPLATES}
          component={InvoiceTemplates}
        />
        <Stack.Screen
          name={HomeNavigation.REMINDERS_SCREEN}
          component={RemindersScreen}
        />
        <Stack.Screen
          name={HomeNavigation.REMINDERSETTINGS}
          component={ReminderScreen}
        />
        <Stack.Screen
          name={HomeNavigation.RATE_US_SCREEN}
          component={RateUsScreen}
        />
        <Stack.Screen
          name={HomeNavigation.PRIVACY_POLICY_SCREEN}
          component={PrivacyPolicyScreen}
        />
        <Stack.Screen
          name={HomeNavigation.DELETE_ACCOUNT_SCREEN}
          component={DeleteAccountScreen}
        />
        <Stack.Screen
          name={HomeNavigation.RESET_DATA_SCREEN}
          component={ResetDataScreen}
        />
        <Stack.Screen
          name={HomeNavigation.CREATE_INVOICE}
          component={CreateInvoice}
        />
        <Stack.Screen
          name={HomeNavigation.CREATE_CREDIT_NOTE}
          component={CreateCreditNote}
        />
        <Stack.Screen
          name={HomeNavigation.CREATE_QUATION}
          component={CreateQuation}
        />
        <Stack.Screen
          name={HomeNavigation.CREATE_PRO_FARMA_INVOICE}
          component={CreateproFarmaInvoice}
        />
        <Stack.Screen
          name={HomeNavigation.DELIVERY_CHALLAN}
          component={DeliveryChallan}
        />
        <Stack.Screen
          name={HomeNavigation.ADMINPROFILE}
          component={AdminProfile}
        />
        <Stack.Screen
          name={HomeNavigation.PRODUCTSETTING}
          component={ProductSetting}
        />
        <Stack.Screen
          name={HomeNavigation.STOREWORKING_HOURS}
          component={StoreWorkingHours}
        />
        <Stack.Screen
          name={HomeNavigation.COUPONS_SCREEN}
          component={CouponsScreen}
        />
        <Stack.Screen
          name={HomeNavigation.EXPENESES_SCREEN}
          component={ExpensesScreen}
        />
        <Stack.Screen
          name={HomeNavigation.EXPENESES_DETAIL_SCREEN}
          component={ExpensesDetailScreen}
        />
        <Stack.Screen
          name={HomeNavigation.CREATECOUPON}
          component={CreateCouponScreen}
        />
        <Stack.Screen
          name={HomeNavigation.ADD_POST_SCREEN}
          component={AddPostScreen}
        />
        <Stack.Screen
          name={HomeNavigation.BUYERSREQUEST}
          component={BuyersRequestScreen}
        />
        <Stack.Screen
          name={HomeNavigation.CREATEREQUEST}
          component={CreateRequestScreen}
        />
        <Stack.Screen
          name={HomeNavigation.CREATEOFFER}
          component={CreateOffer}
        />
        <Stack.Screen name={HomeNavigation.BANNER_ADS} component={BannerAds} />
        <Stack.Screen
          name={HomeNavigation.ADD_BANNER_SCREEN}
          component={AddBannerScreen}
        />

        <Stack.Screen
          name={HomeNavigation.ADDSPOTLIGHT}
          component={AddSpotlightScreen}
        />
        <Stack.Screen
          name={HomeNavigation.SELECTSPOTLIGHTPRODUCT}
          component={SelectSpotlightProduct}
        />
        <Stack.Screen
          name={HomeNavigation.VERIFICATIONPAYMENT}
          component={VerificationPaymentsScreen}
        />
        <Stack.Screen
          name={HomeNavigation.ADDCUSTOMER}
          component={AddCustomer}
        />
        <Stack.Screen name={HomeNavigation.ADDVENDOR} component={AddVendor} />
        <Stack.Screen
          name={HomeNavigation.DELIVERY_SETTING_SCREEN}
          component={DeliverySettingsScreen}
        />
        <Stack.Screen
          name={HomeNavigation.PAYMENTSCREEN}
          component={PaymentsScreen}
        />
        <Stack.Screen
          name={HomeNavigation.PAYMENTS_LIST}
          component={PaymentsList}
        />
        <Stack.Screen
          name={HomeNavigation.MANAGENOTIFICATION}
          component={ManageNotification}
        />
        <Stack.Screen
          name={HomeNavigation.SENDNOTIFICATION}
          component={SendNotifications}
        />
        <Stack.Screen
          name={HomeNavigation.PROMOTESTORE}
          component={PromoteStore}
        />
        <Stack.Screen
          name={HomeNavigation.BOOSTPOSTSPOTLIGHT}
          component={BoostPostSpotlight}
        />
        <Stack.Screen
          name={HomeNavigation.AUTOASSIGNDELIVERY}
          component={AutoAssignDelivery}
        />
        <Stack.Screen
          name={HomeNavigation.ASSIGNOWNDELIVERYBOY}
          component={AssignOwnDeliveryBoy}
        />
        <Stack.Screen
          name={HomeNavigation.ADDDELIVERYBOY}
          component={AddDeliveryBoy}
        />
        <Stack.Screen name={HomeNavigation.ADD_ADDONS} component={AddAddOns} />
        <Stack.Screen
          name={HomeNavigation.ADDON_SUCCESS}
          component={AddonSuccessScreen}
        />
        <Stack.Screen
          name={HomeNavigation.SELECT_ADDONS}
          component={SelectAddonsScreen}
        />
        <Stack.Screen name={HomeNavigation.SUPPORT} component={Support} />
        <Stack.Screen
          name={HomeNavigation.CHAT_SCREEN}
          component={ChatScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppNavigation;

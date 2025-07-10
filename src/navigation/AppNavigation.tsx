import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import SignupScreen from '../component/SignupScreen';
import OtpScreen from '../component/OtpScreen';
import SignupDetailScreen from '../component/SignupDetailScreen';
import SelectLocationScreen from '../component/SelectLocationScreen';
import Statistics from '../Statistics';
import StatisticsScreen from '../component/StatisticsScreen';
import Bottomnavigation from '../component/Bottomnavigation';
import DraftScreen from '../component/DraftScreen';
import Orders from '../component/Orders';
import StockScreen from '../component/StockScreen';
import CreateProduct from '../component/CreateProduct';
import AddProductScreen from '../component/AddProductScreen';
import Storescreen from '../component/Storescreen';
import MarketingTools from '../component/MarketingTools';
import OnlineStore from '../component/OnlineStore';
import BoostSales from '../component/BoostSales';
import AdWallet from '../component/AdWallet';
import OnlineSaleWallet from '../component/OnlineSaleWallet';
import SearchHeader from '../component/SearchHeader';
import CustomerFeedback from '../component/CustomerFeedback';
import Chats from '../component/Chats';
import DownloadQRCode from '../component/DownloadQRCode';
import WhatsAppMessage from '../component/WhatsAppMessage';
import Emails from '../component/Emails';
import ManageDelivery from '../component/ManageDelivery';
import Erp from '../component/Erp';
import CompanyProfile from '../component/CompanyProfile';
import UserProfile from '../component/UserProfile';
import ManageCompanies from '../component/ManageCompanies';
import SalePOS from '../component/SalePOS';
import CreatePurchase from '../component/CreatePurchase';
import Barcode from '../component/Barcode';
import Expenses from '../component/Expenses';
import Reports from '../component/Reports';
import SaleReportScreen from '../component/SaleReportScreen';
import PurchaseReportScreen from '../component/PurchaseReportScreen';
import DayBookScreen from '../component/DayBookScreen';
import ProfitLossScreen from '../component/ProfitLossScreen';
import AllTransactionsScreen from '../component/AllTransactionsScreen';
import PartyStatementScreen from '../component/PartyStatementScreen';
import StockSummaryScreen from '../component/StockSummaryScreen';
import StockDetailScreen from '../component/StockDetailScreen';
import GSTR1Screen from '../component/GSTR1Screen';
import ExpenseTransactionScreen from '../component/ExpenseTransactionScreen';
import CashInHand from '../component/CashInHand';
import BankAccounts from '../component/BankAccounts';
import ManageCustomers from '../component/ManageCustomers';
import ManageVendors from '../component/ManageVendors';
import ManageRoles from '../component/ManageRoles';
import RecycleBinScreen from '../component/RecycleBinScreen';
import CloseYearScreen from '../component/CloseYearScreen';
import SettingsScreen from '../component/SettingsScreen';
import PreferencesScreen from '../component/PreferencesScreen';
import Sales from '../component/Sales';
import Purchase from '../component/Purchase';
import DiscountSettings from '../component/DiscountSettings';
import TaxesAndGST from '../component/TaxesAndGST ';
import InvoiceSettings from '../component/InvoiceSettings';
import InvoiceTemplates from '../component/InvoiceTemplates';
import RemindersScreen from '../component/RemindersScreen';
import RateUsScreen from '../component/RateUsScreen';
import PrivacyPolicyScreen from '../component/PrivacyPolicyScreen';
import DeleteAccountScreen from '../component/DeleteAccountScreen';
import ResetDataScreen from '../component/ResetDataScreen';
import CreateInvoice from '../component/CreateInvoice';
import CreateCreditNote from '../component/CreateCreditNote';
import CreateQuation from '../component/CreateQuation';
import CreateproFarmaInvoice from '../component/CreateproFarmaInvoice';
import DeliveryChallan from '../component/DeliveryChallan';
import SplashScreen from '../component/SplashScreen';
import { HomeNavigation } from '../constants/app-routes.constants';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { THomeNavigation } from '../type';
import WelcomeScreen from '../component/WelcomeScreen';
import AdminProfile from '../component/AdminProfile';
import ProductSetting from '../component/ProductSetting';
import StoreWorkingHours from '../component/StoreWorkingHours';
import CouponsScreen from '../component/CouponsScreen';
import ExpensesScreen from '../component/ExpensesScreen';
import CreateCouponScreen from '../component/CreateCouponScreen';
import AddPostScreen from '../component/AddPostScreen';
import BuyersRequestScreen from '../component/BuyersRequestScreen';
import CreateRequestScreen from '../component/CreateRequestScreen';
import CreateOffer from '../component/CreateOffer';
import BannerAds from '../component/BannerAds';
import AddBannerScreen from '../component/AddBannerScreen';
import AddSpotlightScreen from '../component/AddSpotlightScreen';
import SelectSpotlightProduct from '../component/SelectSpotlightProduct';


const Stack = createNativeStackNavigator<THomeNavigation>();


const AppNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={HomeNavigation.SPLASH_SCREEN} screenOptions={{ headerShown: false }}>
                <Stack.Screen name={HomeNavigation.SPLASH_SCREEN} component={SplashScreen} />
                <Stack.Screen name={HomeNavigation.WELCOME_SCREEN} component={WelcomeScreen} />
                <Stack.Screen name={HomeNavigation.SIGNUP_SCREEN} component={SignupScreen} />
                <Stack.Screen name={HomeNavigation.OTP_SCREEN} component={OtpScreen} />
                <Stack.Screen name={HomeNavigation.SIGNUP_DETAIL_SCREEN} component={SignupDetailScreen} />
                <Stack.Screen name={HomeNavigation.SELECT_LOCATION_SCREEN} component={SelectLocationScreen} />
                <Stack.Screen name={HomeNavigation.STATISTICS} component={Statistics} />
                <Stack.Screen name={HomeNavigation.STATISTICS_SCREEN} component={StatisticsScreen} />
                <Stack.Screen name={HomeNavigation.BOTTOM_NAVIGATION} component={Bottomnavigation} />
                <Stack.Screen name={HomeNavigation.DRAFT_SCREEN} component={DraftScreen} />
                <Stack.Screen name={HomeNavigation.ORDERS} component={Orders} />
                <Stack.Screen name={HomeNavigation.STOCK_SCREEN} component={StockScreen} />
                <Stack.Screen name={HomeNavigation.CREATE_PRODUCT} component={CreateProduct} />
                <Stack.Screen name={HomeNavigation.ADD_PRODUCT_SCREEN} component={AddProductScreen} />
                <Stack.Screen name={HomeNavigation.STORE_SCREEN} component={Storescreen} />
                <Stack.Screen name={HomeNavigation.MARKETING_TOOLS} component={MarketingTools} />
                <Stack.Screen name={HomeNavigation.ONLINE_STORE} component={OnlineStore} />
                <Stack.Screen name={HomeNavigation.AD_WALLET} component={AdWallet} />
                <Stack.Screen name={HomeNavigation.BOOST_SALES} component={BoostSales} />
                <Stack.Screen name={HomeNavigation.ONLINE_SALE_WALLET} component={OnlineSaleWallet} />
                <Stack.Screen name={HomeNavigation.SEARCH_HEADER} component={SearchHeader} />
                <Stack.Screen name={HomeNavigation.CUSTOMER_FEEDBACK} component={CustomerFeedback} />
                <Stack.Screen name={HomeNavigation.CHATS} component={Chats} />
                <Stack.Screen name={HomeNavigation.DOWNLOAD_QR_CODE} component={DownloadQRCode} />
                <Stack.Screen name={HomeNavigation.WHATSAPP_MESSAGE} component={WhatsAppMessage} />
                <Stack.Screen name={HomeNavigation.EMAILS} component={Emails} />
                <Stack.Screen name={HomeNavigation.MANAGE_DELIVERY} component={ManageDelivery} />
                <Stack.Screen name={HomeNavigation.ERP} component={Erp} />
                <Stack.Screen name={HomeNavigation.COMPANY_PROFILE} component={CompanyProfile} />
                <Stack.Screen name={HomeNavigation.USER_PROFILE} component={UserProfile} />
                <Stack.Screen name={HomeNavigation.MANAGE_COMPANIES} component={ManageCompanies} />
                <Stack.Screen name={HomeNavigation.SALE_POS} component={SalePOS} />
                <Stack.Screen name={HomeNavigation.CREATE_PURCHASE} component={CreatePurchase} />
                <Stack.Screen name={HomeNavigation.BARCODE} component={Barcode} />
                <Stack.Screen name={HomeNavigation.EXPENSES} component={Expenses} />
                <Stack.Screen name={HomeNavigation.REPORTS} component={Reports} />
                <Stack.Screen name={HomeNavigation.SALE_REPORT_SCREEN} component={SaleReportScreen} />
                <Stack.Screen name={HomeNavigation.PURCHASE_REPORT_SCREEN} component={PurchaseReportScreen} />
                <Stack.Screen name={HomeNavigation.DAY_BOOK_SCREEN} component={DayBookScreen} />
                <Stack.Screen name={HomeNavigation.PROFIT_LOSS_SCREEN} component={ProfitLossScreen} />

                <Stack.Screen name={HomeNavigation.ALL_TRANSACTIONS_SCREEN} component={AllTransactionsScreen} />
                <Stack.Screen name={HomeNavigation.PARTY_STATEMENT_SCREEN} component={PartyStatementScreen} />
                <Stack.Screen name={HomeNavigation.STOCK_SUMMARY_SCREEN} component={StockSummaryScreen} />
                <Stack.Screen name={HomeNavigation.STOCK_DETAIL_SCREEN} component={StockDetailScreen} />
                <Stack.Screen name={HomeNavigation.GSTR1_SCREEN} component={GSTR1Screen} />
                <Stack.Screen name={HomeNavigation.EXPENSE_TRANSACTION_SCREEN} component={ExpenseTransactionScreen} />
                <Stack.Screen name={HomeNavigation.CASH_IN_HAND} component={CashInHand} />
                <Stack.Screen name={HomeNavigation.BANK_ACCOUNTS} component={BankAccounts} />
                <Stack.Screen name={HomeNavigation.MANAGE_CUSTOMERS} component={ManageCustomers} />
                <Stack.Screen name={HomeNavigation.MANAGE_VENDORS} component={ManageVendors} />
                <Stack.Screen name={HomeNavigation.MANAGE_ROLES} component={ManageRoles} />
                <Stack.Screen name={HomeNavigation.RECYCLE_BIN_SCREEN} component={RecycleBinScreen} />
                <Stack.Screen name={HomeNavigation.CLOSE_YEAR_SCREEN} component={CloseYearScreen} />
                <Stack.Screen name={HomeNavigation.SETTINGS_SCREEN} component={SettingsScreen} />
                <Stack.Screen name={HomeNavigation.PREFERENCES_SCREEN} component={PreferencesScreen} />
                <Stack.Screen name={HomeNavigation.SALES} component={Sales} />
                <Stack.Screen name={HomeNavigation.PURCHASE} component={Purchase} />
                <Stack.Screen name={HomeNavigation.DISCOUNT_SETTINGS} component={DiscountSettings} />
                <Stack.Screen name={HomeNavigation.TAXES_AND_GST} component={TaxesAndGST} />
                <Stack.Screen name={HomeNavigation.INVOICE_SETTINGS} component={InvoiceSettings} />
                <Stack.Screen name={HomeNavigation.INVOICE_TEMPLATES} component={InvoiceTemplates} />
                <Stack.Screen name={HomeNavigation.REMINDERS_SCREEN} component={RemindersScreen} />
                <Stack.Screen name={HomeNavigation.RATE_US_SCREEN} component={RateUsScreen} />
                <Stack.Screen name={HomeNavigation.PRIVACY_POLICY_SCREEN} component={PrivacyPolicyScreen} />
                <Stack.Screen name={HomeNavigation.DELETE_ACCOUNT_SCREEN} component={DeleteAccountScreen} />
                <Stack.Screen name={HomeNavigation.RESET_DATA_SCREEN} component={ResetDataScreen} />
                <Stack.Screen name={HomeNavigation.CREATE_INVOICE} component={CreateInvoice} />
                <Stack.Screen name={HomeNavigation.CREATE_CREDIT_NOTE} component={CreateCreditNote} />
                <Stack.Screen name={HomeNavigation.CREATE_QUATION} component={CreateQuation} />
                <Stack.Screen name={HomeNavigation.CREATE_PRO_FARMA_INVOICE} component={CreateproFarmaInvoice} />
                <Stack.Screen name={HomeNavigation.DELIVERY_CHALLAN} component={DeliveryChallan} />
                <Stack.Screen name={HomeNavigation.ADMINPROFILE} component={AdminProfile} />
                <Stack.Screen name={HomeNavigation.PRODUCTSETTING} component={ProductSetting} />
                <Stack.Screen name={HomeNavigation.STOREWORKING_HOURS} component={StoreWorkingHours} />
                <Stack.Screen name={HomeNavigation.COUPONS_SCREEN} component={CouponsScreen} />
                <Stack.Screen name={HomeNavigation.EXPENESES_SCREEN} component={ExpensesScreen} />
                <Stack.Screen name={HomeNavigation.CREATECOUPON} component={CreateCouponScreen} />
                <Stack.Screen name={HomeNavigation.ADD_POST_SCREEN} component={AddPostScreen} />
                <Stack.Screen name={HomeNavigation.BUYERSREQUEST} component={BuyersRequestScreen} />
                <Stack.Screen name={HomeNavigation.CREATEREQUEST} component={CreateRequestScreen} />
                <Stack.Screen name={HomeNavigation.CREATEOFFER} component={CreateOffer} />
                <Stack.Screen name={HomeNavigation.BANNER_ADS} component={BannerAds} />
                 <Stack.Screen name={HomeNavigation.ADD_BANNER_SCREEN} component={AddBannerScreen} />

                <Stack.Screen name={HomeNavigation.ADDSPOTLIGHT} component={AddSpotlightScreen} />
                <Stack.Screen name={HomeNavigation.SELECTSPOTLIGHTPRODUCT} component={SelectSpotlightProduct} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
export default AppNavigation;
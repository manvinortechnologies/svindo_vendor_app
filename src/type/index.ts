import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeNavigation } from "../constants/app-routes.constants";

export type THomeNavigation = {
  [HomeNavigation.SPLASH_SCREEN]: undefined;
  [HomeNavigation.WELCOME_SCREEN]: undefined;
  [HomeNavigation.SIGNUP_SCREEN]: { authType: string };
  [HomeNavigation.OTP_SCREEN]: {
    confirmAuth?: any;
    phoneNumber?: string;
    authType: string;
  };
  [HomeNavigation.SIGNUP_DETAIL_SCREEN]: undefined;
  [HomeNavigation.SELECT_LOCATION_SCREEN]: undefined;
  [HomeNavigation.STATISTICS]: undefined;
  [HomeNavigation.STATISTICS_SCREEN]: undefined;
  [HomeNavigation.NOTIFICATION_SCREEN]: undefined;
  [HomeNavigation.MODEL_REMINDER_SCREEN]: undefined;
  [HomeNavigation.BOTTOM_NAVIGATION]: undefined;
  [HomeNavigation.DRAFT_SCREEN]: undefined;
  [HomeNavigation.ORDERS]: undefined;
  [HomeNavigation.ORDERPRODUCTDETAILS]: undefined;
  [HomeNavigation.PRODUCTDETAILS]: undefined;
  [HomeNavigation.STOCK_SCREEN]: undefined;
  [HomeNavigation.VARIANTS_SCREEN]: undefined;
  [HomeNavigation.CREATE_PRODUCT]: undefined;
  [HomeNavigation.ADD_PRODUCT_SCREEN]: undefined;
  [HomeNavigation.STORE_SCREEN]: undefined;
  [HomeNavigation.MARKETING_TOOLS]: undefined;
  [HomeNavigation.ONLINE_STORE]: undefined;
  [HomeNavigation.AD_WALLET]: undefined;
  [HomeNavigation.BOOST_SALES]: undefined;
  [HomeNavigation.ONLINE_SALE_WALLET]: undefined;
  [HomeNavigation.SEARCH_HEADER]: undefined;
  [HomeNavigation.CUSTOMER_FEEDBACK]: undefined;
  [HomeNavigation.CHATS]: undefined;
  [HomeNavigation.DOWNLOAD_QR_CODE]: undefined;
  [HomeNavigation.WHATSAPP_MESSAGE]: undefined;
  [HomeNavigation.SMS_SCREEN]: undefined;
  [HomeNavigation.EMAILS]: undefined;
  [HomeNavigation.MANAGE_DELIVERY]: undefined;
  [HomeNavigation.ERP]: undefined;
  [HomeNavigation.WHOLESALE]: undefined;
  [HomeNavigation.BILLDETAILS]: undefined;
  [HomeNavigation.COMPANY_PROFILE]: undefined;
  [HomeNavigation.USER_PROFILE]: undefined;
  [HomeNavigation.MANAGE_COMPANIES]: undefined;
  [HomeNavigation.POSSCREEN]: undefined;
  [HomeNavigation.SALE_POS]: undefined;
  [HomeNavigation.CREATE_PURCHASE]: undefined;
  [HomeNavigation.BARCODE]: undefined;
  [HomeNavigation.EXPENSES]: undefined;
  [HomeNavigation.REPORTS]: undefined;
  [HomeNavigation.SALE_REPORT_SCREEN]: undefined;
  [HomeNavigation.PURCHASE_REPORT_SCREEN]: undefined;
  [HomeNavigation.DAY_BOOK_SCREEN]: undefined;
  [HomeNavigation.PROFIT_LOSS_SCREEN]: undefined;
  [HomeNavigation.ALL_TRANSACTIONS_SCREEN]: undefined;
  [HomeNavigation.PARTY_STATEMENT_SCREEN]: undefined;
  [HomeNavigation.STOCK_SUMMARY_SCREEN]: undefined;
  [HomeNavigation.STOCK_DETAIL_SCREEN]: undefined;
  [HomeNavigation.GSTR1_SCREEN]: undefined;
  [HomeNavigation.EXPENSE_TRANSACTION_SCREEN]: undefined;
  [HomeNavigation.CASH_IN_HAND]: undefined;
  [HomeNavigation.BANK_ACCOUNTS]: undefined;
  [HomeNavigation.BANK_NAME]: undefined;
  [HomeNavigation.MANAGE_CUSTOMERS]: undefined;
  [HomeNavigation.CUSTOMER_LEDGER]: undefined;
  [HomeNavigation.SALES_LEDGER]: undefined;
  [HomeNavigation.MANAGE_VENDORS]: undefined;
  [HomeNavigation.VENDOR_LEDGER]: undefined;
  [HomeNavigation.MANAGE_ROLES]: undefined;
  [HomeNavigation.RECYCLE_BIN_SCREEN]: undefined;
  [HomeNavigation.CLOSE_YEAR_SCREEN]: undefined;
  [HomeNavigation.SETTINGS_SCREEN]: undefined;
  [HomeNavigation.PREFERENCES_SCREEN]: undefined;
  [HomeNavigation.SALES]: undefined;
  [HomeNavigation.PURCHASE]: undefined;
  [HomeNavigation.DISCOUNT_SETTINGS]: undefined;
  [HomeNavigation.TAXES_AND_GST]: undefined;
  [HomeNavigation.INVOICE_SETTINGS]: undefined;
  [HomeNavigation.INVOICE_TEMPLATES]: undefined;
  [HomeNavigation.REMINDERS_SCREEN]: undefined;
  [HomeNavigation.REMINDERSETTINGS]: undefined;
  [HomeNavigation.RATE_US_SCREEN]: undefined;
  [HomeNavigation.PRIVACY_POLICY_SCREEN]: undefined;
  [HomeNavigation.DELETE_ACCOUNT_SCREEN]: undefined;
  [HomeNavigation.RESET_DATA_SCREEN]: undefined;
  [HomeNavigation.CREATE_INVOICE]: undefined;
  [HomeNavigation.CREATE_CREDIT_NOTE]: undefined;
  [HomeNavigation.CREATE_QUATION]: undefined;
  [HomeNavigation.CREATE_PRO_FARMA_INVOICE]: undefined;
  [HomeNavigation.DELIVERY_CHALLAN]: undefined;
  [HomeNavigation.ADMINPROFILE]: undefined;
  [HomeNavigation.PRODUCTSETTING]: undefined;
  [HomeNavigation.STOREWORKING_HOURS]: undefined;
  [HomeNavigation.COUPONS_SCREEN]: undefined;
  [HomeNavigation.EXPENESES_SCREEN]: undefined;
  [HomeNavigation.EXPENESES_DETAIL_SCREEN]: undefined;
  [HomeNavigation.CREATECOUPON]: undefined;
  [HomeNavigation.ADD_POST_SCREEN]: undefined;
  [HomeNavigation.BUYERSREQUEST]: undefined;
  [HomeNavigation.CREATEREQUEST]: undefined;
  [HomeNavigation.CREATEOFFER]: undefined;
  [HomeNavigation.BANNER_ADS]: undefined;
  [HomeNavigation.ADD_BANNER_SCREEN]: undefined;
  [HomeNavigation.ADDSPOTLIGHT]: undefined;
  [HomeNavigation.SELECTSPOTLIGHTPRODUCT]: undefined;
  [HomeNavigation.VERIFICATIONPAYMENT]: undefined;
  [HomeNavigation.ADDCUSTOMER]: undefined;
  [HomeNavigation.ADDVENDOR]: undefined;
  [HomeNavigation.DELIVERY_SETTING_SCREEN]: undefined;
  [HomeNavigation.PAYMENTSCREEN]: undefined;
  [HomeNavigation.PAYMENTS_LIST]: undefined;
  [HomeNavigation.MANAGENOTIFICATION]: undefined;
  [HomeNavigation.SENDNOTIFICATION]: undefined;
  [HomeNavigation.PROMOTESTORE]: undefined;
  [HomeNavigation.BOOSTPOSTSPOTLIGHT]: undefined;
  [HomeNavigation.AUTOASSIGNDELIVERY]: undefined;
  [HomeNavigation.ASSIGNOWNDELIVERYBOY]: undefined;
  [HomeNavigation.ADDDELIVERYBOY]: undefined;
  [HomeNavigation.ADD_ADDONS]: undefined;
  [HomeNavigation.ADDON_SUCCESS]: undefined;
  [HomeNavigation.SELECT_ADDONS]: undefined;
  [HomeNavigation.PRODUCT_ADDED_SUCCESS]: undefined;
  [HomeNavigation.CREATE_ADDONS]: undefined;
  [HomeNavigation.SCAN_BARCODE]: undefined;
  [HomeNavigation.PRODUCT_SELECTION]: undefined;
  [HomeNavigation.TRANSACTION_MESSAGES]: undefined;
  [HomeNavigation.SUPPORT]: undefined;
  [HomeNavigation.CHAT_SCREEN]: undefined;
  [HomeNavigation.REQUESTOFFERS]: { requestId?: string };
};

// export type TTabNavigation = {
//   [HomeNavigation.HOME]: undefined;
//   [HomeNavigation.REPORT]: undefined;
//   [HomeNavigation.ATTENDANCE]: undefined;
//   [HomeNavigation.SETTINGS]: undefined;
//   [HomeNavigation.SALES_ORDER]: undefined;
//   [HomeNavigation.TAB_NAVIGATION]: { checkInTimeAvailable: any };

// };

// export type TVisitNavigation = {
//   [HomeNavigation.NEW_VISIT]: undefined;
//   [HomeNavigation.NEW_VISIT_ACTIVITY]: { customerData: any };

// };
// export type TDrawerNavigation = {
//   [HomeNavigation.BOTTOM_TAB]: undefined;
//   [HomeNavigation.CLAIM]: undefined;
//   [HomeNavigation.PRODUCTION]: undefined;
//   [HomeNavigation.NEW_VISIT]: undefined;
//   [HomeNavigation.NEW_VISIT_NAVIGATION]: undefined;
//   [HomeNavigation.VIEW_VISIT]: undefined;
//   [HomeNavigation.VISIT_PLAN]: undefined;
//   [HomeNavigation.NEW_ORDER]: undefined;
//   [HomeNavigation.VIEW_ORDER]: undefined;
//   [HomeNavigation.NEW_PAYMENT]: undefined;
//   [HomeNavigation.VIEW_PAYMENT]: undefined;
//   [HomeNavigation.NEW_CUSTOMER]: undefined;
//   [HomeNavigation.VIEW_CUSTOMER]: { customerId?: string };
//   [HomeNavigation.CALALOGUE]: undefined;
//   [HomeNavigation.PRODUCT_LIST]: undefined;
//   [HomeNavigation.MY_ATTENDANCE]: undefined;
//   [HomeNavigation.REMINDER]: undefined;
//   [HomeNavigation.LEAVE_APPLICATION]: undefined;
//   [HomeNavigation.PROFILE]: undefined;
//   [HomeNavigation.CHANGE_PASSWORD]: undefined;
//   [HomeNavigation.ABOUT]: undefined;
//   [HomeNavigation.LOGOUT]: undefined;
//   [HomeNavigation.SALES_ORDER_VIEW]: {
//     salesOrderData?(salesOrderData: {
//       selectedProduct: ProductWithDetails[];
//       transpotType: string | number;
//       date: string;
//     }): void;
//     selectSalesOrder?: {
//       selectedProduct: ProductWithDetails[];
//       transpotType: string | number;
//       date: string;
//     };
//   };

//   [HomeNavigation.LOGOUT]: undefined;
//   [HomeNavigation.NEW_VISIT_ACTIVITY]: { customerData: any };
//   [HomeNavigation.VISIT_HISTORY_VIEW]: { customerData: any };
// };

// export type THomeStackParamsList = {
//   [HomeNavigation.REPORT]: undefined;
// };

export type SplashScreenProps = NativeStackScreenProps<
  THomeNavigation,
  HomeNavigation.SPLASH_SCREEN
>;
export type WelcomeScreenProps = NativeStackScreenProps<
  THomeNavigation,
  HomeNavigation.WELCOME_SCREEN
>;
export type SignUpScreenProps = NativeStackScreenProps<
  THomeNavigation,
  HomeNavigation.SIGNUP_SCREEN
>;
export type OtpScreenProps = NativeStackScreenProps<
  THomeNavigation,
  HomeNavigation.OTP_SCREEN
>;
export type SignUpDetailScreenProps = NativeStackScreenProps<
  THomeNavigation,
  HomeNavigation.SIGNUP_DETAIL_SCREEN
>;
export type SelectLocationScreenProps = NativeStackScreenProps<
  THomeNavigation,
  HomeNavigation.SELECT_LOCATION_SCREEN
>;
export type StatisticsScreenProps = NativeStackScreenProps<
  THomeNavigation,
  HomeNavigation.STATISTICS_SCREEN
>;
export type BottomNavigationProps = NativeStackScreenProps<
  THomeNavigation,
  HomeNavigation.BOTTOM_NAVIGATION
>;
export type DraftScreenProps = NativeStackScreenProps<
  THomeNavigation,
  HomeNavigation.DRAFT_SCREEN
>;
export type OrdersScreenProps = NativeStackScreenProps<
  THomeNavigation,
  HomeNavigation.ORDERS
>;
export type StockScreenProps = NativeStackScreenProps<
  THomeNavigation,
  HomeNavigation.STOCK_SCREEN
>;

// Keep repeating like this for each screen...

export type CreateProductScreenProps = NativeStackScreenProps<
  THomeNavigation,
  HomeNavigation.CREATE_PRODUCT
>;
// etc...

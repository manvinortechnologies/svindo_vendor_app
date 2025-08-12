export const API_ROUTES = {
  langCodes: "https://devapi.hindustanvyapar.com/api/getSupportedLangs",
  // langCodes: '/lang-codes',
  // langStrings: 'https://devapi.hindustanvyapar.com/api/getLanguageLabels/en',
  langStrings: "/lang-strings",
  hsnCodes: "/hsn-codes",
  units: "/units",

  GET_NEW_ACCESS_TOKEN: "/getNewAccessToken",

  GET_OTP: "/getOTP",
  LOGIN: "/login",
  RE_LOGIN: "/relogin",
  CANCEL_RE_LOGIN: "/cancelrelogin",
  LOGOUT: "/logout",
  GET_LOGGEDIN_USER: "/getLoggedInUser",
  SAVE_DEVICE_TOKEN: "/saveUserDeviceToken",
  SAVE_USER_LOCATION: "/saveUserLocation",
  GET_USER_LIVE_LOCATION: "/getLiveLocation",
  GET_LOCATION_AND_USERS: "/getLocationsAndUsers",
  GET_ATTENDANCE_DETAILS: "/getUserAttendanceDetail",
  GET_ATTENDANCE_HISTORY: "/getUserAttendanceHistory",
  user: "/user",
  userProfile: "users/profile/me/",
  usersList: "/user/user-list",
  usersLocation: "/user/location",
  jwtRefresh: "/refresh-token",
  UPATE_CURRENT_PROFILE: "/updateCurrentProfile",

  product: "/products",
  productBaseData: "/products/base-data",
  updateProductSetting: "/vendor/productsetting/update/",

  vendor: "/vendors",
  vendorBaseData: "/vendors/base-data",
  vendorList: "/vendor/vendor/",
  companyProfle: "/vendor/company-profile/",
  vendorCustomer: "/vendor/customer/",

  customer: "/customers",
  customerBaseData: "/customers/base-data",

  storeOnlineSetting: "/vendor/onlineStoreSetting/",
  storeWorkingHour: "vendor/store-working-hour/",
  storeWorkingHourBulk: "vendor/store-working-hour/",

  GET_VENDOR_LIST: "/getAllVendors",
};

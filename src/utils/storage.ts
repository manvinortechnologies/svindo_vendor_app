import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();

// Storage keys constants
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  SIGNUP_STATUS: "signUp",
  ADMIN_PROFILE: "adminProfile",
  USER_DATA: "userData",
  BUSINESS_PROFILE: "businessProfile",
  LOCATION_DATA: "locationData",
  IS_LOGGED_IN: "isLoggedIn",
  ONBOARDING_COMPLETED: "onboardingCompleted",
  FCM_TOKEN: "fcmToken",
  COMPANY_PROFILE: "companyProfile",
} as const;

// Storage utility functions
export const StorageUtils = {
  // Set methods
  setAccessToken: (token: string) =>
    storage.set(STORAGE_KEYS.ACCESS_TOKEN, token),
  setRefreshToken: (token: string) =>
    storage.set(STORAGE_KEYS.REFRESH_TOKEN, token),
  setSignupStatus: (status: string) =>
    storage.set(STORAGE_KEYS.SIGNUP_STATUS, status),
  setAdminProfile: (profile: string) =>
    storage.set(STORAGE_KEYS.ADMIN_PROFILE, profile),
  setUserData: (data: any) =>
    storage.set(STORAGE_KEYS.USER_DATA, JSON.stringify(data)),
  setBusinessProfile: (profile: any) =>
    storage.set(STORAGE_KEYS.BUSINESS_PROFILE, JSON.stringify(profile)),
  setLocationData: (location: any) =>
    storage.set(STORAGE_KEYS.LOCATION_DATA, JSON.stringify(location)),
  setIsLoggedIn: (status: boolean) =>
    storage.set(STORAGE_KEYS.IS_LOGGED_IN, status),
  setOnboardingCompleted: (completed: boolean) =>
    storage.set(STORAGE_KEYS.ONBOARDING_COMPLETED, completed),
  setCompanyProfile: (profile: any) =>
    storage.set(STORAGE_KEYS.COMPANY_PROFILE, JSON.stringify(profile)),

  // Get methods
  getAccessToken: () => storage.getString(STORAGE_KEYS.ACCESS_TOKEN),
  getRefreshToken: () => storage.getString(STORAGE_KEYS.REFRESH_TOKEN),
  getSignupStatus: () => storage.getString(STORAGE_KEYS.SIGNUP_STATUS),
  getAdminProfile: () => storage.getString(STORAGE_KEYS.ADMIN_PROFILE),
  getUserData: () => {
    const data = storage.getString(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },
  getBusinessProfile: () => {
    const profile = storage.getString(STORAGE_KEYS.BUSINESS_PROFILE);
    return profile ? JSON.parse(profile) : null;
  },
  getLocationData: () => {
    const location = storage.getString(STORAGE_KEYS.LOCATION_DATA);
    return location ? JSON.parse(location) : null;
  },
  getIsLoggedIn: () => storage.getBoolean(STORAGE_KEYS.IS_LOGGED_IN) || false,
  getOnboardingCompleted: () =>
    storage.getBoolean(STORAGE_KEYS.ONBOARDING_COMPLETED) || false,
  getCompanyProfile: () => {
    const profile = storage.getString(STORAGE_KEYS.COMPANY_PROFILE);
    return profile ? JSON.parse(profile) : null;
  },

  // Remove methods
  removeAccessToken: () => storage.delete(STORAGE_KEYS.ACCESS_TOKEN),
  removeRefreshToken: () => storage.delete(STORAGE_KEYS.REFRESH_TOKEN),
  removeSignupStatus: () => storage.delete(STORAGE_KEYS.SIGNUP_STATUS),
  removeAdminProfile: () => storage.delete(STORAGE_KEYS.ADMIN_PROFILE),
  removeUserData: () => storage.delete(STORAGE_KEYS.USER_DATA),
  removeBusinessProfile: () => storage.delete(STORAGE_KEYS.BUSINESS_PROFILE),
  removeLocationData: () => storage.delete(STORAGE_KEYS.LOCATION_DATA),
  removeIsLoggedIn: () => storage.delete(STORAGE_KEYS.IS_LOGGED_IN),
  removeOnboardingCompleted: () =>
    storage.delete(STORAGE_KEYS.ONBOARDING_COMPLETED),
  removeCompanyProfile: () => storage.delete(STORAGE_KEYS.COMPANY_PROFILE),

  // Clear all
  clearAll: () => storage.clearAll(),

  // Check authentication status
  isAuthenticated: () => {
    const token = storage.getString(STORAGE_KEYS.ACCESS_TOKEN);
    const isLoggedIn = storage.getBoolean(STORAGE_KEYS.IS_LOGGED_IN) || false;
    return !!(token && isLoggedIn);
  },

  // Check if user has completed signup
  hasCompletedSignup: () => {
    const signupStatus = storage.getString(STORAGE_KEYS.SIGNUP_STATUS);
    return signupStatus === "SIGNUP";
  },

  // Check if admin profile is completed
  hasCompletedAdminProfile: () => {
    const adminProfile = storage.getString(STORAGE_KEYS.ADMIN_PROFILE);
    return adminProfile === "ADMIN_PROFILE";
  },

  // Check if business profile is completed
  hasCompletedBusinessProfile: () => {
    const businessProfile = storage.getString(STORAGE_KEYS.BUSINESS_PROFILE);
    return !!businessProfile;
  },

  // Check if location is set
  hasLocationData: () => {
    const locationData = storage.getString(STORAGE_KEYS.LOCATION_DATA);
    return !!locationData;
  },

  // FCM Token methods
  setFCMToken: (token: string) => storage.set(STORAGE_KEYS.FCM_TOKEN, token),
  getFCMToken: () => storage.getString(STORAGE_KEYS.FCM_TOKEN),
  removeFCMToken: () => storage.delete(STORAGE_KEYS.FCM_TOKEN),

  // Company Profile methods
  hasCompanyProfile: () => {
    const profile = storage.getString(STORAGE_KEYS.COMPANY_PROFILE);
    return !!profile;
  },
};

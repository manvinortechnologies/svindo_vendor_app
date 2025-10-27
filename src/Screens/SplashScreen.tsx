import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SplashScreenProps } from "../type";
import { HomeNavigation } from "../constants/app-routes.constants";
import { StorageUtils } from "../utils/storage";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import { ScaledSheet } from "react-native-size-matters";

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Check if company profile exists
  const checkCompanyProfile = async (): Promise<boolean> => {
    try {
      const response = await api.get(API_ROUTES.companyProfle);
      return response.data && response.data.length > 0;
    } catch (error) {
      console.error("Error checking company profile:", error);
      throw error;
    }
  };

  // Check if admin profile is created
  const checkAdminProfile = async (): Promise<boolean> => {
    try {
      const response = await api.get(API_ROUTES.userProfile);
      return response.data;
    } catch (error) {
      console.error("Error checking admin profile:", error);
      throw false;
    }
  };

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        setIsLoading(true);

        // Get authentication and profile status
        const isAuthenticated = StorageUtils.isAuthenticated();
        const hasCompletedSignup = StorageUtils.hasCompletedSignup();
        const hasLocationData = StorageUtils.hasLocationData();

        // Check admin profile and company profile via API (only if authenticated)
        let hasCompletedAdminProfile = false;
        let hasCompanyProfile = false;
        if (isAuthenticated) {
          hasCompletedAdminProfile = await checkAdminProfile();
          hasCompanyProfile = await checkCompanyProfile();
        }

        // Determine navigation based on user state
        let targetScreen = HomeNavigation.WELCOME_SCREEN;

        if (isAuthenticated) {
          if (hasCompletedAdminProfile) {
            if (hasCompanyProfile) {
              // User is fully set up - go to main app
              targetScreen = HomeNavigation.BOTTOM_NAVIGATION;
            } else {
              // User needs to complete business profile
              targetScreen = HomeNavigation.SIGNUP_DETAIL_SCREEN;
            }
          } else {
            // User needs to complete admin profile
            targetScreen = HomeNavigation.ADMINPROFILE;
          }
        } else {
          // User is not authenticated - go to welcome screen
          targetScreen = HomeNavigation.WELCOME_SCREEN;
        }

        // Add a small delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Navigate to determined screen
        navigation.reset({
          index: 0,
          routes: [{ name: targetScreen }],
        });
      } catch (error) {
        console.error("Failed to check authentication status:", error);
        // On error, go to welcome screen
        navigation.reset({
          index: 0,
          routes: [{ name: HomeNavigation.WELCOME_SCREEN }],
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndNavigate();
  }, [navigation]);

  return (
    <LinearGradient colors={["#F9C313", "#FCA511"]} style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.logoTitle}>Svindo</Text>
      <Text style={styles.logoTitle}>Business</Text>
      <Text style={styles.logoText}>Window to Real Growth</Text>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "150@s",
    height: "150@s",
    resizeMode: "contain",
  },
  logoTitle: {
    fontSize: "58@s",
    color: "white",
    fontWeight: "bold",
    lineHeight: "60@s",
    letterSpacing: 2,
  },
  logoText: {
    fontSize: "20@s",
    color: "white",
    marginTop: "6@s",
  },
  loadingContainer: {
    position: "absolute",
    bottom: "50@s",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    fontSize: "14@s",
    marginTop: "6@s",
    fontWeight: "500",
  },
});

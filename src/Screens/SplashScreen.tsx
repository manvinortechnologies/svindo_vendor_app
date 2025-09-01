import React, { useEffect } from "react";
import { StyleSheet, Text, View, StatusBar, Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SplashScreenProps } from "../type";
import { HomeNavigation } from "../constants/app-routes.constants";
import { storage } from "../utils/storage";

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const idToken = storage.getString("accessToken");
        const signUp = storage.getString("signUp");
        console.log(idToken, signUp, "token");
        if (idToken && signUp) {
          navigation.reset({
            index: 0,
            routes: [{ name: HomeNavigation.ADMINPROFILE }],
          });
        } else if (idToken && !signUp) {
          navigation.reset({
            index: 0,
            routes: [{ name: HomeNavigation.STATISTICS_SCREEN }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: HomeNavigation.WELCOME_SCREEN }],
          });
        }
      } catch (error) {
        console.error("Failed to fetch idToken:", error);
        navigation.reset({
          index: 0,
          routes: [{ name: HomeNavigation.WELCOME_SCREEN }],
        });
      }
    };

    const timer = setTimeout(checkAuth, 2000);
    return () => clearTimeout(timer);
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
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 160,
    height: 140,
    resizeMode: "contain",
    marginBottom: 20,
  },
  logoTitle: {
    fontSize: 64,
    color: "white",
    fontWeight: "bold",

    letterSpacing: 2,
  },
  logoText: {
    fontSize: 18,
    color: "white",
    marginTop: 8,
  },
});

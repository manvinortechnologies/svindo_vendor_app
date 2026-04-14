import React, { FC, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { THomeNavigation, WelcomeScreenProps } from "../type";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeNavigation } from "../constants/app-routes.constants";

const WelcomeScreen: FC<WelcomeScreenProps> = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<THomeNavigation>>();

  // const requestSmsPermission = async () => {
  //   if (Platform.OS === "android") {
  //     try {
  //       const granted = await PermissionsAndroid.requestMultiple([
  //         PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
  //         PermissionsAndroid.PERMISSIONS.READ_SMS,
  //       ]);
  //       // console.log('SMS permissions:', granted);
  //       if (
  //         granted["android.permission.RECEIVE_SMS"] ===
  //           PermissionsAndroid.RESULTS.GRANTED &&
  //         granted["android.permission.READ_SMS"] ===
  //           PermissionsAndroid.RESULTS.GRANTED
  //       ) {
  //         // console.log('SMS permissions granted');
  //       } else {
  //         // console.log('SMS permissions denied');
  //       }
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   requestSmsPermission();
  // }, []);

  return (
    <View style={styles.container}>
      {/* Logo & Title */}
      <LinearGradient colors={["#F9C313", "#FCA511"]} style={styles.header}>
        <Image
          source={require("../assets/logo.png")} // Replace with your logo
          style={styles.logo}
        />
        <Text style={styles.title}> Svindo</Text>
        <Text style={styles.title}>Business</Text>
        <Text style={styles.subtitle}>Window to Real Growth</Text>
      </LinearGradient>

      {/* Content Wrapper - Input & Button Centered */}
      <View style={styles.contentWrapper}>
        <TouchableOpacity
          style={styles.continueButtonWrapper}
          onPress={() =>
            navigation.navigate(HomeNavigation.SIGNUP_SCREEN, {
              authType: "login",
            })
          }
        >
          <LinearGradient
            colors={["#F9C313", "#FCA511"]}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.continueButtonWrapper}
          onPress={() =>
            navigation.navigate(HomeNavigation.SIGNUP_SCREEN, {
              authType: "signup",
            })
          }
        >
          <LinearGradient
            colors={["#F9C313", "#FCA511"]}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueText}>Signup</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Terms & Privacy - Pinned to Bottom */}
      <View style={styles.footer}>
        <Text style={styles.termsText}>
          By continuing, you agree to our {"\n"}
          <Text
            onPress={() => navigation.navigate(HomeNavigation.TERMS_SCREEN)}
            style={styles.linkText}
          >
            Terms of Service
          </Text>{" "}
          and{" "}
          <Text
            onPress={() =>
              navigation.navigate(HomeNavigation.PRIVACY_POLICY_SCREEN)
            }
            style={styles.linkText}
          >
            Privacy Policy
          </Text>
          .
        </Text>
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    width: "100%",
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  logo: {
    width: 120,
    height: 140,
    resizeMode: "contain",
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 22,
    color: "#fff",
  },

  continueButtonWrapper: {
    width: "90%",
    borderRadius: 30,
    overflow: "hidden", // Ensures the gradient stays within rounded corners
    alignSelf: "center",
    marginBottom: 20,
  },
  continueButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  continueText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  termsText: {
    fontSize: 12,
    color: "#000",
    textAlign: "center",
    width: "90%",
  },
  linkText: {
    color: "#FCA511",
    textDecorationLine: "underline",
  },

  contentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: -50,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },
});

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { OtpScreenProps, THomeNavigation } from "../type";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeNavigation } from "../constants/app-routes.constants";
import { OtpInput } from "react-native-otp-entry";
import auth from "@react-native-firebase/auth";
import { useLoginMutation } from "../services/api/state-api-slice";
import { DEFAULT_STATUS_CODE_SUCCESS } from "../constants/api-const";
import { storage } from "../utils/storage";
import Loading from "../CommonComponent/Loading";
import Icon from "react-native-vector-icons/Ionicons";

const OtpScreen: React.FC<OtpScreenProps> = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<THomeNavigation>>();
  const route =
    useRoute<RouteProp<THomeNavigation, HomeNavigation.OTP_SCREEN>>();
  const { confirmAuth, phoneNumber, authType } = route?.params;
  const [login] = useLoginMutation();

  const [otp, setOtp] = useState<string>("");

  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string>("");
  const [confirm, setConfirm] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.confirmAuth) {
      setConfirm(route.params.confirmAuth);
    }
  }, [route.params]);

  const handleChange = (text: string) => {
    setOtp(text);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimeLeft(30);
    setIsTimerRunning(true);

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          setIsTimerRunning(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  }, []);

  const resetTimer = () => {
    startTimer();
    handleResendOtp();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const handleConfirmCode = async (otp: string) => {
    setLoading(true);
    if (!confirm) {
      setError("Confirmation failed. Please try again.");
      return;
    }
    try {
      const userCredential = await confirm.confirm(otp);
      const idToken = await userCredential.user.getIdToken();
      console.log(idToken);
      // if (authType === 'login') {
      //   const response = await login({ idToken: idToken, user_type: "vendor" }).unwrap();
      //   if (response.status === DEFAULT_STATUS_CODE_SUCCESS) {
      //     storage.set('accessToken', response.access);
      //     storage.set('refreshToken', response.refresh);
      //   }
      //   navigation.replace(HomeNavigation.STATISTICS_SCREEN);
      // } else {
      const response = await login({
        idToken: idToken,
        user_type: "vendor",
      }).unwrap();
      console.log(response);
      if (response.status === DEFAULT_STATUS_CODE_SUCCESS) {
        storage.set("signUp", "SIGNUP");
        storage.set("accessToken", response.access);
        storage.set("refreshToken", response.refresh);
        if (response.user.created) {
          navigation.replace(HomeNavigation.STATISTICS_SCREEN);
        } else {
          navigation.replace(HomeNavigation.ADMINPROFILE);
        }
      }
      navigation.replace(HomeNavigation.SIGNUP_DETAIL_SCREEN);
      // }
    } catch (error) {
      console.log("error-->", error);

      setError("Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!phoneNumber) {
      setError("Phone number not found.");
      return;
    }

    setError("");
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
      Alert.alert("New verification code sent to your phone.");
    } catch (error: any) {
      setError(error.message);
    }
  };
  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="chevron-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Header with Logo */}
      <LinearGradient colors={["#F9C313", "#FCA511"]} style={styles.header}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Svindo</Text>
        <Text style={styles.title}>Business</Text>
        <Text style={styles.subtitle}>Window to Real Growth</Text>
      </LinearGradient>

      {/* OTP Verification Section */}
      <Text style={styles.otpText}>OTP Verification</Text>

      {/* OTP Input Fields */}
      <View style={styles.otpContainer}>
        <OtpInput
          numberOfDigits={6}
          focusColor="#FCA511"
          focusStickBlinkingDuration={500}
          onTextChange={handleChange}
          onFilled={(otp) => handleConfirmCode(otp)}
          textInputProps={{
            accessibilityLabel: "One-Time Password",
          }}
          theme={{
            containerStyle: styles.otpFieldcontainer,
            pinCodeContainerStyle: styles.pinCodeContainer,
            pinCodeTextStyle: styles.pinCodeText,
            focusStickStyle: styles.focusStick,
          }}
        />
      </View>

      {/* Timer & Resend Option */}
      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      <Text style={styles.resendText}>Didn’t receive it?</Text>

      <TouchableOpacity onPress={resetTimer} style={styles.resendButtonWrapper}>
        <LinearGradient
          colors={["#F9C313", "#FCA511"]}
          style={styles.resendButtonGradient}
          start={{ x: 0, y: 0 }} // Optional - Direction for the gradient
          end={{ x: 1, y: 1 }} // Optional - Diagonal gradient
        >
          <Text style={styles.resendButtonText}>Resend SMS</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Loading visible={loading} />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {/* Terms and Privacy */}
      <View style={styles.footer}>
        <Text style={styles.termsText}>
          By continuing, you agree to our {"\n"}
          <Text style={styles.linkText}>Terms of Service</Text> and{" "}
          <Text style={styles.linkText}>Privacy Policy</Text>.
        </Text>
      </View>
    </View>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: "#FF9800",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    fontSize: 60,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 22,
    color: "#fff",
  },
  tagline: {
    fontSize: 14,
    color: "#fff",
    marginTop: 5,
  },
  otpText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    color: "#1E3462",
  },
  otpContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  otpFieldcontainer: {
    paddingHorizontal: 40,
  },
  pinCodeContainer: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: "#FCA511",
    backgroundColor: "#FFF7DD",
    textAlign: "center",
    marginHorizontal: 5,
    borderRadius: 20,
  },
  pinCodeText: {
    fontSize: 18,
    textAlign: "center",
    color: "#000",
  },
  focusStick: {
    height: 25,
    backgroundColor: "#FCA511",
  },

  timerText: {
    marginTop: 15,
    fontSize: 16,
    color: "#1E3462",
    fontWeight: "600",
  },
  resendText: {
    marginTop: 10,
    fontSize: 14,
    color: "#1E3462",
  },
  resendButtonWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 10,
  },
  resendButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  resendButtonText: {
    color: "#000",
    fontSize: 14,
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
  footer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  loading: {
    marginTop: "15%",
  },
});

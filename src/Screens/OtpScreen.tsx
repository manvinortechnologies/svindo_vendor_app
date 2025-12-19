import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { OtpScreenProps, THomeNavigation } from "../type";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeNavigation } from "../constants/app-routes.constants";
import { OtpInput } from "react-native-otp-entry";
import auth from "@react-native-firebase/auth";
import { useLoginMutation } from "../services/api/state-api-slice";
import {
  DEFAULT_STATUS_CODE_CREATED,
  DEFAULT_STATUS_CODE_SUCCESS,
} from "../constants/api-const";
import { StorageUtils } from "../utils/storage";
import Loading from "../CommonComponent/Loading";
import Icon from "react-native-vector-icons/Ionicons";
import { s, ScaledSheet } from "react-native-size-matters";
import Toast from "react-native-toast-message";
import NotificationService from "../services/notification-service";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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
      if (
        response.status === DEFAULT_STATUS_CODE_SUCCESS ||
        response.status === DEFAULT_STATUS_CODE_CREATED
      ) {
        StorageUtils.setSignupStatus("SIGNUP");
        StorageUtils.setAccessToken(response.access);
        StorageUtils.setRefreshToken(response.refresh);
        StorageUtils.setIsLoggedIn(true);
        await NotificationService.initialize();
        if (response.user.created) {
          navigation.reset({
            index: 0,
            routes: [{ name: HomeNavigation.ADMINPROFILE }],
          });
          return;
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: HomeNavigation.BOTTOM_NAVIGATION }],
          });
          return;
        }
      }
      navigation.reset({
        index: 0,
        routes: [{ name: HomeNavigation.SIGNUP_DETAIL_SCREEN }],
      });
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
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "New verification code sent to your phone.",
      });
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      style={styles.container}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ alignItems: "center" }}
      >
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
              containerStyle: { paddingHorizontal: s(30) },
              pinCodeContainerStyle: {
                width: s(45),
                height: s(45),
                borderWidth: 1,
                borderColor: "#FCA511",
                backgroundColor: "#FFF7DD",
                alignItems: "center",
                justifyContent: "center",
                marginHorizontal: s(3),
                borderRadius: s(16),
              },
              pinCodeTextStyle: {
                fontSize: s(18),
                textAlign: "center",
                color: "#000",
              },
              focusStickStyle: { height: s(25), backgroundColor: "#FCA511" },
            }}
          />
        </View>

        {/* Timer & Resend Option */}
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        <Text style={styles.resendText}>Didn’t receive it?</Text>

        <TouchableOpacity
          onPress={resetTimer}
          style={styles.resendButtonWrapper}
        >
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
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

export default OtpScreen;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: "20@s",
    left: "20@s",
    width: "35@s",
    height: "35@s",
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
    // height: "50%",
    paddingTop: "60@s",
    paddingBottom: "20@s",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  logo: {
    width: "140@s",
    height: "140@s",
    resizeMode: "contain",
  },
  title: {
    fontSize: "60@s",
    fontWeight: "bold",
    color: "#fff",
    lineHeight: "60@s",
  },
  subtitle: {
    fontSize: "22@s",
    color: "#fff",
  },
  tagline: {
    fontSize: "14@s",
    color: "#fff",
    marginTop: 5,
  },
  otpText: {
    fontSize: "16@s",
    fontWeight: "bold",
    marginTop: 20,
    color: "#1E3462",
  },
  otpContainer: {
    flexDirection: "row",
    marginTop: "15@s",
  },
  otpFieldcontainer: {
    paddingHorizontal: "30@s",
  },
  pinCodeContainer: {
    width: "45@s",
    height: "45@s",
    borderWidth: 1,
    borderColor: "#FCA511",
    backgroundColor: "#FFF7DD",
    textAlign: "center",
    marginHorizontal: "3@s",
    borderRadius: "16@s",
  },
  pinCodeText: {
    fontSize: "18@s",
    textAlign: "center",
    color: "#000",
  },
  focusStick: {
    height: "25@s",
    backgroundColor: "#FCA511",
  },

  timerText: {
    marginTop: "15@s",
    fontSize: 16,
    color: "#1E3462",
    fontWeight: "600",
  },
  resendText: {
    marginTop: "10@s",
    fontSize: 14,
    color: "#1E3462",
  },
  resendButtonWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 10,
  },
  resendButtonGradient: {
    paddingHorizontal: "20@s",
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
    // position: "absolute",
    // bottom: 30,
    // width: "100%",
    paddingVertical: "20@s",
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

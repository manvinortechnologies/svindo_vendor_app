import React, { FC, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import { SignUpScreenProps, THomeNavigation } from "../type";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeNavigation } from "../constants/app-routes.constants";
import Loading from "../CommonComponent/Loading";
import Icon from "react-native-vector-icons/Ionicons";
import { s, ScaledSheet, vs } from "react-native-size-matters";
import { MaskedTextInput } from "react-native-mask-text";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const SignupScreen: FC<SignUpScreenProps> = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<THomeNavigation>>();
  const insets = useSafeAreaInsets();

  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [confirm, setConfirm] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (phoneNumber.replace(/\D/g, "").length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const sanitizedPhoneNumber = `+91${phoneNumber.replace(/\D/g, "")}`;

      // Use the default auth instance - this ensures reCAPTCHA triggers on Android
      const confirmation = await auth().signInWithPhoneNumber(
        sanitizedPhoneNumber
      );

      setConfirm(confirmation);
      navigation.navigate(HomeNavigation.OTP_SCREEN, {
        confirmAuth: confirmation,
        phoneNumber: sanitizedPhoneNumber,
        authType: "signup",
      });
      // Alert.alert('Verification code sent to your phone.');
    } catch (error: any) {

      let errorMessage = error.message || "Authentication failed";

      // Provide more specific error messages
      if (error.code === "auth/app-not-authorized") {
        errorMessage =
          "App is not authorized. Please verify SHA fingerprints in Firebase Console.";
      } else if (error.code === "auth/invalid-phone-number") {
        errorMessage = "Invalid phone number format.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again later.";
      } else if (error.code === "auth/captcha-check-failed") {
        errorMessage = "reCAPTCHA verification failed. Please try again.";
      }

      Toast.show({
        type: "error",
        text1: "Authentication Error",
        text2: errorMessage,
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
      <Loading visible={loading} />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // Adjust offset if needed
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          >
            {/* Back Button */}
            <TouchableOpacity
              style={[styles.backButton, { top: insets.top + s(20) }]}
              onPress={() => navigation.goBack()}
            >
              <Icon name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Logo & Title */}
            <LinearGradient
              colors={["#F9C313", "#FCA511"]}
              style={styles.header}
            >
              <Image
                source={require("../assets/logo.png")}
                style={styles.logo}
              />
              <Text style={styles.title}> Svindo</Text>
              <Text style={styles.title}>Business</Text>
              <Text style={styles.subtitle}>Window to Real Growth</Text>
            </LinearGradient>

            {/* Content Wrapper - Input & Button Centered */}
            <View style={styles.contentWrapper}>
              <Text style={styles.headerText}>Login / Signup</Text>
              {/* Phone Number Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.countryCode}>+91</Text>
                <MaskedTextInput
                  mask="999-999-9999"
                  placeholder="999-999-9999"
                  placeholderTextColor="#ccc"
                  keyboardType="phone-pad"
                  onChangeText={(text) =>
                    setPhoneNumber(text.replace(/[^0-9]/g, ""))
                  }
                  onSubmitEditing={handleContinue}
                  value={phoneNumber}
                  style={styles.input}
                />
              </View>

              {/* Continue Button */}
              <TouchableOpacity
                onPress={handleContinue}
                style={styles.continueButtonWrapper}
                disabled={!phoneNumber}
              >
                <LinearGradient
                  colors={["#F9C313", "#FCA511"]}
                  style={styles.continueButtonGradient}
                >
                  <Text style={styles.continueText}>Continue</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Terms & Privacy - Pinned to Bottom */}
            <View style={styles.footer}>
              <Text style={styles.termsText}>
                By continuing, you agree to our {"\n"}
                <Text style={styles.linkText}>Terms of Service</Text> and{" "}
                <Text style={styles.linkText}>Privacy Policy</Text>.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default SignupScreen;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  backButton: {
    position: "absolute",
    top: "20@s",
    left: 20,
    width: "35@s",
    height: "35@s",
    borderRadius: "25@s",
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
    // width: "100%",
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
  headerText: {
    fontSize: "20@s",
    fontWeight: "bold",
    color: "#000",
    marginBottom: "20@s",
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF7DD",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "30@s",
    paddingHorizontal: "10@s",
    paddingVertical: "4@s",
    width: "90%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FCA511",
  },
  countryCode: {
    fontSize: "18@s",
    fontWeight: "bold",
    color: "#555",
    marginHorizontal: "10@s",
  },
  input: {
    flex: 1,
    fontSize: "18@s",
    color: "#000",
    letterSpacing: "3@s",
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
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: "50@s",
  },
  footer: {
    // position: "absolute",
    // bottom: "30@s",
    // width: "100%",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: "20@s",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});

// const handleAllow = () => {
//   setModalVisible(false);
//   navigation.navigate('OtpScreen');
// };

// const handleContinue = () => {
//   setModalVisible(true); // Show the modal on Continue
// };

{
  /* Permission Popup */
}
{
  /* <Modal transparent visible={isModalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Image
              source={require('../assets/message.png')}
              style={styles.messageIcon}
            />
            <Text style={styles.modalText}>
              Allow svindo to send and view SMS messages?
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleAllow}>
              <Text style={styles.modalButtonText}>Allow</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Don't allow</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */
}

// Modal Styles
// modalOverlay: {
//   flex: 1,
//   backgroundColor: 'rgba(0,0,0,0.5)',
//   alignItems: 'center',
//   justifyContent: 'center',
// },
// modalContainer: {
//   backgroundColor: '#fff',
//   width: '85%',
//   borderRadius: 10,
//   padding: 20,
//   alignItems: 'center',
// },
// messageIcon: {
//   width: 40,
//   height: 40,
//   marginBottom: 10,
// },
// modalText: {
//   fontSize: 16,
//   fontWeight: 'bold',
//   textAlign: 'center',
//   marginBottom: 20,
// },
// modalButton: {
//   backgroundColor: '#FFF7DD',
//   paddingVertical: 10,
//   borderRadius: 20,
//   width: '100%',
//   alignItems: 'center',
//   marginBottom: 10,
// },
// modalButtonText: {
//   fontSize: 16,
//   fontWeight: 'bold',
//   color: '#333',
// },

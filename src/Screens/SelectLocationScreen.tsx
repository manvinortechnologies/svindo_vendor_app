import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Platform,
  Alert,
  PermissionsAndroid,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from "react-native-permissions";
type RootStackParamList = {
  SelectSubCategoryScreen: undefined;
  StatisticsScreen: undefined;
};

interface SelectLocationScreenProps {
  navigation: StackNavigationProp<RootStackParamList, "StatisticsScreen">;
}

const SelectLocationScreen: React.FC<SelectLocationScreenProps> = ({
  navigation,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    const permission =
      Platform.OS === "ios"
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const result = await check(permission);
    console.log(result, "case result");

    switch (result) {
      case RESULTS.UNAVAILABLE:
        console.log("This feature is not available on this device or OS.");
        break;
      case RESULTS.DENIED:
        console.log("Permission has not been requested / is denied.");
        handleDeniedPermissionModal();
        break;
      case RESULTS.GRANTED:
        console.log("Permission is granted.");
        break;
      case RESULTS.BLOCKED:
        console.log("Permission is denied and cannot be requested (blocked).");
        break;
    }
  };

  const handleDeniedPermissionModal = () => {
    Alert.alert(
      "Permission Required",
      "We need access to your location to provide accurate results and personalized services. Please enable location permissions in your device settings.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Open Settings",
          onPress: () => openSettings(),
        },
      ]
    );
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === "ios") {
      const status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (status === RESULTS.GRANTED) {
        console.log("Location permission granted.");
      } else {
        console.log("Location permission denied.");
        handleDeniedPermissionModal();
      }
    } else if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      console.log(granted, PermissionsAndroid.RESULTS.GRANTED, "granted");

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Location permission granted.");
        navigation.navigate("StatisticsScreen");
      } else {
        console.log("Location permission denied.");
        handleDeniedPermissionModal();
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/location_on.png")}
        style={styles.icon}
      />
      <Text style={styles.title}>Location</Text>
      <Text style={styles.subtitle}>
        Please enable location permission for better shopping experience
      </Text>

      <LinearGradient
        colors={["#F9C313", "#FCA511"]}
        style={styles.continueButtonGradient}
      >
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => requestLocationPermission()}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </LinearGradient>

      <TouchableOpacity style={styles.manualButton}>
        <Text style={styles.manualButtonText}>Add Manually</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.termsText}>
          By continuing, you agree to our {"\n"}
          <Text style={styles.linkText}>Terms of Service</Text> and{" "}
          <Text style={styles.linkText}>Privacy Policy</Text>.
        </Text>
      </View>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Allow <Text style={styles.svindotxt}>svindo</Text> to access this
              device's location?
            </Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                This app stated that it may share location data with third
                parties
              </Text>
            </View>
            <View style={styles.locationOptions}>
              <View style={styles.locationOption}>
                <Image
                  source={require("../assets/earth.png")}
                  style={styles.mapIcon}
                />
                <Text>Precise</Text>
              </View>
              <View style={styles.locationOption}>
                <Image
                  source={require("../assets/map.png")}
                  style={styles.mapIcon}
                />
                <Text>Approximate</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => navigation.navigate("StatisticsScreen")}
            >
              <Text style={styles.modalButtonText}>While using the app</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Only this time</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Don't allow</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FCA511",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  continueButtonGradient: {
    width: "90%",
    borderRadius: 25,
    alignSelf: "center",
    marginBottom: 10,
    overflow: "hidden",
  },
  continueButton: {
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  manualButton: {
    borderWidth: 1,
    borderColor: "#FCA511",
    backgroundColor: "#FFF7DD",
    width: "90%",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  manualButtonText: {
    color: "#FCA511",
    fontSize: 16,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 400,
    textAlign: "center",
    marginBottom: 10,
  },
  svindotxt: {
    fontWeight: 800,
  },

  infoBox: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#F1F1F1",
    padding: 10,
    borderRadius: 8,
    width: "90%",
    marginBottom: 15,
  },

  infoText: {
    fontSize: 12,
    color: "#000",
    textAlign: "center",
  },
  locationOptions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 50,
    width: "100%",
    marginBottom: 15,
  },
  locationOption: {
    alignItems: "center",
  },
  mapIcon: {
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  modalButton: {
    backgroundColor: "#DDF2FF",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },
  modalButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
  closeText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default SelectLocationScreen;

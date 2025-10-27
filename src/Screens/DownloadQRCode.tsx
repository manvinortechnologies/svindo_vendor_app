import React, { useEffect, useState, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import Header from "./Header";
import Bottomnavigation from "./Bottomnavigation";
import { Text } from "react-native";
import CustomHeader from "../CommonComponent/CustomHeader";
import QRCode from "react-native-qrcode-svg";
import Loading from "../CommonComponent/Loading";
import { s } from "react-native-size-matters";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import RNFS from "react-native-fs";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { PERMISSIONS, request, RESULTS, check } from "react-native-permissions";

const DownloadQRCode = () => {
  const [storeId, setStoreId] = useState<string>("0"); // Default value
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const qrRef = useRef<any>(null);

  useEffect(() => {
    fetchVendorStores();
  }, []);

  const fetchVendorStores = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get(API_ROUTES.vendorStores);

      if (response.data) {
        // Handle different response structures
        let stores = response.data;

        // If response.data is an array, take the first store
        if (Array.isArray(stores)) {
          if (stores.length > 0) {
            setStoreId(stores[0].id?.toString() || "5");
          }
        }
        // If response.data is an object with stores array
        else if (stores.stores && Array.isArray(stores.stores)) {
          if (stores.stores.length > 0) {
            setStoreId(stores.stores[0].id?.toString() || "5");
          }
        }
        // If response.data is a single store object
        else if (stores.id) {
          setStoreId(stores.id.toString());
        }

        console.log("Vendor stores response:", response.data);
        console.log("Using store ID:", storeId);
      }
    } catch (error: any) {
      console.error("Error fetching vendor stores:", error);
      setError("Failed to load store information");
      // Keep default store ID on error
    } finally {
      setIsLoading(false);
    }
  };

  // const qrCodeValue = `svindo://store/${storeId}`;
  const qrCodeValue = `https://svindo-customer.netlify.app/store/${storeId}`;

  // Request permissions for both Android and iOS
  const requestStoragePermission = async () => {
    try {
      let permission;

      if (Platform.OS === "android") {
        // For Android 13+ (API level 33+), we need READ_MEDIA_IMAGES
        // For older Android versions, we need WRITE_EXTERNAL_STORAGE
        const androidVersion = Platform.Version;
        if (androidVersion >= 33) {
          permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
        } else {
          permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
        }
      } else {
        // For iOS, we need photo library permissions
        permission = PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY;
      }

      // Check current permission status
      const currentStatus = await check(permission);

      if (currentStatus === RESULTS.GRANTED) {
        return true;
      }

      if (
        currentStatus === RESULTS.BLOCKED ||
        currentStatus === RESULTS.UNAVAILABLE
      ) {
        Alert.alert(
          "Permission Required",
          "Please enable storage/photo permissions in your device settings to save QR codes.",
          [{ text: "OK" }]
        );
        return false;
      }

      // Request permission
      const result = await request(permission);
      return result === RESULTS.GRANTED;
    } catch (err) {
      console.warn("Permission request error:", err);
      return false;
    }
  };

  // Download QR Code functionality
  const downloadQRCode = async () => {
    try {
      setIsDownloading(true);

      // Check permissions
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert(
          "Permission Denied",
          "Storage permission is required to save QR code"
        );
        return;
      }

      // Get QR code as base64
      if (qrRef.current) {
        qrRef.current.toDataURL((dataURL: string) => {
          saveQRCode(dataURL);
        });
      }
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Error", "Failed to download QR code");
    } finally {
      setIsDownloading(false);
    }
  };

  // Save QR code to device
  const saveQRCode = async (base64Data: string) => {
    try {
      const timestamp = new Date().getTime();
      const filename = `svindo_store_qr_${storeId}_${timestamp}.png`;

      // Remove data URL prefix if present
      const base64Image = base64Data.replace(/^data:image\/png;base64,/, "");

      if (Platform.OS === "ios") {
        // For iOS, save to camera roll
        const path = `${RNFS.CachesDirectoryPath}/${filename}`;
        await RNFS.writeFile(path, base64Image, "base64");
        await CameraRoll.save(path, { type: "photo" });
        await RNFS.unlink(path); // Clean up temp file
      } else {
        // For Android, save to Pictures directory
        const path = `${RNFS.PicturesDirectoryPath}/${filename}`;
        await RNFS.writeFile(path, base64Image, "base64");

        // Also save to camera roll if available
        try {
          await CameraRoll.save(path, { type: "photo" });
        } catch (cameraRollError) {
          console.log(
            "CameraRoll save failed, file saved to Pictures directory"
          );
        }
      }

      Alert.alert(
        "Success",
        `QR code saved successfully!\nFilename: ${filename}`,
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Failed to save QR code to device");
    }
  };

  const logo = require("../assets/svindo_qr_logo.jpeg");

  return (
    <View style={styles.container}>
      <CustomHeader title="Store QR Code" />

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorSubText}>Using default store ID</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.barcode}>
        <QRCode
          value={qrCodeValue} // Dynamic URL with store ID from API
          size={s(250)} // QR size
          color="#FCA311" // QR code color
          backgroundColor="white" // Background color
          enableLinearGradient={true}
          linearGradient={["#FCA311", "#006EB2"]}
          getRef={(c) => (qrRef.current = c)}
          quietZone={10}
          logo={logo}
          logoSize={s(50)}
          logoBackgroundColor="#FCA311"
          logoColor="#fff"
          logoMargin={s(5)}
          logoBorderRadius={10}
        />
        <TouchableOpacity
          style={[
            styles.downloadBtn,
            isDownloading && styles.downloadBtnDisabled,
          ]}
          onPress={downloadQRCode}
          disabled={isDownloading}
        >
          <Text style={styles.text}>
            {isDownloading ? "Downloading..." : "Download QR-code"}
          </Text>
        </TouchableOpacity>
        {/* <Text style={styles.storeIdText}>Store ID: {storeId}</Text> */}
      </ScrollView>

      <Loading visible={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  barcode: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  qrImage: {
    width: 300,
    height: 300,
  },
  downloadBtn: {
    backgroundColor: "#FCA311",
    borderRadius: 10,
    // padding: 10,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  downloadBtnDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    textAlign: "left",
    margin: 10,
    fontWeight: "800",
    color: "#000",
  },
  storeIdText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    color: "#666",
    fontWeight: "600",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    borderColor: "#f44336",
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    margin: 16,
    alignItems: "center",
  },
  errorText: {
    color: "#f44336",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  errorSubText: {
    color: "#666",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
});

export default DownloadQRCode;

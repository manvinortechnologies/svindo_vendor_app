import React, { useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Platform,
  ImageProps,
} from "react-native";
import ImageCropPicker, { ImageOrVideo } from "react-native-image-crop-picker";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

interface ModalUpdatePhotoProps extends ImageProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectedFile: (file: any) => void;
  onChange?: (image: ImageOrVideo) => void;
}

const ModalUpdatePhoto: React.FC<ModalUpdatePhotoProps> = ({
  isVisible,
  onClose,
  onSelectedFile,
  onChange,
}) => {
  useEffect(() => {
    requestCameraPermission();
    requestGalleryPermission();
  }, []);

  const requestCameraPermission = async () => {
    const permission =
      Platform.OS === "ios"
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;
    try {
      const result = await check(permission);
      if (result === RESULTS.GRANTED) return true;
      if (result === RESULTS.DENIED) {
        const requestResult = await request(permission);
        return requestResult === RESULTS.GRANTED;
      }
      if (result === RESULTS.BLOCKED || result === RESULTS.LIMITED) {
        Toast.show({
          text1: "Permission Denied",
          type: "error",
          text2: "Camera access is required. Please enable it in settings.",
        });
      }
      return false;
    } catch (error) {
      console.error("Camera Permission Error:", error);
      Toast.show({
        text1: "Error",
        type: "error",
        text2: "Failed to request camera permission.",
      });
      return false;
    }
  };

  const requestGalleryPermission = async () => {
    const permission =
      Platform.OS === "ios"
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : Number(Platform.Version) >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

    try {
      const result = await check(permission);
      if (result === RESULTS.GRANTED) return true;
      if (result === RESULTS.DENIED) {
        const requestResult = await request(permission);
        return requestResult === RESULTS.GRANTED;
      }
      if (result === RESULTS.BLOCKED || result === RESULTS.LIMITED) {
        Toast.show({
          text1: "Permission Denied",
          type: "error",
          text2: "Gallery access is required. Please enable it in settings.",
        });
      }
      return false;
    } catch (error) {
      console.error("Gallery Permission Error:", error);
      Toast.show({
        text1: "Error",
        type: "error",
        text2: "Failed to request gallery permission.",
      });
      return false;
    }
  };

  const handlePickerImage = async (target: "camera" | "library") => {
    try {
      if (target === "camera") {
        const image = await ImageCropPicker.openCamera({
          mediaType: "photo",
          useFrontCamera: false,
        });
        const file = {
          uri: image.path,
          name: `image-${image.modificationDate || Date.now()}.jpg`,
          type: image.mime,
          size: image.size,
        };
        onSelectedFile(file);
        onChange?.(image);
        onClose();
      } else {
        const image = await ImageCropPicker.openPicker({
          mediaType: "photo",
          cropping: true,
        });
        // const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.5 });
        const file = {
          uri: image.path,
          name: `image-${image.modificationDate || Date.now()}.jpg`,
          type: image.mime,
          size: image.size,
        };
        onSelectedFile(file);
        onClose();
      }
    } catch (error) {
      console.error("Image Picker Error:", error);
      Toast.show({
        text1: "Error",
        type: "error",
        text2: `Failed to ${target === "camera" ? "capture" : "select"} image.`,
      });
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Upload Profile Photo</Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handlePickerImage("camera")}
            >
              <Ionicons name="camera" size={24} color="#000" />
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handlePickerImage("library")}
            >
              <Ionicons name="image" size={24} color="#000" />
              <Text style={styles.buttonText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
});

export default ModalUpdatePhoto;

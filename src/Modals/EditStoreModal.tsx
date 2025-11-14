import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ImageCropPicker, {
  ImageOrVideo,
  Options,
} from "react-native-image-crop-picker";
import Toast from "react-native-toast-message";
import { APP_CONSTANTS } from "../constants/app.constants";

interface EditStoreModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  editType: "name" | "banner" | "logo" | "about" | "storetag" | null;
  currentData: {
    name?: string;
    banner_image?: string | null;
    profile_image?: string | null;
    about_text?: string | null;
    storetag?: string | null;
  };
  isLoading?: boolean;
}

const EditStoreModal: React.FC<EditStoreModalProps> = ({
  visible,
  onClose,
  onSubmit,
  editType,
  currentData,
  isLoading = false,
}) => {
  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [aboutText, setAboutText] = useState("");
  useEffect(() => {
    if (visible && currentData) {
      setName(currentData.name || "");
      if (editType === "banner") {
        setSelectedImage(currentData.banner_image || null);
      } else if (editType === "logo") {
        setSelectedImage(currentData.profile_image || null);
      } else if (editType === "about") {
        setAboutText(currentData.about_text || "");
      } else if (editType === "storetag") {
        setAboutText(currentData.storetag || "");
      }
      setImageUri(null);
    }
  }, [visible, currentData, editType]);

  const selectImage = async () => {
    const options: Options = {
      mediaType: "photo",
      cropping: true,
    };

    const image: ImageOrVideo = await ImageCropPicker.openPicker(options);

    setImageUri(image.path);
  };

  const handleSubmit = () => {
    if (editType === "name" && !name.trim()) {
      Toast.show({
        text1: "Please enter a store name",
        type: "error",
      });
      return;
    }

    if ((editType === "banner" || editType === "logo") && !imageUri) {
      Toast.show({
        text1: "Please select an image",
        type: "error",
      });
      return;
    }

    const formData = new FormData();

    if (editType === "name") {
      formData.append("name", name.trim());
    } else if (editType === "banner" && imageUri) {
      formData.append("banner_image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "banner.jpg",
      } as any);
    } else if (editType === "logo" && imageUri) {
      formData.append("profile_image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "logo.jpg",
      } as any);
    } else if (editType === "about" && aboutText) {
      formData.append("about", aboutText);
    } else if (editType === "storetag" && aboutText) {
      formData.append("storetag", aboutText);
    }
    onSubmit(formData);
  };

  const renderContent = () => {
    switch (editType) {
      case "name":
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Store Name</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter store name"
              placeholderTextColor="#999"
            />
          </View>
        );

      case "banner":
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Store Banner</Text>
            <TouchableOpacity
              style={styles.imageSelector}
              onPress={selectImage}
            >
              {imageUri ? (
                <Image
                  source={{
                    uri: imageUri.includes("http")
                      ? imageUri
                      : APP_CONSTANTS.API_BASE_URL + imageUri,
                  }}
                  style={styles.selectedImage}
                />
              ) : selectedImage ? (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.selectedImage}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Icon name="image-plus" size={48} color="#999" />
                  <Text style={styles.placeholderText}>
                    Select Banner Image
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            {imageUri && (
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={selectImage}
              >
                <Text style={styles.changeImageText}>Change Image</Text>
              </TouchableOpacity>
            )}
          </View>
        );

      case "logo":
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Store Logo</Text>
            <TouchableOpacity style={styles.logoSelector} onPress={selectImage}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.selectedLogo} />
              ) : selectedImage ? (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.selectedLogo}
                />
              ) : (
                <View style={styles.logoPlaceholder}>
                  <Icon name="image-plus" size={32} color="#999" />
                  <Text style={styles.placeholderText}>Select Logo</Text>
                </View>
              )}
            </TouchableOpacity>
            {imageUri && (
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={selectImage}
              >
                <Text style={styles.changeImageText}>Change Image</Text>
              </TouchableOpacity>
            )}
          </View>
        );

      case "about":
      case "storetag":
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {editType === "about" ? "Store About" : "Store Tagline"}
            </Text>
            <TextInput
              style={styles.textInput}
              value={aboutText}
              onChangeText={setAboutText}
              placeholder={
                editType === "about"
                  ? "Enter store about"
                  : "Enter store tagline"
              }
              placeholderTextColor="#999"
              multiline
              numberOfLines={6}
              maxLength={editType === "about" ? 150 : 40}
              textAlignVertical="top"
            />
          </View>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (editType) {
      case "name":
        return "Edit Store Name";
      case "banner":
        return "Edit Store Banner";
      case "logo":
        return "Edit Store Logo";
      case "about":
        return "Edit Store About";
      default:
        return "Edit Store";
    }
  };

  return (
    <View>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>{getModalTitle()}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>{renderContent()}</View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = ScaledSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
  },
  imageSelector: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 8,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  logoSelector: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 8,
    height: 120,
    width: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    alignSelf: "center",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
  },
  selectedLogo: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
  },
  imagePlaceholder: {
    alignItems: "center",
  },
  logoPlaceholder: {
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    color: "#999",
  },
  changeImageButton: {
    marginTop: 10,
    alignSelf: "center",
  },
  changeImageText: {
    color: "#006EB2",
    fontSize: 14,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#006EB2",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EditStoreModal;

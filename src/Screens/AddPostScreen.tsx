import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Alert,
  Linking,
} from "react-native";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import Icon from "react-native-vector-icons/Ionicons";
import CustomSwitch from "../CommonComponent/CustomSwitch";
import CustomDropdown, {
  DropDownOption,
} from "../CommonComponent/CustomDropdown";
import MainContainer from "../CommonComponent/MainContainer";
import Headerwithback from "./Headerwithback";
import { launchImageLibrary } from "react-native-image-picker";
import Video from "react-native-video";
import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";
import { API_ROUTES } from "../constants/api-routes.constants";

const AddPostScreen = ({ navigation }: any) => {
  const [boostEnabled, setBoostEnabled] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<DropDownOption | null>(
    null
  );
  const [productOptions, setProductOptions] = useState<DropDownOption[]>([]);
  const [amount, setAmount] = useState("");
  const [media, setMedia] = useState<any>(null);
  const [mediaType, setMediaType] = useState<"video" | "image" | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);

  // Error state management
  const [errors, setErrors] = useState({
    description: "",
    selectedProduct: "",
    budget: "",
    image: "",
  });

  // Fetch vendor products on component mount
  useEffect(() => {
    fetchVendorProducts();
  }, []);

  // Input change handlers that clear errors
  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: "" }));
    }
  };

  const handleProductSelect = (product: DropDownOption | null) => {
    setSelectedProduct(product);
    if (errors.selectedProduct) {
      setErrors((prev) => ({ ...prev, selectedProduct: "" }));
    }
  };

  const handleAmountChange = (text: string) => {
    setAmount(text);
    if (errors.budget) {
      setErrors((prev) => ({ ...prev, budget: "" }));
    }
  };

  const handleMediaUpload = async () => {
    // Clear image error when user starts uploading
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }));
    }

    try {
      // Check permissions before launching image library
      // const hasPermissions = await checkPermissions();
      // if (!hasPermissions) {
      //   return;
      // }

      launchImageLibrary(
        {
          mediaType: "mixed",
          selectionLimit: 1,
          quality: 0.8, // Reduce quality to avoid large file sizes
          maxWidth: 1920,
          maxHeight: 1080,
          includeBase64: false, // Don't include base64 to avoid memory issues
        },
        (response) => {
          console.log("response--->", response);

          // Check for errors in response
          if (response.errorMessage) {
            console.error("Image picker error:", response.errorMessage);
            setErrors((prev) => ({
              ...prev,
              image: `Failed to select media: ${response.errorMessage}. Please try selecting a different file.`,
            }));
            return;
          }

          if (response.didCancel) return;

          if (response.assets && response.assets.length > 0) {
            try {
              const selectedMedia = response.assets[0];

              // Validate file size (max 100MB)
              const maxSize = 10 * 1024 * 1024; // 100MB in bytes
              if (selectedMedia.fileSize && selectedMedia.fileSize > maxSize) {
                setErrors((prev) => ({
                  ...prev,
                  image:
                    "The selected file is too large. Please choose a file smaller than 100MB.",
                }));
                return;
              }

              // Validate video duration (max 5 minutes)
              if (
                selectedMedia.type?.startsWith("video") &&
                selectedMedia.duration
              ) {
                const maxDuration = 5 * 60; // 5 minutes in seconds
                if (selectedMedia.duration > maxDuration) {
                  setErrors((prev) => ({
                    ...prev,
                    image:
                      "The selected video is too long. Please choose a video shorter than 5 minutes.",
                  }));
                  return;
                }
              }

              // Validate that we have a valid URI
              if (!selectedMedia.uri) {
                setErrors((prev) => ({
                  ...prev,
                  image:
                    "The selected file could not be processed. Please try selecting a different file.",
                }));
                return;
              }

              setMedia(selectedMedia);
              // Set media type based on the selected file
              if (selectedMedia.type?.startsWith("video")) {
                setMediaType("video");
              } else {
                setMediaType("image");
              }
            } catch (mediaError) {
              console.error("Error processing selected media:", mediaError);
              setErrors((prev) => ({
                ...prev,
                image:
                  "There was an error processing the selected file. Please try selecting a different file.",
              }));
            }
          }
        }
      );
    } catch (error) {
      console.log("error--->", error);
      setErrors((prev) => ({
        ...prev,
        image: "Failed to access media library. Please try again.",
      }));
    }
  };

  // Check and request permissions for media access
  const checkPermissions = async () => {
    try {
      // Define permissions based on platform
      const storagePermission =
        Platform.OS === "ios"
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

      // Check current permission status
      const currentStatus = await check(storagePermission);

      if (currentStatus === RESULTS.GRANTED) {
        return true;
      }

      // Request permission if not granted
      const requestResult = await request(storagePermission);

      if (requestResult === RESULTS.GRANTED) {
        return true;
      } else if (requestResult === RESULTS.DENIED) {
        Alert.alert(
          "Permission Denied",
          "Storage permission is required to upload media. Please grant permission to continue.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Try Again", onPress: () => checkPermissions() },
          ]
        );
        return false;
      } else if (
        requestResult === RESULTS.BLOCKED ||
        requestResult === RESULTS.UNAVAILABLE
      ) {
        Alert.alert(
          "Permission Required",
          "Storage permission is required to upload media. Please enable it in settings.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Settings",
              onPress: () => {
                Linking.openSettings();
              },
            },
          ]
        );
        return false;
      }

      return false;
    } catch (error) {
      console.error("Permission error:", error);
      Alert.alert("Error", "Failed to check permissions. Please try again.");
      return false;
    }
  };

  const fetchVendorProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await api.get(API_ROUTES.vendorProduct);
      if (response.data && Array.isArray(response.data)) {
        const products = response.data.map((product: any) => ({
          id: product.id,
          name: product.name || product.product_name || "Unnamed Product",
        }));
        setProductOptions(products);
      }
    } catch (error) {
      console.error("Error fetching vendor products:", error);
      Alert.alert("Error", "Failed to load products. Please try again.");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const validateForm = () => {
    const newErrors = {
      description: "",
      selectedProduct: "",
      budget: "",
      image: "",
    };

    let isValid = true;

    if (!description.trim()) {
      newErrors.description = "Please enter a description";
      isValid = false;
    }

    if (!selectedProduct) {
      newErrors.selectedProduct =
        "Please select a product to connect with your post";
      isValid = false;
    }

    if (!amount.trim()) {
      newErrors.budget = "Please enter a budget amount";
      isValid = false;
    } else if (isNaN(Number(amount)) || Number(amount) < 10) {
      newErrors.budget = "Budget must be at least 10 rupees";
      isValid = false;
    }

    if (!media) {
      newErrors.image = "Please upload an image or video";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handelSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const formdata = new FormData();
      formdata.append("description", description);
      formdata.append("product", selectedProduct!.id.toString());
      formdata.append("boost_post", boostEnabled);
      formdata.append("budget", amount);
      formdata.append("media", {
        uri: media.uri,
        type: media.type, // e.g., "video/mp4"
        name: media.fileName || "upload.mp4",
      });
      const apiEndPoing = media?.type?.startsWith("video")
        ? "vendor/reel/"
        : "vendor/post/";
      const res = await api.post(apiEndPoing, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigation.goBack();
      if (res.status == 201) {
        Alert.alert(
          "Success",
          "Upload successful! Your content is now ready for review."
        );
      }
    } catch (error) {
      console.log("error--->", error);
      Alert.alert("Error", "Failed to upload post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <MainContainer>
      <Headerwithback title="Add Post / Reel" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.container}
          >
            {/* Upload Box */}
            <TouchableOpacity
              style={[styles.uploadBox, errors.image && styles.inputError]}
              onPress={handleMediaUpload}
            >
              {media ? (
                media?.type?.startsWith("video") ? (
                  <Video
                    source={{ uri: media.uri }}
                    style={[styles.uploadedMedia, { width: "20%" }]}
                    resizeMode="cover"
                    repeat
                    muted
                  />
                ) : (
                  <Image
                    source={{ uri: media.uri }}
                    style={styles.uploadedMedia}
                    resizeMode="cover"
                  />
                )
              ) : (
                <>
                  {mediaType === "video" ? (
                    <Icon name="videocam" size={48} color="#FCA311" />
                  ) : mediaType === "image" ? (
                    <Icon name="camera" size={48} color="#FCA311" />
                  ) : (
                    <Icon name="add-circle-outline" size={48} color="#FCA311" />
                  )}
                  <Text style={styles.uploadHint}>
                    Upload Media{"\n"}
                    For Photos keep the dimension ratio 1:1{"\n"}
                    for videos use vertical videos
                  </Text>
                </>
              )}
            </TouchableOpacity>
            {errors.image ? (
              <Text style={styles.errorText}>{errors.image}</Text>
            ) : null}

            {/* Description Input */}
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, errors.description && styles.inputError]}
              placeholder="Enter here"
              value={description}
              placeholderTextColor={"#727272"}
              onChangeText={handleDescriptionChange}
            />
            {errors.description ? (
              <Text style={styles.errorText}>{errors.description}</Text>
            ) : null}

            {/* Product Selection */}
            <Text style={styles.label}>Select product to connect</Text>
            <CustomDropdown
              placeholder={
                isLoadingProducts ? "Loading products..." : "Select product"
              }
              options={productOptions}
              onSelect={handleProductSelect}
              selectedValue={selectedProduct}
              dropDownBoxStyle={[
                styles.dropdownStyle,
                errors.selectedProduct && styles.inputError,
              ]}
            />
            {errors.selectedProduct ? (
              <Text style={styles.errorText}>{errors.selectedProduct}</Text>
            ) : null}

            {/* Boost Post Toggle */}
            <View style={styles.boostRow}>
              <Text style={styles.label}>Boost Post</Text>
              {/* <Switch
          value={boostEnabled}
          onValueChange={setBoostEnabled}
          trackColor={{ false: '#727272', true: '#FCA311' }}
          thumbColor={boostEnabled ? '#fff' : '#fff'}
          
        /> */}
              <CustomSwitch
                value={boostEnabled}
                onValueChange={setBoostEnabled}
                activeColor="#FCA311"
              />
            </View>

            {/* Budget */}
            <Text style={styles.label}>Budget (Minimum - 10 Rupees)</Text>
            <TextInput
              style={[styles.input, errors.budget && styles.inputError]}
              placeholder="Enter Amount"
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              placeholderTextColor={"#727272"}
            />
            {errors.budget ? (
              <Text style={styles.errorText}>{errors.budget}</Text>
            ) : null}

            {/* Approximate Costing Box */}
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                <Text style={{ fontWeight: "bold", color: "#FCA311" }}>
                  Approximate Costing{"\n \n"}
                </Text>
                per view cost:{" "}
                <Text style={{ fontWeight: "bold" }}>10 paisa</Text>{" "}
                {"        "}
                per view cost:{" "}
                <Text style={{ fontWeight: "bold" }}>10 paisa</Text>
              </Text>
              <Text style={styles.cautionText}>Caution</Text>
              <Text style={styles.termsText}>
                Please follow platforms{" "}
                <Text style={styles.termsHighlight}>terms & conditions</Text>{" "}
                for speedy approval of campaigns
              </Text>
            </View>
            <Loading visible={isLoading} />

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handelSubmit}
              style={styles.submitButton}
            >
              <Text style={styles.submitText}>Submit for approval</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </MainContainer>
  );
};

export default AddPostScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
  },
  uploadBox: {
    height: 150,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 32,
    color: "#888",
  },
  uploadHint: {
    textAlign: "center",
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#FCA311",
    backgroundColor: "#FFF7DD",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 48,
    marginBottom: 16,
    color: "#000",
  },
  boostRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  infoBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  infoText: {
    fontSize: 13,
    color: "#333",
    marginBottom: 4,
  },
  cautionText: {
    color: "red",
    fontWeight: "bold",
    fontSize: 13,
    marginTop: 4,
  },
  termsText: {
    fontSize: 12,
    color: "#444",
    marginTop: 2,
  },
  termsHighlight: {
    color: "#FCA311",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#28A745",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },
  uploadedMedia: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  dropdownStyle: {
    borderColor: "#FCA311",
    backgroundColor: "#FFF7DD",
    marginBottom: 16,
  },
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  inputError: {
    borderColor: "#FF0000",
  },
});

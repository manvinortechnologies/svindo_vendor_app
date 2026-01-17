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
  Keyboard,
  Platform,
  Alert,
  Linking,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import Icon from "react-native-vector-icons/Ionicons";
import CustomSwitch from "../CommonComponent/CustomSwitch";
import MainContainer from "../CommonComponent/MainContainer";
import Headerwithback from "./Headerwithback";
import Video from "react-native-video";
import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";
import { API_ROUTES } from "../constants/api-routes.constants";
import { RouteProp, useRoute } from "@react-navigation/native";
import { APP_CONSTANTS } from "../constants/app.constants";
import ImageCropPicker from "react-native-image-crop-picker";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScaledSheet } from "react-native-size-matters";

type RootStackParamList = {
  AddPost: {
    item?: any;
    type?: string;
  };
};

type AddPostRouteProp = RouteProp<RootStackParamList, "AddPost">;
const { width } = Dimensions.get("window");
const AddPostScreen = ({ navigation }: any) => {
  const route = useRoute<AddPostRouteProp>();
  const item = route.params?.item;
  const type = route.params?.type;
  const insets = useSafeAreaInsets();
  const [boostEnabled, setBoostEnabled] = useState(true);
  const [description, setDescription] = useState(item?.description || "");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(
    item?.product ? { id: item.product, name: item?.product?.name || "" } : null
  );
  const [productOptions, setProductOptions] = useState<any[]>([]);
  const [amount, setAmount] = useState(item?.budget || "");
  const [media, setMedia] = useState<any>(
    item?.media
      ? {
          uri: APP_CONSTANTS.API_BASE_URL + item.media,
          type: item.media.includes(".mp4") ? "video/mp4" : "image/jpeg",
        }
      : null
  );
  const [mediaType, setMediaType] = useState<"video" | "image" | null>(
    item?.media?.includes(".mp4")
      ? "video"
      : item?.media?.includes(".jp")
      ? "image"
      : null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [showProductModal, setShowProductModal] = useState<boolean>(false);

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

  const handleProductSelect = (product: any | null) => {
    setSelectedProduct(product);
    if (errors.selectedProduct) {
      setErrors((prev) => ({ ...prev, selectedProduct: "" }));
    }
    setShowProductModal(false);
  };

  const handleAmountChange = (text: string) => {
    setAmount(text);
    if (errors.budget) {
      setErrors((prev) => ({ ...prev, budget: "" }));
    }
  };

  const openProductModal = async () => {
    setShowProductModal(true);
    if (!productOptions.length) {
      await fetchVendorProducts();
    }
  };

  const handleMediaUpload = async () => {
    // Clear image error when user starts uploading
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }));
    }

    try {
      // Determine media type based on existing item or default to 'any'
      // let mediaTypeOption: "photo" | "video" | "any" = "any";
      // if (item?.media) {
      //   if (item.media.includes(".mp4")) {
      //     mediaTypeOption = "video";
      //   } else if (item.media.includes(".jp")) {
      //     mediaTypeOption = "photo";
      //   }
      // }

      const result = await ImageCropPicker.openPicker({
        mediaType: type === "reel" ? "video" : "photo",
        compressImageQuality: 0.8,
        cropping: type === "reel" ? false : true, // Only enable cropping for images
        includeBase64: false,
      });

      // Validate file size (max 100MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (result.size && result.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          image:
            "The selected file is too large. Please choose a file smaller than 10MB.",
        }));
        return;
      }

      // Validate video duration (max 5 minutes)
      if (
        result.mime &&
        result.mime.startsWith("video/") &&
        "duration" in result &&
        result.duration
      ) {
        const maxDuration = 60000; // 1 minutes in seconds
        if (result.duration > maxDuration) {
          setErrors((prev) => ({
            ...prev,
            image:
              "The selected video is too long. Please choose a video shorter than 5 minutes.",
          }));
          return;
        }
      }

      // Validate that we have a valid path/uri
      if (!result.path) {
        setErrors((prev) => ({
          ...prev,
          image:
            "The selected file could not be processed. Please try selecting a different file.",
        }));
        return;
      }

      // Convert ImageCropPicker response to format expected by the rest of the app
      const isVideo =
        result.mime?.startsWith("video/") ||
        result.path?.includes(".mp4") ||
        result.path?.includes(".mov");

      const selectedMedia = {
        uri: result.path,
        type: result.mime || (isVideo ? "video/mp4" : "image/jpeg"),
        name:
          result.filename ||
          result.path?.split("/").pop() ||
          (isVideo ? "video.mp4" : "image.jpg"),
        fileSize: result.size,
        duration: "duration" in result ? result.duration : undefined,
      };

      setMedia(selectedMedia);

      // Set media type based on the selected file
      if (result.mime && result.mime.startsWith("video/")) {
        setMediaType("video");
      } else {
        setMediaType("image");
      }
    } catch (error: any) {

      // Check if user cancelled
      if (error.code === "E_PICKER_CANCELLED") {
        return; // User cancelled, don't show error
      }

      setErrors((prev) => ({
        ...prev,
        image:
          error.message || "Failed to access media library. Please try again.",
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
      return false;
    }
  };

  const fetchVendorProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await api.get(API_ROUTES.vendorProduct);
      if (response.data && Array.isArray(response.data)) {
        const products = response.data
          .filter((product: any) => product?.is_active)
          .map((product: any) => ({
            id: product.id,
            name: product.name || product.product_name || "Unnamed Product",
            image: product.image || product.feature_image || null,
            ...product,
          }));
        setProductOptions(products);
        if (item?.product) {
          const foundProduct = products.find(
            (product: any) => product.id === item.product
          );
          if (foundProduct) {
            setSelectedProduct(foundProduct);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching vendor products:", error);
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

    // if (!amount.trim()) {
    //   newErrors.budget = "Please enter a budget amount";
    //   isValid = false;
    // } else if (isNaN(Number(amount)) || Number(amount) < 10) {
    //   newErrors.budget = "Budget must be at least 10 rupees";
    //   isValid = false;
    // }

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
      if (media.name) {
        formdata.append("media", {
          uri: media.uri,
          type: media.type, // e.g., "video/mp4"
          name: media.name || "upload.mp4",
        });
      }
      const apiEndPoing = media?.type?.startsWith("video")
        ? API_ROUTES.reel
        : API_ROUTES.post;
      const res = await api[item ? "patch" : "post"](
        apiEndPoing + (item?.id ? `/${item?.id}/` : ""),
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigation.goBack();
      if (res.status == 201) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Upload successful! Your content is now ready for review.",
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to upload post. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={[
        { flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Headerwithback title="Add Post / Reel" />
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
          <TouchableOpacity
            style={[
              styles.productSelectButton,
              errors.selectedProduct && styles.inputError,
            ]}
            onPress={openProductModal}
          >
            <Text style={styles.productSelectButtonText}>
              {isLoadingProducts
                ? "Loading..."
                : selectedProduct?.name
                ? `Selected: ${selectedProduct.name}`
                : "Select Product"}
            </Text>
          </TouchableOpacity>
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
              disabled={true}
            />
          </View>

          {/* Budget */}
          <Text style={styles.label}>Budget (Minimum - 0 Rupees)</Text>
          <TextInput
            style={[styles.input, errors.budget && styles.inputError]}
            placeholder="Boosted by default"
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            placeholderTextColor={"#727272"}
            editable={false}
          />
          {errors.budget ? (
            <Text style={styles.errorText}>{errors.budget}</Text>
          ) : null}

          {/* Approximate Costing Box */}
          <View style={styles.infoBox}>
            <Text style={{ fontWeight: "bold", color: "#FCA311" }}>
              We are offering free boost post for limited time!
            </Text>
            {/* <Text style={styles.infoText}>
                <Text style={{ fontWeight: "bold", color: "#FCA311" }}>
                  Approximate Costing{"\n \n"}
                </Text>
                per view cost:{" "}
                <Text style={{ fontWeight: "bold" }}>10 paisa</Text>{" "}
                {"        "}
                per click cost:{" "}
                <Text style={{ fontWeight: "bold" }}>10 paisa</Text>
              </Text>
              <Text style={styles.cautionText}>Caution</Text>
              <Text style={styles.termsText}>
                Please follow platforms{" "}
                <Text style={styles.termsHighlight}>terms & conditions</Text>{" "}
                for speedy approval of campaigns
              </Text> */}
          </View>
          <Loading visible={isLoading} />

          {/* Submit Button */}
          <TouchableOpacity onPress={handelSubmit} style={styles.submitButton}>
            <Text style={styles.submitText}>Submit for approval</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal visible={showProductModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Product</Text>
              <TouchableOpacity onPress={() => setShowProductModal(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
            {isLoadingProducts ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            ) : (
              <FlatList
                data={productOptions.filter(
                  (product: any) => product.sale_type === "both"
                )}
                keyExtractor={(item: any) =>
                  item?.id?.toString() || Math.random().toString()
                }
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.productCard}
                    onPress={() => handleProductSelect(item)}
                  >
                    <Image
                      source={
                        item?.image
                          ? { uri: item.image }
                          : require("../assets/product.png")
                      }
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.productName} numberOfLines={1}>
                      {item?.name || "Unnamed"}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                  <Text style={styles.loadingText}>No products found</Text>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddPostScreen;

const styles = ScaledSheet.create({
  container: {
    padding: "16@s",
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
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  inputError: {
    borderColor: "#FF0000",
  },
  productSelectButton: {
    borderWidth: 1,
    borderColor: "#FCA311",
    backgroundColor: "#FFF7DD",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  productSelectButtonText: {
    color: "#FCA311",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "92%",
    borderRadius: 12,
    padding: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  modalCloseText: {
    color: "#FCA311",
    fontWeight: "700",
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadingText: {
    color: "#666",
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  productCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: width * 0.3,
  },
  productName: {
    padding: 8,
    color: "#000",
  },
});

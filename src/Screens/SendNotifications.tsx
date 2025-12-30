import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  StatusBar,
  Alert,
  Image,
  Modal,
  FlatList,
} from "react-native";
import Headerwithback from "./Headerwithback";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import ImageCropPicker from "react-native-image-crop-picker";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import CalendarModal from "../Modals/CalendarModal";
import moment from "moment";
import { formatToISOString, convert24To12Hour } from "../utils/dateandTime";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import Loading from "../CommonComponent/Loading";
import { useNotificationContext } from "../contexts/NotificationContext";
import Toast from "react-native-toast-message";
import CustomDropdown from "../CommonComponent/CustomDropdown";

const SendNotifications = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    campaign_name: "",
    redirect_to: "store",
    description: "",
    budget: "0",
    start_time: "",
    end_time: "",
  });
  const [startDate, setStartDate] = useState<string>(
    moment().format("YYYY-MM-DD")
  );
  const [startTime, setStartTime] = useState<string>(moment().format("HH:mm"));
  const [endDate, setEndDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [endTime, setEndTime] = useState<string>(moment().format("HH:mm"));
  const [bannerImage, setBannerImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [startDateCallModel, setStartDateCallModel] = useState<boolean>(false);
  const [endDateCallModel, setEndDateCallModel] = useState<boolean>(false);
  const [startTimeCallModel, setStartTimeCallModel] = useState<boolean>(false);
  const [endTimeCallModel, setEndTimeCallModel] = useState<boolean>(false);
  const { showNotification } = useNotificationContext();
  const [showProductModal, setShowProductModal] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const redirectOptions = [
    { name: "Store", id: "store" },
    { name: "Product", id: "product" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: "" }));
    }
    // Clear selected product when redirect changes from product
    if (field === "redirect_to" && value !== "product") {
      setSelectedProduct(null);
    }
  };

  const openProductPicker = async () => {
    try {
      setLoadingProducts(true);
      if (products.length === 0) {
        const res = await api.get(API_ROUTES.vendorProduct);
        setProducts(
          res.data.filter(
            (product: any) => product.is_active && product.sale_type === "both"
          )
        );
      }
      setShowProductModal(true);
    } catch (e) {
      setProducts([]);
      setShowProductModal(true);
    } finally {
      setLoadingProducts(false);
    }
  };

  const onStartTimeChange = (
    event: DateTimePickerEvent,
    selectedTime?: Date
  ) => {
    if (Platform.OS === "android") {
      setStartTimeCallModel(false);
    }

    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, "0");
      const minutes = selectedTime.getMinutes().toString().padStart(2, "0");
      const formatted = `${hours}:${minutes}`;
      setStartTime(formatted);
      // Clear error when time is selected
      if (errors.start_time) {
        setErrors((prev: any) => ({ ...prev, start_time: "" }));
      }
    }
  };

  const onEndTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setEndTimeCallModel(false);
    }

    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, "0");
      const minutes = selectedTime.getMinutes().toString().padStart(2, "0");
      const formatted = `${hours}:${minutes}`;
      setEndTime(formatted);
      // Clear error when time is selected
      if (errors.end_time) {
        setErrors((prev: any) => ({ ...prev, end_time: "" }));
      }
    }
  };

  const handleImagePicker = async () => {
    try {
      // Clear image error when user starts uploading
      if (errors.image) {
        setErrors((prev: any) => ({ ...prev, image: "" }));
      }

      const result = await ImageCropPicker.openPicker({
        mediaType: "photo",
        compressImageQuality: 0.8,
        cropping: true,
        includeBase64: false,
      });

      console.log("ImageCropPicker response--->", result);

      // Validate that we have a valid path
      if (!result.path) {
        setErrors((prev: any) => ({
          ...prev,
          image:
            "The selected image could not be processed. Please try selecting a different file.",
        }));
        return;
      }

      // Validate file size (max 1MB as per UI hint)
      const maxSize = 1 * 1024 * 1024; // 1MB in bytes
      if (result.size && result.size > maxSize) {
        setErrors((prev: any) => ({
          ...prev,
          image:
            "The selected file is too large. Please choose a file smaller than 1MB.",
        }));
        return;
      }

      // Convert ImageCropPicker response to format expected by the rest of the app
      const asset = {
        uri: result.path,
        type: result.mime || "image/jpeg",
        fileName:
          result.filename ||
          result.path?.split("/").pop() ||
          "banner_image.jpg",
        fileSize: result.size,
      };

      setBannerImage(asset);
    } catch (error: any) {
      console.log("ImageCropPicker error--->", error);

      // Check if user cancelled
      if (error.code === "E_PICKER_CANCELLED") {
        return; // User cancelled, don't show error
      }

      setErrors((prev: any) => ({
        ...prev,
        image:
          error.message || "Failed to access media library. Please try again.",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.campaign_name.trim()) {
      newErrors.campaign_name = "Campaign name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 90) {
      newErrors.description = "Description must be under 90 characters";
    }

    if (formData.redirect_to === "product" && !selectedProduct?.id) {
      newErrors.product = "Please select a product";
    }

    // if (!formData.budget.trim()) {
    //   newErrors.budget = "Budget is required";
    // } else if (
    //   isNaN(parseFloat(formData.budget)) ||
    //   parseFloat(formData.budget) <= 0
    // ) {
    //   newErrors.budget = "Please enter a valid budget amount";
    // }

    if (!startDate.trim()) {
      newErrors.start_time = "Start date is required";
    }

    if (!startTime.trim()) {
      newErrors.start_time = "Start time is required";
    }

    if (!endDate.trim()) {
      newErrors.end_time = "End date is required";
    }

    if (!endTime.trim()) {
      newErrors.end_time = "End time is required";
    }

    if (startDate && startTime && endDate && endTime) {
      const startDateTime = formatToISOString(
        startDate,
        convert24To12Hour(startTime)
      );
      const endDateTime = formatToISOString(
        endDate,
        convert24To12Hour(endTime)
      );
      const startDateObj = new Date(startDateTime);
      const endDateObj = new Date(endDateTime);
      if (endDateObj <= startDateObj) {
        newErrors.end_time = "End date/time must be after start date/time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      // Create FormData
      const formDataPayload = new FormData();

      // Append text fields
      formDataPayload.append("campaign_name", formData.campaign_name.trim());
      formDataPayload.append("redirect_to", formData.redirect_to);
      formDataPayload.append("description", formData.description.trim());
      formDataPayload.append("status", "pending");
      formDataPayload.append("budget", parseFloat(formData.budget).toFixed(2));
      formDataPayload.append("rejection_reason", "");
      formDataPayload.append("views", "0");
      formDataPayload.append("clicks", "0");
      formDataPayload.append(
        "start_time",
        formatToISOString(startDate, convert24To12Hour(startTime))
      );
      formDataPayload.append(
        "end_time",
        formatToISOString(endDate, convert24To12Hour(endTime))
      );

      // Append product if redirect_to is product
      if (formData.redirect_to === "product" && selectedProduct?.id) {
        formDataPayload.append("product", selectedProduct.id.toString());
      }

      // Append banner image if available
      if (bannerImage) {
        formDataPayload.append("banner", {
          uri: bannerImage.uri,
          type: bannerImage.type || "image/jpeg",
          name: bannerImage.fileName || "banner_image.jpg",
        });
      }

      const response = await api.post(
        API_ROUTES.notificationCampaign,
        formDataPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        Toast.show({
          type: "success",
          text1: "Notification campaign submitted successfully!",
          text2: " It will be reviewed and approved soon.",
        });
        setFormData({
          campaign_name: "",
          redirect_to: "store",
          description: "",
          budget: "",
          start_time: "",
          end_time: "",
        });
        setBannerImage(null);
        setSelectedProduct(null);
        setErrors({});
        // Navigate back to manage notifications
        navigation.goBack();
      } else {
        throw new Error("Failed to submit campaign");
      }
    } catch (error) {
      console.error("Error submitting notification campaign:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to submit notification campaign. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Headerwithback title={"Send Notification"} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Upload Banner */}
        <TouchableOpacity style={styles.uploadBox} onPress={handleImagePicker}>
          {bannerImage ? (
            <Image
              source={{ uri: bannerImage.uri }}
              style={styles.bannerImage}
            />
          ) : (
            <>
              <Text style={styles.uploadText}>+</Text>
              <Text style={styles.uploadInfo}>Upload banner</Text>
              <Text style={styles.uploadInfo}>Size ~ less than 1 MB</Text>
              <Text style={styles.uploadInfo}>Ratio : 1:3</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Campaign Name */}
        <Text style={styles.label}>Campaign name *</Text>
        <TextInput
          style={[styles.input, errors.campaign_name && styles.inputError]}
          placeholder="Enter campaign name"
          placeholderTextColor="#FCA311"
          value={formData.campaign_name}
          onChangeText={(text) => handleInputChange("campaign_name", text)}
        />
        {errors.campaign_name && (
          <Text style={styles.errorText}>{errors.campaign_name}</Text>
        )}

        {/* On click redirect */}
        <Text style={styles.label}>On click redirect to *</Text>
        <CustomDropdown
          placeholder="Select Option"
          options={redirectOptions}
          selectedValue={formData.redirect_to}
          onSelect={(option) => handleInputChange("redirect_to", option.id)}
          dropDownBoxStyle={[
            styles.dropdown,
            errors.redirect_to && styles.inputError,
          ]}
        />
        {errors.redirect_to && (
          <Text style={styles.errorText}>{errors.redirect_to}</Text>
        )}

        {/* Product Selection Button - Show when Product is selected */}
        {formData.redirect_to === "product" && (
          <View style={{ marginBottom: 16 }}>
            <TouchableOpacity
              onPress={openProductPicker}
              style={[
                styles.productButton,
                errors.product && styles.inputError,
              ]}
            >
              {loadingProducts ? (
                <Text style={styles.productButtonText}>Loading...</Text>
              ) : (
                <Text style={styles.productButtonText}>
                  {selectedProduct?.name
                    ? `Selected: ${selectedProduct.name}`
                    : "Select Product"}
                </Text>
              )}
            </TouchableOpacity>
            {errors.product && (
              <Text style={styles.errorText}>{errors.product}</Text>
            )}
          </View>
        )}

        {/* Description */}
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[
            styles.input,
            { height: 80 },
            errors.description && styles.inputError,
          ]}
          multiline
          placeholder="Under 90 characters"
          placeholderTextColor="#FCA311"
          value={formData.description}
          onChangeText={(text) => handleInputChange("description", text)}
          maxLength={90}
        />
        <Text style={styles.characterCount}>
          {formData.description.length}/90 characters
        </Text>
        {errors.description && (
          <Text style={styles.errorText}>{errors.description}</Text>
        )}

        {/* Budget */}
        {/* <Text style={styles.label}>Budget (₹) *</Text>
        <TextInput
          style={[styles.input, errors.budget && styles.inputError]}
          placeholder="Enter budget amount"
          placeholderTextColor="#FCA311"
          value={formData.budget}
          onChangeText={(text) => handleInputChange("budget", text)}
          keyboardType="numeric"
        />
        {errors.budget && <Text style={styles.errorText}>{errors.budget}</Text>} */}

        {/* Start Date and Time */}
        <Text style={styles.label}>Start Date & Time *</Text>
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <TouchableOpacity
              style={[
                styles.timeInput,
                errors.start_time && styles.inputError,
                !startDate && styles.placeholderInput,
              ]}
              onPress={() => {
                setStartDateCallModel(true);
                if (errors.start_time) {
                  setErrors((prev: any) => ({ ...prev, start_time: "" }));
                }
              }}
            >
              <Text
                style={[
                  styles.timeInputText,
                  !startDate && styles.placeholderText,
                ]}
              >
                {startDate || "Date (YYYY-MM-DD)"}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.halfWidth}>
            <TouchableOpacity
              style={[
                styles.timeInput,
                errors.start_time && styles.inputError,
                !startTime && styles.placeholderInput,
              ]}
              onPress={() => {
                setStartTimeCallModel(true);
                if (errors.start_time) {
                  setErrors((prev: any) => ({ ...prev, start_time: "" }));
                }
              }}
            >
              <Text
                style={[
                  styles.timeInputText,
                  !startTime && styles.placeholderText,
                ]}
              >
                {startTime ? convert24To12Hour(startTime) : "Time (HH:MM AM)"}
              </Text>
              {/* <Icon name="access-time" size={20} color="#FCA311" /> */}
            </TouchableOpacity>
          </View>
        </View>
        {errors.start_time && (
          <Text style={styles.errorText}>{errors.start_time}</Text>
        )}

        {/* End Date and Time */}
        <Text style={styles.label}>End Date & Time *</Text>
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <TouchableOpacity
              style={[
                styles.timeInput,
                errors.end_time && styles.inputError,
                !endDate && styles.placeholderInput,
              ]}
              onPress={() => {
                setEndDateCallModel(true);
                if (errors.end_time) {
                  setErrors((prev: any) => ({ ...prev, end_time: "" }));
                }
              }}
            >
              <Text
                style={[
                  styles.timeInputText,
                  !endDate && styles.placeholderText,
                ]}
              >
                {endDate || "Date (YYYY-MM-DD)"}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.halfWidth}>
            <TouchableOpacity
              style={[
                styles.timeInput,
                errors.end_time && styles.inputError,
                !endTime && styles.placeholderInput,
              ]}
              onPress={() => {
                setEndTimeCallModel(true);
                if (errors.end_time) {
                  setErrors((prev: any) => ({ ...prev, end_time: "" }));
                }
              }}
            >
              <Text
                style={[
                  styles.timeInputText,
                  !endTime && styles.placeholderText,
                ]}
              >
                {endTime ? convert24To12Hour(endTime) : "Time (HH:MM AM)"}
              </Text>
              {/* <Icon name="access-time" size={20} color="#FCA311" /> */}
            </TouchableOpacity>
          </View>
        </View>
        {errors.end_time && (
          <Text style={styles.errorText}>{errors.end_time}</Text>
        )}

        {/* Note */}
        <View style={styles.noteBox}>
          <Text style={styles.noteLabel}>Note:</Text>
          <Text style={styles.noteText}>
            This notification is pushed only to your followers, visible only for
            7 days after approval. At a time only 1 notification can be active.
            {"\n\n"}
            To send notification to wider audience contact svindo support.
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isLoading && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitText}>
            {isLoading ? "Submitting..." : "Submit for approval"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <Loading visible={isLoading} />

      {/* Date Pickers */}
      <CalendarModal
        visible={startDateCallModel}
        initialDate={startDate}
        onClose={() => setStartDateCallModel(false)}
        onSelect={setStartDate}
        minDate={moment().format("YYYY-MM-DD")}
      />
      <CalendarModal
        visible={endDateCallModel}
        initialDate={endDate}
        onClose={() => setEndDateCallModel(false)}
        onSelect={setEndDate}
        minDate={startDate || moment().format("YYYY-MM-DD")}
      />

      {/* Time Pickers */}
      {startTimeCallModel && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={false}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onStartTimeChange}
        />
      )}
      {endTimeCallModel && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={false}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onEndTimeChange}
        />
      )}

      {/* Product Picker Modal */}
      <Modal visible={showProductModal} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              width: "92%",
              borderRadius: 12,
              padding: 12,
              maxHeight: "80%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#000" }}>
                Select Product
              </Text>
              <TouchableOpacity onPress={() => setShowProductModal(false)}>
                <Text style={{ color: "#006EB2", fontWeight: "700" }}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
            {loadingProducts ? (
              <View style={{ paddingVertical: 20, alignItems: "center" }}>
                <Text style={{ color: "#666" }}>Loading...</Text>
              </View>
            ) : (
              <FlatList
                data={products}
                keyExtractor={(it: any) =>
                  it.id?.toString() || Math.random().toString()
                }
                numColumns={2}
                columnWrapperStyle={{
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
                renderItem={({ item }: { item: any }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedProduct(item);
                      setShowProductModal(false);
                      // Clear product error when product is selected
                      if (errors.product) {
                        setErrors((prev: any) => ({ ...prev, product: "" }));
                      }
                    }}
                    style={{
                      width: "48%",
                      backgroundColor: "#fff",
                      borderWidth: 1,
                      borderColor: "#eee",
                      borderRadius: 10,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      source={
                        item.image
                          ? { uri: item.image }
                          : require("../assets/product.png")
                      }
                      style={{ width: "100%", height: 110 }}
                      resizeMode="cover"
                    />
                    <Text
                      style={{ padding: 8, color: "#000" }}
                      numberOfLines={1}
                    >
                      {item.name || "Unnamed"}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SendNotifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 20,
  },
  uploadText: {
    fontSize: 30,
    color: "#333",
  },
  uploadInfo: {
    fontSize: 12,
    color: "#555",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#000",
  },
  input: {
    color: "#000",
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  dropdownText: {
    color: "#000",
    fontSize: 14,
  },
  noteBox: {
    backgroundColor: "#fff1dc",
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
  },
  noteLabel: {
    color: "#FCA311",
    fontWeight: "bold",
    marginBottom: 4,
  },
  noteText: {
    fontSize: 12,
    color: "#555",
  },
  submitButton: {
    backgroundColor: "#169729",
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 20,
  },
  submitText: {
    color: "#fff",
    fontWeight: "700",
  },
  bannerImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    resizeMode: "cover",
  },
  inputError: {
    borderColor: "#F44336",
  },
  errorText: {
    color: "#F44336",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  characterCount: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
    marginTop: -10,
    marginBottom: 10,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  timeInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  timeInputText: {
    color: "#000",
    fontSize: 14,
    flex: 1,
  },
  placeholderInput: {
    backgroundColor: "#fff",
  },
  placeholderText: {
    color: "#FCA311",
  },
  productButton: {
    backgroundColor: "#006EB2",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#006EB2",
  },
  productButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
});

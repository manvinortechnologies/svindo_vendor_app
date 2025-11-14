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
} from "react-native";
import Headerwithback from "./Headerwithback";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import ImageCropPicker from "react-native-image-crop-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import Loading from "../CommonComponent/Loading";
import { useNotificationContext } from "../contexts/NotificationContext";
import Toast from "react-native-toast-message";

const SendNotifications = ({ navigation }: any) => {
  const [formData, setFormData] = useState({
    campaign_name: "",
    redirect_to: "store",
    description: "",
    budget: "0",
    start_time: "",
    end_time: "",
  });
  const [bannerImage, setBannerImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isDateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const [pickerType, setPickerType] = useState<
    "start_time" | "end_time" | null
  >(null);
  const { showNotification } = useNotificationContext();

  const redirectOptions = [
    { label: "Store", value: "store" },
    { label: "Products", value: "products" },
    { label: "Orders", value: "orders" },
    { label: "Profile", value: "profile" },
    { label: "Settings", value: "settings" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: "" }));
    }
  };

  const showDateTimePicker = (type: "start_time" | "end_time") => {
    setPickerType(type);
    setDateTimePickerVisible(true);
    // Clear error when opening picker
    if (errors[type]) {
      setErrors((prev: any) => ({ ...prev, [type]: "" }));
    }
  };

  const handleDateTimeConfirm = (date: Date) => {
    const formattedDateTime = moment(date).format("YYYY-MM-DD HH:mm");
    if (pickerType) {
      handleInputChange(pickerType, formattedDateTime);
    }
    setDateTimePickerVisible(false);
    setPickerType(null);
  };

  const getPickerDate = () => {
    if (pickerType === "start_time" && formData.start_time) {
      return moment(formData.start_time, "YYYY-MM-DD HH:mm").toDate();
    }
    if (pickerType === "end_time" && formData.end_time) {
      return moment(formData.end_time, "YYYY-MM-DD HH:mm").toDate();
    }
    return new Date();
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

    // if (!formData.budget.trim()) {
    //   newErrors.budget = "Budget is required";
    // } else if (
    //   isNaN(parseFloat(formData.budget)) ||
    //   parseFloat(formData.budget) <= 0
    // ) {
    //   newErrors.budget = "Please enter a valid budget amount";
    // }

    if (!formData.start_time.trim()) {
      newErrors.start_time = "Start time is required";
    }

    if (!formData.end_time.trim()) {
      newErrors.end_time = "End time is required";
    }

    if (formData.start_time && formData.end_time) {
      const startDate = new Date(formData.start_time);
      const endDate = new Date(formData.end_time);
      if (endDate <= startDate) {
        newErrors.end_time = "End time must be after start time";
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

      const payload = {
        campaign_name: formData.campaign_name.trim(),
        redirect_to: formData.redirect_to,
        description: formData.description.trim(),
        status: "pending",
        budget: parseFloat(formData.budget).toFixed(2),
        rejection_reason: "",
        views: 0,
        clicks: 0,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
      };

      console.log("Submitting notification campaign:", payload);

      const response = await api.post(API_ROUTES.notificationCampaign, payload);

      if (response.status === 200 || response.status === 201) {
        Alert.alert(
          "Success",
          "Notification campaign submitted successfully! It will be reviewed and approved soon.",
          [
            {
              text: "OK",
              onPress: () => {
                // Reset form
                setFormData({
                  campaign_name: "",
                  redirect_to: "store",
                  description: "",
                  budget: "",
                  start_time: "",
                  end_time: "",
                });
                setBannerImage(null);
                setErrors({});
                // Navigate back to manage notifications
                navigation.goBack();
              },
            },
          ]
        );
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
    <SafeAreaView style={styles.container}>
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
        <View
          style={[styles.dropdown, errors.redirect_to && styles.inputError]}
        >
          <Text style={styles.dropdownText}>
            {redirectOptions.find((opt) => opt.value === formData.redirect_to)
              ?.label || "Store"}
          </Text>
          <Icon name="arrow-drop-down" size={24} color="#333" />
        </View>

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

        {/* Start Time */}
        <Text style={styles.label}>Start Time *</Text>
        <TouchableOpacity
          style={[
            styles.timeInput,
            errors.start_time && styles.inputError,
            !formData.start_time && styles.placeholderInput,
          ]}
          onPress={() => showDateTimePicker("start_time")}
        >
          <Text
            style={[
              styles.timeInputText,
              !formData.start_time && styles.placeholderText,
            ]}
          >
            {formData.start_time || "YYYY-MM-DD HH:MM"}
          </Text>
          <Icon name="access-time" size={20} color="#FCA311" />
        </TouchableOpacity>
        {errors.start_time && (
          <Text style={styles.errorText}>{errors.start_time}</Text>
        )}

        {/* End Time */}
        <Text style={styles.label}>End Time *</Text>
        <TouchableOpacity
          style={[
            styles.timeInput,
            errors.end_time && styles.inputError,
            !formData.end_time && styles.placeholderInput,
          ]}
          onPress={() => showDateTimePicker("end_time")}
        >
          <Text
            style={[
              styles.timeInputText,
              !formData.end_time && styles.placeholderText,
            ]}
          >
            {formData.end_time || "YYYY-MM-DD HH:MM"}
          </Text>
          <Icon name="access-time" size={20} color="#FCA311" />
        </TouchableOpacity>
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

      {/* DateTime Picker Modal */}
      <DateTimePickerModal
        isVisible={isDateTimePickerVisible}
        mode="datetime"
        onConfirm={handleDateTimeConfirm}
        onCancel={() => {
          setDateTimePickerVisible(false);
          setPickerType(null);
        }}
        date={getPickerDate()}
        minimumDate={new Date()}
      />
    </SafeAreaView>
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
});

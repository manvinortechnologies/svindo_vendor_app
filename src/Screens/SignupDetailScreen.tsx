import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import ImageCropPicker from "react-native-image-crop-picker";
import { SignUpDetailScreenProps } from "../type";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import { HomeNavigation } from "../constants/app-routes.constants";
import { useForm, Controller } from "react-hook-form";
import { StorageUtils } from "../utils/storage";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ScaledSheet } from "react-native-size-matters";
import Loading from "../CommonComponent/Loading";
import Toast from "react-native-toast-message";

type FormData = {
  company_name: string;
  brand_name: string;
  email: string;
  // address: string;
  gst: string;
};
const SignupDetailScreen: React.FC<SignUpDetailScreenProps> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      company_name: "",
      brand_name: "",
      email: "",
      // address: "",
      gst: "",
    },
    mode: "onChange",
  });

  const [profileImage, setProfileImage] = useState<{
    uri: string;
    type: string;
    name: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectProfilePicture = async () => {
    try {
      const result = await ImageCropPicker.openPicker({
        mediaType: "photo",
        compressImageQuality: 0.8,
        cropping: true,
        cropperCircleOverlay: true, // Circular crop for profile picture
        includeBase64: false,
      });


      // Validate that we have a valid path
      if (!result.path) {
        console.error("No path in ImageCropPicker result");
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (result.size && result.size > maxSize) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Logo size should be less than 5MB",
        });
        console.error("File size too large");
        return;
      }

      // Convert ImageCropPicker response to format expected by the rest of the app
      setProfileImage({
        uri: result.path,
        type: result.mime || "image/jpeg",
        name:
          result.filename ||
          result.path?.split("/").pop() ||
          "profile_image.jpg",
      });
    } catch (error: any) {
      // Check if user cancelled
      if (error.code === "E_PICKER_CANCELLED") {
        return; // User cancelled, don't show error
      }

      console.error("Failed to access media library:", error.message);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      formData.append("company_name", data.company_name);
      formData.append("brand_name", data.brand_name);
      formData.append("email", data.email);
      // formData.append("address", data.address);
      formData.append("gstin", data.gst || "");

      if (profileImage) {
        formData.append("profile_image", {
          uri: profileImage.uri,
          type: profileImage.type,
          name: profileImage.name,
        } as any);
      }

      // Using axios directly to ensure token is sent via interceptor
      const res = await api.post(API_ROUTES.companyProfle, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      StorageUtils.removeSignupStatus();
      StorageUtils.removeAdminProfile();
      StorageUtils.setBusinessProfile(JSON.stringify(res.data));
      navigation.navigate(HomeNavigation.SELECT_LOCATION_SCREEN as never);
    } catch (error) {
      console.log("Comapny Error:", error);
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
      <Loading visible={isLoading} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Company</Text>
          {/* <TouchableOpacity
          style={styles.skipButton}
          onPress={() => {
            navigation.navigate(HomeNavigation.SELECT_LOCATION_SCREEN);
            StorageUtils.removeSignupStatus();
          }}>
          <LinearGradient
            colors={['#F9C313', '#FCA511']}
            style={styles.skipButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.skipText}>Skip</Text>
          </LinearGradient>
        </TouchableOpacity> */}
        </View>

        {/* Input Fields */}
        <View style={styles.row}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Company Name</Text>
            <Controller
              control={control}
              rules={{ required: "Company name is required" }}
              name="company_name"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    style={[
                      styles.input,
                      errors.company_name && styles.inputError,
                    ]}
                    placeholder="Company Name"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor="#999"
                  />
                  {errors.company_name && (
                    <Text style={styles.errorText}>
                      {errors.company_name.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Brand Name</Text>

            <Controller
              control={control}
              rules={{ required: "Brand name is required" }}
              name="brand_name"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    placeholder="Brand Name"
                    style={[
                      styles.input,
                      errors.brand_name && styles.inputError,
                    ]}
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor="#999"
                  />
                  {errors.brand_name && (
                    <Text style={styles.errorText}>
                      {errors.brand_name.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>
        </View>

        {/* Email field */}
        <View style={{ width: "95%" }}>
          <Text style={styles.label}>E-mail</Text>
          <Controller
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            }}
            name="email"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  style={[styles.inputFull, errors.email && styles.inputError]}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  onChangeText={onChange}
                  value={value}
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email.message}</Text>
                )}
              </>
            )}
          />
        </View>
        {/* Address */}
        {/* <View style={{ width: "95%" }}>
          <Text style={styles.label}>Address</Text>

          <Controller
            control={control}
            rules={{ required: "Address is required" }}
            name="address"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  style={[
                    styles.inputFull,
                    errors.address && styles.inputError,
                  ]}
                  placeholder="Enter your address"
                  placeholderTextColor="#999"
                  onChangeText={onChange}
                  value={value}
                />
                {errors.address && (
                  <Text style={styles.errorText}>{errors.address.message}</Text>
                )}
              </>
            )}
          />
        </View> */}

        {/* GST */}
        <View style={{ width: "95%" }}>
          <Text style={styles.label}>GST</Text>
          <Controller
            control={control}
            rules={{
              validate: (value) => {
                if (value && value.trim()) {
                  const gstRegex =
                    /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;
                  if (!gstRegex.test(value.toUpperCase())) {
                    return "Please enter a valid GSTIN";
                  }
                }
                return true;
              },
            }}
            name="gst"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  style={[styles.inputFull, errors.gst && styles.inputError]}
                  placeholder="Enter GST number"
                  placeholderTextColor="#999"
                  onChangeText={onChange}
                  value={value}
                  keyboardType="default"
                  autoCapitalize="characters"
                />
                {errors.gst && (
                  <Text style={styles.errorText}>{errors.gst.message}</Text>
                )}
              </>
            )}
          />
          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>
              GST is not a required field. If registered please enter GST number
              to Enable GST settings in app.
            </Text>
          </View>
        </View>

        {/* Profile Picture Upload */}
        <TouchableOpacity
          onPress={selectProfilePicture}
          style={styles.uploadContainer}
        >
          {profileImage ? (
            <Image
              source={{ uri: profileImage.uri }}
              style={styles.profileImage}
            />
          ) : (
            <Text style={styles.initials}>T</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.uploadText}>Upload Logo</Text>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, { opacity: isValid ? 1 : 0.5 }]}
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid || isLoading}
        >
          <LinearGradient
            colors={["#F9C313", "#FCA511"]}
            style={styles.gradientButton}
          >
            <Text style={styles.submitText}>Submit</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Terms and Privacy Policy */}
        <View style={styles.footer}>
          <Text style={styles.termsText}>
            By continuing, you agree to our {"\n"}
            <Text
              onPress={() => navigation.navigate(HomeNavigation.TERMS_SCREEN)}
              style={styles.linkText}
            >
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text
              onPress={() =>
                navigation.navigate(HomeNavigation.PRIVACY_POLICY_SCREEN)
              }
              style={styles.linkText}
            >
              Privacy Policy
            </Text>
            .
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignupDetailScreen;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  scrollContainer: {
    alignItems: "center",
    flexGrow: 1,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20@s",
  },
  headerTitle: {
    fontSize: "24@s",
    fontWeight: "900",
    color: "#222",
  },
  skipButton: {
    borderRadius: 20,
    overflow: "hidden", // To ensure the gradient respects the border radius
  },

  skipButtonGradient: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  skipText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "20@s",
    padding: 10,
    textAlign: "left",
  },
  inputWrapper: {
    width: "48%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  input: {
    backgroundColor: "#FFF7DD",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    color: "#333",
    marginBottom: 20,
    borderColor: "#FCA511",
    borderWidth: 1,
  },
  inputFull: {
    backgroundColor: "#FFF7DD",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    width: "100%",
    marginBottom: 25,
    color: "#333",
    textAlign: "left",
    borderColor: "#FCA511",
    borderWidth: 1,
  },
  uploadContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF7DD",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  initials: {
    fontSize: 32,
    color: "#FCA511",
    fontWeight: "bold",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  uploadText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "800",
    color: "#000",
  },
  submitButton: {
    marginVertical: "20@s",
    width: "90%",
  },
  gradientButton: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  submitText: {
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
  footer: {
    marginTop: "auto",
    marginBottom: "20@s",
    width: "100%",
    alignItems: "center",
  },
  inputError: {
    borderColor: "#FF0000",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    marginTop: -15,
    marginBottom: 10,
    marginLeft: 4,
  },
  noteContainer: {
    marginBottom: 10,
    padding: 12,
    backgroundColor: "#FFF3CD",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FFC107",
  },
  noteText: {
    fontSize: 12,
    color: "#856404",
    lineHeight: 18,
  },
});

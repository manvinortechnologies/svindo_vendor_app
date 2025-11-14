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
import { useAddCompanyMutation } from "../services/api/state-api-slice";
import { HomeNavigation } from "../constants/app-routes.constants";
import { useForm, Controller } from "react-hook-form";
import { StorageUtils } from "../utils/storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScaledSheet } from "react-native-size-matters";
import Loading from "../CommonComponent/Loading";

type FormData = {
  company_name: string;
  brand_name: string;
  email: string;
  address: string;
};
const SignupDetailScreen: React.FC<SignUpDetailScreenProps> = ({
  navigation,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      company_name: "",
      brand_name: "",
      email: "",
      address: "",
    },
    mode: "onChange",
  });

  const [profileImage, setProfileImage] = useState<{
    uri: string;
    type: string;
    name: string;
  } | null>(null);
  const [addCompany, { error: signupError }] = useAddCompanyMutation();
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

      console.log("ImageCropPicker response--->", result);

      // Validate that we have a valid path
      if (!result.path) {
        console.error("No path in ImageCropPicker result");
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (result.size && result.size > maxSize) {
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
      console.log("ImageCropPicker error--->", error);

      // Check if user cancelled
      if (error.code === "E_PICKER_CANCELLED") {
        return; // User cancelled, don't show error
      }

      console.error("Failed to access media library:", error.message);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    if (signupError) {
      console.log("Signup Error:", signupError);
      return;
    }
    try {
      const formData = new FormData();

      formData.append("company_name", data.company_name);
      formData.append("brand_name", data.brand_name);
      formData.append("email", data.email);
      formData.append("address", data.address);

      if (profileImage) {
        formData.append("profile_image", {
          uri: profileImage.uri,
          type: profileImage.type,
          name: profileImage.name,
        });
      }

      const res = await addCompany(formData).unwrap();

      StorageUtils.removeSignupStatus();
      StorageUtils.removeAdminProfile();
      StorageUtils.setBusinessProfile(JSON.stringify(res));
      navigation.reset({
        index: 0,
        routes: [{ name: HomeNavigation.BOTTOM_NAVIGATION }],
      });
    } catch (error) {
      console.log("Comapny Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
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
              name="company_name"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Company Name"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#999"
                />
              )}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Brand Name</Text>

            <Controller
              control={control}
              name="brand_name"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Brand Name"
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#999"
                />
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
              <TextInput
                style={styles.inputFull}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </View>
        {/* Address */}
        <View style={{ width: "95%" }}>
          <Text style={styles.label}>Address</Text>

          <Controller
            control={control}
            rules={{ required: "Address is required" }}
            name="address"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.inputFull}
                placeholder="Enter your address"
                placeholderTextColor="#999"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
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
            <Text style={styles.linkText}>Terms of Service</Text> and{" "}
            <Text style={styles.linkText}>Privacy Policy</Text>.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
});

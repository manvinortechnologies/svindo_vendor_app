import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useForm, Controller } from "react-hook-form";
import CustomTextInput from "../CommonComponent/CustomeTextInput";
import Loading from "../CommonComponent/Loading";
import apis from "../services/api/api";
import api from "../services/api/api";
import { DEFAULT_STATUS_CODE_SUCCESS } from "../constants/api-const";
import { HomeNavigation } from "../constants/app-routes.constants";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ScaledSheet } from "react-native-size-matters";
import { StorageUtils } from "../utils/storage";
import {
  validatePassword,
  getPasswordStrength,
  getPasswordStrengthColor,
} from "../utils/validation";
import Icon from "react-native-vector-icons/Ionicons";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const AdminProfile = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const {
    control,
    handleSubmit,
    watch,
    setError,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit", // only show errors after submit
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong"
  >("weak");
  const [passwordValidation, setPasswordValidation] = useState<{
    isValid: boolean;
    errors: string[];
  }>({ isValid: false, errors: [] });
  const values = watch();
  const allFieldsFilled = Object.values(values).every((v) => v.trim() !== "");

  const handlePasswordChange = (password: string) => {
    const strength = getPasswordStrength(password);
    const validation = validatePassword(password);
    setPasswordStrength(strength);
    setPasswordValidation(validation);
  };

  const onSubmit = async (data: FormData) => {
    const isValid = await trigger([
      "firstName",
      "email",
      "password",
      "confirmPassword",
    ]);

    if (!isValid) return;

    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }
    const bodyData = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    try {
      setIsLoading(true);
      const res = await api.put("users/profile/me/", bodyData);
      if (res.status == DEFAULT_STATUS_CODE_SUCCESS) {
        navigation.navigate(HomeNavigation.SIGNUP_DETAIL_SCREEN);
        StorageUtils.setAdminProfile("ADMIN_PROFILE");
      }
    } catch (error) {
      console.log("error--->", error);
    } finally {
      setIsLoading(false);
    }

    // API call logic here
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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Admin Profile</Text>
        </View>

        {/* Name Fields */}
        <View style={styles.row}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>First Name</Text>
            <Controller
              control={control}
              name="firstName"
              rules={{ required: "First name is required" }}
              render={({ field: { onChange, value } }) => (
                <>
                  <CustomTextInput
                    placeholder="Enter your First Name"
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.firstName && (
                    <Text style={styles.errorText}>
                      {errors.firstName.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Last Name</Text>
            <Controller
              control={control}
              name="lastName"
              rules={{ required: "Last name is required" }}
              render={({ field: { onChange, value } }) => (
                <>
                  <CustomTextInput
                    placeholder="Enter your Last Name"
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.lastName && (
                    <Text style={styles.errorText}>
                      {errors.lastName.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>
        </View>

        {/* Email */}
        <View style={styles.fullWidth}>
          <Text style={styles.label}>E-mail</Text>
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Invalid email format",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <>
                <CustomTextInput
                  placeholder="Enter your email"
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email.message}</Text>
                )}
              </>
            )}
          />
        </View>

        {/* Password */}
        <View style={styles.fullWidth}>
          <Text style={styles.label}>Password (For Web Access )</Text>
          <Controller
            control={control}
            name="password"
            rules={{
              required: "Password is required",
              validate: (value) => {
                const validation = validatePassword(value);
                if (!validation.isValid) {
                  return validation.errors[0]; // Return the first error
                }
                return true;
              },
            }}
            render={({ field: { onChange, value } }) => (
              <>
                <CustomTextInput
                  placeholder="Enter your password"
                  onChangeText={(text) => {
                    onChange(text);
                    handlePasswordChange(text);
                  }}
                  value={value}
                  secureTextEntry={true}
                  showPasswordToggle={true}
                />
                {value && passwordValidation.errors.length > 0 && (
                  <View style={styles.passwordValidationContainer}>
                    {passwordValidation.errors.map((error, index) => (
                      <View key={index} style={styles.validationItem}>
                        <Icon
                          name="close-circle"
                          size={16}
                          color="#FF5722"
                          style={styles.validationIcon}
                        />
                        <Text style={styles.validationErrorText}>{error}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {value && passwordValidation.isValid && (
                  <View style={styles.passwordValidationContainer}>
                    <View style={styles.validationItem}>
                      <Icon
                        name="checkmark-circle"
                        size={16}
                        color="#4CAF50"
                        style={styles.validationIcon}
                      />
                      <Text style={styles.validationSuccessText}>
                        Password meets all requirements
                      </Text>
                    </View>
                  </View>
                )}
                {errors.password && (
                  <Text style={styles.errorText}>
                    {errors.password.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        {/* Confirm Password */}
        <View style={styles.fullWidth}>
          <Text style={styles.label}>Confirm Password</Text>
          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: "Confirm password is required",
              validate: (val) =>
                val === watch("password") || "Passwords do not match",
            }}
            render={({ field: { onChange, value } }) => (
              <>
                <CustomTextInput
                  placeholder="Confirm your password"
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={true}
                  showPasswordToggle={true}
                />
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        {/* Submit Button */}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit(onSubmit)}
        >
          <LinearGradient
            colors={["#F9C313", "#FCA511"]}
            style={styles.gradientButton}
          >
            <Text style={styles.submitText}>Submit</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Footer */}
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

export default AdminProfile;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: "20@s",
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
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 28,
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
    marginTop: 30,
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
    // position: "absolute",
    // bottom: 30,
    width: "100%",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
  fullWidth: {
    width: "95%",
    marginTop: 15,
  },
  passwordValidationContainer: {
    marginTop: 8,
  },
  validationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  validationIcon: {
    marginRight: 8,
  },
  validationErrorText: {
    fontSize: 12,
    color: "#FF5722",
    flex: 1,
  },
  validationSuccessText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
    flex: 1,
  },
});

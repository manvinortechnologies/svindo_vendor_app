import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MainContainer from "../CommonComponent/MainContainer";
import CustomSwitch from "../CommonComponent/CustomSwitch";
import Loading from "../CommonComponent/Loading";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import { InputBox } from "../CommonComponent/InputBox";
import ModalUpdatePhoto from "../Modals/ModalUpdatePhoto";
import Toast from "react-native-toast-message";
import CustomDropdown from "../CommonComponent/CustomDropdown";
import { DropDownOption } from "../CommonComponent/CustomDropdown";
import { StorageUtils } from "../utils/storage";

const CompanyProfile = ({ navigation, route }: any) => {
  const profileId = route?.params?.id;
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [imageFile, setImageFile] = useState<any>();
  const [imagePickerModel, setImagePickerModel] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [states, setStates] = useState<DropDownOption[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [form, setForm] = useState({
    companyName: "",
    gstin: "",
    email: "",
    contact: "",
    state: "",
    brandName: "",
    billing: {
      address1: "",
      address2: "",
      pincode: "",
      city: "",
      state: "",
      country: "",
    },
    shipping: {
      address1: "",
      address2: "",
      pincode: "",
      city: "",
      state: "",
      country: "",
    },
    pan: "",
    website: "",
    upiId: "",
    id: "",
    isDefault: true,
  });

  useEffect(() => {
    getProfileData();
  }, [profileId]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get("masters/get-state/");
        if (Array.isArray(response?.data)) {
          setStates(response.data);
          console.log(
            "response.data",
            response.data
              .find((item: any) => item.id.toString() === form.state)
              ?.id.toString()
          );
          setForm((prev) => ({
            ...prev,
            state:
              response.data
                .find((item: any) => item.id.toString() === prev.state)
                ?.id.toString() || "",
          }));
        }
      } catch (error) {
        console.error("Failed to load states:", error);
      }
    };

    form.companyName && fetchStates();
  }, [form.companyName]);

  const getProfileData = async () => {
    try {
      setIsLoading(true);
      let data;

      if (profileId) {
        // If profileId is provided, fetch specific company
        const apiEnd = `${API_ROUTES.companyProfle}/${profileId}/`;
        const res = await api.get(apiEnd);
        data = res.data;
      } else {
        // If no profileId, fetch all companies and get first one
        const res = await api.get(API_ROUTES.companyProfle);
        const companies = res.data;
        data = companies && companies.length > 0 ? companies[0] : null;

        if (!data) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "No company profile found.",
          });
          return;
        }
        if (data) {
          StorageUtils.setCompanyProfile(data);
        }
      }

      // Handle both old format (comma-separated) and new format (separate fields)
      const billingFields = data.address_line_1
        ? {
            address1: data.address_line_1 || "",
            address2: data.address_line_2 || "",
            pincode: data.pincode || "",
            city: data.city || "",
            state: data.state_details?.id.toString() || "",
            country: data.country || "India",
          }
        : splitAddress(data.billing_address);

      const shippingFields = data.shipping_address_line_1
        ? {
            address1: data.shipping_address_line_1 || "",
            address2: data.shipping_address_line_2 || "",
            pincode: data.shipping_pincode || "",
            city: data.shipping_city || "",
            state:
              data.shipping_state_details?.id.toString() ||
              data.shipping_state?.toString() ||
              "",
            country: data.shipping_country || "India",
          }
        : splitAddress(data.address);

      const state =
        data.state_details?.id.toString() || data.state?.toString() || "";
      setForm({
        companyName: data.company_name || "",
        gstin: data.gstin || "",
        email: data.email || "",
        contact: data.contact || "",
        brandName: data.brand_name || "",
        state: state || "",
        billing: billingFields,
        shipping: shippingFields,
        pan: data.pan || "",
        website: data.website || "",
        upiId: data.upi_id || "",
        id: data.id || "",
        isDefault: data.is_default !== undefined ? data.is_default : true,
      });

      setSameAsBilling(data.shipping_same_as_billing || false);

      setImageFile({ uri: data.profile_image });
    } catch (error) {
      console.log("getProfileData error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch company profile data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const splitAddress = (addressString: string) => {
    const parts = addressString?.split(",").map((item) => item.trim()) || [];
    return {
      address1: parts[0] || "",
      address2: parts[1] || "",
      pincode: parts[2] || "",
      city: parts[3] || "",
      state: parts[4] || "",
      country: parts[5] || "",
    };
  };

  const toggleSameAsBilling = () => {
    const updatedSame = !sameAsBilling;
    if (updatedSame) {
      setForm((prev) => ({
        ...prev,
        shipping: { ...prev.billing },
      }));
      // Clear shipping errors when same as billing is enabled
      setErrors((prev) => {
        const newErrors = { ...prev };
        Object.keys(newErrors).forEach((key) => {
          if (key.startsWith("shipping_")) {
            delete newErrors[key];
          }
        });
        return newErrors;
      });
    }
    setSameAsBilling(updatedSame);
  };

  const handleBillingChange = (field: string, value: string) => {
    const updatedBilling = { ...form.billing, [field]: value };
    setForm((prev) => ({
      ...prev,
      billing: updatedBilling,
      shipping: sameAsBilling ? { ...updatedBilling } : prev.shipping,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validate required fields
    if (!form.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    if (!form.contact.trim()) {
      console.log("form.contact", form.contact);
      newErrors.contact = "Contact number is required";
    } else if (form.contact.length !== 10) {
      newErrors.contact = "Contact number must be 10 digits";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!form.state) {
      newErrors.state = "State is required";
    }

    // Validate GSTIN (optional but must be valid format if provided)
    if (form.gstin.trim()) {
      const gstRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;
      if (!gstRegex.test(form.gstin.toUpperCase())) {
        newErrors.gstin = "Please enter a valid GSTIN";
      }
    }

    // Validate billing address
    if (!form.billing.address1.trim()) {
      newErrors.billing_address1 = "Billing address line 1 is required";
    }
    if (!form.billing.city.trim()) {
      newErrors.billing_city = "Billing city is required";
    }
    if (!form.billing.pincode.trim()) {
      newErrors.billing_pincode = "Billing pincode is required";
    } else if (form.billing.pincode.length !== 6) {
      newErrors.billing_pincode = "Pincode must be 6 digits";
    }

    // Validate shipping address (only if not same as billing)
    if (!sameAsBilling) {
      if (!form.shipping.address1.trim()) {
        newErrors.shipping_address1 = "Shipping address line 1 is required";
      }
      if (!form.shipping.city.trim()) {
        newErrors.shipping_city = "Shipping city is required";
      }
      if (!form.shipping.pincode.trim()) {
        newErrors.shipping_pincode = "Shipping pincode is required";
      } else if (form.shipping.pincode.length !== 6) {
        newErrors.shipping_pincode = "Pincode must be 6 digits";
      }
    }

    // Validate PAN (optional but must be valid format if provided)
    if (form.pan.trim()) {
      const panRegex = /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/;
      if (!panRegex.test(form.pan.toUpperCase())) {
        newErrors.pan = "Please enter a valid PAN";
      }
    }

    // Validate UPI ID (optional but must be valid format if provided)
    if (form.upiId.trim()) {
      const upiRegex = /^[0-9A-Za-z.-]{2,256}@[A-Za-z]{2,64}$/;
      if (!upiRegex.test(form.upiId)) {
        newErrors.upiId = "Please enter a valid UPI ID";
      }
    }

    // Validate Website (optional but must be valid format if provided)
    if (form.website.trim()) {
      const websiteRegex =
        /^((https|ftp|smtp):\/\/)(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/;
      if (!websiteRegex.test(form.website.toLowerCase())) {
        newErrors.website = "Please enter a valid website URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveCompany = async () => {
    // Validate form before saving
    if (!validateForm()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill all required fields",
      });
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();

      // Basic company information
      formData.append("company_name", form.companyName);
      formData.append("brand_name", form.brandName);
      formData.append("email", form.email || "");
      formData.append("gstin", form.gstin || "");
      formData.append("is_gst_registered", form.gstin ? "true" : "false");
      formData.append("contact", form.contact || "");

      // Billing address - separate fields
      formData.append("address_line_1", form.billing.address1 || "");
      formData.append("address_line_2", form.billing.address2 || "");
      formData.append("pincode", form.billing.pincode || "");
      formData.append("city", form.billing.city || "");
      formData.append("state", form.state ? parseInt(form.state) : "");
      formData.append("country", form.billing.country || "India");

      // Shipping address - separate fields
      formData.append(
        "shipping_same_as_billing",
        sameAsBilling ? "true" : "false"
      );
      formData.append("shipping_address_line_1", form.shipping.address1 || "");
      formData.append("shipping_address_line_2", form.shipping.address2 || "");
      formData.append("shipping_pincode", form.shipping.pincode || "");
      formData.append("shipping_city", form.shipping.city || "");
      // Use billing state if same as billing, otherwise try to parse shipping state
      const shippingStateId = sameAsBilling
        ? form.state
          ? parseInt(form.state)
          : ""
        : form.shipping.state && !isNaN(parseInt(form.shipping.state))
        ? parseInt(form.shipping.state)
        : "";
      formData.append("shipping_state", shippingStateId);
      formData.append("shipping_country", form.shipping.country || "India");

      // Optional fields
      formData.append("pan", form.pan || "");
      formData.append("upi_id", form.upiId || "");
      formData.append("website", form.website || "");
      formData.append("is_default", form.isDefault ? "true" : "false");

      if (imageFile?.uri) {
        formData.append("profile_image", {
          uri: imageFile.uri,
          name: imageFile.name || "file.jpg",
          type: imageFile.type || "image/jpeg",
        });
      }

      const apiEnd = `${API_ROUTES.companyProfle}${profileId || form.id}/`;

      const response = await api[profileId || form.id ? "put" : "post"](
        apiEnd,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201 || response.status === 200) {
        // Save updated profile to storage
        StorageUtils.setCompanyProfile(response.data);

        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Company Add successfully!",
        });
        navigation.goBack();
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Update failed!",
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to save company profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <MainContainer>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Company Profile</Text>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            {/* Profile Image */}
            <TouchableOpacity
              style={styles.profileContainer}
              onPress={() => setImagePickerModel(true)}
            >
              <View style={styles.profileCircle}>
                {imageFile?.uri && (
                  <Image
                    source={{ uri: imageFile?.uri }}
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "cover",
                      borderRadius: 40,
                    }}
                  />
                )}
              </View>
              <Text style={styles.profileText}>Update profile picture</Text>
            </TouchableOpacity>

            {/* Inputs */}
            <InputBox
              label="Company Name"
              placeholder="Your Business name"
              value={form.companyName}
              onChangeText={(text) => {
                setForm({ ...form, companyName: text });
                if (errors.companyName) {
                  setErrors((prev) => ({ ...prev, companyName: "" }));
                }
              }}
              error={errors.companyName}
            />
            <InputBox
              label="GSTIN (Optional)"
              autoCapitalize="characters"
              placeholder="GSTIN"
              value={form.gstin}
              onChangeText={(text) => {
                setForm({ ...form, gstin: text.toUpperCase() });
                if (errors.gstin) {
                  setErrors((prev) => ({ ...prev, gstin: "" }));
                }
              }}
              error={errors.gstin}
            />
            <InputBox
              label="Email id"
              placeholder="example@email.com"
              keyboardType="email-address"
              value={form.email}
              onChangeText={(text) => {
                setForm({ ...form, email: text });
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: "" }));
                }
              }}
              error={errors.email}
            />
            <InputBox
              label="Contact"
              placeholder="9876543210"
              keyboardType="number-pad"
              value={form.contact}
              maxLength={10}
              onChangeText={(text) => {
                setForm({ ...form, contact: text });
                if (errors.contact) {
                  setErrors((prev) => ({ ...prev, contact: "" }));
                }
              }}
              error={errors.contact}
            />
            <InputBox
              label="Brand Name"
              placeholder="Your brand"
              value={form.brandName}
              onChangeText={(text) => setForm({ ...form, brandName: text })}
            />
            <Text style={styles.dropdownLabel}>State</Text>
            <CustomDropdown
              placeholder="Select State"
              options={states}
              onSelect={(option) => {
                setForm((prev) => ({
                  ...prev,
                  state: option?.id?.toString() || "",
                }));
                if (errors.state) {
                  setErrors((prev) => ({ ...prev, state: "" }));
                }
              }}
              selectedValue={
                states.find((item) => item.id.toString() === form.state) || null
              }
              dropDownBoxStyle={[
                styles.dropdown,
                errors.state && styles.dropdownError,
              ]}
            />
            {errors.state && (
              <Text style={styles.errorText}>{errors.state}</Text>
            )}

            {/* Billing Address */}
            <Text style={styles.sectionTitle}>Billing Address</Text>
            <View style={styles.addressContainer}>
              {Object.keys(form.billing).map((key, i) => {
                const errorKey = `billing_${key}` as keyof typeof errors;
                return (
                  <InputBox
                    key={i}
                    placeholder={key.replace(/^\w/, (c) => c.toUpperCase())}
                    background="#FFEBCB"
                    value={form.billing[key as keyof typeof form.billing]}
                    keyboardType={key === "pincode" ? "number-pad" : "default"}
                    maxLength={key === "pincode" ? 6 : undefined}
                    onChangeText={(text) => {
                      handleBillingChange(key, text);
                      if (errors[errorKey]) {
                        setErrors((prev) => ({ ...prev, [errorKey]: "" }));
                      }
                    }}
                    error={errors[errorKey]}
                  />
                );
              })}
            </View>

            {/* Shipping Address */}
            <View style={styles.shippingHeader}>
              <Text style={styles.sectionTitle}>Shipping Address</Text>
              <View style={styles.sameAsBilling}>
                <Text style={styles.sameText}>Same as Billing</Text>
                <CustomSwitch
                  value={sameAsBilling}
                  onValueChange={toggleSameAsBilling}
                />
              </View>
            </View>
            <View style={styles.addressContainer}>
              {Object.keys(form.shipping).map((key, i) => {
                const errorKey = `shipping_${key}` as keyof typeof errors;
                return (
                  <InputBox
                    key={i}
                    placeholder={key.replace(/^\w/, (c) => c.toUpperCase())}
                    background="#FFEBCB"
                    editable={!sameAsBilling}
                    value={form.shipping[key as keyof typeof form.shipping]}
                    keyboardType={key === "pincode" ? "number-pad" : "default"}
                    maxLength={key === "pincode" ? 6 : undefined}
                    onChangeText={(text) => {
                      setForm((prev) => ({
                        ...prev,
                        shipping: { ...prev.shipping, [key]: text },
                      }));
                      if (errors[errorKey]) {
                        setErrors((prev) => ({ ...prev, [errorKey]: "" }));
                      }
                    }}
                    error={!sameAsBilling ? errors[errorKey] : undefined}
                  />
                );
              })}
            </View>

            {/* Optional Fields */}
            <Text style={styles.optionalTitle}>Optional Fields</Text>
            <InputBox
              placeholder="PAN"
              background="#FFEBCB"
              autoCapitalize="characters"
              value={form.pan}
              onChangeText={(text) => {
                setForm({ ...form, pan: text.toUpperCase() });
                if (errors.pan) {
                  setErrors((prev) => ({ ...prev, pan: "" }));
                }
              }}
              error={errors.pan}
            />
            <InputBox
              placeholder="Website"
              background="#FFEBCB"
              value={form.website}
              onChangeText={(text) => {
                setForm({ ...form, website: text });
                if (errors.website) {
                  setErrors((prev) => ({ ...prev, website: "" }));
                }
              }}
              error={errors.website}
            />
            <InputBox
              placeholder="UPI Id"
              background="#FFEBCB"
              value={form.upiId}
              onChangeText={(text) => {
                setForm({ ...form, upiId: text });
                if (errors.upiId) {
                  setErrors((prev) => ({ ...prev, upiId: "" }));
                }
              }}
              error={errors.upiId}
            />

            {/* Save */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                handleSaveCompany();
              }}
            >
              <Text style={styles.saveText}>Save & Update</Text>
            </TouchableOpacity>

            <Loading visible={isLoading} />
            <ModalUpdatePhoto
              isVisible={imagePickerModel}
              onClose={() => setImagePickerModel(false)}
              onSelectedFile={(file: any) => setImageFile(file)}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </MainContainer>
  );
};
export default CompanyProfile;

// ========== Reusable InputBox Component ==========

// ========== Styles ==========
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 16,
  },
  backButton: {
    backgroundColor: "#FCA511",
    borderRadius: 20,
    padding: 6,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
    marginRight: 40,
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileCircle: {
    backgroundColor: "#FFF2D6",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FCA511",
  },
  profileText: {
    marginTop: 8,
    fontWeight: "600",
    color: "#000",
  },
  dropdownLabel: {
    marginTop: 12,
    marginBottom: 6,
    fontWeight: "600",
    color: "#000",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FCA511",
    marginVertical: 8,
  },
  optionalTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginVertical: 10,
  },
  addressContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 16,
  },
  shippingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sameAsBilling: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sameText: {
    color: "#000",
    fontSize: 13,
    marginRight: 6,
  },
  dropdown: {
    marginBottom: 12,
  },
  dropdownError: {
    borderColor: "#FF0000",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
  saveButton: {
    backgroundColor: "#FCA511",
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 20,
  },
  saveText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
  },
});

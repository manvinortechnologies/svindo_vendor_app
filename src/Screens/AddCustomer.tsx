import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import Headerwithback from "./Headerwithback";
import CustomSwitch from "./CustomSwitch";
import MainContainer from "../CommonComponent/MainContainer";
import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";
import { useRoute, RouteProp } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import CustomDropdown from "../CommonComponent/CustomDropdown";
import { StorageUtils } from "../utils/storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type RootStackParamList = {
  AddCustomer: {
    isEdit?: boolean;
    customer?: any;
  };
};

type AddCustomerRouteProp = RouteProp<RootStackParamList, "AddCustomer">;

const AddCustomer = ({ navigation }: any) => {
  const route = useRoute<AddCustomerRouteProp>();
  const isEdit = route.params?.isEdit || false;
  const customer = route.params?.customer || {};
  const insets = useSafeAreaInsets();
  const [sameAsBilling, setSameAsBilling] = useState(false);
  // const [currentUser, setCurrentUser] = useState<any>(null);

  // useEffect(() => {
  //   const user = StorageUtils.getUserData();
  //   setCurrentUser(user);
  //   console.log("currentUser-->", currentUser);
  // }, []);

  const [basicDetails, setBasicDetails] = useState({
    name: "",
    mobile: "",
    email: "",
    opening_balance: "0",
    state: "",
  });

  const [businessDetails, setBusinessDetails] = useState({
    name: "",
    gst: "",
    aadhar: "",
    pan: "",
  });

  const [billingAddress, setBillingAddress] = useState({
    line1: "",
    line2: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
  });

  const [dispatchAddress, setDispatchAddress] = useState({
    line1: "",
    line2: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
  });

  const [transportName, setTransportName] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [states, setStates] = useState<{ id: string | number; name: string }[]>(
    []
  );

  useEffect(() => {
    if (isEdit && customer) {
      // Set basic details
      setBasicDetails({
        name: customer.name || "",
        mobile: customer.contact || customer.phone || "",
        email: customer.email || "",
        opening_balance:
          customer.opening_balance?.toString() ||
          customer.balance?.toString() ||
          "0",
        state: customer.state || customer.billing_state || "",
      });

      // Set business details
      setBusinessDetails({
        name: customer.company_name || "",
        gst: customer.gst_number || "",
        aadhar: customer.aadhar_number || "",
        pan: customer.pan_number || "",
      });

      // Set billing address
      setBillingAddress({
        line1: customer.billing_address_line1 || "",
        line2: customer.billing_address_line2 || "",
        pincode: customer.billing_pincode || "",
        city: customer.billing_city || "",
        state: customer.billing_state || "",
        country: customer.billing_country || "",
      });

      // Set dispatch address
      setDispatchAddress({
        line1: customer.dispatch_address_line1 || "",
        line2: customer.dispatch_address_line2 || "",
        pincode: customer.dispatch_pincode || "",
        city: customer.dispatch_city || "",
        state: customer.dispatch_state || "",
        country: customer.dispatch_country || "",
      });

      // Set transport name
      setTransportName(customer.transport_name || "");

      // Set same as billing toggle
      setSameAsBilling(
        customer.dispatch_address_line1 === customer.billing_address_line1 &&
          customer.dispatch_address_line1 !== ""
      );
    }
  }, [isEdit, customer]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get("masters/get-state/");
        if (response?.data) {
          const formattedStates = response.data.map((item: any) => ({
            id: item.id,
            name: item.name,
          }));
          setStates(formattedStates);
        }
      } catch (error) {
        console.error("Failed to load states:", error);
      }
    };

    fetchStates();
  }, []);

  const validateForm = () => {
    let tempErrors: { [key: string]: string } = {};

    // Validate required fields
    if (!basicDetails.name.trim()) {
      tempErrors.name = "Customer name is required";
    }
    if (!basicDetails.mobile.trim()) {
      tempErrors.mobile = "Mobile number is required";
    } else if (basicDetails.mobile.length !== 10) {
      tempErrors.mobile = "Mobile number must be 10 digits";
    }
    if (basicDetails.email.trim() && !/\S+@\S+\.\S+/.test(basicDetails.email)) {
      tempErrors.email = "Please enter a valid email";
    }
    if (!basicDetails.opening_balance.trim()) {
      tempErrors.opening_balance = "Opening balance is required";
    } else if (isNaN(Number(basicDetails.opening_balance))) {
      tempErrors.opening_balance = "Opening balance must be a number";
    }
    if (!basicDetails.state) {
      tempErrors.state = "Please select a state";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handelSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        name: basicDetails.name,
        email: basicDetails.email,
        contact: basicDetails.mobile,
        opening_balance: basicDetails.opening_balance, // or you can add balance field in your state
        state: basicDetails.state,

        company_name: businessDetails.name,
        gst_number: businessDetails.gst,
        aadhar_number: businessDetails.aadhar,
        pan_number: businessDetails.pan,

        billing_address_line1: billingAddress.line1,
        billing_address_line2: billingAddress.line2,
        billing_pincode: billingAddress.pincode,
        billing_city: billingAddress.city,
        billing_state: billingAddress.state,
        billing_country: billingAddress.country,
        dispatch_address_line1: dispatchAddress.line1,
        dispatch_address_line2: dispatchAddress.line2,
        dispatch_pincode: dispatchAddress.pincode,
        dispatch_city: dispatchAddress.city,
        dispatch_state: dispatchAddress.state,
        dispatch_country: dispatchAddress.country,
        transport_name: transportName,
      };

      let res;
      if (isEdit && customer.id) {
        // Update existing customer
        res = await api.put(`vendor/customer/${customer.id}/`, payload);
        if (res.status === 200) {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "Customer information updated successfully.",
          });
          navigation.goBack();
        }
      } else {
        // Create new customer
        res = await api.post("vendor/customer/", payload);
        if (res.status === 201) {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "Customer information saved successfully.",
          });
          navigation.goBack();
        }
      }
    } catch (error) {
      console.error("Error saving customer:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to save customer information. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sync dispatch address if "Same as Billing" is enabled
  const handleBillingToggle = (value: boolean) => {
    setSameAsBilling(value);
    if (value) {
      setDispatchAddress({ ...billingAddress });
    } else {
      setDispatchAddress({
        line1: "",
        line2: "",
        pincode: "",
        city: "",
        state: "",
        country: "",
      });
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Headerwithback title={isEdit ? "Edit Customer" : "Add Customer"} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContainer}
        >
          {/* Basic Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Details</Text>
            <View style={styles.sectionContent}>
              {(
                [
                  { label: "Customer Name", key: "name" },
                  { label: "Mobille Number", key: "mobile" },
                  { label: "Email Id", key: "email" },
                  { label: "Credit Balance", key: "opening_balance" },
                ] as { label: string; key: keyof typeof basicDetails }[]
              ).map(({ label, key }, index) => (
                <View key={index} style={styles.inputWrapper}>
                  <Text style={styles.label}>{label}</Text>
                  <TextInput
                    placeholder={`Enter ${label}`}
                    placeholderTextColor="#999"
                    style={[styles.input, errors[key] && styles.inputError]}
                    value={basicDetails[key]}
                    editable={!(isEdit && key === "opening_balance")}
                    keyboardType={
                      key === "mobile"
                        ? "numeric"
                        : key === "opening_balance"
                        ? "numeric"
                        : key === "email"
                        ? "email-address"
                        : "ascii-capable"
                    }
                    maxLength={key === "mobile" ? 10 : 100}
                    onChangeText={(text) => {
                      setBasicDetails((prev) => ({ ...prev, [key]: text }));
                      // Clear error when user starts typing
                      if (errors[key]) {
                        setErrors((prev) => ({ ...prev, [key]: "" }));
                      }
                    }}
                    selectTextOnFocus={key !== "opening_balance"}
                  />
                  {errors[key] && (
                    <Text style={styles.errorText}>{errors[key]}</Text>
                  )}
                </View>
              ))}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>State</Text>
                <CustomDropdown
                  placeholder="Select State"
                  options={states}
                  onSelect={(option) => {
                    setBasicDetails((prev) => ({
                      ...prev,
                      state: option.id,
                    }));
                    if (errors.state) {
                      setErrors((prev) => ({ ...prev, state: "" }));
                    }
                  }}
                  selectedValue={basicDetails.state || null}
                  dropDownBoxStyle={[
                    styles.dropdown,
                    errors.state && styles.inputError,
                  ]}
                />
                {errors.state && (
                  <Text style={styles.errorText}>{errors.state}</Text>
                )}
              </View>
              <TouchableOpacity
                style={[styles.saveButton, { width: "100%" }]}
                onPress={handelSubmit}
              >
                <Text style={styles.saveButtonText}>
                  {isEdit ? "Update for Retail" : "Save for Retail"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Business Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Details</Text>
            <View style={styles.sectionContent}>
              {(
                [
                  { label: "Business Name", key: "name" },
                  { label: "GST", key: "gst" },
                  { label: "Aadhar Number", key: "aadhar" },
                  { label: "Pan", key: "pan" },
                ] as { label: string; key: keyof typeof businessDetails }[]
              ).map(({ label, key }, index) => (
                <View key={index} style={styles.inputWrapper}>
                  <Text style={styles.label}>{label}</Text>
                  <TextInput
                    placeholder={`Enter ${label}`}
                    placeholderTextColor="#999"
                    style={styles.input}
                    maxLength={key === "aadhar" ? 16 : 100}
                    autoCapitalize={key !== "name" ? "characters" : "words"}
                    keyboardType={
                      key === "aadhar" ? "numeric" : "ascii-capable"
                    }
                    value={businessDetails[key]}
                    onChangeText={(text) =>
                      setBusinessDetails((prev) => ({
                        ...prev,
                        [key]: text,
                      }))
                    }
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Billing Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Billing Address</Text>
            <View style={styles.sectionContent}>
              {(
                [
                  { placeholder: "Address Line 1", key: "line1" },
                  { placeholder: "Address Line 2", key: "line2" },
                  { placeholder: "Pincode", key: "pincode" },
                  { placeholder: "City", key: "city" },
                  { placeholder: "State", key: "state" },
                  { placeholder: "Country", key: "country" },
                ] as {
                  placeholder: string;
                  key: keyof typeof billingAddress;
                }[]
              ).map(({ placeholder, key }, idx) => (
                <TextInput
                  key={idx}
                  placeholder={placeholder}
                  placeholderTextColor="#888"
                  style={[styles.input, { marginBottom: 10 }]}
                  keyboardType={key === "pincode" ? "numeric" : "ascii-capable"}
                  maxLength={key === "pincode" ? 6 : 100}
                  value={billingAddress[key]}
                  onChangeText={(text) =>
                    setBillingAddress((prev) => ({ ...prev, [key]: text }))
                  }
                />
              ))}
            </View>
          </View>

          {/* Dispatch Address */}
          <View style={styles.section}>
            <View style={styles.dispatchHeader}>
              <Text style={styles.sectionTitle}>Dispatch Address</Text>
              <View style={styles.sameAsRow}>
                <Text style={styles.sameAsText}>Same as Billing</Text>
                <CustomSwitch
                  value={sameAsBilling}
                  onValueChange={handleBillingToggle}
                />
              </View>
            </View>
            <View style={styles.sectionContent}>
              {(
                [
                  { placeholder: "Address Line 1", key: "line1" },
                  { placeholder: "Address Line 2", key: "line2" },
                  { placeholder: "Pincode", key: "pincode" },
                  { placeholder: "City", key: "city" },
                  { placeholder: "State", key: "state" },
                  { placeholder: "Country", key: "country" },
                ] as {
                  placeholder: string;
                  key: keyof typeof dispatchAddress;
                }[]
              ).map(({ placeholder, key }, idx) => (
                <TextInput
                  key={idx}
                  placeholder={placeholder}
                  placeholderTextColor="#888"
                  style={[styles.input, { marginBottom: 10 }]}
                  value={dispatchAddress[key]}
                  keyboardType={key === "pincode" ? "numeric" : "ascii-capable"}
                  maxLength={key === "pincode" ? 6 : 100}
                  onChangeText={(text) =>
                    setDispatchAddress((prev) => ({ ...prev, [key]: text }))
                  }
                  // editable={!sameAsBilling}
                />
              ))}
            </View>
          </View>

          {/* Transport Name */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Transport Name</Text>
            <TextInput
              placeholder="Transport Name"
              placeholderTextColor="#888"
              style={styles.input}
              value={transportName}
              onChangeText={setTransportName}
            />
          </View>
          <Loading visible={isLoading} />

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handelSubmit}>
            <Text style={styles.saveButtonText}>
              {isEdit ? "Update Customer" : "Save Customer"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AddCustomer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingTop: 15
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FCA311",
    marginBottom: 10,
  },
  sectionContent: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
  },
  inputWrapper: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 5,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#FFF8EB",
    fontSize: 14,
    color: "#000",
  },
  dispatchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sameAsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sameAsText: {
    marginRight: 6,
    fontSize: 12,
    fontWeight: "500",
    color: "#000",
  },
  saveButton: {
    width: "40%",
    alignSelf: "center",
    backgroundColor: "#FCA311",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  inputError: {
    borderColor: "#f44336",
    backgroundColor: "#ffebee",
  },
  dropdown: {
    marginTop: 4,
  },
  errorText: {
    color: "#f44336",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

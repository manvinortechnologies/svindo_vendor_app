import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import Headerwithback from "./Headerwithback";
import MainContainer from "../CommonComponent/MainContainer";
import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";

const AddVendor = ({ navigation }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [basicDetails, setBasicDetails] = useState({
    name: "",
    mobile: "",
    email: "",
    opening_balance: "",
  });

  const [businessDetails, setBusinessDetails] = useState({
    company: "",
    gst: "",
    aadhar: "",
    pan: "",
  });

  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
  });

  const validateForm = () => {
    let tempErrors: { [key: string]: string } = {};

    // Validate required fields
    if (!basicDetails.name.trim()) {
      tempErrors.name = "Vendor name is required";
    }
    if (!basicDetails.mobile.trim()) {
      tempErrors.mobile = "Mobile number is required";
    } else if (basicDetails.mobile.length !== 10) {
      tempErrors.mobile = "Mobile number must be 10 digits";
    }
    if (!basicDetails.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(basicDetails.email)) {
      tempErrors.email = "Please enter a valid email";
    }
    if (!basicDetails.opening_balance.trim()) {
      tempErrors.opening_balance = "Opening balance is required";
    } else if (isNaN(Number(basicDetails.opening_balance))) {
      tempErrors.opening_balance = "Opening balance must be a number";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      setIsLoading(true);
      const payload = {
        name: basicDetails.name,
        contact: basicDetails.mobile,
        email: basicDetails.email,

        company_name: businessDetails.company,
        gst_number: businessDetails.gst,
        aadhar_number: businessDetails.aadhar,
        pan_number: businessDetails.pan,

        billing_address_line1: address.line1,
        billing_address_line2: address.line2,
        billing_pincode: address.pincode,
        billing_city: address.city,
        billing_state: address.state,
        billing_country: address.country,
        balance: basicDetails.opening_balance,
      };

      console.log("Payload to submit:", payload);
      const res = await api.post("vendor/vendor/", payload);
      if (res.status == 201) {
        Alert.alert("Success", "Customer information saved successfully.");
        navigation.goBack();
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
    // Submit to API here
  };

  return (
    <MainContainer>
      <SafeAreaView style={styles.container}>
        <Headerwithback title={"Add Vendor"} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
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
                      { label: "Vendor Name", key: "name" },
                      { label: "Mobille Number", key: "mobile" },
                      { label: "Email Id", key: "email" },
                      { label: "Opening Balance", key: "opening_balance" },
                    ] as { label: string; key: keyof typeof basicDetails }[]
                  ).map(({ label, key }, index) => (
                    <View key={index} style={styles.inputWrapper}>
                      <Text style={styles.label}>{label}</Text>
                      <TextInput
                        placeholder={`Enter ${label}`}
                        placeholderTextColor="#999"
                        style={[styles.input, errors[key] && styles.inputError]}
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
                        value={basicDetails[key]}
                        onChangeText={(text) => {
                          setBasicDetails((prev) => ({ ...prev, [key]: text }));
                          // Clear error when user starts typing
                          if (errors[key]) {
                            setErrors((prev) => ({ ...prev, [key]: "" }));
                          }
                        }}
                      />
                      {errors[key] && (
                        <Text style={styles.errorText}>{errors[key]}</Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>

              {/* Business Details */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Business Details</Text>
                <View style={styles.sectionContent}>
                  {(
                    [
                      { label: "Company Name", key: "company" },
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
                        autoCapitalize={
                          key !== "company" ? "characters" : "words"
                        }
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

              {/* Address Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Address</Text>
                <View style={styles.sectionContent}>
                  {(
                    [
                      { placeholder: "Address Line 1", key: "line1" },
                      { placeholder: "Address Line 2", key: "line2" },
                      { placeholder: "Pincode", key: "pincode" },
                      { placeholder: "City", key: "city" },
                      { placeholder: "State", key: "state" },
                      { placeholder: "Country", key: "country" },
                    ] as { placeholder: string; key: keyof typeof address }[]
                  ).map(({ placeholder, key }, idx) => (
                    <TextInput
                      key={idx}
                      placeholder={placeholder}
                      placeholderTextColor="#888"
                      style={[styles.input, { marginBottom: 10 }]}
                      keyboardType={
                        key === "pincode" ? "numeric" : "ascii-capable"
                      }
                      maxLength={key === "pincode" ? 6 : 200}
                      value={address[key]}
                      onChangeText={(text) =>
                        setAddress((prev) => ({ ...prev, [key]: text }))
                      }
                    />
                  ))}
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <Loading visible={isLoading} />
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </MainContainer>
  );
};
export default AddVendor;

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
  errorText: {
    color: "#f44336",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

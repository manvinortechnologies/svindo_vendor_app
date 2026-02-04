import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconIonic from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Headerwithback from "./Headerwithback";
import CustomSwitch from "./CustomSwitch";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import Toast from "react-native-toast-message";
import { s } from "react-native-size-matters";

const screenWidth = Dimensions.get("window").width;

const VerificationPaymentsScreen = () => {
  const insets = useSafeAreaInsets();
  // PAN Verification State
  const [panNumber, setPanNumber] = useState("");
  const [openingBalance, setOpeningBalance] = useState("");
  const [isPanVerified, setIsPanVerified] = useState(false);
  const [isVerifyingPan, setIsVerifyingPan] = useState(false);
  const [panVerificationData, setPanVerificationData] = useState<{
    pan_number?: string;
    full_name?: string;
    category?: string;
  } | null>(null);

  // GSTIN Verification State
  const [gstin, setGstin] = useState("");
  const [initialGstin, setInitialGstin] = useState(""); // Track initial GSTIN from server
  const [isGstinVerified, setIsGstinVerified] = useState(false);
  const [isVerifyingGstin, setIsVerifyingGstin] = useState(false);
  const [gstinVerificationData, setGstinVerificationData] = useState<{
    pan_number?: string;
    full_name?: string;
    category?: string;
  } | null>(null);

  // UID state
  const [uid, setUid] = useState("");

  // FSSAI Verification State
  const [fssai, setFssai] = useState("");
  const [isFssaiVerified, setIsFssaiVerified] = useState(false);
  const [isVerifyingFssai, setIsVerifyingFssai] = useState(false);
  const [fssaiVerificationData, setFssaiVerificationData] = useState<{
    pan_number?: string;
    full_name?: string;
    category?: string;
  } | null>(null);

  // Bank Account Verification State
  const [accountHolderName, setAccountHolderName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [initialAccountNumber, setInitialAccountNumber] = useState("");
  const [reEnterAccountNumber, setReEnterAccountNumber] = useState("");
  const [isBankVerified, setIsBankVerified] = useState(false);
  const [isVerifyingBank, setIsVerifyingBank] = useState(false);
  const [bankVerificationData, setBankVerificationData] = useState<{
    pan_number?: string;
    full_name?: string;
    category?: string;
  } | null>(null);

  // Loading state for fetching store data
  const [isLoadingStoreData, setIsLoadingStoreData] = useState(false);

  // Fetch store data and populate verification status
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setIsLoadingStoreData(true);
        const response = await api.get(API_ROUTES.vendorStores);

        if (response.data) {
          // Handle different response structures
          let storeData = null;

          // If response.data is an array, take the first store
          if (Array.isArray(response.data)) {
            if (response.data.length > 0) {
              storeData = response.data[0];
            }
          }
          // If response.data is an object with stores array
          else if (
            response.data.stores &&
            Array.isArray(response.data.stores)
          ) {
            if (response.data.stores.length > 0) {
              storeData = response.data.stores[0];
            }
          }
          // If response.data is a single store object
          else if (response.data.id) {
            storeData = response.data;
          }

          if (storeData) {
            // Update PAN verification status and value
            setPanNumber(storeData.pan_number || "");
            setIsPanVerified(storeData.is_pan_verified);

            // Update GSTIN verification status and value
            setGstin(storeData.gstin || "");
            setInitialGstin(storeData.gstin || "");
            setIsGstinVerified(storeData.is_gstin_verified);

            // Update FSSAI verification status and value
            setFssai(storeData.fssai_number || "");
            setIsFssaiVerified(storeData.is_fssai_verified);

            // Update Bank verification status
            setIsBankVerified(storeData.is_bank_verified);
            setAccountNumber(storeData.bank_account_number || "");
            setInitialAccountNumber(storeData.bank_account_number || "");
            setIfscCode(storeData.bank_ifsc || "");
          }
        }
      } catch (error: any) {
        console.error("Error fetching store data:", error);
        // Don't show error toast as this is a background operation
      } finally {
        setIsLoadingStoreData(false);
      }
    };

    fetchStoreData();
  }, []);

  // Verify PAN function
  const handleVerifyPAN = async () => {
    if (!panNumber || panNumber.trim() === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter PAN number",
      });
      return;
    }

    // Validate PAN format (10 characters, alphanumeric)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(panNumber.toUpperCase())) {
      Toast.show({
        type: "error",
        text1: "Invalid PAN",
        text2: "Please enter a valid PAN number (e.g., ABCDE1234F)",
      });
      return;
    }

    try {
      setIsVerifyingPan(true);
      const response = await api.post("vendor/kyc/verify-pan/", {
        pan: panNumber.toUpperCase(),
      });

      if (response.data?.verified === true && response.data?.result?.data) {
        setIsPanVerified(true);
        setPanVerificationData(response.data.result.data);
        Toast.show({
          type: "success",
          text1: "PAN Verified",
          text2: `Verified: ${response.data.result.data.full_name}`,
        });
      } else {
        setIsPanVerified(false);
        setPanVerificationData(null);
        Toast.show({
          type: "error",
          text1: "Verification Failed",
          text2: "PAN could not be verified",
        });
      }
    } catch (error: any) {
      console.error("PAN verification error:", error);
      setIsPanVerified(false);
      setPanVerificationData(null);
      Toast.show({
        type: "error",
        text1: "Verification Failed",
        text2:
          error.response?.data?.message ||
          "Failed to verify PAN. Please try again.",
      });
    } finally {
      setIsVerifyingPan(false);
    }
  };

  // Verify GSTIN function
  const handleVerifyGSTIN = async () => {
    if (!gstin || gstin.trim() === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter GSTIN",
      });
      return;
    }

    // Validate GSTIN format (15 characters, alphanumeric)
    const gstinRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstinRegex.test(gstin.toUpperCase())) {
      Toast.show({
        type: "error",
        text1: "Invalid GSTIN",
        text2: "Please enter a valid GSTIN number (15 characters)",
      });
      return;
    }

    try {
      setIsVerifyingGstin(true);
      const response = await api.post("vendor/kyc/verify-gstin/", {
        gstin: gstin.toUpperCase(),
      });

      if (response.data?.verified === true && response.data?.result?.data) {
        setIsGstinVerified(true);
        setGstinVerificationData(response.data.result.data);
        Toast.show({
          type: "success",
          text1: "GSTIN Verified",
          text2: `Verified: ${
            response.data.result.data.full_name || "GSTIN verified successfully"
          }`,
        });
      } else {
        setIsGstinVerified(false);
        setGstinVerificationData(null);
        Toast.show({
          type: "error",
          text1: "Verification Failed",
          text2: "GSTIN could not be verified",
        });
      }
    } catch (error: any) {
      console.error("GSTIN verification error:", error);
      setIsGstinVerified(false);
      setGstinVerificationData(null);
      Toast.show({
        type: "error",
        text1: "Verification Failed",
        text2:
          error.response?.data?.message ||
          "Failed to verify GSTIN. Please try again.",
      });
    } finally {
      setIsVerifyingGstin(false);
    }
  };

  // Verify FSSAI function
  const handleVerifyFSSAI = async () => {
    if (!fssai || fssai.trim() === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter FSSAI number",
      });
      return;
    }

    try {
      setIsVerifyingFssai(true);
      const response = await api.post("vendor/kyc/verify-fssai/", {
        fssai: fssai.toUpperCase(),
      });

      if (response.data?.verified === true && response.data?.result?.data) {
        setIsFssaiVerified(true);
        setFssaiVerificationData(response.data.result.data);
        Toast.show({
          type: "success",
          text1: "FSSAI Verified",
          text2: `Verified: ${
            response.data.result.data.full_name || "FSSAI verified successfully"
          }`,
        });
      } else {
        setIsFssaiVerified(false);
        setFssaiVerificationData(null);
        Toast.show({
          type: "error",
          text1: "Verification Failed",
          text2: "FSSAI could not be verified",
        });
      }
    } catch (error: any) {
      console.error("FSSAI verification error:", error);
      setIsFssaiVerified(false);
      setFssaiVerificationData(null);
      Toast.show({
        type: "error",
        text1: "Verification Failed",
        text2:
          error.response?.data?.message ||
          "Failed to verify FSSAI. Please try again.",
      });
    } finally {
      setIsVerifyingFssai(false);
    }
  };

  // Verify Bank Account function
  const handleVerifyBank = async () => {
    if (!ifscCode || ifscCode.trim() === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter IFSC code",
      });
      return;
    }

    if (!accountNumber || accountNumber.trim() === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter account number",
      });
      return;
    }

    // Validate account numbers match
    if (accountNumber !== reEnterAccountNumber) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Account numbers do not match",
      });
      return;
    }

    try {
      setIsVerifyingBank(true);
      const response = await api.post("vendor/kyc/verify-bank/", {
        ifsc: ifscCode.toUpperCase(),
        account_number: accountNumber,
        opening_balance: openingBalance,
      });

      if (response.data?.verified === true && response.data?.result?.data) {
        setIsBankVerified(true);
        setBankVerificationData(response.data.result.data);
        Toast.show({
          type: "success",
          text1: "Bank Account Verified",
          text2: `Verified: ${
            response.data.result.data.full_name ||
            "Bank account verified successfully"
          }`,
        });
      } else {
        setIsBankVerified(false);
        setBankVerificationData(null);
        Toast.show({
          type: "error",
          text1: "Verification Failed",
          text2: "Bank account could not be verified",
        });
      }
    } catch (error: any) {
      console.error("Bank verification error:", error);
      setIsBankVerified(false);
      setBankVerificationData(null);
      Toast.show({
        type: "error",
        text1: "Verification Failed",
        text2:
          error.response?.data?.message ||
          "Failed to verify bank account. Please try again.",
      });
    } finally {
      setIsVerifyingBank(false);
    }
  };

  const sections = [
    {
      content: (
        <View
          style={{ flexDirection: "row", justifyContent: "center", gap: 40 }}
        >
          <View style={{ alignItems: "center" }}>
            <MaterialIcon name="verified" size={s(20)} color="#000" />

            <Text style={styles.notVerified}>Not Verified</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Icon name="currency-usd-off" size={s(20)} color="#000" />
            <Text style={styles.notVerified}>Payment inactive</Text>
          </View>
        </View>
      ),
    },
    {
      key: "status",
      content: (
        <View style={styles.sectionContent}>
          <Text style={{ color: "#000", fontWeight: "500", marginBottom: 8 }}>
            Note:
          </Text>
          <Text style={styles.note}>
            To get verification, please contact service support team through
            section. After verification the business cannot change.
          </Text>
          <Text style={[styles.note, { marginTop: 8 }]}>
            After verification the bussiness cannot change this details.
          </Text>
        </View>
      ),
    },
    // {
    //   key: "basicDetails",
    //   title: "Basic Details",
    //   content: (
    //     <View style={styles.sectionContent}>
    //       {[
    //         "Business Name",
    //         "Brand Name",
    //         "Mobile Number",
    //         "Email Id",
    //         "Business Category",
    //         "Trade Type",
    //         "Address",
    //         "Emergency Mobile Number",
    //       ].map((label, index) => (
    //         <View key={index} style={styles.inputWrapper}>
    //           <Text
    //             style={{ marginBottom: 5, fontWeight: "500", color: "#000" }}
    //           >
    //             {label}
    //           </Text>
    //           <TextInput
    //             placeholder="Enter here"
    //             placeholderTextColor="#999"
    //             style={styles.input}
    //           />
    //         </View>
    //       ))}
    //       <View style={styles.inputWrapper}>
    //         <View
    //           style={{ flexDirection: "row", justifyContent: "space-between" }}
    //         >
    //           <Text style={styles.locationText}>Location</Text>
    //           <Icon
    //             name="map-marker"
    //             size={18}
    //             color="#FCA311"
    //             style={{ justifyContent: "flex-end" }}
    //           />
    //         </View>
    //         <TouchableOpacity style={styles.locationInput}></TouchableOpacity>
    //       </View>
    //     </View>
    //   ),
    // },
    {
      key: "gstStatus",
      title: "GST Registration Status",
      content: (
        <>
          {/* <View style={styles.inputWrapper}>
            <TouchableOpacity style={styles.locationInput}>
              <Text style={{ fontSize: 12, color: "#000" }}>No (Default)</Text>
            </TouchableOpacity>
          </View> */}
          <View>
            <Text style={styles.note}>
              Note: If your business is GST registered please verify it. If not
              please register for UID from GST portal to start selling at state
              level and verify your UID here to active payments. Only GSTIN
              registered businesses will be shown at national level.
            </Text>
            {/* <Text style={[styles.note, { marginTop: 10 }]}>
              Click <Text style={{ color: "blue" }}>here</Text> for further
              info.
            </Text> */}
          </View>
        </>
      ),
    },
    {
      key: "gstVerification",
      title: "GSTIN / UID & PAN Verification",
      content: (
        <View style={styles.sectionContent}>
          {/* <Text style={{ marginBottom: 5, fontWeight: "500", color: "#000" }}>
            Legal Name
          </Text>
          <TextInput
            placeholder="Enter here"
            placeholderTextColor="#999"
            style={styles.input}
          /> */}
          {/* GSTIN */}
          <View style={styles.verificationBlock}>
            <View style={styles.rowBetween}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.label}>GSTIN</Text>
                {isGstinVerified && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#E8F5E9",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                      marginLeft: 8,
                    }}
                  >
                    <Icon name="check-circle" size={12} color="#4CAF50" />
                    <Text
                      style={{
                        color: "#2E7D32",
                        fontSize: 10,
                        marginLeft: 4,
                        fontWeight: "700",
                      }}
                    >
                      VERIFIED
                    </Text>
                  </View>
                )}
              </View>
              <CustomSwitch
                value={isGstinVerified}
                onValueChange={() => {}}
                disabled={true}
              />
            </View>
            <TextInput
              placeholder="Enter GSTIN (15 characters)"
              placeholderTextColor="#999"
              style={[
                styles.input,
                isGstinVerified && { borderColor: "#4CAF50" },
              ]}
              value={gstin}
              onChangeText={(text) => {
                setGstin(text.toUpperCase());
                setIsGstinVerified(false);
                setGstinVerificationData(null);
              }}
              maxLength={15}
              editable={!isVerifyingGstin || !isGstinVerified}
            />
            {isGstinVerified && gstinVerificationData && (
              <View style={styles.verifiedInfo}>
                <View style={styles.verifiedRow}>
                  <Icon name="check-circle" size={16} color="#4CAF50" />
                  <Text style={styles.verifiedText}>
                    Verified:{" "}
                    {gstinVerificationData.full_name || "GSTIN verified"}
                  </Text>
                </View>
                {gstinVerificationData.category && (
                  <Text style={styles.verifiedDetail}>
                    Category: {gstinVerificationData.category}
                  </Text>
                )}
                {gstinVerificationData.pan_number && (
                  <Text style={styles.verifiedDetail}>
                    PAN: {gstinVerificationData.pan_number}
                  </Text>
                )}
              </View>
            )}
            <Text style={[styles.note, { marginVertical: 5 }]}>
              Note: GSTIN will be verified instantly using government database.
            </Text>
            {!isGstinVerified && gstin && gstin === initialGstin ? (
              <View
                style={{
                  marginTop: 8,
                  padding: 10,
                  backgroundColor: "#FFF3CD",
                  borderRadius: 6,
                  borderLeftWidth: 3,
                  borderLeftColor: "#FFC107",
                }}
              >
                <Text
                  style={{ color: "#856404", fontSize: 13, fontWeight: "500" }}
                >
                  Your request is under review
                </Text>
              </View>
            ) : (
              !isGstinVerified && (
                <TouchableOpacity
                  style={[
                    styles.otpButton,
                    isVerifyingGstin && styles.otpButtonDisabled,
                  ]}
                  onPress={handleVerifyGSTIN}
                  disabled={isVerifyingGstin || !gstin.trim()}
                >
                  {isVerifyingGstin ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ActivityIndicator size="small" color="#fff" />
                      <Text style={[styles.otpButtonText, { marginLeft: 8 }]}>
                        Verifying...
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.otpButtonText}>Verify GSTIN</Text>
                  )}
                </TouchableOpacity>
              )
            )}
          </View>

          {/* UID */}
          <View style={styles.verificationBlock}>
            <View style={styles.rowBetween}>
              <Text style={styles.label}>UID</Text>
              <CustomSwitch value={false} onValueChange={() => {}} />
            </View>
            <TextInput
              placeholder="Enter UID"
              placeholderTextColor="#999"
              style={styles.input}
              value={uid}
              onChangeText={setUid}
            />
            <Text style={[styles.note, { marginVertical: 5 }]}>
              Note: To verify UID details, a one time OTP will be sent to mobile
              number and email address of the primary UID holder. OTP is valid
              for limited time.
            </Text>
            <TouchableOpacity style={styles.otpButton}>
              <Text style={styles.otpButtonText}>Verify UID</Text>
            </TouchableOpacity>
          </View>

          {/* PAN */}
          <View style={styles.verificationBlock}>
            <View style={styles.rowBetween}>
              <Text style={styles.label}>PAN</Text>
              <CustomSwitch
                value={isPanVerified}
                onValueChange={() => {}}
                disabled={true}
              />
            </View>
            <TextInput
              placeholder="Enter PAN (e.g., ABCDE1234F)"
              placeholderTextColor="#999"
              style={[
                styles.input,
                isPanVerified && { borderColor: "#4CAF50" },
              ]}
              value={panNumber}
              onChangeText={(text) => {
                setPanNumber(text.toUpperCase());
                setIsPanVerified(false);
                setPanVerificationData(null);
              }}
              maxLength={10}
              editable={!isVerifyingPan || !isPanVerified}
            />
            {isPanVerified && panVerificationData && (
              <View style={styles.verifiedInfo}>
                <View style={styles.verifiedRow}>
                  <Icon name="check-circle" size={16} color="#4CAF50" />
                  <Text style={styles.verifiedText}>
                    Verified: {panVerificationData.full_name}
                  </Text>
                </View>
                {panVerificationData.category && (
                  <Text style={styles.verifiedDetail}>
                    Category: {panVerificationData.category}
                  </Text>
                )}
              </View>
            )}
            <Text style={[styles.note, { marginVertical: 5 }]}>
              Note: PAN will be verified instantly using government database.
            </Text>
            {!isPanVerified && (
              <TouchableOpacity
                style={[
                  styles.otpButton,
                  isVerifyingPan && styles.otpButtonDisabled,
                ]}
                onPress={handleVerifyPAN}
                disabled={isVerifyingPan || !panNumber.trim()}
              >
                {isVerifyingPan ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={[styles.otpButtonText, { marginLeft: 8 }]}>
                      Verifying...
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.otpButtonText}>Verify PAN</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      ),
    },
    {
      key: "fssaiSection",
      title: "I sell Food Products",
      content: (
        <View style={styles.sectionContent}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>FSSAI number</Text>
            <CustomSwitch
              value={isFssaiVerified}
              onValueChange={() => {}}
              disabled={true}
            />
          </View>
          <TextInput
            placeholder="Enter FSSAI number"
            placeholderTextColor="#999"
            style={[
              styles.input,
              isFssaiVerified && { borderColor: "#4CAF50" },
            ]}
            value={fssai}
            onChangeText={(text) => {
              setFssai(text.toUpperCase());
              setIsFssaiVerified(false);
              setFssaiVerificationData(null);
            }}
            editable={!isVerifyingFssai || !isFssaiVerified}
          />
          {isFssaiVerified && fssaiVerificationData && (
            <View style={styles.verifiedInfo}>
              <View style={styles.verifiedRow}>
                <Icon name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.verifiedText}>
                  Verified:{" "}
                  {fssaiVerificationData.full_name || "FSSAI verified"}
                </Text>
              </View>
              {fssaiVerificationData.category && (
                <Text style={styles.verifiedDetail}>
                  Category: {fssaiVerificationData.category}
                </Text>
              )}
              {fssaiVerificationData.pan_number && (
                <Text style={styles.verifiedDetail}>
                  PAN: {fssaiVerificationData.pan_number}
                </Text>
              )}
            </View>
          )}
          <Text style={[styles.note, { marginVertical: 5 }]}>
            Note: FSSAI will be verified instantly using government database.
          </Text>
          {!isFssaiVerified && (
            <TouchableOpacity
              style={[
                styles.otpButton,
                isVerifyingFssai && styles.otpButtonDisabled,
              ]}
              onPress={handleVerifyFSSAI}
              disabled={isVerifyingFssai || !fssai.trim()}
            >
              {isVerifyingFssai ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={[styles.otpButtonText, { marginLeft: 8 }]}>
                    Verifying...
                  </Text>
                </View>
              ) : (
                <Text style={styles.otpButtonText}>Verify FSSAI</Text>
              )}
            </TouchableOpacity>
          )}
          <View style={styles.disclaimerContainer}>
            <Text style={styles.disclaimerText}>
              Selling Food products online without FSSAI verification is
              illegal, if found unverified will lead to permanent Ban in
              account.
            </Text>
          </View>
        </View>
      ),
    },
    {
      key: "bankDetails",
      content: (
        <>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.sectionTitle}>Bank Details</Text>
            {isBankVerified && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#E8F5E9",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                  marginLeft: 8,
                  marginBottom: 10,
                }}
              >
                <Icon name="check-circle" size={12} color="#4CAF50" />
                <Text
                  style={{
                    color: "#2E7D32",
                    fontSize: 10,
                    marginLeft: 4,
                    fontWeight: "700",
                  }}
                >
                  VERIFIED
                </Text>
              </View>
            )}
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.inputWrapper}>
              <Text
                style={{ marginBottom: 5, fontWeight: "500", color: "#000" }}
              >
                Account Holder Name
              </Text>
              <TextInput
                placeholder="Enter here"
                placeholderTextColor="#999"
                style={styles.input}
                value={accountHolderName}
                onChangeText={setAccountHolderName}
                // editable={!isBankVerified}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text
                style={{ marginBottom: 5, fontWeight: "500", color: "#000" }}
              >
                Bank IFSC code
              </Text>
              <TextInput
                placeholder="Enter IFSC code"
                placeholderTextColor="#999"
                style={[
                  styles.input,
                  isBankVerified && { borderColor: "#4CAF50" },
                ]}
                value={ifscCode}
                onChangeText={(text) => {
                  setIfscCode(text.toUpperCase());
                  setIsBankVerified(false);
                  setBankVerificationData(null);
                }}
                maxLength={11}
                // editable={!isVerifyingBank || !isBankVerified}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text
                style={{ marginBottom: 5, fontWeight: "500", color: "#000" }}
              >
                Bank Name
              </Text>
              <TextInput
                placeholder="Enter here"
                placeholderTextColor="#999"
                style={styles.input}
                value={bankName}
                onChangeText={setBankName}
                // editable={!isVerifyingBank || !isBankVerified}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text
                style={{ marginBottom: 5, fontWeight: "500", color: "#000" }}
              >
                Opening Balance
              </Text>
              <TextInput
                placeholder="Enter here"
                placeholderTextColor="#999"
                style={styles.input}
                value={openingBalance}
                onChangeText={setOpeningBalance}
                keyboardType="numeric"
                // editable={!isVerifyingBank || !isBankVerified}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text
                style={{ marginBottom: 5, fontWeight: "500", color: "#000" }}
              >
                Account Number
              </Text>
              <TextInput
                placeholder="Enter account number"
                placeholderTextColor="#999"
                style={[
                  styles.input,
                  isBankVerified && { borderColor: "#4CAF50" },
                ]}
                value={accountNumber}
                onChangeText={(text) => {
                  setAccountNumber(text);
                  setIsBankVerified(false);
                  setBankVerificationData(null);
                }}
                keyboardType="numeric"
                // editable={!isVerifyingBank || !isBankVerified}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text
                style={{ marginBottom: 5, fontWeight: "500", color: "#000" }}
              >
                Re-enter Account Number
              </Text>
              <TextInput
                placeholder="Re-enter account number"
                placeholderTextColor="#999"
                style={styles.input}
                value={reEnterAccountNumber}
                onChangeText={setReEnterAccountNumber}
                keyboardType="numeric"
                // editable={!isVerifyingBank || !isBankVerified}
              />
            </View>
            {isBankVerified && bankVerificationData && (
              <View style={styles.verifiedInfo}>
                <View style={styles.verifiedRow}>
                  <Icon name="check-circle" size={16} color="#4CAF50" />
                  <Text style={styles.verifiedText}>
                    Verified:{" "}
                    {bankVerificationData.full_name || "Bank account verified"}
                  </Text>
                </View>
                {bankVerificationData.category && (
                  <Text style={styles.verifiedDetail}>
                    Category: {bankVerificationData.category}
                  </Text>
                )}
                {bankVerificationData.pan_number && (
                  <Text style={styles.verifiedDetail}>
                    PAN: {bankVerificationData.pan_number}
                  </Text>
                )}
              </View>
            )}
            <Text style={[styles.note, { marginVertical: 5 }]}>
              Note: Bank account will be verified instantly using government
              database.
            </Text>
            {!isBankVerified &&
            accountNumber &&
            accountNumber === initialAccountNumber ? (
              <View
                style={{
                  marginTop: 8,
                  padding: 10,
                  backgroundColor: "#FFF3CD",
                  borderRadius: 6,
                  borderLeftWidth: 3,
                  borderLeftColor: "#FFC107",
                }}
              >
                <Text
                  style={{ color: "#856404", fontSize: 13, fontWeight: "500" }}
                >
                  Your request is under review
                </Text>
              </View>
            ) : (
              !isBankVerified && (
                <TouchableOpacity
                  style={[
                    styles.otpButton,
                    isVerifyingBank && styles.otpButtonDisabled,
                  ]}
                  onPress={handleVerifyBank}
                  disabled={isVerifyingBank}
                >
                  {isVerifyingBank ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ActivityIndicator size="small" color="#fff" />
                      <Text style={[styles.otpButtonText, { marginLeft: 8 }]}>
                        Verifying...
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.otpButtonText}>Verify Account</Text>
                  )}
                </TouchableOpacity>
              )
            )}
          </View>
        </>
      ),
    },
    // {
    //   key: "activeAreaPincodes",
    //   title: "Business Active Area pin codes",
    //   content: (
    //     <View style={styles.sectionContent}>
    //       <View
    //         style={{
    //           flexDirection: "row",
    //           alignItems: "center",
    //           marginBottom: 10,
    //         }}
    //       >
    //         <TextInput
    //           placeholder="Ex: 518001"
    //           placeholderTextColor="#999"
    //           style={[styles.input, { flex: 1, marginRight: 8 }]}
    //         />
    //         <TouchableOpacity style={styles.otpButton}>
    //           <Text style={styles.otpButtonText}>Verify Pincodes</Text>
    //         </TouchableOpacity>
    //       </View>
    //       <Text style={{ fontSize: 13, fontWeight: "500", marginBottom: 5 }}>
    //         Your active area Pincodes are :
    //       </Text>
    //       <View
    //         style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 10 }}
    //       >
    //         {["518001", "518002"].map((pincode, index) => (
    //           <Text
    //             key={index}
    //             style={{
    //               color: "#163881",
    //               marginRight: 15,
    //               fontSize: 13,
    //               fontWeight: "600",
    //             }}
    //           >
    //             {pincode}
    //           </Text>
    //         ))}
    //       </View>
    //       <Text
    //         style={[
    //           styles.note,
    //           { color: "red", fontWeight: "600", marginBottom: 5 },
    //         ]}
    //       >
    //         Note:
    //       </Text>
    //       <Text style={[styles.note, { marginBottom: 10 }]}>
    //         The pin codes you enter will be used to
    //       </Text>
    //       <Text style={[styles.note, { marginBottom: 10 }]}>
    //         Mapped as active area for instant delivery.
    //       </Text>
    //       <Text style={[styles.note, { marginBottom: 10 }]}>
    //         Active / Visible area for your product / services for unverified
    //         vendor.
    //       </Text>
    //       <Text style={[styles.note, { marginBottom: 10 }]}>
    //         Area of visibility of your shop page in svindo app and website.
    //       </Text>
    //       <Text style={[styles.note, { marginBottom: 10 }]}>
    //         Ads you run will be targeted to this area.
    //       </Text>
    //     </View>
    //   ),
    // },
  ];

  const renderItem = ({ item }: any) => (
    <View style={styles.sectionContainer}>
      {item.title && <Text style={styles.sectionTitle}>{item.title}</Text>}
      {item.content}
    </View>
  );
  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Headerwithback title={"Verification & Payments"} />
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.key ?? index.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default VerificationPaymentsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  listContainer: {
    padding: 16,
  },
  sectionContainer: {
    // borderWidth: 1,
    // borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FCA311",
    marginBottom: 10,
  },
  notVerified: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  paymentInactive: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
  },
  sectionContent: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  note: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "500",
  },
  inputWrapper: {
    marginBottom: 10,
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
  locationInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 16,
    backgroundColor: "#FFF8EB",
  },
  locationText: {
    color: "#000",
    fontSize: 14,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  smallText: {
    fontSize: 14,
    color: "#000",
  },
  verificationBlock: {
    borderRadius: 6,
    padding: 10,
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  otpButton: {
    width: "50%",
    alignSelf: "center",
    backgroundColor: "#FCA311",
    paddingVertical: 10,
    borderRadius: 6,
    // marginTop: 8,
    elevation: 10,
  },
  otpButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  otpButtonDisabled: {
    opacity: 0.6,
  },
  verifiedInfo: {
    backgroundColor: "#E8F5E9",
    padding: 10,
    borderRadius: 6,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  verifiedText: {
    color: "#2E7D32",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  verifiedDetail: {
    color: "#2E7D32",
    fontSize: 12,
    marginTop: 4,
  },
  disclaimerContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#FFF3CD",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FFC107",
  },
  disclaimerText: {
    fontSize: 12,
    color: "#856404",
    lineHeight: 18,
  },
});

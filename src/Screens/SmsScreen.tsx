import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  ScrollView,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import CustomHeader from "../CommonComponent/CustomHeader";
import CustomSwitch from "../CommonComponent/CustomSwitch";
import Icon from "react-native-vector-icons/Ionicons";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import Loading from "../CommonComponent/Loading";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScaledSheet } from "react-native-size-matters";
const SmsScreen = () => {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [availableCredits, setAvailableCredits] = useState(0);
  const [usedCredits, setUsedCredits] = useState(0);
  const [purchaseMsgEnabled, setPurchaseMsgEnabled] = useState(false);
  const [quoteMsgEnabled, setQuoteMsgEnabled] = useState(false);
  const [creditReminderEnabled, setCreditReminderEnabled] = useState(false);

  useEffect(() => {
    fetchSmsSettings();
  }, []);

  const fetchSmsSettings = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(API_ROUTES.smsSettings);
      if (res.data) {
        const data = res.data;
        // Parse credits from string to number
        // Parse credits from string format like "0.00" to number
        setAvailableCredits(
          data.available_credits !== undefined &&
            data.available_credits !== null
            ? parseFloat(
                typeof data.available_credits === "string"
                  ? data.available_credits
                  : data.available_credits.toString()
              )
            : 0
        );
        setUsedCredits(
          data.used_credits !== undefined && data.used_credits !== null
            ? parseFloat(
                typeof data.used_credits === "string"
                  ? data.used_credits
                  : data.used_credits.toString()
              )
            : 0
        );
        setPurchaseMsgEnabled(
          data.enable_purchase_message !== undefined
            ? data.enable_purchase_message
            : false
        );
        setQuoteMsgEnabled(
          data.enable_quote_message !== undefined
            ? data.enable_quote_message
            : false
        );
        setCreditReminderEnabled(
          data.enable_credit_reminder_message !== undefined
            ? data.enable_credit_reminder_message
            : false
        );
      }
    } catch (error) {
      console.error("Error fetching SMS settings:", error);
      // Keep default values on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      const payload = {
        available_credits: availableCredits,
        used_credits: usedCredits,
        enable_purchase_message: purchaseMsgEnabled,
        enable_quote_message: quoteMsgEnabled,
        enable_credit_reminder_message: creditReminderEnabled,
      };

      const res = await api.post(API_ROUTES.smsSettings, payload);
      if (res.status === 200 || res.status === 201) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "SMS settings saved successfully",
        });
      }
    } catch (error: any) {
      console.error("Error saving SMS settings:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message || "Failed to save SMS settings",
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
      <CustomHeader title="SMS" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* SMS Credits Details */}
        <View style={styles.creditsContainer}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.sectionTitle}>SMS Credits Details</Text>
            {/* <View
              style={{
                flexDirection: "row",
                gap: 2,
                borderWidth: 1,
                borderColor: "#ddd",
                padding: 5,
                paddingHorizontal: 10,
                marginBottom: 5,
                borderRadius: 10,
              }}
            >
              <Text>Till day</Text>
              <TouchableOpacity>
                <Icon name="chevron-down" size={18} />
              </TouchableOpacity>
            </View> */}
          </View>
          <View style={styles.creditRow}>
            <View style={[styles.creditBox, { backgroundColor: "#CDBDFF" }]}>
              <Text style={styles.creditLabel}>Available</Text>
              <Text style={styles.creditValue}>
                {availableCredits?.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.creditBox, { backgroundColor: "#CEFFB7" }]}>
              <Text style={styles.creditLabel}>Used</Text>
              <Text style={styles.creditValue}>{usedCredits?.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Note Section */}
        <View style={styles.noteBox}>
          <Text style={styles.noteTitle}>Note:</Text>
          <Text style={styles.noteText}>
            This feature is to automatically send different transactions to your
            customer via SMS.
          </Text>
          {/* <Text style={styles.noteText}>
            It's a paid service, add SMS credits to avail the benefits
          </Text> */}
        </View>

        {/* Toggle */}
        <View style={styles.toggleBox}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Enable Purchase Message</Text>
            <CustomSwitch
              value={purchaseMsgEnabled}
              onValueChange={setPurchaseMsgEnabled}
            />
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Enable Quote Message</Text>
            <CustomSwitch
              value={quoteMsgEnabled}
              onValueChange={setQuoteMsgEnabled}
            />
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>
              Enable Credit Reminder Message
            </Text>
            <CustomSwitch
              value={creditReminderEnabled}
              onValueChange={setCreditReminderEnabled}
            />
          </View>
        </View>

        {/* Templates */}
        <View style={styles.templatesBox}>
          <Text style={styles.templatesTitle}>SMS templates used</Text>
        </View>
        <View style={styles.templateItem}>
          <Image
            source={require("../assets/SMSTemplate1.jpeg")}
            style={styles.templateImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.templateItem}>
          <Image
            source={require("../assets/SMSTemplate2.jpeg")}
            style={styles.templateImage}
            resizeMode="cover"
          />
        </View>
      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSaveSettings}
        disabled={isLoading}
      >
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>

      <Loading visible={isLoading} />
    </View>
  );
};

export default SmsScreen;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  creditsContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FCA311",
    marginBottom: 8,
  },
  creditRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  creditBox: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 8,
    alignItems: "flex-start",
  },
  creditLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  creditValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },
  noteBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  noteText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
    marginBottom: 2,
  },
  toggleBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },
  toggleText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
  },
  templatesBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    height: 80,
    marginBottom: 20,
  },
  templatesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  templateItem: {
    width: "350@s",
    height: "150@s",
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  templateImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  saveButton: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#FCA311",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

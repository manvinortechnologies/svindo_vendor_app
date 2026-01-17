import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { InputBox } from "../CommonComponent/InputBox";
import MainContainer from "../CommonComponent/MainContainer";
import CustomHeader from "../CommonComponent/CustomHeader";
import api from "../services/api/api";
import Loading from "../CommonComponent/Loading";
import Toast from "react-native-toast-message";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const DeliverySettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState({
    prepTime: "",
    deliveryTime: "",
    deliveryCharge: "",
    perKmCharge: "",
    baseFare: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("vendor/deliverysettings/");
      if (res.data) {
        const data = res.data;

        setSettings({
          prepTime: data?.instant_order_prep_time?.toString() || "",
          deliveryTime: data?.general_delivery_days?.toString() || "",
          deliveryCharge: data?.general_delivery_charge?.toString() || "",
          perKmCharge: data?.instant_per_km_charge?.toString() || "",
          baseFare: data?.instant_min_base_fare?.toString() || "",
        });
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    // Perform your save logic here

    try {
      setIsLoading(true);
      const payload = {
        instant_order_prep_time: parseInt(settings.prepTime) || 0,
        general_delivery_days: parseInt(settings.deliveryTime) || 0,
        general_delivery_charge: parseFloat(
          settings.deliveryCharge || "0"
        ).toFixed(2),
        instant_per_km_charge: parseFloat(settings.perKmCharge || "0").toFixed(
          2
        ),
        instant_min_base_fare: parseFloat(settings.baseFare || "0").toFixed(2),
      };
      const res = await api.post("vendor/deliverysettings/", payload);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Delivery settings saved successfully.",
      });
    } catch (error) {
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
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery settings</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveText}>SAVE</Text>
        </TouchableOpacity>
      </View> */}
      <CustomHeader
        title="Delivery settings"
        rightIcon={
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveText}>SAVE</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Input Fields */}
        <InputBox
          label="Instant Delivery order preparation time in minutes"
          placeholder="Ex: 30"
          value={settings.prepTime}
          onChangeText={(value: any) => handleChange("prepTime", value)}
          textInputStyle={{ width: "50%" }}
          background="#FFEFD5"
          keyboardType="decimal-pad"
        />
        <InputBox
          label="General Delivery order delivery time in days"
          placeholder="Ex: 2"
          value={settings.deliveryTime}
          onChangeText={(value: any) => handleChange("deliveryTime", value)}
          textInputStyle={{ width: "50%" }}
          background="#FFEFD5"
          keyboardType="decimal-pad"
        />
        <InputBox
          label="General Delivery charges"
          placeholder="Ex: 50"
          value={settings.deliveryCharge}
          onChangeText={(value: any) => handleChange("deliveryCharge", value)}
          textInputStyle={{ width: "50%" }}
          background="#FFEFD5"
          keyboardType="decimal-pad"
        />
        <InputBox
          label="Instant delivery charges per KM after a basic fare for your assigned delivery boy"
          placeholder="Ex: 10"
          value={settings.perKmCharge}
          onChangeText={(value: any) => handleChange("perKmCharge", value)}
          textInputStyle={{ width: "50%" }}
          background="#FFEFD5"
          keyboardType="decimal-pad"
        />
        <InputBox
          label="Minimum Basic fare for instant delivery"
          placeholder="Ex: 30"
          value={settings.baseFare}
          onChangeText={(value: any) => handleChange("baseFare", value)}
          background="#FFEFD5"
          textInputStyle={{ width: "50%" }}
          keyboardType="decimal-pad"
        />
        <Loading visible={isLoading} />
      </ScrollView>
    </View>
  );
};

// Reusable Input Field Component

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#FFA500",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
  scrollContent: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "#555",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#f7c281",
    backgroundColor: "#fff3e1",
    padding: 10,
    borderRadius: 8,
  },
});

export default DeliverySettingsScreen;

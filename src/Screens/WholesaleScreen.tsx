import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardTypeOptions,
  StatusBar,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Headerwithback from "./Headerwithback"; // Use your actual path
import OptionInput from "../CommonComponent/OptionalInputs";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { HomeNavigation } from "../constants/app-routes.constants";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Loading from "../CommonComponent/Loading";
import moment from "moment";

type FormDataKeys =
  | "dispatchAddress"
  | "signature"
  | "references"
  | "notes"
  | "terms"
  | "shippingCharges"
  | "packagingCharges"
  | "ewayBill"
  | "lrNumber"
  | "vehicleNumber"
  | "transportName"
  | "reverseCharge"
  | "deliveryCity"
  | "parcels";

type FormData = Record<FormDataKeys, string | boolean>;

type WholesaleScreenRouteProp = RouteProp<{
  params: {
    customer_details: any;
  };
}>;
export default function WholesaleScreen() {
  const navigation: any = useNavigation();
  const { params } = useRoute<WholesaleScreenRouteProp>();

  const insets = useSafeAreaInsets();

  const [selectedType, setSelectedType] = useState({
    name: "Invoice",
    key: "invoice",
  });
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    dispatchAddress:
      params?.customer_details?.dispatch_address_line1 ||
      "" + params?.customer_details?.dispatch_address_line2 ||
      "" + params?.customer_details?.dispatch_city ||
      "" + params?.customer_details?.dispatch_state ||
      "" + params?.customer_details?.dispatch_pincode ||
      "",
    signature: "",
    references: "",
    notes: "",
    terms: "",
    shippingCharges: "",
    packagingCharges: "",
    ewayBill: "",
    lrNumber: "",
    vehicleNumber: "",
    transportName: params?.customer_details?.transport_name || "",
    deliveryCity: params?.customer_details?.dispatch_city || "",
    reverseCharge: false,
    parcels: "",
  });

  const handleChange = (field: FormDataKeys, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const optionalFields: {
    icon?: string;
    label: string;
    state: FormDataKeys;
    boldLabelPrefix?: string;
    keyboardType?: KeyboardTypeOptions;
  }[] = [
    { icon: "truck", label: "Dispatch Address", state: "dispatchAddress" },
    // { icon: "pencil", label: "Select Signature", state: "signature" },
    { icon: "briefcase", label: "Add References", state: "references" },
    { icon: "file-document-edit", label: "Add Notes", state: "notes" },
    { icon: "file-document-outline", label: "Add Terms", state: "terms" },
    {
      icon: "currency-inr",
      label: "Delivery/ Shipping Charges",
      state: "shippingCharges",
      keyboardType: "numeric",
    },
    {
      icon: "currency-inr",
      label: "Packaging Charges",
      state: "packagingCharges",
      keyboardType: "numeric",
    },
    { icon: "file-multiple", label: "E-way Bill Number", state: "ewayBill" },
    { icon: "google-maps", label: "Delivery City", state: "deliveryCity" },
    {
      icon: "arrow-left-right",
      label: "Reverse Charge",
      state: "reverseCharge",
      keyboardType: "default",
    },
    {
      icon: undefined,
      label: "LR Number",
      state: "lrNumber",
      boldLabelPrefix: "LR",
    },
    { icon: "truck-fast", label: "Vehicle Number", state: "vehicleNumber" },
    { icon: "truck-delivery", label: "Transport Name", state: "transportName" },
    {
      icon: "cube-outline",
      label: "No. of Parcels",
      state: "parcels",
      keyboardType: "numeric",
    },
  ];

  const handleSubmit = async () => {
    try {
      const data = {
        ...params,
        wholesale_invoice: {
          invoice_type: selectedType?.key,
          invoice_number: invoiceNumber,
          date: moment().format("YYYY-MM-DD"),
          dispatch_address: formData?.dispatchAddress,
          references: formData?.references,
          notes: formData?.notes,
          terms: formData?.terms,
          delivery_charges: formData?.shippingCharges,
          packaging_charges: formData?.packagingCharges,
          eway_bill_number: formData?.ewayBill,
          lr_number: formData?.lrNumber,
          vehicle_number: formData?.vehicleNumber,
          transport_name: formData?.transportName,
          number_of_parcels: Number(formData?.parcels),
          delivery_city: formData?.deliveryCity,
          reverse_charges: formData?.reverseCharge || false,
        },
      };

      setIsLoading(true);

      const res = await api.post(API_ROUTES.posSales, data);
      console.log(res);
      navigation.reset({
        index: 0,
        routes: [
          {
            name: HomeNavigation.BOTTOM_NAVIGATION,
            state: { index: 0, routes: [{ name: HomeNavigation.ERP }] },
          },
          { name: HomeNavigation.SALES_LEDGER },
          { name: HomeNavigation.BILLDETAILS, params: { id: res.data?.id } },
        ],
      });
    } catch (error) {
      console.log(error, "sales error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const res = await api.get(
        API_ROUTES.invoiceNumber + `?invoice_type=${selectedType?.key}`
      );
      setInvoiceNumber(res.data?.invoice_number);
    })();
  }, [selectedType?.name]);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Loading visible={isLoading} />
      <Headerwithback
        title="Wholesale"
        rightIcons={[
          <Icon
            name="format-list-text"
            size={25}
            color="#FFA700"
            key="search"
          />,
        ]}
      />
      <ScrollView
        style={styles.content}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: insets.bottom + 30,
        }}
      >
        {/* Document Type Selector */}
        <View style={styles.typeSelector}>
          {[
            { name: "Invoice", key: "invoice" },
            { name: "Pro Forma Invoice", key: "proforma" },
            { name: "Quotation", key: "quotation" },
            // { name: "Credit Note", key: "credit_note" },
            { name: "Delivery Challan", key: "delivery_challan" },
          ].map((type) => (
            <TouchableOpacity
              key={type?.key}
              style={[
                styles.typeButton,
                type?.key === selectedType?.key && styles.typeButtonActive,
              ]}
              onPress={() => setSelectedType(type)}
            >
              <Text
                style={
                  type?.key === selectedType?.key
                    ? styles.typeButtonTextActive
                    : styles.typeButtonText
                }
              >
                {type?.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Invoice Header */}
        <View style={styles.invoiceHeader}>
          <Text style={styles.invoiceId}>{invoiceNumber}</Text>
          <Text style={styles.invoiceDate}>14-02-2025</Text>
          {/* <TouchableOpacity>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity> */}
        </View>

        <Text style={styles.optionalTitle}>Optional</Text>

        {/* Optional Fields */}
        <View style={styles.optionalList}>
          {optionalFields.map((field) => (
            <OptionInput
              key={field.state}
              icon={field.icon}
              label={field.label}
              value={formData[field.state]}
              onChangeText={(text) => handleChange(field.state, text)}
              keyboardType={field.keyboardType}
              boldLabelPrefix={field.boldLabelPrefix}
            />
          ))}
        </View>

        {/* Proceed Button */}
        <TouchableOpacity style={styles.proceedButton} onPress={handleSubmit}>
          <Text style={styles.proceedButtonText}>Proceed</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

type OptionItemProps = {
  icon: string;
  label: string;
};

const OptionItem = ({ icon, label }: OptionItemProps) => (
  <TouchableOpacity style={styles.optionItem}>
    <Icon name={icon} size={18} color="#666" style={styles.optionIcon} />
    <Text style={styles.optionText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  typeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  typeButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "white",
  },
  typeButtonActive: {
    backgroundColor: "#FFA700",
    borderColor: "#FFA700",
  },
  typeButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  typeButtonTextActive: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  invoiceHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FCA3111C",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 24,
  },
  invoiceId: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
  },
  invoiceDate: {
    color: "#999",
    fontSize: 12,
    marginRight: 12,
  },
  editText: {
    color: "#FFA700",
    fontWeight: "bold",
    fontSize: 14,
  },
  optionalTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 12,
    color: "#000",
  },
  optionalList: {
    backgroundColor: "#FCA3111C",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#DEDEDE",
  },
  optionIcon: {
    marginRight: 16,
  },
  optionText: {
    color: "#666",
    fontSize: 14,
  },
  optionInput: {
    flex: 1,
    fontSize: 14,
    color: "#222",
    // borderBottomWidth: 1,
    // borderBottomColor: "#FFD272",
    paddingVertical: 2,
  },
  lrText: {
    fontWeight: "bold",
    marginRight: 10,
  },
  proceedButton: {
    marginTop: 30,
    backgroundColor: "#FFA700",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
  },
  proceedButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

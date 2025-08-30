import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Headerwithback from "./Headerwithback";
import ModalUpdatePhoto from "../Modals/ModalUpdatePhoto";
import CustomDropdown, {
  DropDownOption,
} from "../CommonComponent/CustomDropdown";
import { API_ROUTES } from "../constants/api-routes.constants";
import api from "../services/api/api";
import { useNavigation } from "@react-navigation/native";
import CalendarModal from "../Modals/CalendarModal";

const screenWidth = Dimensions.get("window").width;

const PaymentsScreen = () => {
  const navigation = useNavigation();

  const [selectedType, setSelectedType] = useState(true);
  const [selectedParty, setSelectedParty] = useState<"Customer" | "Vendor">(
    "Customer"
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("UPI");
  const [imagePickerModel, setImagePickerModel] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<any>();
  const [selectedBank, setSelectedBank] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [partyName, setPartyName] = useState<string>("");
  const [bankList, setBankList] = useState<DropDownOption[]>([]);
  const [errors, setErrors] = useState({});
  const [paymentCalModel, setPaymentCalModel] = useState<boolean>(false);

  const paymentMethods = ["UPI", "Cash", "Card", "Cheque", "EMI", "Netbanking"];

  useEffect(() => {
    getAllCategory();
  }, []);
  const getAllCategory = async () => {
    try {
      setIsLoading(true);

      const [banks] = await Promise.all([api.get(API_ROUTES.vendorBank)]);

      if (banks.data) {
        const transformedBank: DropDownOption[] = banks.data?.map(
          (item: any) => ({
            id: item.id,
            name: item.name || item.vendor_name,
          })
        );
        setBankList(transformedBank);
      }
    } catch (error) {
      console.log("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    let tempErrors: any = {};

    if (!amount) tempErrors.amount = "Amount is required";
    if (!paymentDate) tempErrors.paymentDate = "Payment date is required";
    if (!partyName) tempErrors.partyName = "Party name is required";
    if (selectedPaymentMethod !== "Cash" && !selectedBank) {
      tempErrors.bank = "Please select bank";
    }

    setErrors(tempErrors);
    console.log(tempErrors, "errors");

    return Object.keys(tempErrors).length === 0;
  };

  const addPaymentData = async () => {
    if (!validateForm()) return;
    try {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("type", selectedType ? "gave" : "received");
      formData.append("party", selectedParty.toLocaleLowerCase());
      formData.append("party_name", partyName);
      formData.append("amount", Number(amount).toFixed(2));
      formData.append("payment_date", paymentDate);
      formData.append("payment_type", selectedPaymentMethod.toLowerCase());

      // Optional fields
      if (description) {
        formData.append("notes", description);
      }
      if (selectedPaymentMethod !== "Cash" && selectedBank) {
        formData.append("account", selectedBank?.name);
      }

      if (imageFile) {
        formData.append("attachment", {
          uri: imageFile.uri,
          name: imageFile.name || "file.jpg",
          type: imageFile.type || "image/jpeg",
        });
      }
      console.log("formdata--->", formData);
      const res = await api.post(API_ROUTES.paymnet, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("res--->", res);
      navigation.goBack();
    } catch (error) {
      console.log("error-->", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Headerwithback title="Payments" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Type */}
        <View style={styles.row}>
          <Text style={{ fontSize: 14, color: "#000", fontWeight: "700" }}>
            Type
          </Text>
          <TouchableOpacity
            style={[styles.toggleButton, selectedType && styles.activeButton]}
            onPress={() => setSelectedType(true)}
          >
            <Text
              style={[
                styles.toggleButtonText,
                selectedType && styles.activeButtonText,
              ]}
            >
              You Gave
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, !selectedType && styles.activeButton]}
            onPress={() => setSelectedType(false)}
          >
            <Text
              style={[
                styles.toggleButtonText,
                !selectedType && styles.activeButtonText,
              ]}
            >
              You Received
            </Text>
          </TouchableOpacity>
        </View>

        {/* Party */}
        <View style={styles.row}>
          <Text style={{ fontSize: 14, color: "#000", fontWeight: "700" }}>
            Party
          </Text>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedParty === "Customer" && styles.activeButton,
            ]}
            onPress={() => setSelectedParty("Customer")}
          >
            <Text
              style={[
                styles.toggleButtonText,
                selectedParty === "Customer" && styles.activeButtonText,
              ]}
            >
              Customer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedParty === "Vendor" && styles.activeButton,
            ]}
            onPress={() => setSelectedParty("Vendor")}
          >
            <Text
              style={[
                styles.toggleButtonText,
                selectedParty === "Vendor" && styles.activeButtonText,
              ]}
            >
              Vendor
            </Text>
          </TouchableOpacity>
        </View>

        {/* Select Party */}
        <Text style={styles.label}>Select Party</Text>
        <TextInput
          placeholder="Search"
          placeholderTextColor="#999"
          style={styles.input}
          value={partyName}
          onChangeText={setPartyName}
        />
        {errors?.partyName && (
          <Text style={{ color: "red", marginBottom: 10 }}>
            {errors?.partyName}
          </Text>
        )}

        {/* Amount */}
        <Text style={styles.label}>Amount</Text>
        <TextInput
          placeholder="Enter here"
          placeholderTextColor="#999"
          keyboardType="numeric"
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
        />
        {errors?.amount && (
          <Text style={{ color: "red", marginBottom: 10 }}>
            {errors?.amount}
          </Text>
        )}

        {/* Payment Date */}
        <Text style={styles.label}>Payment Date</Text>
        <TouchableOpacity
          onPress={() => {
            setPaymentCalModel(true);
          }}
          style={styles.inputRow}
        >
          <TextInput
            placeholder="DD/MM/YYYY"
            placeholderTextColor="#999"
            style={[styles.input, { flex: 1 }]}
            editable={false}
            value={paymentDate}
          />
          <View style={styles.iconButton}>
            <Icon name="calendar-today" size={20} color="#FCA311" />
          </View>
        </TouchableOpacity>
        {errors?.paymentDate && (
          <Text style={{ color: "red", marginBottom: 10 }}>
            {errors?.paymentDate}
          </Text>
        )}

        {/* Select Type */}
        <Text style={[styles.label, { marginTop: 10 }]}>Select Type *</Text>
        <View style={styles.paymentRow}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                styles.paymentMethod,
                selectedPaymentMethod === method && styles.paymentMethodActive,
              ]}
              onPress={() => setSelectedPaymentMethod(method)}
            >
              <Text
                style={[
                  styles.paymentMethodText,
                  selectedPaymentMethod === method &&
                    styles.paymentMethodTextActive,
                ]}
              >
                {method}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Select Account */}
        {selectedPaymentMethod !== "Cash" && (
          <>
            <Text style={styles.addBankText}>Select Bank</Text>
            <CustomDropdown
              onSelect={setSelectedBank}
              placeholder="Select Bank"
              selectedValue={selectedBank?.name || ""}
              options={bankList}
              dropDownBoxStyle={{ marginTop: 10 }}
            />
            {errors?.bank && (
              <Text style={{ color: "red" }}>{errors?.bank}</Text>
            )}
          </>
        )}

        {/* Notes */}
        <Text style={styles.label}>Notes</Text>
        <TextInput
          placeholder="Expense Description"
          placeholderTextColor="#999"
          style={styles.notesInput}
          multiline
          value={description}
          onChangeText={setDescription}
        />

        {/* Attachments */}
        <Text style={styles.label}>Attachments</Text>
        {imageFile?.uri ? (
          <TouchableOpacity
            onPress={() => setImagePickerModel(true)}
            style={styles.imageBox}
          >
            <Image
              source={{ uri: imageFile?.uri }}
              style={styles.imagePreview}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => setImagePickerModel(true)}
              style={styles.attachmentButton}
            >
              <Icon name="upload-file" size={20} color="#000" />
              <Text style={styles.attachmentText}>Upload File</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Create Button */}
        <TouchableOpacity style={styles.createButton} onPress={addPaymentData}>
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </ScrollView>
      <ModalUpdatePhoto
        isVisible={imagePickerModel}
        onClose={() => setImagePickerModel(false)}
        onSelectedFile={(file: any) => {
          setImageFile(file);
        }}
        onChange={(image) => console.log("Full crop picker image:", image)}
      />
      <CalendarModal
        visible={paymentCalModel}
        initialDate={paymentDate}
        onClose={() => setPaymentCalModel(false)}
        onSelect={setPaymentDate}
      />
    </View>
  );
};

export default PaymentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 15,
  },
  content: {
    padding: 16,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 10,
  },
  toggleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    paddingVertical: 4,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#FCA311",
  },
  toggleButtonText: {
    color: "#000",
    fontWeight: "500",
  },
  activeButtonText: {
    color: "#fff",
  },
  label: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#FFF8EB",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 10,
  },
  paymentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  paymentMethod: {
    width: "30%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#C3C3C3",
    alignItems: "center",
  },
  paymentMethodActive: {
    backgroundColor: "#FCA311",
  },
  paymentMethodText: {
    fontSize: 14,
    color: "#fff",
  },
  paymentMethodTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  addBankText: {
    color: "#FCA311",
    fontWeight: "600",
    marginTop: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 10,
    minHeight: 80,
    backgroundColor: "#FFF8EB",
  },
  attachmentButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 8,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFF8EB",
  },
  attachmentText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#000",
  },
  imageBox: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fffbe6",
    marginBottom: 12,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  createButton: {
    width: "35%",
    alignSelf: "flex-end",
    backgroundColor: "#FCA311",
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 20,
  },
  createButtonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
});

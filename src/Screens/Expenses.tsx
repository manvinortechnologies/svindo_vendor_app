import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  ScrollView,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/MaterialCommunityIcons";
import Headerwithback from "./Headerwithback";
import CustomTextInput from "../CommonComponent/CustomeTextInput";
import CalendarModal from "../Modals/CalendarModal";
import api from "../services/api/api";
import { CategoryType } from "../modelType/CommonType";
import CustomDropdown, {
  DropDownOption,
} from "../CommonComponent/CustomDropdown";
import ModalUpdatePhoto from "../Modals/ModalUpdatePhoto";
import { API_ROUTES } from "../constants/api-routes.constants";
import Loading from "../CommonComponent/Loading";

const Expenses = ({ navigation }: any) => {
  const [isPaid, setIsPaid] = useState(true);
  const [selectedType, setSelectedType] = useState("Cash");
  const [expense, setExpense] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openCallenderModel, setOpenCallenderModel] = useState<boolean>(false);
  const [expenseDate, setExpenseDate] = useState<string>("");
  const [paymentData, setPaymentDate] = useState<string>("");
  const [paymentCalModel, setPaymentCalModel] = useState<boolean>(false);
  const [allCategoryData, setAllCategoryData] = useState<CategoryType[]>([]);
  const [bankList, setBankList] = useState<DropDownOption[]>([]);
  const [category, setCategory] = useState<CategoryType | null>();
  const [selectedBank, setSelectedBank] = useState("");
  const [description, setDescription] = useState<string>("");
  const [imageFile, setImageFile] = useState<any>();
  const [imageUrl, setImageUrl] = useState("");
  const [imagePickerModel, setImagePickerModel] = useState(false);
  const [errors, setErrors] = useState({});
  const types = ["UPI", "Cash", "Card", "Cheque", "EMI", "Netbanking"];
  useEffect(() => {
    getAllCategory();
  }, []);
  const getAllCategory = async () => {
    try {
      setIsLoading(true);

      const [expenseCatagory, banks] = await Promise.all([
        api.get(API_ROUTES.expenseCategory),
        api.get(API_ROUTES.vendorBank),
      ]);

      if (expenseCatagory.data) {
        setAllCategoryData(expenseCatagory.data);
      }

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

    if (!expense) tempErrors.expense = "Expense amount is required";
    if (!expenseDate) tempErrors.expenseDate = "Expense date is required";
    if (!category) tempErrors.category = "Category is required";
    if (!description) tempErrors.description = "Description is required";

    if (isPaid) {
      if (!paymentData) {
        tempErrors.paymentDate = "Payment date is required";
      }
      if (selectedType !== "Cash" && !selectedBank) {
        tempErrors.bank = "Please select bank";
      }
    }

    setErrors(tempErrors);
    console.log(tempErrors, "errors");

    return Object.keys(tempErrors).length === 0;
  };
  const addExpensesData = async () => {
    if (!validateForm()) return;
    try {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("amount", expense);
      formData.append("expense_date", expenseDate);
      formData.append("category", category?.id);
      formData.append("is_paid", isPaid);
      formData.append("payment_type", selectedType.toLowerCase());

      // Optional fields
      if (paymentData) {
        formData.append("payment_date", paymentData);
      }

      if (selectedBank) {
        formData.append("bank", selectedBank?.name);
      }

      if (description) {
        formData.append("description", description);
      }

      if (imageFile) {
        formData.append("attachment", {
          uri: imageFile.uri,
          name: imageFile.name || "file.jpg",
          type: imageFile.type || "image/jpeg",
        });
      }
      console.log("formdata--->", formData);
      const res = await api.post(API_ROUTES.expense, formData, {
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
      <Headerwithback title="Create Expenses" />
      <Loading visible={isLoading} />
      <ScrollView>
        {/* Expense Amount */}
        <Text style={styles.label}>Enter Expense Amount</Text>
        {/* <TextInput placeholder="0.00" style={styles.input} keyboardType="decimal-pad" /> */}
        <CustomTextInput
          placeholder="0.00"
          value={expense}
          onChangeText={setExpense}
          styles={styles.input}
          keyboardType="decimal-pad"
        />
        {errors?.expense && (
          <Text style={{ color: "red" }}>{errors?.expense}</Text>
        )}
        {/* Expense Date */}
        <Text style={styles.label}>Expense Date</Text>
        <TouchableOpacity
          style={styles.inputRow}
          onPress={() => {
            setOpenCallenderModel(true);
          }}
        >
          <TextInput
            placeholderTextColor="#999"
            placeholder="Select Expense Date"
            style={styles.input}
            editable={false}
            value={expenseDate}
          />

          <Ionicons
            name="calendar"
            size={20}
            color="orange"
            style={styles.iconRight}
          />
        </TouchableOpacity>
        {errors?.expenseDate && (
          <Text style={{ color: "red", marginBottom: 10 }}>
            {errors?.expenseDate}
          </Text>
        )}
        {/* Category Dropdown */}
        <CustomDropdown
          placeholder="Select Category"
          onSelect={(option) => setCategory(option)}
          selectedValue={category?.name || ""}
          dropDownBoxStyle={styles.input}
          styles={{ marginBottom: 0, marginTop: 10 }}
          options={allCategoryData}
        />
        {errors?.category && (
          <Text style={{ color: "red", marginBottom: 10 }}>
            {errors?.category}
          </Text>
        )}
        <View style={styles.markpain}>
          {/* Mark as Paid */}
          <Text style={styles.label}>Mark as Paid</Text>
          <TouchableOpacity
            onPress={() => setIsPaid(!isPaid)}
            style={[
              styles.toggleButton,
              { backgroundColor: isPaid ? "#FCA311" : "#ccc" },
            ]}
          >
            <Text style={{ color: "#fff" }}>{isPaid ? "Yes" : "No"}</Text>
          </TouchableOpacity>
        </View>
        {isPaid && (
          <>
            {/* Select Type */}
            <Text style={styles.label}>
              Select Type <Text style={{ color: "red" }}>*</Text>
            </Text>
            <View style={styles.typeRow}>
              {types.map((type) => {
                const isSelected = selectedType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setSelectedType(type)}
                    style={[
                      styles.typeButton,
                      isSelected && styles.typeButtonSelected,
                    ]}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {isSelected && (
                        <Ionicons name="check-circle" size={16} color="#fff" />
                      )}
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        {type}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Payment Date */}
            <Text style={styles.label}>Payment Date</Text>
            <TouchableOpacity
              style={styles.inputRow}
              onPress={() => {
                setPaymentCalModel(true);
              }}
            >
              <TextInput
                placeholderTextColor="#999"
                placeholder="Select Payment Date"
                style={styles.input}
                editable={false}
                value={paymentData}
              />
              <Ionicons
                name="calendar"
                size={20}
                color="orange"
                style={styles.iconRight}
              />
            </TouchableOpacity>
            {errors?.paymentDate && (
              <Text style={{ color: "red" }}>{errors?.paymentDate}</Text>
            )}
            {/* Add Bank */}
            {selectedType !== "Cash" && (
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
          </>
        )}

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: "top" }]}
          placeholder="Expense Description"
          multiline
          value={description}
          onChangeText={setDescription}
          placeholderTextColor={"#999"}
        />
        {errors?.description && (
          <Text style={{ color: "red" }}>{errors?.description}</Text>
        )}
        {/* Attachments */}
        <Text style={styles.label}>Attachments</Text>
        <View style={styles.attachmentRow}>
          {!imageFile?.uri ? (
            <TouchableOpacity
              style={styles.attachmentBtn}
              onPress={() => {
                setImagePickerModel(true);
              }}
            >
              <Ionicons name="camera" size={18} color="#000" />
              <Text style={styles.attachmentText}>Upload File</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setImagePickerModel(true)}
              style={styles.imageBox}
            >
              <Image
                source={{ uri: imageFile?.uri }}
                style={styles.imagePreview}
              />
            </TouchableOpacity>
          )}
          {/* <TouchableOpacity style={styles.attachmentBtn}>
            <Ionicons name="document" size={18} color="#000" />
            <Text style={styles.attachmentText}>Camera</Text>
          </TouchableOpacity> */}
        </View>
        <CalendarModal
          visible={openCallenderModel}
          initialDate={expenseDate}
          onClose={() => setOpenCallenderModel(false)}
          onSelect={(e) => {
            console.log(e);
            setExpenseDate(e);
          }}
        />
        <CalendarModal
          visible={paymentCalModel}
          initialDate={paymentData}
          onClose={() => setPaymentCalModel(false)}
          onSelect={setPaymentDate}
        />
        <ModalUpdatePhoto
          isVisible={imagePickerModel}
          onClose={() => setImagePickerModel(false)}
          onSelectedFile={(file: any) => {
            setImageFile(file);
            setImageUrl(file.uri);
          }}
          onChange={(image) => console.log("Full crop picker image:", image)}
        />

        {/* Create Button */}
        <TouchableOpacity style={styles.createBtn} onPress={addExpensesData}>
          <Text style={styles.createText}>Create</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 40 : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  label: {
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 12,
    backgroundColor: "#FFF5E9",
    width: "100%",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    width: "100%",
  },
  iconRight: {
    position: "absolute",
    right: 12,
  },
  markpain: {
    flexDirection: "row",
    gap: 10,
  },
  toggleButton: {
    width: 60,
    paddingVertical: 6,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 4,
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 8,
    rowGap: 12,
  },

  typeButton: {
    width: "30%", // ~3 buttons per row with spacing
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#ccc",
    color: "#fff",
  },
  typeButtonSelected: {
    backgroundColor: "#FCA311",
  },
  addBankBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  addBankText: {
    color: "#FCA311",
    fontWeight: "600",
    marginLeft: 4,
  },
  attachmentRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  attachmentBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#FCA311",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
    backgroundColor: "#FFF5E9",
  },
  attachmentText: {
    fontWeight: "600",
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
  plusIcon: {
    fontSize: 20,
    color: "#000",
  },
  createBtn: {
    backgroundColor: "#FCA311",
    padding: 14,
    borderRadius: 10,
    marginTop: 24,
    alignItems: "center",
    width: "45%",
    alignSelf: "flex-end", // <--- aligns button to the right
    marginRight: 10, // <--- optional spacing from right
  },
  createText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Expenses;

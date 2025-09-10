import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import Headerwithback from "./Headerwithback";
import Loading from "../CommonComponent/Loading";
import api from "../services/api/api";
import { Vendor } from "../type/Vendor";
import formatNumber from "../utils/priceFormatter";
import VendorModal from "../Modals/VendorModal";
import CustomModal from "../Modals/CustomModal";
import CustomTextInput from "../CommonComponent/CustomeTextInput";
import CalendarModal from "../Modals/CalendarModal";
import CustomButton from "../CommonComponent/CustomeButton";
import MainContainer from "../CommonComponent/MainContainer";
import { Alert } from "react-native";
import ProductSelectionModal from "../Modals/ProductSelectionModal";
import OptionInput from "../CommonComponent/OptionalInputs";
import { API_ROUTES } from "../constants/api-routes.constants";
import moment from "moment";
import CustomDropdown, {
  DropDownOption,
} from "../CommonComponent/CustomDropdown";

interface Product {
  id: number;
  name: string;
  desc: string;
  price: number;
  image: string;
}

const CreatePurchase = ({ navigation }: any) => {
  const [selectedPayment, setSelectedPayment] = useState("credit");
  const [selectedAdvanceType, setSelectedAdvanceType] = useState("Bank");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVendorModalVisible, setIsVendorModalVisible] = useState(false);
  const [isPurchasePlanModalVisible, setIsPurchasePlanModalVisible] =
    useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [allVendorList, setAllVendorList] = useState<Vendor[]>();
  const [allProductList, setAllProductList] = useState<Product[]>();
  const [bankList, setBankList] = useState<DropDownOption[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [purchasecode, setPurchasecode] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [openCalendarModel, setOpenCalendarModel] = useState<boolean>(false);
  const [discount, setDiscount] = useState({ amount: "", pr: "" });
  const [dueDate, setDueDate] = useState<string>("");
  const [dueDateCallModel, setDueDateCallModel] = useState<boolean>(false);
  const [serialNo, setSerialNo] = useState<string>("");
  const [advanceAmount, setAdvanceAmount] = useState<string>("");
  const [selectedBank, setSelectedBank] = useState<DropDownOption>();
  const [supplierDate, setSupplierDate] = useState<string>("");
  const [supplierDateCallModel, setSupplierDateCallModel] =
    useState<boolean>(false);
  const [packingCharges, setPackingCharges] = useState<string>("");
  const [packingChargesModel, setPackingChargesModel] =
    useState<boolean>(false);
  // New states for optional fields
  const [dispatchAddress, setDispatchAddress] = useState<string>("");
  const [dispatchAddressModel, setDispatchAddressModel] =
    useState<boolean>(false);
  const [bank, setBank] = useState<string>("");
  const [bankModel, setBankModel] = useState<boolean>(false);
  const [signature, setSignature] = useState<string>("");
  const [signatureModel, setSignatureModel] = useState<boolean>(false);
  const [references, setReferences] = useState<string>("");
  const [referencesModel, setReferencesModel] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");
  const [notesModel, setNotesModel] = useState<boolean>(false);
  const [terms, setTerms] = useState<string>("");
  const [termsModel, setTermsModel] = useState<boolean>(false);
  const [extraDiscount, setExtraDiscount] = useState<string>("");
  const [extraDiscountModel, setExtraDiscountModel] = useState<boolean>(false);
  const [deliveryCharges, setDeliveryCharges] = useState<string>("");
  const [deliveryChargesModel, setDeliveryChargesModel] =
    useState<boolean>(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [formData, setFormData] = useState({
    dispatchAddress: "",
    signature: "",
    references: "",
    notes: "",
    terms: "",
    shippingCharges: "",
    packagingCharges: "",
    ewayBill: "",
    lrNumber: "",
    vehicleNumber: "",
    transportName: "",
    parcels: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let tempErrors: any = {};

    if (!selectedVendor) tempErrors.vendor = "Please select a vendor";
    if (!selectedProducts.length) tempErrors.products = "Please add a product";
    if (!supplierDate)
      tempErrors.supplierDate = "Supplier invoice date required";
    if (!serialNo.trim()) tempErrors.serialNo = "Serial number is required";

    // ✅ check discount Amount
    if (
      !discount.amount ||
      Number(discount.amount) <= 0 ||
      !discount.pr ||
      Number(discount.pr) < 0
    ) {
      tempErrors.discount = `Discount amount ${
        !discount.pr || Number(discount.pr) < 0
          ? "and Discount percentage "
          : ""
      }must be a valid positive number`;
    }

    if (selectedPayment === "In Credit") {
      if (!dueDate) {
        tempErrors.dueDate = "Due date is required";
      }
      if (!advanceAmount) {
        tempErrors.advanceAmount =
          "Advance amount must be a valid positive number";
      }
      if (selectedAdvanceType === "Bank" && !selectedBank) {
        tempErrors.advanceBank = "Please select bank";
      }
    }

    setErrors(tempErrors);
    console.log(tempErrors, "errors");

    return Object.keys(tempErrors).length === 0;
  };

  const handleSearch = () => {
    // Handle search action
  };

  const handlePercentChange = (value: string) => {
    const totalAmount = selectedProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setDiscount((p) => ({ ...p, pr: value }));
    const percent = parseFloat(value);
    if (!isNaN(percent)) {
      const amount = (totalAmount * percent) / 100;
      setDiscount((p) => ({ ...p, amount: amount.toFixed(2) }));
    } else {
      setDiscount((p) => ({ ...p, pr: "" }));
    }
  };

  const handleAmountChange = (value: string) => {
    const totalAmount = selectedProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setDiscount((p) => ({ ...p, amount: value }));
    const amount = parseFloat(value);
    if (!isNaN(amount)) {
      const percent = (amount / totalAmount) * 100;
      setDiscount((p) => ({ ...p, pr: percent.toFixed(2) }));
    } else {
      setDiscount((p) => ({ ...p, amount: "" }));
    }
  };

  useEffect(() => {
    getInitialData();
  }, []);

  const getInitialData = async () => {
    try {
      setIsLoading(true);

      const [vendorRes, purchaseRes, banks] = await Promise.all([
        api.get(API_ROUTES.vendorList),
        api.get(API_ROUTES.purchaseNo),
        api.get(API_ROUTES.vendorBank),
      ]);

      if (vendorRes.data) {
        setAllVendorList(vendorRes.data);
      }

      // if (productRes.data) {
      //   const data = productRes.data.map((item: any) => ({
      //     id: item.id,
      //     name: item.name || item.product_name,
      //     desc: item.description || "",
      //     price: item.sales_price || 0,
      //     image: item.image || "https://via.placeholder.com/150",
      //     ...item,
      //   }));
      //   setAllProductList(data);
      // }

      if (purchaseRes.data) {
        setPurchasecode(purchaseRes.data.purchase_number); // or the correct key from API
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

  const handleSelectVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsVendorModalVisible(false);
  };

  const submitAllData = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const data = {
        purchase_date: purchaseDate,
        vendor: selectedVendor?.id,
        payment_method:
          selectedPayment === "In Credit"
            ? "credit"
            : selectedPayment.toLowerCase(),
        discount_percent: Number(discount) || 0,
        discount_amount: Number(extraDiscount) || 0,
        advance_amount: Number(advanceAmount) || 0,
        advance_mode: selectedAdvanceType.toLowerCase(), // bank / cash
        due_date: dueDate,
        advance_bank: selectedBank?.id,
        dispatch_address: formData.dispatchAddress,
        references: formData.references,
        notes: formData.notes,
        terms: formData.terms,
        delivery_shipping_charges: Number(formData.shippingCharges) || 0,
        packaging_charges: Number(formData.packagingCharges) || 0,
        eway_bill_no: formData.ewayBill,
        lr_no: formData.lrNumber,
        vehicle_no: formData.vehicleNumber,
        transport_name: formData.transportName,
        no_of_parcels: Number(formData.parcels) || null,
        items: selectedProducts.map((p) => ({
          product: p.id,
          quantity: p.quantity,
          price: p.price,
          total: Number(p.quantity) * Number(p.price),
        })),
      };

      !dueDate && delete data.due_date;

      console.log("Sending purchase data:", data);

      const res = await api.post("vendor/purchase/", data);

      if (res.status === 201) {
        navigation.goBack();
      }
    } catch (error) {
      console.log("error-->", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <MainContainer>
      <View style={styles.container}>
        <Headerwithback
          title="Create Purchase"
          rightIcons={[
            <TouchableOpacity onPress={handleSearch} key="search">
              <Icon name="file-document-outline" size={20} color="#FCA311" />
            </TouchableOpacity>,
          ]}
        />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.content}
            >
              {/* Purchase Info */}
              <View style={styles.section}>
                <View style={styles.rowBetween}>
                  <View>
                    <Text style={{ color: "#777777" }}>Purchase</Text>
                    <Text style={styles.value}>{purchasecode}</Text>
                    <Text style={{ color: "#777777", marginTop: 2 }}>
                      {purchaseDate}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setIsEditModalVisible(true)}>
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
                </View>
                {errors?.purchasecode && (
                  <Text style={{ color: "red" }}>{errors?.purchasecode}</Text>
                )}
              </View>

              {/* Vendor Selection */}

              <View style={{ marginBottom: 12 }}>
                <Text style={styles.label}>
                  Vendor <Icon name="information" size={14} />
                </Text>
                <TouchableOpacity
                  style={styles.selector}
                  onPress={() => setIsVendorModalVisible(true)}
                >
                  <Text style={styles.selectorText}>
                    {selectedVendor ? selectedVendor.name : "+ Select Vendor"}
                  </Text>
                </TouchableOpacity>
                {errors?.vendor && (
                  <Text style={{ color: "red", marginBottom: 12 }}>
                    {errors?.vendor}
                  </Text>
                )}
                <Text style={styles.label}>
                  Product <Icon name="information" size={14} />
                </Text>
                <TouchableOpacity
                  style={styles.selector}
                  onPress={() => setShowProductModal(true)}
                >
                  <Text style={styles.selectorText}>
                    {selectedProducts.length ? "Add +" : "+ Select Products"}
                  </Text>
                </TouchableOpacity>
                {errors?.products && (
                  <Text style={{ color: "red" }}>{errors?.products}</Text>
                )}
              </View>

              {!!selectedProducts.length && (
                <View style={{ marginBottom: 12 }}>
                  {/* Table Header */}
                  <View style={styles.tableHeader}>
                    <Text
                      style={[
                        styles.tableText,
                        { color: "#fff", fontWeight: "500" },
                      ]}
                    >
                      S.No.
                    </Text>
                    <Text
                      style={[
                        styles.tableText,
                        { flex: 2, color: "#fff", fontWeight: "500" },
                      ]}
                    >
                      Item
                    </Text>
                    <Text
                      style={[
                        styles.tableText,
                        { color: "#fff", fontWeight: "500" },
                      ]}
                    >
                      Quantity
                    </Text>
                    <Text
                      style={[
                        styles.tableText,
                        { color: "#fff", fontWeight: "500" },
                      ]}
                    >
                      Purchase Price
                    </Text>
                    <Text
                      style={[
                        styles.tableText,
                        { color: "#fff", fontWeight: "500" },
                      ]}
                    >
                      Amount
                    </Text>
                  </View>

                  {/* Product List */}
                  {selectedProducts.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                      <Text style={styles.tableText}>{index + 1}</Text>
                      <Text
                        style={[styles.tableText, { flex: 2 }]}
                        numberOfLines={2}
                      >
                        {item.name}
                      </Text>
                      <TextInput
                        style={[styles.tableText, styles.quantityInput]}
                        value={item.quantity.toString()}
                        onChangeText={(text) => {
                          const newQuantity = parseInt(text) || 0;
                          if (newQuantity >= 0) {
                            const updatedProducts = [...selectedProducts];
                            if (newQuantity === 0) {
                              // Remove item if quantity is 0
                              updatedProducts.splice(index, 1);
                            } else {
                              // Update quantity
                              updatedProducts[index] = {
                                ...item,
                                quantity: newQuantity,
                              };
                            }
                            setSelectedProducts(updatedProducts);
                          }
                        }}
                        keyboardType="numeric"
                        selectTextOnFocus
                      />
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          flexDirection: "row",
                        }}
                        onPress={() => setIsPurchasePlanModalVisible(true)}
                      >
                        <Text style={styles.tableText}>
                          {formatNumber(Number(item?.purchase_price))}
                        </Text>
                      </TouchableOpacity>
                      <Text style={styles.tableText}>
                        {formatNumber(item?.purchase_price * item?.quantity)}
                      </Text>

                      <TouchableOpacity
                        onPress={() => {
                          const updated = selectedProducts.filter(
                            (_, i) => i !== index
                          );
                          setSelectedProducts(updated);
                        }}
                      >
                        <Icon name="delete" size={16} color="red" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* Supplier Invoice */}
              <View style={styles.section}>
                <Text style={styles.label}>Supplier Invoice</Text>
                <Text style={styles.inputLabel}>Supplier Invoice Date</Text>
                <TouchableOpacity
                  style={styles.inputField}
                  onPress={() => setSupplierDateCallModel(true)}
                >
                  <Text style={{ color: supplierDate ? "#000" : "#777" }}>
                    {supplierDate || "Select Supplier Invoice Date"}
                  </Text>
                  <Feather name="calendar" size={18} color="#FCA311" />
                </TouchableOpacity>
                {errors?.supplierDate && (
                  <Text style={{ color: "red" }}>{errors?.supplierDate}</Text>
                )}
                <Text style={styles.inputLabel}>Serial Number</Text>
                <TextInput
                  style={styles.textInput}
                  value={serialNo}
                  onChangeText={setSerialNo}
                  placeholder="Supplier Invoice Serial Number"
                  placeholderTextColor={"#777"}
                />
                {errors?.serialNo && (
                  <Text style={{ color: "red" }}>{errors?.serialNo}</Text>
                )}
              </View>

              {/* Optional Section */}
              <View style={styles.rowBetween}>
                <Text style={styles.label}>Optional</Text>
                {/* <TouchableOpacity>
                  <Text style={styles.linkText}>+ Additional Charges</Text>
                </TouchableOpacity> */}
              </View>

              <View style={styles.section}>
                {[
                  {
                    icon: "file-document-outline",
                    label: "Add References",
                    state: "references",
                  },
                  {
                    icon: "note",
                    label: "Add Notes",
                    state: "notes",
                  },
                  {
                    icon: "file-certificate-outline",
                    label: "Add Terms",
                    state: "terms",
                  },
                  // {
                  //   icon: "truck",
                  //   label: "Select Dispatch Address",
                  //   state: "dispatchAddress",
                  // },
                  // {
                  //   icon: "bank",
                  //   label: "Bank",
                  //   sub: "Cash",
                  //   action: "Change",
                  // },
                  // {
                  //   icon: "pen",
                  //   label: "Select Signature",
                  // },
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
                  {
                    icon: "file-multiple",
                    label: "E-way Bill Number",
                    state: "ewayBill",
                  },
                  {
                    icon: null,
                    label: "LR Number",
                    state: "lrNumber",
                    boldLabelPrefix: "LR",
                  },
                  {
                    icon: "truck-fast",
                    label: "Vehicle Number",
                    state: "vehicleNumber",
                  },
                  {
                    icon: "truck-delivery",
                    label: "Transport Name",
                    state: "transportName",
                  },
                  {
                    icon: "cube-outline",
                    label: "No. of Parcels",
                    state: "parcels",
                    keyboardType: "numeric",
                  },

                  // {
                  //   icon: "percent-outline",
                  //   label: "Add Extra Discount",
                  // },
                ].map((item, index) => (
                  <OptionInput
                    key={item.state}
                    icon={item.icon}
                    label={item.label}
                    value={formData[item.state]}
                    onChangeText={(text) => handleChange(item.state, text)}
                    keyboardType={item.keyboardType}
                    boldLabelPrefix={item.boldLabelPrefix}
                  />
                ))}
              </View>

              {/* Last Box Container */}
              <View
                style={{
                  padding: 10,
                  borderWidth: 1,
                  borderColor: "#D9D9D9",
                  borderRadius: 15,
                }}
              >
                {/* Discount Row */}
                <View style={styles.row}>
                  <Text style={[styles.label, { marginRight: 15 }]}>
                    Discount
                  </Text>
                  <TextInput
                    value={discount?.pr}
                    onChangeText={handlePercentChange}
                    placeholder="0"
                    placeholderTextColor="#ccc"
                    style={styles.input}
                    keyboardType="numeric"
                  />
                  <TextInput
                    value={discount?.amount}
                    onChangeText={handleAmountChange}
                    placeholder="%"
                    placeholderTextColor="#ccc"
                    style={styles.input}
                    keyboardType="numeric"
                  />
                </View>
                {errors?.discount && (
                  <Text style={{ color: "red" }}>{errors?.discount}</Text>
                )}

                {/* Payment Row */}
                <View style={styles.row}>
                  <Text style={[styles.label, { marginRight: 20 }]}>
                    Payment
                  </Text>
                  <View style={styles.optionsRow}>
                    {["UPI", "Card", "Cash", "In Credit"].map((method) => (
                      <TouchableOpacity
                        key={method}
                        style={[
                          styles.optionButton,
                          selectedPayment === method && styles.selectedButton,
                        ]}
                        onPress={() => setSelectedPayment(method)}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            selectedPayment === method && styles.selectedText,
                          ]}
                        >
                          {method}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                {selectedPayment === "In Credit" && (
                  <>
                    {/* Advance Row */}
                    <View style={styles.row}>
                      <Text style={[styles.label, { marginRight: 15 }]}>
                        Advance
                      </Text>
                      <View style={styles.inputGroup}>
                        <TextInput
                          placeholder="Amount"
                          style={styles.input}
                          keyboardType="numeric"
                          value={advanceAmount}
                          onChangeText={setAdvanceAmount}
                        />
                        {["Bank", "Cash"].map((type) => (
                          <TouchableOpacity
                            key={type}
                            style={[
                              styles.optionButton,
                              selectedAdvanceType === type &&
                                styles.selectedButton,
                            ]}
                            onPress={() => setSelectedAdvanceType(type)}
                          >
                            <Text
                              style={[
                                styles.optionText,
                                selectedAdvanceType === type &&
                                  styles.selectedText,
                              ]}
                            >
                              {type}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      {errors?.advanceAmount && (
                        <Text style={{ color: "red" }}>
                          {errors?.advanceAmount}
                        </Text>
                      )}
                    </View>
                    {selectedAdvanceType === "Bank" && (
                      <>
                        <CustomDropdown
                          onSelect={setSelectedBank}
                          placeholder="Select Bank"
                          selectedValue={selectedBank?.name || ""}
                          options={bankList}
                          dropDownBoxStyle={{ marginTop: 10 }}
                        />
                        {errors?.advanceBank && (
                          <Text style={{ color: "red" }}>
                            {errors?.advanceBank}
                          </Text>
                        )}
                      </>
                    )}
                    {/* Due Date Row */}
                    <View style={styles.row}>
                      <Text style={[styles.label, { marginRight: 15 }]}>
                        Due Date
                      </Text>
                      <TouchableOpacity
                        style={{ width: "30%" }}
                        onPress={() => setDueDateCallModel(true)}
                      >
                        <TextInput
                          placeholder="DD/MM/YYYY"
                          value={dueDate}
                          placeholderTextColor={"#777"}
                          editable={false}
                          style={[styles.inputFull, { width: "100%" }]}
                          pointerEvents="none"
                        />
                      </TouchableOpacity>
                    </View>
                    {errors?.dueDate && (
                      <Text style={{ color: "red" }}>{errors?.dueDate}</Text>
                    )}
                  </>
                )}
              </View>

              {/* Proceed Button */}
              <TouchableOpacity
                onPress={submitAllData}
                style={{
                  width: "40%",
                  alignSelf: "center",
                  padding: 10,
                  backgroundColor: "#FCA311",
                  marginVertical: 15,
                  alignItems: "center",
                  borderRadius: 15,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  Proceed
                </Text>
              </TouchableOpacity>

              {/* Modals */}
              <VendorModal
                visible={isVendorModalVisible}
                vendors={allVendorList}
                selectedVendor={selectedVendor}
                onSelect={handleSelectVendor}
                onClose={() => setIsVendorModalVisible(false)}
              />
              <Loading visible={isLoading} />
              {/* Purchase Data Modal */}
              <CustomModal
                visible={isEditModalVisible}
                onClose={() => setIsEditModalVisible(false)}
                children={
                  <>
                    <TouchableOpacity
                      style={{ marginTop: 20 }}
                      onPress={() => setOpenCalendarModel(true)}
                    >
                      <Text style={{ marginBottom: 5 }}>Purchase Date</Text>
                      <CustomTextInput
                        value={purchaseDate}
                        placeholder="Select Purchase Date"
                        editable={false}
                      />
                    </TouchableOpacity>
                    <CalendarModal
                      visible={openCalendarModel}
                      initialDate={purchaseDate}
                      onClose={() => setOpenCalendarModel(false)}
                      onSelect={(e) => setPurchaseDate(e)}
                      minDate={""}
                    />
                    <CustomButton
                      containerStyle={{ marginTop: 20 }}
                      title="Done"
                      onPress={() => setIsEditModalVisible(false)}
                    />
                  </>
                }
              />
              {/* Dispatch Address Modal */}
              <CustomModal
                visible={dispatchAddressModel}
                onClose={() => setDispatchAddressModel(false)}
                children={
                  <>
                    <Text style={{ marginBottom: 5 }}>Dispatch Address</Text>
                    <CustomTextInput
                      value={dispatchAddress}
                      onChangeText={setDispatchAddress}
                      placeholder="Enter Dispatch Address"
                    />
                    <CustomButton
                      containerStyle={{ marginTop: 20 }}
                      title="Done"
                      onPress={() => setDispatchAddressModel(false)}
                    />
                  </>
                }
              />
              {/* Bank Modal */}
              <CustomModal
                visible={bankModel}
                onClose={() => setBankModel(false)}
                children={
                  <>
                    <Text style={{ marginBottom: 5 }}>Bank</Text>
                    <CustomTextInput
                      value={bank}
                      onChangeText={setBank}
                      placeholder="Enter Bank Details"
                    />
                    <CustomButton
                      containerStyle={{ marginTop: 20 }}
                      title="Done"
                      onPress={() => setBankModel(false)}
                    />
                  </>
                }
              />
              {/* Signature Modal */}
              <CustomModal
                visible={signatureModel}
                onClose={() => setSignatureModel(false)}
                children={
                  <>
                    <Text style={{ marginBottom: 5 }}>Signature</Text>
                    <CustomTextInput
                      value={signature}
                      onChangeText={setSignature}
                      placeholder="Enter Signature"
                    />
                    <CustomButton
                      containerStyle={{ marginTop: 20 }}
                      title="Done"
                      onPress={() => setSignatureModel(false)}
                    />
                  </>
                }
              />
              {/* References Modal */}
              <CustomModal
                visible={referencesModel}
                onClose={() => setReferencesModel(false)}
                children={
                  <>
                    <Text style={{ marginBottom: 5 }}>References</Text>
                    <CustomTextInput
                      value={references}
                      onChangeText={setReferences}
                      placeholder="Enter References"
                    />
                    <CustomButton
                      containerStyle={{ marginTop: 20 }}
                      title="Done"
                      onPress={() => setReferencesModel(false)}
                    />
                  </>
                }
              />
              {/* Notes Modal */}
              <CustomModal
                visible={notesModel}
                onClose={() => setNotesModel(false)}
                children={
                  <>
                    <Text style={{ marginBottom: 5 }}>Notes</Text>
                    <CustomTextInput
                      value={notes}
                      onChangeText={setNotes}
                      placeholder="Enter Notes"
                    />
                    <CustomButton
                      containerStyle={{ marginTop: 20 }}
                      title="Done"
                      onPress={() => setNotesModel(false)}
                    />
                  </>
                }
              />
              {/* Terms Modal */}
              <CustomModal
                visible={termsModel}
                onClose={() => setTermsModel(false)}
                children={
                  <>
                    <Text style={{ marginBottom: 5 }}>Terms</Text>
                    <CustomTextInput
                      value={terms}
                      onChangeText={setTerms}
                      placeholder="Enter Terms"
                    />
                    <CustomButton
                      containerStyle={{ marginTop: 20 }}
                      title="Done"
                      onPress={() => setTermsModel(false)}
                    />
                  </>
                }
              />
              {/* Extra Discount Modal */}
              <CustomModal
                visible={extraDiscountModel}
                onClose={() => setExtraDiscountModel(false)}
                children={
                  <>
                    <Text style={{ marginBottom: 5 }}>Extra Discount</Text>
                    <CustomTextInput
                      value={extraDiscount}
                      onChangeText={setExtraDiscount}
                      placeholder="Enter Extra Discount"
                      keyboardType="decimal-pad"
                    />
                    <CustomButton
                      containerStyle={{ marginTop: 20 }}
                      title="Done"
                      onPress={() => setExtraDiscountModel(false)}
                    />
                  </>
                }
              />
              {/* Delivery Charges Modal */}
              <CustomModal
                visible={deliveryChargesModel}
                onClose={() => setDeliveryChargesModel(false)}
                children={
                  <>
                    <Text style={{ marginBottom: 5 }}>
                      Delivery/ Shipping Charges
                    </Text>
                    <CustomTextInput
                      value={deliveryCharges}
                      onChangeText={setDeliveryCharges}
                      placeholder="Enter Delivery Charges"
                      keyboardType="decimal-pad"
                    />
                    <CustomButton
                      containerStyle={{ marginTop: 20 }}
                      title="Done"
                      onPress={() => setDeliveryChargesModel(false)}
                    />
                  </>
                }
              />
              {/* Packing Charges Modal */}
              <CustomModal
                visible={packingChargesModel}
                onClose={() => setPackingChargesModel(false)}
                children={
                  <>
                    <Text style={{ marginBottom: 5 }}>Packaging Charges</Text>
                    <CustomTextInput
                      value={packingCharges}
                      onChangeText={setPackingCharges}
                      placeholder="Enter Packaging Charges"
                      keyboardType="decimal-pad"
                    />
                    <CustomButton
                      containerStyle={{ marginTop: 20 }}
                      title="Done"
                      onPress={() => setPackingChargesModel(false)}
                    />
                  </>
                }
              />
              <CalendarModal
                visible={dueDateCallModel}
                initialDate={dueDate}
                onClose={() => setDueDateCallModel(false)}
                onSelect={(e) => setDueDate(e)}
              />
              <CalendarModal
                visible={supplierDateCallModel}
                initialDate={supplierDate}
                onClose={() => setSupplierDateCallModel(false)}
                onSelect={(e) => setSupplierDate(e)}
              />
              <ProductSelectionModal
                visible={showProductModal}
                onClose={() => setShowProductModal(false)}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
              />

              {/* Purchase Plan Info Modal */}
              <CustomModal
                visible={isPurchasePlanModalVisible}
                onClose={() => setIsPurchasePlanModalVisible(false)}
              >
                <View style={styles.infoModalContent}>
                  <Icon
                    name="information"
                    size={48}
                    color="#FCA311"
                    style={styles.infoIcon}
                  />
                  <Text style={styles.infoModalTitle}>Purchase Plan</Text>
                  <Text style={styles.infoModalMessage}>
                    Please create a new to add a new stock with updated purchase
                    price
                  </Text>
                  <TouchableOpacity
                    style={styles.infoModalButton}
                    onPress={() => setIsPurchasePlanModalVisible(false)}
                  >
                    <Text style={styles.infoModalButtonText}>OK</Text>
                  </TouchableOpacity>
                </View>
              </CustomModal>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    </MainContainer>
  );
};

export default CreatePurchase;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: "#FFF6E9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 8,
    color: "#000",
  },
  value: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  subtext: {
    fontSize: 12,
    color: "#888",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#008BE1",
    padding: 8,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 5,
    paddingRight: 10,
  },
  tableText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    color: "#000",
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: "#f9f9f9",
  },
  purchasePlanButton: {
    backgroundColor: "#FCA311",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  purchasePlanButtonText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  infoModalContent: {
    alignItems: "center",
    padding: 20,
  },
  infoIcon: {
    marginBottom: 15,
  },
  infoModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  infoModalMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  infoModalButton: {
    backgroundColor: "#FCA311",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 6,
  },
  infoModalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editText: {
    color: "#FCA311",
    fontWeight: "bold",
  },
  selector: {
    backgroundColor: "#FFF6E9",
    borderRadius: 6,
    padding: 12,
  },
  selectorText: {
    color: "#FCA311",
    fontWeight: "bold",
  },
  customFieldButton: {
    backgroundColor: "#FCA311",
    padding: 12,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  customFieldText: {
    color: "#fff",
    fontWeight: "bold",
  },
  customsubText: {
    color: "#fff",
  },
  inputLabel: {
    marginTop: 10,
    marginBottom: 4,
    fontWeight: "bold",
    color: "#000",
  },
  inputField: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
    marginTop: 4,
    color: "#000",
  },
  linkText: {
    color: "#FCA311",
    fontWeight: "bold",
    fontSize: 13,
  },
  optionRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#DEDEDE",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  optionText: {
    color: "#000",
    fontWeight: "500",
  },
  subOptionText: {
    fontWeight: "bold",
    fontSize: 13,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    flexWrap: "wrap",
    gap: 5,
  },
  inputGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    alignItems: "center",
    marginTop: 10,
    marginLeft: 10,
  },
  optionsRow: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
  },
  optionButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
    marginRight: 6,
    marginTop: 6,
    fontWeight: "500",
    justifyContent: "center",
  },
  selectedButton: {
    backgroundColor: "#FCA311",
    borderColor: "#FCA311",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "600",
  },
  input: {
    flex: 1,
    padding: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: 60,
    fontSize: 13,
    color: "#000",
  },
  inputFull: {
    width: "30%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
    color: "#000",
  },
});

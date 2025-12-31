import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  StatusBar,
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
import OptionInput from "../CommonComponent/OptionalInputs";
import { API_ROUTES } from "../constants/api-routes.constants";
import { HomeNavigation } from "../constants/app-routes.constants";
import { useRoute, RouteProp } from "@react-navigation/native";
import moment from "moment";
import CustomDropdown, {
  DropDownOption,
} from "../CommonComponent/CustomDropdown";
import { s, ScaledSheet } from "react-native-size-matters";

interface Product {
  id: number;
  name: string;
  desc: string;
  price: number;
  purchase_price?: number;
  quantity: number;
  image: string;
  gst?: number | null;
  tax_inclusive?: boolean;
}

type RootStackParamList = {
  CreatePurchase: {
    selectedProducts?: Product[];
    formData?: any; // Add form data preservation
    editMode?: boolean;
    purchaseData?: any; // PurchaseEntry from PurchaseLedger
  };
};

type CreatePurchaseRouteProp = RouteProp<RootStackParamList, "CreatePurchase">;

const CreatePurchase = ({ navigation }: any) => {
  const route = useRoute<CreatePurchaseRouteProp>();
  const [selectedPayment, setSelectedPayment] = useState("Cash");
  const [selectedAdvanceType, setSelectedAdvanceType] = useState("Cash");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVendorModalVisible, setIsVendorModalVisible] = useState(false);
  const [isPurchasePlanModalVisible, setIsPurchasePlanModalVisible] =
    useState(false);
  const [editingProductIndex, setEditingProductIndex] = useState<number | null>(
    null
  );
  const [editProductPrice, setEditProductPrice] = useState<string>("");
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
  const [advanceAmount, setAdvanceAmount] = useState<string>("0");
  const [selectedBank, setSelectedBank] = useState<DropDownOption>();
  const [supplierDate, setSupplierDate] = useState<string>(
    moment().format("YYYY-MM-DD")
  );
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
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [purchaseId, setPurchaseId] = useState<number | null>(null);

  const [formData, setFormData] = useState<{ [key: string]: string | boolean }>(
    {
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
      gstNumber: "",
      reverseCharge: false,
    }
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    let tempErrors: any = {};

    if (!selectedVendor) tempErrors.vendor = "Please select a vendor";
    if (!selectedProducts.length) tempErrors.products = "Please add a product";
    if (!supplierDate)
      tempErrors.supplierDate = "Supplier invoice date required";
    if (!serialNo.trim()) tempErrors.serialNo = "Serial number is required";

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
    if (
      (selectedPayment === "Cheques" || selectedPayment === "UPI") &&
      !selectedBank
    ) {
      tempErrors.selectedBank = "Please select bank for cheque or UPI payment";
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
      (sum, item) =>
        sum + (item.purchase_price || item.price || 0) * item.quantity,
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
      (sum, item) =>
        sum + (item.purchase_price || item.price || 0) * item.quantity,
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

  // Calculate subtotal before discount (for discount calculation base)
  const subtotalAmount = useMemo(() => {
    if (!selectedProducts?.length) return 0;
    return selectedProducts.reduce((sum, item) => {
      const price = item.purchase_price || item.price || 0;
      return sum + price * (item.quantity || 0);
    }, 0);
  }, [selectedProducts]);

  // Calculate discount per item (proportional distribution)
  const getItemDiscount = (item: Product): number => {
    if (!selectedProducts?.length || subtotalAmount === 0) {
      return 0;
    }
    const totalDiscount = Number(discount.amount) || 0;
    const discountPercent = Number(discount.pr) || 0;
    const price = item.purchase_price || item.price || 0;
    const itemTotal = price * (item.quantity || 0);

    if (discountPercent > 0) {
      // Apply percentage discount per item
      return (itemTotal * discountPercent) / 100;
    } else if (totalDiscount > 0) {
      // Distribute total discount proportionally
      return (itemTotal * totalDiscount) / subtotalAmount;
    }
    return 0;
  };

  // Calculate GST amount on discounted amount per item
  const gstAmount = useMemo(() => {
    if (!selectedProducts?.length) return 0;

    return selectedProducts.reduce((sum, item) => {
      const price = item.purchase_price || item.price || 0;
      const gstRate = Number(item.gst) || 0;
      const quantity = item.quantity || 0;
      const itemTotal = price * quantity;
      const itemDiscount = getItemDiscount(item);
      const itemTotalAfterDiscount = itemTotal - itemDiscount;

      // GST is calculated on discounted amount
      if (item.tax_inclusive) {
        // GST is included in price, extract it from discounted amount
        const gstValue = (itemTotalAfterDiscount * gstRate) / (100 + gstRate);
        return sum + gstValue;
      } else {
        // GST is exclusive, add it on top of discounted amount
        const gstValue = (itemTotalAfterDiscount * gstRate) / 100;
        return sum + gstValue;
      }
    }, 0);
  }, [selectedProducts, discount.amount, discount.pr, subtotalAmount]);

  // Subtotal after discount, without GST (for display purposes)
  const subtotalWithoutGst = useMemo(() => {
    if (!selectedProducts?.length) return 0;

    return selectedProducts.reduce((sum, item) => {
      const price = item.purchase_price || item.price || 0;
      const gstRate = Number(item.gst) || 0;
      const quantity = item.quantity || 0;
      const itemTotal = price * quantity;
      const itemDiscount = getItemDiscount(item);
      const itemTotalAfterDiscount = itemTotal;

      if (item.tax_inclusive) {
        // GST is included, so subtract it from discounted amount
        const gstValue = (itemTotalAfterDiscount * gstRate) / (100 + gstRate);
        return sum + (itemTotalAfterDiscount - gstValue);
      } else {
        // GST is exclusive, so discounted amount is already without GST
        return sum + itemTotalAfterDiscount;
      }
    }, 0);
  }, [selectedProducts, discount.amount, discount.pr, subtotalAmount]);

  // Calculate total charges (delivery + packaging)
  const totalCharges = useMemo(() => {
    const delivery = Number(formData.shippingCharges) || 0;
    const packaging = Number(formData.packagingCharges) || 0;
    return delivery + packaging;
  }, [formData.shippingCharges, formData.packagingCharges]);

  // Total amount after discount, including GST and charges
  const totalAmount = useMemo(() => {
    return (
      subtotalWithoutGst + gstAmount - Number(discount.amount) + totalCharges
    );
  }, [subtotalWithoutGst, gstAmount, discount, totalCharges]);

  // Advance amount as numeric value
  const advanceNumeric = useMemo(
    () => Number(advanceAmount) || 0,
    [advanceAmount]
  );

  // Due amount calculation
  const dueAmount = useMemo(() => {
    const due = totalAmount - advanceNumeric;
    return due > 0 ? due : 0;
  }, [totalAmount, advanceNumeric]);

  useEffect(() => {
    getInitialData();
  }, []);

  // Handle selectedProducts and form data from ProductSelectionScreen
  useEffect(() => {
    if (route.params?.selectedProducts) {
      setSelectedProducts(route.params.selectedProducts);
    }

    // Restore form data if coming back from ProductSelectionScreen
    if (route.params?.formData) {
      const { formData: preservedData } = route.params;

      // Restore all form states except selectedProducts
      if (preservedData.selectedVendor)
        setSelectedVendor(preservedData.selectedVendor);
      if (preservedData.purchaseDate)
        setPurchaseDate(preservedData.purchaseDate);
      if (preservedData.selectedPayment)
        setSelectedPayment(preservedData.selectedPayment);
      if (preservedData.selectedAdvanceType)
        setSelectedAdvanceType(preservedData.selectedAdvanceType);
      if (preservedData.discount) setDiscount(preservedData.discount);
      if (preservedData.dueDate) setDueDate(preservedData.dueDate);
      if (preservedData.serialNo) setSerialNo(preservedData.serialNo);
      if (preservedData.advanceAmount)
        setAdvanceAmount(preservedData.advanceAmount);
      if (preservedData.selectedBank)
        setSelectedBank(preservedData.selectedBank);
      if (preservedData.supplierDate)
        setSupplierDate(preservedData.supplierDate);
      if (preservedData.packingCharges)
        setPackingCharges(preservedData.packingCharges);
      if (preservedData.dispatchAddress)
        setDispatchAddress(preservedData.dispatchAddress);
      if (preservedData.bank) setBank(preservedData.bank);
      if (preservedData.signature) setSignature(preservedData.signature);
      if (preservedData.references) setReferences(preservedData.references);
      if (preservedData.notes) setNotes(preservedData.notes);
      if (preservedData.terms) setTerms(preservedData.terms);
      if (preservedData.extraDiscount)
        setExtraDiscount(preservedData.extraDiscount);
      if (preservedData.deliveryCharges)
        setDeliveryCharges(preservedData.deliveryCharges);
      if (preservedData.formData) setFormData(preservedData.formData);
    }
  }, [route.params?.selectedProducts, route.params?.formData]);

  // Handle edit mode - populate form with purchase data
  useEffect(() => {
    if (route.params?.editMode && route.params?.purchaseData) {
      const purchaseData = route.params.purchaseData;
      setIsEditMode(true);
      setPurchaseId(purchaseData.id);

      // Set vendor
      if (purchaseData.vendor_details && allVendorList) {
        const vendor = allVendorList.find(
          (v) => v.id === purchaseData.vendor_details.id
        );
        if (vendor) setSelectedVendor(vendor);
      }

      // Set purchase date
      if (purchaseData.purchase_date) {
        setPurchaseDate(purchaseData.purchase_date);
      }

      // Set purchase code
      if (purchaseData.purchase_code) {
        setPurchasecode(purchaseData.purchase_code);
      }

      // Set supplier invoice date
      if (purchaseData.supplier_invoice_date) {
        setSupplierDate(purchaseData.supplier_invoice_date);
      }

      // Set serial number
      if (purchaseData.serial_number) {
        setSerialNo(purchaseData.serial_number);
      }

      // Set payment method
      if (purchaseData.payment_method) {
        const paymentMap: { [key: string]: string } = {
          credit: "In Credit",
          cheques: "Cheques",
          upi: "UPI",
          cash: "Cash",
        };
        setSelectedPayment(
          paymentMap[purchaseData.payment_method] || purchaseData.payment_method
        );
      }

      // Set discount
      if (purchaseData.discount_percentage || purchaseData.discount_amount) {
        setDiscount({
          pr: purchaseData.discount_percentage || "",
          amount: purchaseData.discount_amount || "",
        });
      }

      // Set advance amount and mode
      if (purchaseData.advance_amount) {
        setAdvanceAmount(purchaseData.advance_amount);
      }
      if (purchaseData.advance_mode) {
        const mode =
          purchaseData.advance_mode.charAt(0).toUpperCase() +
          purchaseData.advance_mode.slice(1);
        setSelectedAdvanceType(mode);
      }

      // Set due date
      if (purchaseData.due_date) {
        setDueDate(purchaseData.due_date);
      }

      // Set bank
      if (purchaseData.advance_bank && bankList) {
        const bank = bankList.find((b) => b.id === purchaseData.advance_bank);
        if (bank) setSelectedBank(bank);
      }

      // Set form data fields
      setFormData((prev) => ({
        ...prev,
        dispatchAddress: purchaseData.dispatch_address || "",
        references: purchaseData.references || "",
        notes: purchaseData.notes || "",
        terms: purchaseData.terms || "",
        shippingCharges: purchaseData.delivery_shipping_charges || "",
        packagingCharges: purchaseData.packaging_charges || "",
        ewayBill: purchaseData.eway_bill_no || "",
        lrNumber: purchaseData.lr_no || "",
        vehicleNumber: purchaseData.vehicle_no || "",
        transportName: purchaseData.transport_name || "",
        parcels: purchaseData.no_of_parcels?.toString() || "",
        gstNumber: purchaseData.gst_number || "",
        reverseCharge: purchaseData.reverse_charges || false,
      }));

      // Set products
      if (purchaseData.items && purchaseData.items.length > 0) {
        const mappedProducts: Product[] = purchaseData.items.map(
          (item: any) => ({
            id: item.product,
            name: item.product_details?.name || `Product ${item.product}`,
            desc: item.product_details?.desc || "",
            price: item.price || 0,
            purchase_price: item.price || 0,
            quantity: item.quantity || 1,
            image: item.product_details?.image || "",
            gst: item.product_details?.gst || null,
            tax_inclusive: item.product_details?.tax_inclusive || false,
          })
        );
        setSelectedProducts(mappedProducts);
      }
    }
  }, [
    route.params?.editMode,
    route.params?.purchaseData,
    allVendorList,
    bankList,
  ]);

  const getInitialData = async () => {
    try {
      setIsLoading(true);

      const [vendorRes, purchaseRes, banks, purchaseList] = await Promise.all([
        api.get(API_ROUTES.vendorList),
        api.get(API_ROUTES.purchaseNo),
        api.get(API_ROUTES.vendorBank),
        api.get(API_ROUTES.purchase),
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

      if (purchaseRes.data && !isEditMode) {
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
      const totalAmount = selectedProducts.reduce(
        (sum, item) =>
          sum + (item.purchase_price || item.price || 0) * item.quantity,
        0
      );

      const totalDiscountedAmount = totalAmount - Number(discount.amount || 0);

      const baseData = {
        purchase_date: purchaseDate,
        vendor: selectedVendor?.id,
        supplier_invoice_date: supplierDate,
        serial_number: serialNo,
        payment_method:
          selectedPayment === "In Credit"
            ? "credit"
            : selectedPayment === "Cheques"
            ? "cheques"
            : selectedPayment === "UPI"
            ? "upi"
            : selectedPayment === "Cash"
            ? "cash"
            : "other",
        discount_percentage: discount.pr || "0",
        discount_amount: discount.amount || "0",

        dispatch_address: formData.dispatchAddress || "",
        gst_number: formData.gstNumber || "",
        references: formData.references || "",
        notes: formData.notes || "",
        terms: formData.terms || "",
        delivery_shipping_charges: Number(formData.shippingCharges) || 0,
        packaging_charges: Number(formData.packagingCharges) || 0,
        eway_bill_number: formData.ewayBill || "",
        lr_no: formData.lrNumber || "",
        vehicle_no: formData.vehicleNumber || "",
        transport_name: formData.transportName || "",
        number_of_parcels: Number(formData.parcels) || null,
        reverse_charges: formData.reverseCharge || false,
        items: selectedProducts.map((p) => ({
          product: p.id,
          quantity: p.quantity,
          price: p.purchase_price || p.price || 0,
          amount: Number(p.quantity) * Number(p.purchase_price || 0),
        })),
      };
      const data =
        selectedPayment === "In Credit"
          ? {
              ...baseData,
              advance_amount: Number(advanceAmount) || 0,
              advance_mode: selectedAdvanceType.toLowerCase(), // bank / cash
              due_date: dueDate || null,
              advance_bank: selectedBank?.id || null,
            }
          : baseData;

      console.log("Sending purchase data:", data);

      let res;
      if (isEditMode && purchaseId) {
        // Update existing purchase
        res = await api.put(`vendor/purchase/${purchaseId}/`, data);
      } else {
        // Create new purchase
        res = await api.post("vendor/purchase/", data);
      }

      if (res.status === 200 || res.status === 201) {
        navigation.goBack();
      }
    } catch (error) {
      console.log("error-->", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Function to collect all current form data for preservation
  const getCurrentFormData = () => {
    return {
      selectedVendor,
      purchaseDate,
      selectedPayment,
      selectedAdvanceType,
      discount,
      dueDate,
      serialNo,
      advanceAmount,
      selectedBank,
      supplierDate,
      packingCharges,
      dispatchAddress,
      bank,
      signature,
      references,
      notes,
      terms,
      extraDiscount,
      deliveryCharges,
      formData,
    };
  };

  return (
    <MainContainer>
      <View style={styles.container}>
        <Headerwithback
          title={isEditMode ? "Edit Purchase" : "Create Purchase"}
          rightIcons={[
            <TouchableOpacity onPress={handleSearch} key="search">
              <Icon name="file-document-outline" size={20} color="#FCA311" />
            </TouchableOpacity>,
          ]}
        />
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
                onPress={() => {
                  navigation.navigate(HomeNavigation.PRODUCT_SELECTION as any, {
                    selectedProducts: selectedProducts,
                    navigateScreen: HomeNavigation.CREATE_PURCHASE,
                    formData: getCurrentFormData(), // Pass current form data
                    isPurchase: true,
                  });
                }}
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
                      onPress={() => {
                        setEditingProductIndex(index);
                        setEditProductPrice(
                          (item?.purchase_price || 0).toString()
                        );
                        setIsPurchasePlanModalVisible(true);
                      }}
                    >
                      <Text style={styles.tableText}>
                        {formatNumber(Number(item?.purchase_price || 0))}
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.tableText}>
                      {formatNumber(
                        (item?.purchase_price || 0) * item?.quantity
                      )}
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

            {/* GST Calculation Section - Below Product List */}
            {!!selectedProducts.length && (
              <View style={{ marginBottom: 12 }}>
                {/* Item Total without GST */}
                <View style={styles.totalBar}>
                  <Text style={styles.totalLabel}>Item Total</Text>
                  <Text style={styles.totalValue}>
                    {formatNumber(Number(subtotalWithoutGst.toFixed(2)))}
                  </Text>
                </View>

                {/* Discount (above total when discount is applied) */}
                {Number(discount.amount) > 0 && (
                  <View style={styles.totalBar}>
                    <Text style={styles.totalLabel}>Discount</Text>
                    <Text style={styles.totalValue}>
                      -{formatNumber(Number(discount.amount))}
                    </Text>
                  </View>
                )}

                {/* GST (above total when GST is applicable) */}
                {gstAmount > 0 && (
                  <View style={styles.totalBar}>
                    <Text style={styles.totalLabel}>GST</Text>
                    <Text style={styles.totalValue}>
                      +{formatNumber(Number(gstAmount.toFixed(2)))}
                    </Text>
                  </View>
                )}

                {/* Charges (delivery + packaging) */}
                {totalCharges > 0 && (
                  <View style={styles.totalBar}>
                    <Text style={styles.totalLabel}>Charges</Text>
                    <Text style={styles.totalValue}>
                      +{formatNumber(Number(totalCharges.toFixed(2)))}
                    </Text>
                  </View>
                )}

                {/* Total Amount (below product list) */}
                <View
                  style={[
                    styles.totalBar,
                    {
                      borderTopWidth: 1,
                      borderColor: "#FCA311",
                      paddingTop: s(5),
                    },
                  ]}
                >
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>
                    {formatNumber(Number(totalAmount.toFixed(2)))}
                  </Text>
                </View>

                {/* Advance and Due (only when advance entered) */}
                {advanceNumeric > 0 && (
                  <View style={styles.advanceDueBar}>
                    <View style={styles.advanceDueRow}>
                      <Text style={styles.totalLabel}>Advance</Text>
                      <Text style={styles.totalValue}>
                        {formatNumber(advanceNumeric)}
                      </Text>
                    </View>
                    <View style={styles.advanceDueRow}>
                      <Text style={styles.totalLabel}>Due</Text>
                      <Text style={styles.totalValue}>
                        {Number(formatNumber(dueAmount)).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                )}
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
                  icon: "file-document-outline",
                  label: "GST Number",
                  state: "gstNumber",
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
                {
                  icon: "arrow-left-right",
                  label: "Reverse Charge",
                  state: "reverseCharge",
                  keyboardType: "default",
                },
                // {
                //   icon: "percent-outline",
                //   label: "Add Extra Discount",
                // },
              ].map((item, index) => {
                const fieldValue = formData[item.state];
                return (
                  <OptionInput
                    key={item.state}
                    icon={item.icon || undefined}
                    label={item.label}
                    value={
                      typeof fieldValue === "boolean"
                        ? fieldValue
                        : fieldValue || ""
                    }
                    onChangeText={(text) => handleChange(item.state, text)}
                    keyboardType={item.keyboardType as any}
                    boldLabelPrefix={item.boldLabelPrefix}
                  />
                );
              })}
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
                  placeholder="%"
                  placeholderTextColor="#ccc"
                  style={styles.input}
                  keyboardType="numeric"
                />
                <TextInput
                  value={discount?.amount}
                  onChangeText={handleAmountChange}
                  placeholder="0"
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
                <Text
                  style={[
                    styles.label,
                    { marginRight: s(12), marginBottom: 0 },
                  ]}
                >
                  Payment
                </Text>
                <View style={styles.optionsRow}>
                  {["UPI", "Cheques", "Cash", "In Credit"].map((method) => (
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

            {selectedPayment !== "Cash" && selectedPayment !== "In Credit" && (
              <>
                <CustomDropdown
                  onSelect={setSelectedBank}
                  placeholder="Select Bank"
                  selectedValue={selectedBank?.name || ""}
                  options={bankList}
                  dropDownBoxStyle={{ marginTop: 10 }}
                />
                {errors?.selectedBank && (
                  <Text style={{ color: "red" }}>{errors?.selectedBank}</Text>
                )}
              </>
            )}

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
              <Text style={{ color: "#fff", fontWeight: "600" }}>Proceed</Text>
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
              onSelect={setSupplierDate}
            />

            {/* Edit Product Price Modal */}
            <CustomModal
              visible={isPurchasePlanModalVisible}
              onClose={() => {
                setIsPurchasePlanModalVisible(false);
                setEditingProductIndex(null);
                setEditProductPrice("");
              }}
              title="Edit Product"
            >
              <View style={styles.editProductModalContent}>
                {editingProductIndex !== null &&
                  selectedProducts[editingProductIndex] && (
                    <>
                      <Text style={styles.editProductLabel}>
                        Product: {selectedProducts[editingProductIndex].name}
                      </Text>
                      <Text style={styles.editProductSubLabel}>
                        Purchase Price
                      </Text>
                      <CustomTextInput
                        value={editProductPrice}
                        onChangeText={setEditProductPrice}
                        placeholder="Enter Purchase Price"
                        keyboardType="decimal-pad"
                        containerStyle={{ marginTop: 10 }}
                      />
                      <View style={styles.editProductButtons}>
                        <TouchableOpacity
                          style={[
                            styles.editProductButton,
                            styles.cancelButton,
                          ]}
                          onPress={() => {
                            setIsPurchasePlanModalVisible(false);
                            setEditingProductIndex(null);
                            setEditProductPrice("");
                          }}
                        >
                          <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.editProductButton, styles.saveButton]}
                          onPress={() => {
                            if (editingProductIndex !== null) {
                              const price = parseFloat(editProductPrice) || 0;
                              const updatedProducts = [...selectedProducts];
                              updatedProducts[editingProductIndex] = {
                                ...updatedProducts[editingProductIndex],
                                purchase_price: price,
                              };
                              setSelectedProducts(updatedProducts);
                              setIsPurchasePlanModalVisible(false);
                              setEditingProductIndex(null);
                              setEditProductPrice("");
                            }
                          }}
                        >
                          <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
              </View>
            </CustomModal>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </MainContainer>
  );
};

export default CreatePurchase;

const styles = ScaledSheet.create({
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
    fontSize: "11@s",
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
    // gap: 5,
    flex: 1,
  },
  optionButton: {
    paddingHorizontal: "6@s",
    paddingVertical: "2@s",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: "6@s",
    backgroundColor: "#fff",
    marginRight: "6@s",
    // marginTop: "6@s",
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
  editProductModalContent: {
    padding: 20,
  },
  editProductLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  editProductSubLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginTop: 10,
  },
  editProductButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  editProductButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#FCA311",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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
  totalBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    marginHorizontal: 10,
    marginTop: s(6),
  },
  totalLabel: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  totalValue: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
  advanceDueBar: {
    paddingHorizontal: s(8),
    paddingTop: s(6),
    marginHorizontal: s(10),
    marginTop: s(8),
    borderTopWidth: 1,
    borderTopColor: "#FCA311",
  },
  advanceDueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 2,
  },
});

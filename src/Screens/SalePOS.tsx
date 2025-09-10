import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import Headerwithback from "./Headerwithback";
import Bottomnavigation from "./Bottomnavigation";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomButton from "../CommonComponent/CustomeButton";
import CustomDropdown, {
  DropDownOption,
} from "../CommonComponent/CustomDropdown";
import Loading from "../CommonComponent/Loading";
import api from "../services/api/api";
import ProductSelectionModal from "../Modals/ProductSelectionModal";
import CustomSwitch from "./CustomSwitch";
import { API_ROUTES } from "../constants/api-routes.constants";
import CustomModal from "../Modals/CustomModal";
import CompanySelectModal from "../Modals/CompanySelectModal";
import { useNavigation } from "@react-navigation/native";
import { HomeNavigation } from "../constants/app-routes.constants";
import CalendarModal from "../Modals/CalendarModal";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import formatNumber from "../utils/priceFormatter";

const SalePOS = () => {
  const navigation: any = useNavigation();
  const isFoxcused = useIsFocused();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [companyList, setCompanyList] = useState<DropDownOption[]>();
  const [companySelected, setCompanySelected] = useState<DropDownOption>();
  const [selectedPartyType, setSelectedPartyType] = useState<
    "None" | "Customer" | "Vendor"
  >("None");
  const [customerList, setCustomerList] = useState<DropDownOption[]>([]);
  const [bankList, setBankList] = useState<DropDownOption[]>([]);
  const [selectedBank, setSelectedBank] = useState<DropDownOption>();
  const [vendorList, setVendorList] = useState<DropDownOption[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<DropDownOption>();
  const [selectedVendor, setSelectedVendor] = useState<DropDownOption>();
  const [showProductModal, setShowProductModal] = useState(true);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [wholesale, setWholesale] = useState<boolean>(false);
  const [discount, setDiscount] = useState({ pr: "", amount: "" });
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [advancePaymentMode, setAdvancePaymentMode] = useState(1);
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [callenderModel, setCallenderModel] = useState<boolean>(false);
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAllData();
  }, [isFoxcused]);

  useEffect(() => {
    handleAmountChange(discount?.amount);
    handlePercentChange(discount?.pr);
  }, [wholesale]);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);

      // Parallel fetching
      const [companyRes, customerRes, vendorRes, banks] = await Promise.all([
        api.get(API_ROUTES.companyProfle),
        api.get(API_ROUTES.vendorCustomer),
        api.get(API_ROUTES.vendorList),
        api.get(API_ROUTES.vendorBank),
      ]);

      const transformedCompany: DropDownOption[] = companyRes.data?.map(
        (item: any) => ({
          id: item.id,
          name: item.company_name,
        })
      );
      setCompanyList(transformedCompany);
      setCompanySelected(transformedCompany[0]);

      const transformedCustomer: DropDownOption[] = customerRes.data?.map(
        (item: any) => ({
          id: item.id,
          name: item.name || item.customer_name,
          ...item,
        })
      );
      setCustomerList(transformedCustomer);
      setSelectedCustomer(transformedCustomer[0]);

      const transformedVendor: DropDownOption[] = vendorRes.data?.map(
        (item: any) => ({
          id: item.id,
          name: item.name || item.vendor_name,
          ...item,
        })
      );
      setVendorList(transformedVendor);

      const transformedBank: DropDownOption[] = banks.data?.map(
        (item: any) => ({
          id: item.id,
          name: item.name || item.vendor_name,
          ...item,
        })
      );
      setBankList(transformedBank);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePercentChange = (value: string) => {
    const totalAmount = products.reduce(
      (sum, item) =>
        sum + (wholesale ? item.wholesale_price : item.price) * item.quantity,
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
    const totalAmount = products.reduce(
      (sum, item) =>
        sum + (wholesale ? item.wholesale_price : item.price) * item.quantity,
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

  const validateForm = () => {
    let tempErrors = {};
    // ✅ check products
    if (!products || products.length === 0) {
      tempErrors.products = "Please add at least one product before proceeding";
    }

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
    // if (!discount.pr || Number(discount.pr) < 0) {
    //   tempErrors.pr = "Discount percentage must be a valid positive number";
    // }
    if (paymentMode === "In Credit") {
      if (!dueDate) {
        tempErrors.dueDate = "Due date is required";
      }
      if (!advanceAmount) {
        tempErrors.advanceAmount =
          "Advance amount must be a valid positive number";
      }
      if (advancePaymentMode === 1 && !selectedBank) {
        tempErrors.advanceBank = "Please select bank";
      }
    }

    setErrors(tempErrors);

    return Object.keys(tempErrors).length > 0; // Everything OK
  };

  const handleSubmit = async () => {
    if (validateForm()) return;
    try {
      const totalAmount = products.reduce(
        (sum, item) =>
          sum + (wholesale ? item.wholesale_price : item.price) * item.quantity,
        0
      );
      const totalDiscountedAmount = totalAmount - Number(discount.amount);

      const data = {
        payment_method:
          paymentMode === "In Credit"
            ? "credit"
            : paymentMode.toLocaleLowerCase(),
        company_profile: companySelected?.id,
        // //   "party": 2,
        customer: selectedCustomer?.id,
        discount_percentage: Number(discount?.pr),
        credit_date:
          paymentMode === "In Credit" ? new Date(dueDate).toISOString() : "",
        is_wholesale_rate: wholesale,
        items: products.map((p) => ({
          product: p.id,
          quantity: p.quantity,
          price: wholesale ? p.wholesale_price : p.price,
          amount: (wholesale ? p.wholesale_price : p.price) * p.quantity,
        })),
        total_items: products.length,
        total_amount_before_discount: totalAmount,
        discount_amount: discount.amount,
        total_amount: totalDiscountedAmount,
        balance_amount:
          paymentMode === "In Credit"
            ? totalDiscountedAmount - Number(advanceAmount)
            : 0,
        wholesale_invoice_details: null,
        advance_bank: selectedBank?.id || "",
        advance_amount: advanceAmount || 0,
      };
      !dueDate && delete data.credit_date;
      console.log(data, "data");
      if (wholesale) {
        navigation.navigate(HomeNavigation.WHOLESALE, data);
      } else {
        setIsLoading(true);

        const res = await api.post(API_ROUTES.posSales, data);
        console.log(res);
        navigation.navigate(HomeNavigation.BILLDETAILS, {
          id: res.data?.id,
        });
      }
    } catch (error) {
      console.log(error, "sales error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Headerwithback title="Sales & POS" />

      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.scrollContent}
      >
        {/* Company Section */}
        <View style={styles.companyRow}>
          {/* <Text style={styles.companyText}>Company - Svindo Enterprise</Text>
          <TouchableOpacity>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity> */}
        </View>
        {/* <View style={styles.optionContainer}>
          <Text style={styles.optionLabel}>
            Company - {companySelected?.name}
          </Text>
          <TouchableOpacity onPress={() => setShowCompanyModal(true)}>
            <Text style={styles.change}>Change</Text>
          </TouchableOpacity>
        </View> */}
        {/* <Text style={styles.label}>Select Party Type</Text> */}
        {/* <View style={styles.radioGroup}>
          {["None", "Customer", "Vendor"].map((type) => (
            <TouchableOpacity
              key={type}
              style={styles.radioOption}
              onPress={() => setSelectedPartyType(type as any)}
            >
              <View style={styles.radioOuter}>
                {selectedPartyType === type && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={styles.radioLabel}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View> */}
        <View style={styles.optionContainer}>
          <Text style={styles.optionLabel}>
            Customer - {selectedCustomer?.name}
          </Text>
          <TouchableOpacity
            onPress={() => setShowCustomerModal(true)}
            style={styles.changeButton}
          >
            <Text style={styles.changeButtonText}>Add/Select</Text>
          </TouchableOpacity>
        </View>

        {selectedPartyType === "Vendor" && (
          <>
            <Text style={styles.label}>Select Vendor</Text>
            <CustomDropdown
              onSelect={setSelectedVendor}
              selectedValue={selectedVendor?.name || ""}
              options={vendorList}
              placeholder="Select Vendor"
              dropDownBoxStyle={styles.dropdownStyle}
            />
          </>
        )}

        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.label}>Customer Details</Text>
          <TouchableOpacity>
            <Text style={styles.addCustomer}>+ Add Customer</Text>
          </TouchableOpacity>
        </View> */}
        {/* <TextInput
          placeholder="Search Mobile"
          placeholderTextColor="#000"
          style={{
            width: "50%",
            borderWidth: 1,
            borderColor: "#FCA311",
            backgroundColor: "#FFF8EB",
            borderRadius: 10,
            color: "#000",
          }}
        /> */}

        <View style={styles.invoiceRow}>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <Text style={styles.label}>Wholesale Invoice</Text>
            {/* <CustomButton title={''} onPress={function (): void {
            throw new Error('Function not implemented.');
          } } /> */}
            <CustomSwitch onValueChange={setWholesale} value={wholesale} />
          </View>
          <TouchableOpacity
            onPress={() => {
              setShowProductModal(true);
            }}
            style={styles.addItemButton}
          >
            <Text style={styles.addItemText}>Add Item</Text>
          </TouchableOpacity>
        </View>
        {errors?.products && (
          <Text style={{ color: "red" }}>{errors?.products}</Text>
        )}

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text
            style={[styles.tableText, { color: "#fff", fontWeight: "500" }]}
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
            style={[styles.tableText, { color: "#fff", fontWeight: "500" }]}
          >
            Quantity
          </Text>
          <Text
            style={[styles.tableText, { color: "#fff", fontWeight: "500" }]}
          >
            Price
          </Text>
          <Text
            style={[styles.tableText, { color: "#fff", fontWeight: "500" }]}
          >
            Amount
          </Text>
          {/* <Text style={[styles.tableText, {color: '#fff', fontWeight: '500'}]}>Action</Text> */}
        </View>

        {/* Product List */}
        {products.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableText}>{index + 1}</Text>
            <Text style={[styles.tableText, { flex: 2 }]} numberOfLines={2}>
              {item.name}
            </Text>
            <TextInput
              style={[styles.tableText, styles.quantityInput]}
              value={item.quantity.toString()}
              onChangeText={(text) => {
                const newQuantity = parseInt(text) || 0;
                if (newQuantity >= 0) {
                  const updatedProducts = [...products];
                  if (newQuantity === 0) {
                    // Remove item if quantity is 0
                    updatedProducts.splice(index, 1);
                  } else {
                    // Update quantity
                    updatedProducts[index] = { ...item, quantity: newQuantity };
                  }
                  setProducts(updatedProducts);
                }
              }}
              keyboardType="numeric"
              selectTextOnFocus
            />
            <Text style={styles.tableText}>
              {/* {Number(wholesale ? item?.wholesale_price : item?.price).toFixed(0)} */}
              {formatNumber(wholesale ? item?.wholesale_price : item?.price)}
            </Text>
            <Text style={styles.tableText}>
              {formatNumber(
                (wholesale ? item?.wholesale_price : item?.price) *
                  item?.quantity
              )}
            </Text>
            <TouchableOpacity
              style={{ marginEnd: 5 }}
              onPress={() => {
                const updated = products.filter((_, i) => i !== index);
                setProducts(updated);
              }}
            >
              <Icon name="delete" size={16} color="red" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Discount */}
        <View style={styles.bottomBox}>
          <View style={styles.discountRow}>
            <Text style={styles.label}>Discount</Text>
            <TextInput
              placeholder="%"
              placeholderTextColor="#ccc"
              value={discount.pr}
              onChangeText={handlePercentChange}
              style={styles.discountInput}
              keyboardType="decimal-pad"
            />
            <TextInput
              placeholder="0"
              placeholderTextColor="#ccc"
              value={discount.amount}
              onChangeText={handleAmountChange}
              style={styles.discountInput}
              keyboardType="decimal-pad"
            />
          </View>
          {errors?.pr && <Text style={{ color: "red" }}>{errors?.pr}</Text>}
          {errors?.discount && (
            <Text style={{ color: "red" }}>{errors?.discount}</Text>
          )}

          {/* Payment */}
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Text style={styles.label}>Payment</Text>
            <View style={styles.paymentOptions}>
              {["UPI", "Card", "Cash", "In Credit"].map((method) => (
                <TouchableOpacity
                  key={method}
                  onPress={() => setPaymentMode(method)}
                  style={[
                    styles.paymentButton,
                    paymentMode === method && { backgroundColor: "#FCA311" },
                  ]}
                >
                  <Text
                    style={{
                      fontWeight: "500",
                      color: paymentMode === method ? "#FFF" : "#000",
                    }}
                  >
                    {method}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Advance */}
          {paymentMode === "In Credit" && (
            <>
              <View style={{ flexDirection: "row", gap: 20 }}>
                <Text style={styles.label}>Advance</Text>
                <TextInput
                  placeholder="Amount"
                  placeholderTextColor="#ccc"
                  style={[styles.discountInput, { paddingVertical: 2 }]}
                  value={advanceAmount}
                  onChangeText={setAdvanceAmount}
                  keyboardType="decimal-pad"
                />
                <View style={styles.paymentOptions}>
                  {["Bank", "Cash"].map((method, i) => (
                    <TouchableOpacity
                      key={method}
                      style={[
                        styles.paymentButton,
                        advancePaymentMode === i + 1 && {
                          backgroundColor: "#FCA311",
                        },
                      ]}
                      onPress={() => setAdvancePaymentMode(i + 1)}
                    >
                      <Text
                        style={{
                          fontWeight: "500",
                          color: advancePaymentMode === i + 1 ? "#FFF" : "#000",
                        }}
                      >
                        {method}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {errors?.advanceAmount && (
                <Text style={{ color: "red" }}>{errors?.advanceAmount}</Text>
              )}

              {advancePaymentMode === 1 && (
                <>
                  <CustomDropdown
                    onSelect={setSelectedBank}
                    placeholder="Select Bank"
                    selectedValue={selectedBank?.name || ""}
                    options={bankList}
                    dropDownBoxStyle={{ marginTop: 10 }}
                  />
                  {errors?.advanceBank && (
                    <Text style={{ color: "red" }}>{errors?.advanceBank}</Text>
                  )}
                </>
              )}
              {/* Due Date */}
              <View style={{ flexDirection: "row", gap: 20, marginTop: 10 }}>
                <Text style={styles.label}>Due Date</Text>
                <TouchableOpacity
                  style={[styles.discountInput]}
                  onPress={() => setCallenderModel(true)}
                >
                  <Text>{dueDate ? dueDate : "YYYY/MM/DD"}</Text>
                </TouchableOpacity>
              </View>
              {errors?.dueDate && (
                <Text style={{ color: "red" }}>{errors?.dueDate}</Text>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.bottomButtonRow}>
        <TouchableOpacity style={styles.discardButton}>
          <Text style={{ color: "#000", fontWeight: "bold" }}>Discard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.proceedButton} onPress={handleSubmit}>
          <Text style={{ color: "#000", fontWeight: "bold" }}>Proceed</Text>
        </TouchableOpacity>
      </View>
      <Loading visible={isLoading} />
      <ProductSelectionModal
        visible={showProductModal}
        onClose={() => setShowProductModal(false)}
        setSelectedProducts={setProducts}
        selectedProducts={products}
      />
      <CompanySelectModal
        visible={showCompanyModal}
        onClose={() => setShowCompanyModal(false)}
        onSelect={setCompanySelected}
        options={companyList}
        title="Select Company"
      />
      <CompanySelectModal
        visible={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onSelect={setSelectedCustomer}
        options={customerList}
        title="Select Customer"
      />
      <CalendarModal
        visible={callenderModel}
        onClose={() => {
          setCallenderModel(false);
        }}
        onSelect={(e) => {
          setDueDate(e);
        }}
      />
    </SafeAreaView>
  );
};

export default SalePOS;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 15,
  },
  companyRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 10,
  },
  companyText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  changeText: {
    color: "#FCA311",
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    color: "#5A5A5A",
    fontWeight: "bold",
    marginVertical: 6,
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
  optionText: {
    color: "#000",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  addCustomer: {
    color: "#FCA311",
    fontWeight: "bold",
    marginTop: 5,
  },
  invoiceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  addItemButton: {
    backgroundColor: "#FCA311",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  addItemText: {
    color: "#fff",
    fontWeight: "bold",
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
    // minWidth: 40,
  },
  bottomBox: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
  },
  discountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  discountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#fff",
    color: "#000",
  },
  paymentOptions: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 8,
  },
  paymentButton: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
  },
  bottomButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 30,
  },
  discardButton: {
    backgroundColor: "#FF5B5B",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  proceedButton: {
    backgroundColor: "#92F1A0",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  radioGroup: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FCA311",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#FCA311",
  },
  radioLabel: {
    fontSize: 16,
    color: "#333",
  },
  dropdownStyle: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#FFF8EB",
    marginBottom: 12,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 16,
    marginHorizontal: 8,
  },
  optionLabel: {
    // fontWeight: "bold",
    fontSize: 18,
    color: "#222",
  },
  company: {
    fontSize: 18,
    color: "#222",
    fontWeight: "normal",
  },
  changeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    backgroundColor: "#FFF",
  },
  changeButtonText: {
    fontSize: 14,
    color: "#FCA311",
    fontWeight: "500",
  },
});

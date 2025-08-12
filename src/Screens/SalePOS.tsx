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

const SalePOS = () => {
  const naviagation = useNavigation();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [companyList, setCompanyList] = useState<DropDownOption[]>();
  const [companySelected, setCompanySelected] = useState<DropDownOption>();
  const [selectedPartyType, setSelectedPartyType] = useState<
    "None" | "Customer" | "Vendor"
  >("None");
  const [customerList, setCustomerList] = useState<DropDownOption[]>([]);
  const [vendorList, setVendorList] = useState<DropDownOption[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<DropDownOption>();
  const [selectedVendor, setSelectedVendor] = useState<DropDownOption>();
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [wholesale, setWholesale] = useState<boolean>(false);
  const [discount, setDiscount] = useState({ pr: "", amount: "0" });
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [advancePaymentMode, setAdvancePaymentMode] = useState("Cash");
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [callenderModel, setCallenderModel] = useState<boolean>(false);
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);

      // Parallel fetching
      const [companyRes, customerRes, vendorRes] = await Promise.all([
        api.get(API_ROUTES.companyProfle),
        api.get(API_ROUTES.vendorCustomer),
        api.get(API_ROUTES.vendorList),
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
        })
      );
      setCustomerList(transformedCustomer);
      setSelectedCustomer(transformedCustomer[0]);
      const transformedVendor: DropDownOption[] = vendorRes.data?.map(
        (item: any) => ({
          id: item.id,
          name: item.name || item.vendor_name,
        })
      );
      setVendorList(transformedVendor);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (wholesale) {
      naviagation.navigate(HomeNavigation.WHOLESALE, {
        data: {
          company: companySelected,
          customer: selectedCustomer,
          products,
          discount,
          paymentMode,
          advanceAmount,
          advancePaymentMode,
          dueDate,
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Headerwithback
        title="Sales & POS"
        rightIcons={[
          <Icon name="magnify" size={20} color="black" key="search" />,
        ]}
      />

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
        <View style={styles.optionContainer}>
          <Text style={styles.optionLabel}>
            Company - {companySelected?.name}
          </Text>
          <TouchableOpacity onPress={() => setShowCompanyModal(true)}>
            <Text style={styles.change}>Change</Text>
          </TouchableOpacity>
        </View>
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
          <TouchableOpacity onPress={() => setShowCustomerModal(true)}>
            <Text style={styles.change}>Change</Text>
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
              { flex: 3, color: "#fff", fontWeight: "500" },
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
            <Text style={[styles.tableText, { flex: 3 }]} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.tableText}>{item.quantity}</Text>
            <Text style={styles.tableText}>500.00</Text>
            <Text style={styles.tableText}>1000.00</Text>
            <TouchableOpacity
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
              placeholderTextColor="black"
              value={discount.pr}
              onChangeText={(v) => setDiscount((p) => ({ ...p, pr: v }))}
              style={styles.discountInput}
              keyboardType="decimal-pad"
            />
            <TextInput
              placeholder="0"
              value={discount.amount}
              onChangeText={(v) => setDiscount((p) => ({ ...p, amount: v }))}
              style={styles.discountInput}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Payment */}
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Text style={styles.label}>Payment</Text>
            <View style={styles.paymentOptions}>
              {["UPI", "Card", "Cash", "Credit"].map((method) => (
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
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Text style={styles.label}>Advance</Text>
            <TextInput
              placeholder="Amount"
              style={[styles.discountInput, { paddingVertical: 2 }]}
              value={advanceAmount}
              onChangeText={setAdvanceAmount}
              keyboardType="decimal-pad"
            />
            <View style={styles.paymentOptions}>
              {["Bank", "Cash"].map((method) => (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.paymentButton,
                    advancePaymentMode === method && {
                      backgroundColor: "#FCA311",
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontWeight: "500",
                      color: advancePaymentMode === method ? "#FFF" : "#000",
                    }}
                  >
                    {method}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

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
      {/* <Bottomnavigation /> */}
    </View>
  );
};

export default SalePOS;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 40 : 0,
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
  change: {
    fontSize: 18,
    color: "#FFA700",
    fontWeight: "bold",
    marginLeft: 4,
  },
});

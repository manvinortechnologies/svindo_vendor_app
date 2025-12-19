import React, { useEffect, useMemo, useState } from "react";
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
import CustomSwitch from "./CustomSwitch";
import { API_ROUTES } from "../constants/api-routes.constants";
import CustomModal from "../Modals/CustomModal";
import CompanySelectModal from "../Modals/CompanySelectModal";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { HomeNavigation } from "../constants/app-routes.constants";
import CalendarModal from "../Modals/CalendarModal";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import formatNumber from "../utils/priceFormatter";
import { s, ScaledSheet } from "react-native-size-matters";
import moment from "moment";

interface Product {
  id: number;
  name: string;
  desc: string;
  price: number;
  wholesale_price?: number;
  quantity: number;
  image: string;
  gst?: number | null;
  tax_inclusive?: boolean;
}

interface FormErrors {
  products?: string;
  quantity?: string;
  customer?: string;
  dueDate?: string;
  advanceAmount?: string;
  advanceBank?: string;
  pr?: string;
  discount?: string;
}

type RootStackParamList = {
  SalePOS: {
    selectedProducts?: Product[];
    editMode?: boolean;
    saleData?: any;
  };
};

type SalePOSRouteProp = RouteProp<RootStackParamList, "SalePOS">;

const SalePOS = () => {
  const navigation: any = useNavigation();
  const route = useRoute<SalePOSRouteProp>();
  const isFoxcused = useIsFocused();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [companyList, setCompanyList] = useState<DropDownOption[]>();
  const [companySelected, setCompanySelected] = useState<DropDownOption>();
  // const [selectedPartyType, setSelectedPartyType] = useState<
  //   "None" | "Customer" | "Vendor"
  // >("None");
  const [customerList, setCustomerList] = useState<DropDownOption[]>([]);
  const [bankList, setBankList] = useState<DropDownOption[]>([]);
  const [selectedBank, setSelectedBank] = useState<DropDownOption>();
  // const [vendorList, setVendorList] = useState<DropDownOption[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<DropDownOption>();
  // const [selectedVendor, setSelectedVendor] = useState<DropDownOption>();
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [wholesale, setWholesale] = useState<boolean>(false);
  const [discount, setDiscount] = useState({ pr: "", amount: "" });
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [advancePaymentMode, setAdvancePaymentMode] = useState<number | null>(
    null
  );
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [callenderModel, setCallenderModel] = useState<boolean>(false);
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const paymentMethods = [
    { key: "upi", value: "UPI" },
    { key: "card", value: "Cheque" },
    { key: "cash", value: "Cash" },
    { key: "credit", value: "In Credit" },
  ];

  useEffect(() => {
    fetchAllData();
  }, [isFoxcused]);

  // Handle selectedProducts from ProductSelectionScreen
  useEffect(() => {
    if (route.params?.selectedProducts) {
      setProducts(route.params.selectedProducts);
    }
  }, [route.params?.selectedProducts]);

  useEffect(() => {
    handleAmountChange(discount?.amount);
    handlePercentChange(discount?.pr);
  }, [wholesale, products]);

  // Calculate subtotal before discount (for discount calculation base)
  const subtotalAmount = useMemo(() => {
    if (!products?.length) return 0;
    return products.reduce((sum, item) => {
      const price = wholesale ? item.wholesale_price || 0 : item.price || 0;
      return sum + price * (item.quantity || 0);
    }, 0);
  }, [products, wholesale]);

  // Calculate discount per item (proportional distribution)
  const getItemDiscount = (item: Product): number => {
    if (!products?.length || subtotalAmount === 0) {
      return 0;
    }
    const totalDiscount = Number(discount.amount) || 0;
    const discountPercent = Number(discount.pr) || 0;
    const price = wholesale ? item.wholesale_price || 0 : item.price || 0;
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
    if (!products?.length) return 0;

    return products.reduce((sum, item) => {
      const price = wholesale ? item.wholesale_price || 0 : item.price || 0;
      const gstRate = Number(item.gst) || 0;
      const quantity = item.quantity || 0;
      const itemTotal = price * quantity;
      const itemDiscount = getItemDiscount(item);
      const itemTotalAfterDiscount = itemTotal - itemDiscount;

      // GST is calculated on discounted amount
      if (item.tax_inclusive) {
        // GST is included in price, extract it from discounted amount
        const gstValue = (itemTotalAfterDiscount * gstRate) / (100 + gstRate);
        console.log(gstValue, "gstValue");
        return sum + gstValue;
      } else {
        // GST is exclusive, add it on top of discounted amount
        const gstValue = (itemTotalAfterDiscount * gstRate) / 100;
        return sum + gstValue;
      }
    }, 0);
  }, [products, wholesale, discount.amount, discount.pr, subtotalAmount]);

  // Subtotal after discount, without GST (for display purposes)
  const subtotalWithoutGst = useMemo(() => {
    if (!products?.length) return 0;

    return products.reduce((sum, item) => {
      const price = wholesale ? item.wholesale_price || 0 : item.price || 0;
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
  }, [products, wholesale, discount.amount, discount.pr, subtotalAmount]);

  // Total amount after discount, including GST
  const totalAmount = useMemo(() => {
    return subtotalWithoutGst + gstAmount - Number(discount.amount);
  }, [subtotalWithoutGst, gstAmount, discount]);

  // After-discount total (same as totalAmount now, kept for compatibility)
  const discountedTotal = useMemo(() => {
    return totalAmount;
  }, [totalAmount]);

  const advanceNumeric = useMemo(
    () => Number(advanceAmount) || 0,
    [advanceAmount]
  );
  const dueAmount = useMemo(() => {
    const due = discountedTotal - advanceNumeric;
    return due > 0 ? due : 0;
  }, [discountedTotal, advanceNumeric]);

  const getSaleData = async () => {
    const res = await api.get(
      `${API_ROUTES.posSales}/${route.params?.saleData?.id}/`
    );
    return res.data;
  };

  useEffect(() => {
    (async () => {
      if (route.params?.editMode && route.params?.saleData) {
        const res = await getSaleData();
        populateFormWithSaleData(res);
      }
    })();
  }, [route.params?.editMode, route.params?.saleData]);

  const populateFormWithSaleData = async (saleData: any) => {
    try {
      // Map items to products format
      const mappedProducts = saleData.items.map((item: any) => ({
        id: item.product_details.id,
        name: item.product_details.name,
        desc: item.product_details.description || "",
        price: item.product_details.sales_price,
        wholesale_price: item.product_details.wholesale_price,
        quantity: item.quantity,
        image: item.product_details.image || "",
        gst: item.product_details.gst || null,
        tax_inclusive: item.product_details.tax_inclusive || false,
      }));

      !route.params?.selectedProducts && setProducts(mappedProducts);

      // Set customer if exists
      if (saleData.customer_detials) {
        setSelectedCustomer({
          id: saleData.customer_detials.id,
          name: saleData.customer_detials.name,
        });
      }

      // Set company profile
      if (saleData.company_profile_detials) {
        setCompanySelected({
          id: saleData.company_profile_detials.id,
          name: saleData.company_profile_detials.company_name,
        });
      }

      // Set advance bank if exists
      if (saleData.advance_bank_details) {
        setSelectedBank({
          id: saleData.advance_bank_details.id,
          name: saleData.advance_bank_details.bank_name,
        });
      }

      // Set other form values
      setAdvanceAmount(saleData.advance_amount || "");
      setWholesale(saleData.is_wholesale_rate || false);
      setPaymentMode(
        paymentMethods.find(
          (method) =>
            method.key.toLowerCase() === saleData.payment_method.toLowerCase()
        )?.key || "cash"
      );
      handlePercentChange(saleData.discount_percentage || "");
      setDueDate(saleData.credit_date || "");
    } catch (error) {
      console.error("Error populating form with sale data:", error);
    }
  };

  const fetchAllData = async () => {
    try {
      setIsLoading(true);

      // Parallel fetching
      const [companyRes, customerRes, banks] = await Promise.all([
        api.get(API_ROUTES.companyProfle),
        api.get(API_ROUTES.vendorCustomer),
        // api.get(API_ROUTES.vendorList),
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

      // const transformedVendor: DropDownOption[] = vendorRes.data?.map(
      //   (item: any) => ({
      //     id: item.id,
      //     name: item.name || item.vendor_name,
      //     ...item,
      //   })
      // );
      // setVendorList(transformedVendor);

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
        sum +
        (wholesale ? item.wholesale_price || item.price : item.price) *
          item.quantity,
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
        sum +
        (wholesale ? item.wholesale_price || item.price : item.price) *
          item.quantity,
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
    let tempErrors: FormErrors = {};
    // ✅ check products
    if (!products || products.length === 0) {
      tempErrors.products = "Please add at least one product before proceeding";
    }

    if (products.some((p) => p.quantity === 0)) {
      tempErrors.quantity = "Please remove all items with quantity 0";
    }

    // ✅ check customer selection
    if (!selectedCustomer) {
      tempErrors.customer = "Please select a customer before proceeding";
    }

    // ✅ check discount Amount
    // if (!discount.pr || Number(discount.pr) < 0) {
    //   tempErrors.pr = "Discount percentage must be a valid positive number";
    // }
    if (paymentMode === "credit") {
      if (!dueDate) {
        tempErrors.dueDate = "Due date is required";
      }
      if (advancePaymentMode === 1 && !selectedBank) {
        tempErrors.advanceBank = "Please select bank";
      }
    } else if (paymentMode !== "cash" && !advancePaymentMode && !selectedBank) {
      tempErrors.advanceBank = "Please select bank";
    }
    setErrors(tempErrors);
    console.log(tempErrors, "tempErrors");
    return Object.keys(tempErrors).length > 0; // Everything OK
  };
  const handleSubmit = async () => {
    if (validateForm()) return;
    try {
      // Use the memoized totalAmount which includes GST when wholesale is selected
      const totalDiscountedAmount = discountedTotal;

      const baseData = {
        payment_method: paymentMode.toLocaleLowerCase(),
        company_profile: companySelected?.id,
        // //   "party": 2,
        customer: selectedCustomer?.id,
        customer_details: selectedCustomer,
        discount_percentage: Number(discount?.pr),
        is_wholesale_rate: wholesale,
        items: products.map((p) => ({
          product: p.id,
          quantity: p.quantity,
          price: wholesale ? p.wholesale_price || p.price : p.price,
          amount:
            (wholesale ? p.wholesale_price || p.price : p.price) * p.quantity,
        })),
        total_items: products.reduce((sum, p) => sum + p.quantity, 0),
        total_amount_before_discount: subtotalAmount,
        discount_amount: discount.amount,
        total_amount: totalDiscountedAmount,
        gst_amount: wholesale ? gstAmount.toFixed(2) : 0,
        balance_amount:
          paymentMode === "credit"
            ? totalDiscountedAmount - Number(advanceAmount)
            : 0,
        wholesale_invoice_details: null,
        advance_bank: selectedBank?.id || "",
        advance_amount: paymentMode === "credit" ? advanceAmount || 0 : 0,
      };

      const data =
        paymentMode === "credit"
          ? {
              ...baseData,
              credit_date: new Date(dueDate).toISOString(),
            }
          : baseData;
      console.log(data, "data");
      if (wholesale) {
        navigation.navigate(HomeNavigation.WHOLESALE, data);
      } else {
        setIsLoading(true);

        const res = await api[route.params?.editMode ? "put" : "post"](
          `${API_ROUTES.posSales}${
            route.params?.editMode ? `${route.params?.saleData?.id}/` : ""
          }`,
          data
        );
        console.log(res);
        navigation.reset({
          index: 0,
          routes: [
            {
              name: HomeNavigation.BOTTOM_NAVIGATION,
              state: { index: 0, routes: [{ name: HomeNavigation.ERP }] },
            },
            { name: HomeNavigation.BILLDETAILS, params: { id: res.data?.id } },
          ],
        });
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
      <Headerwithback
        title={route.params?.editMode ? "Edit Sale" : "Sales & POS"}
      />

      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.scrollContent}
      >
        {/* Company Section */}
        {/* <View style={styles.companyRow}>
          <Text style={styles.companyText}>Company - Svindo Enterprise</Text>
          <TouchableOpacity>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View> */}
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
          <View>
            <Text style={styles.optionLabel}>Customer :</Text>
            <Text style={styles.optionLabel}>
              {selectedCustomer?.name || "Not Selected"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowCustomerModal(true)}
            style={styles.changeButton}
          >
            <Text style={styles.changeButtonText}>Add/Select</Text>
          </TouchableOpacity>
        </View>
        {errors.customer && (
          <Text style={{ color: "red" }}>{errors.customer}</Text>
        )}

        {/* {selectedPartyType === "Vendor" && (
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
        )} */}

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
              navigation.navigate(HomeNavigation.PRODUCT_SELECTION as any, {
                selectedProducts: products,
                navigateScreen: HomeNavigation.SALE_POS,
                editMode: route.params?.editMode,
                saleData: route.params?.saleData,
              });
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
        {errors?.quantity && (
          <Text style={{ color: "red" }}>{errors?.quantity}</Text>
        )}
        {/* Product List */}
        {products.map((item, index) => (
          <View key={`${index}-${item.id}`}>
            {index === 0 && (
              <View style={[styles.tableRow, styles.tableHeader]}>
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
                  Price
                </Text>
                <Text
                  style={[
                    styles.tableText,
                    { color: "#fff", fontWeight: "500", marginRight: s(16) },
                  ]}
                >
                  Amount
                </Text>
                {/* <Text style={[styles.tableText, {color: '#fff', fontWeight: '500'}]}>Action</Text> */}
              </View>
            )}
            <View style={styles.tableRow}>
              <Text style={styles.tableText}>{index + 1}</Text>
              <Text style={[styles.tableText, { flex: 2 }]} numberOfLines={2}>
                {item.name}
              </Text>
              <TextInput
                style={[styles.tableText, styles.quantityInput]}
                value={item.quantity?.toString() || "0"}
                onChangeText={(text) => {
                  const newQuantity = parseInt(text) || 0;
                  if (newQuantity >= 0) {
                    const updatedProducts = [...products];

                    // Update quantity
                    updatedProducts[index] = {
                      ...item,
                      quantity: newQuantity,
                    };

                    setProducts(updatedProducts);
                  }
                }}
                keyboardType="numeric"
                selectTextOnFocus
                // onSubmitEditing={() => {
                //   const updatedProducts = [...products];
                //   if (item.quantity === 0) {
                //     // Remove item if quantity is 0
                //     updatedProducts.splice(index, 1);
                //     setProducts(updatedProducts);
                //   }
                // }}
              />
              <Text style={styles.tableText}>
                {formatNumber(
                  (wholesale ? item?.wholesale_price ?? 0 : item?.price) ?? 0
                )}
              </Text>
              <Text style={styles.tableText}>
                {(() => {
                  const price = wholesale
                    ? item?.wholesale_price ?? 0
                    : item?.price ?? 0;
                  const quantity = item?.quantity || 0;
                  const itemTotal = price * quantity;
                  const itemDiscount = getItemDiscount(item);
                  const itemTotalAfterDiscount = itemTotal;

                  // If tax_inclusive, show amount without GST
                  if (item.tax_inclusive) {
                    const gstRate = Number(item.gst) || 0;
                    const gstValue =
                      (itemTotalAfterDiscount * gstRate) / (100 + gstRate);
                    return formatNumber(
                      Number(itemTotalAfterDiscount - gstValue).toFixed(2)
                    );
                  }
                  // Otherwise show amount after discount
                  return formatNumber(itemTotalAfterDiscount.toFixed(2));
                })()}
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
          </View>
        ))}

        {/* Advance and Due (only when advance entered) */}

        {/* Item Total without GST (when wholesale is selected) */}
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

        {/* GST (above total when wholesale is selected) */}
        {gstAmount > 0 && (
          <View style={styles.totalBar}>
            <Text style={styles.totalLabel}>GST</Text>
            <Text style={styles.totalValue}>
              +{formatNumber(Number(gstAmount.toFixed(2)))}
            </Text>
          </View>
        )}

        {/* Total Amount (below product list) */}
        <View
          style={[
            styles.totalBar,
            { borderTopWidth: 1, borderColor: "#FCA311", paddingTop: s(5) },
          ]}
        >
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            {formatNumber(Number(discountedTotal.toFixed(2)))}
          </Text>
        </View>
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
              <Text style={styles.totalValue}>{formatNumber(dueAmount)}</Text>
            </View>
          </View>
        )}
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
          <View style={{ flexDirection: "row", gap: s(10) }}>
            <Text style={styles.label}>Payment</Text>
            <View style={styles.paymentOptions}>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.key}
                  onPress={() => {
                    setPaymentMode(method.key);
                    method.key === "credit"
                      ? setAdvancePaymentMode(1)
                      : setAdvancePaymentMode(null);
                  }}
                  style={[
                    styles.paymentButton,
                    paymentMode === method.key && {
                      backgroundColor: "#FCA311",
                    },
                  ]}
                >
                  <Text style={styles.paymentButtonText}>{method.value}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Advance */}
          {paymentMode === "credit" && (
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
                    selectedValue={selectedBank || null}
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
                  <Text style={{ color: "#000" }}>
                    {dueDate ? dueDate : "YYYY/MM/DD"}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors?.dueDate && (
                <Text style={{ color: "red" }}>{errors?.dueDate}</Text>
              )}
            </>
          )}
          {paymentMode !== "cash" && paymentMode !== "credit" && (
            <>
              <CustomDropdown
                onSelect={setSelectedBank}
                placeholder="Select Bank"
                selectedValue={selectedBank || null}
                options={bankList}
                dropDownBoxStyle={{ marginTop: 10 }}
              />
              {errors?.advanceBank && (
                <Text style={{ color: "red" }}>{errors?.advanceBank}</Text>
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
          <Text style={{ color: "#000", fontWeight: "bold" }}>
            {route.params?.editMode ? "Update Sale" : "Generate Invoice"}
          </Text>
        </TouchableOpacity>
      </View>
      <Loading visible={isLoading} />
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
        minDate={moment().format("YYYY-MM-DD")}
        initialDate={dueDate}
      />
    </SafeAreaView>
  );
};

export default SalePOS;

const styles = ScaledSheet.create({
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
    marginBottom: "6@s",
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
    backgroundColor: "#008BE1",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingVertical: "6@s",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: "5@s",
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
    gap: "6@s",
    marginVertical: 8,
  },
  paymentButton: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
  },
  paymentButtonText: {
    fontSize: "12@s",
    fontWeight: "500",
    color: "#000",
  },
  totalBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: "#FFF7EB",
    paddingHorizontal: 12,
    // paddingVertical: 10,
    marginHorizontal: 10,
    marginTop: "6@s",
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
    // backgroundColor: "#FFF7EB",
    // borderWidth: 1,
    // borderColor: "#FCA311",
    // borderRadius: "8@s",
    paddingHorizontal: "8@s",
    paddingTop: "6@s",
    marginHorizontal: "10@s",
    marginTop: "8@s",
    borderTopWidth: 1,
    borderTopColor: "#FCA311",
  },
  advanceDueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 2,
  },
  bottomButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    // paddingHorizontal: 20,
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
    marginVertical: "10@s",
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

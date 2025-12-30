import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CheckBox from "@react-native-community/checkbox";
import Headerwithback from "./Headerwithback";
import api from "../services/api/api";
import { useRoute } from "@react-navigation/native";
import { API_ROUTES } from "../constants/api-routes.constants";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Loading from "../CommonComponent/Loading";
import { ScaledSheet } from "react-native-size-matters";
import moment from "moment";

interface BillItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  product_details: {
    id: number;
    name: string;
  };
}
interface InfoItem {
  id: string;
  icon: string;
  label: string;
  value?: string;
  valueColor?: string;
  modeColor?: string;
  mode?: string;
}

const BillDetails: React.FC = () => {
  const { params }: any = useRoute();
  const insets = useSafeAreaInsets();
  const [billData, setBillData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`${API_ROUTES.posSales}${params?.id}/`);
        setBillData({ ...res.data });
      } catch (error) {
        console.log(error, "get bill data");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const saleType = billData?.is_wholesale_rate; // or "Wholesale" — you can make this dynamic

  // Calculate charges: delivery + packaging charges
  const deliveryCharges =
    Number(billData?.wholesale_invoice_details?.delivery_charges) || 0;
  const packagingCharges =
    Number(billData?.wholesale_invoice_details?.packaging_charges) || 0;
  const totalCharges = deliveryCharges + packagingCharges;

  const totals = {
    charges: totalCharges,
    tax: 0,
  };

  // Calculate net total: total + charges - discount + tax
  const gstAmount = Number(billData?.total_gst_amount) || 0;
  const netTotal = Number(billData?.total_amount) || 0;

  // Calculate balance: net total - advance paid (only for credit payments)
  const balance = Number(billData?.balance_amount) || 0;

  const [printOptions, setPrintOptions] = useState([
    { label: "Customer", checked: true },
    { label: "Supplier", checked: true },
    { label: "Transport", checked: true },
    { label: "Delivery", checked: false },
  ]);

  const toggleOption = (index: number) => {
    const updated = [...printOptions];
    updated[index].checked = !updated[index].checked;
    setPrintOptions(updated);
  };

  const renderBillItem = ({
    item,
    index,
  }: {
    item: BillItem;
    index: number;
  }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{index + 1}</Text>
      <Text style={[styles.tableCell, { flex: 2 }]} numberOfLines={1}>
        {item?.product_details?.name}
      </Text>
      <Text style={styles.tableCell}>{item.quantity}</Text>
      <Text style={styles.tableCell}>₹{Number(item?.price)?.toFixed(2)}</Text>
      <Text style={styles.tableCell}>
        ₹{(Number(item.quantity) * Number(item?.price))?.toFixed(2)}
      </Text>
    </View>
  );

  const infoData: InfoItem[] = [
    {
      id: "1",
      icon: "truck",
      label: "Dispatch Address",
      value: billData?.wholesale_invoice_details?.dispatch_address,
    },
    {
      id: "2",
      icon: "credit-card",
      label: "Payment",
      value: billData?.wholesale_invoice_details?.payment_date, // you can add this in billData
      mode:
        billData?.payment_method.charAt(0).toUpperCase() +
        billData?.payment_method.slice(1),
      modeColor: "orange",
    },
    {
      id: "3",
      icon: "pen",
      label: "Signature",
      value: billData?.wholesale_invoice_details?.signature,
    },
    {
      id: "4",
      icon: "lock",
      label: "References",
      value: billData?.wholesale_invoice_details?.references,
    },
    {
      id: "5",
      icon: "file-document",
      label: "Notes",
      value: billData?.wholesale_invoice_details?.notes,
    },
    {
      id: "6",
      icon: "file-document-edit",
      label: "Terms",
      value: billData?.wholesale_invoice_details?.terms,
    },
    {
      id: "7",
      icon: "currency-inr",
      label: "Delivery/ Shipping Charges",
      value: billData?.wholesale_invoice_details?.delivery_charges,
    },
    {
      id: "8",
      icon: "package-variant",
      label: "Packaging Charges",
      value: billData?.wholesale_invoice_details?.packaging_charges,
    },
    {
      id: "9",
      icon: "file-outline",
      label: "E-way Bill Number",
      value: billData?.wholesale_invoice_details?.eway_bill_number,
    },
    {
      id: "10",
      icon: "truck-delivery",
      label: "LR Number",
      value: billData?.wholesale_invoice_details?.lr_number,
    },
    {
      id: "11",
      icon: "car",
      label: "Vehicle Number",
      value: billData?.wholesale_invoice_details?.vehicle_number,
    },
    {
      id: "12",
      icon: "truck-fast",
      label: "Transport Name",
      value: billData?.wholesale_invoice_details?.transport_name,
    },
    {
      id: "13",
      icon: "cube",
      label: "No. of Parcels",
      value: billData?.wholesale_invoice_details?.number_of_parcels,
    },
  ];

  const renderItem = ({ item }: { item: InfoItem }) => (
    <View style={styles.infoRow}>
      <View style={{ flexDirection: "row", gap: 5 }}>
        <Icon name={item.icon} size={18} color="#555" style={{ width: 24 }} />
        <View>
          <Text style={styles.infoLabel}>{item.label}</Text>
          {!!item.mode && (
            <Text
              style={[styles.infoValue, { color: item.modeColor || "#000" }]}
            >
              {item.mode}
            </Text>
          )}
        </View>
      </View>
      <View>
        {!!item.value && (
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[
              styles.infoValue,
              {
                color: item.valueColor || "#000",
                marginLeft: "auto",
              },
              item.id === "1" && { maxWidth: "80%" },
            ]}
          >
            {item.value}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* Header */}
      <Loading visible={isLoading} />
      <Headerwithback
        title="Bill Details"
        // rightIcons={[
        //   <TouchableOpacity key="share">
        //     <Icon name="share-variant" size={25} color="#666" key="share" />
        //   </TouchableOpacity>,
        // ]}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 20, flex: 1 }}>
        {/* Company Info */}
        <View style={styles.companyRow}>
          <Text style={styles.company}>
            Company - {billData?.company_profile_detials?.company_name}
          </Text>
          <View
            style={[
              styles.tag,
              !saleType && { backgroundColor: "transparent" },
            ]}
          >
            <Text style={[styles.tagText, !saleType && { color: "orange" }]}>
              {saleType}
            </Text>
          </View>
        </View>

        {/* Customer Details */}
        <Text style={styles.sectionTitle}>
          Customer - {billData?.customer_detials?.name}
        </Text>
        {/* <Text style={styles.sectionSubtitle}>Details here.....</Text> */}

        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.headerText]}>S.No.</Text>
          <Text style={[styles.tableCell, { flex: 2 }, styles.headerText]}>
            Item
          </Text>
          <Text style={[styles.tableCell, styles.headerText]}>Quantity</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Price</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Amount</Text>
        </View>

        {/* Table Body */}
        <View>
          <FlatList
            data={billData?.items}
            renderItem={renderBillItem}
            keyExtractor={(item) => item?.id?.toString()}
            ListFooterComponent={<View style={{ height: 10 }} />}
          />
        </View>

        {/* Invoice Header */}
        <View style={styles.invoiceBox}>
          <Text style={[styles.invoiceTitle, { flex: 1 }]}>Invoice</Text>
          <View>
            <Text style={styles.invoiceNumber}>
              {billData?.wholesale_invoice_details?.invoice_number ||
                billData?.invoice_number}
            </Text>
            <Text style={styles.invoiceDate}>
              {moment(billData?.created_at).format("DD-MM-YYYY")}
            </Text>
          </View>
        </View>
        {!saleType && (
          <View style={[styles.invoiceBox, { marginTop: "auto" }]}>
            <Icon name="bank" size={24} color="#666" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.invoicePaymentTitle}>Payment</Text>
              <Text style={styles.invoiceMethod}>
                {billData?.payment_method.toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.invoiceDate}>
                {billData?.credit_date
                  ? new Date(billData?.credit_date).toLocaleDateString()
                  : "N/A"}
              </Text>
            </View>
          </View>
        )}

        {/* Info List - only for Wholesale */}
        {saleType && (
          <FlatList
            data={infoData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.infoList}
          />
        )}

        {/* Totals */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              Rs {Number(billData?.total_amount_before_discount).toFixed(2)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Charges</Text>
            <Text style={styles.totalValue}>
              Rs {totals.charges.toFixed(2)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Discount</Text>
            <Text style={styles.totalValue}>
              Rs {Number(billData?.discount_amount).toFixed(2)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax</Text>
            <Text style={styles.totalValue}>Rs {gstAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { fontWeight: "bold" }]}>
              Net Total
            </Text>
            <Text style={styles.totalValue}>Rs {netTotal.toFixed(2)}</Text>
          </View>
          {billData?.payment_method === "credit" && (
            <>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Advance Paid</Text>
                <Text style={styles.totalValue}>
                  Rs {Number(billData?.advance_amount).toFixed(2)}
                </Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { fontWeight: "bold" }]}>
                  Balance
                </Text>
                <Text
                  style={[
                    styles.totalValue,
                    { color: "orange", fontWeight: "bold" },
                  ]}
                >
                  Rs {balance.toFixed(2)}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Checkbox Section - only for Wholesale */}
        {!!saleType && (
          <>
            <Text style={styles.checkTitle}>Bill copies to print</Text>
            <View style={styles.checkboxRow}>
              {printOptions.map((opt, idx) => (
                <View key={idx} style={styles.checkboxItem}>
                  <CheckBox
                    value={opt.checked}
                    onValueChange={() => toggleOption(idx)}
                    tintColors={{ true: "#ff9800", false: "#ccc" }}
                  />
                  <Text style={{ color: "#000" }}>{opt.label}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Buttons Section */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#89ACF7" }]}
          >
            <Text style={styles.buttonText}>View PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#92F1A0" }]}
          >
            <Text style={styles.buttonText}>Print</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ margin: 5 }}>
            <Icon name="whatsapp" size={28} color="#25d366" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default BillDetails;

const styles = ScaledSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    elevation: 3,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  companyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 10,
  },
  company: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 10,
    color: "#000",
  },
  tag: {
    backgroundColor: "#ffeb3b",
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 10,
  },
  tagText: { fontSize: 12, fontWeight: "bold", color: "#000" },
  sectionTitle: {
    marginLeft: 10,
    marginTop: 5,
    fontWeight: "bold",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    color: "#000",
  },
  sectionSubtitle: {
    marginLeft: 10,
    color: "#777",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 6,
    paddingHorizontal: 5,
    marginHorizontal: 20,
  },
  tableHeader: {
    backgroundColor: "#2196f3",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    paddingVertical: 6,
    textAlign: "center",
    color: "#000",
  },
  serialCell: {
    textAlign: "center",
  },
  headerText: { color: "#fff", fontWeight: "bold" },
  invoiceBox: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 8,
    marginTop: 12,
    marginHorizontal: 20,
  },
  invoiceTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#000",
  },
  invoicePaymentTitle: {
    fontSize: "12@s",
    color: "#000",
  },
  invoiceMethod: {
    // fontWeight: "bold",
    fontSize: "12@s",
    color: "#ff9800",
  },
  invoiceNumber: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "right",
    color: "#000",
  },
  invoiceDate: {
    fontSize: 12,
    color: "#777",
    textAlign: "right",
  },
  infoList: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 20,
    elevation: 2,
    borderBottomWidth: 1,
    borderColor: "#DDDDDD",
    marginTop: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: "#DDDDDD",
  },
  infoLabel: {
    flex: 1,
    fontSize: 12,
    color: "#333",
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "500",
  },
  totalSection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    marginVertical: 12,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 14,
    color: "#617C9D",
    fontWeight: "500",
  },
  totalValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
  },
  checkTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    marginHorizontal: 20,
  },
  checkboxRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    marginHorizontal: 15,
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 6,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 6,
    width: "70%",
    alignSelf: "center",
  },
  button: {
    flex: 1,
    marginHorizontal: 2,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});

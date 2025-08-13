import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CheckBox from '@react-native-community/checkbox';
import Headerwithback from './Headerwithback';

interface BillItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
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
  const saleType = 'Retail'; // or "Wholesale" — you can make this dynamic

  const billItems: BillItem[] = [
    { id: '1', name: 'White Shirt XL Size, Blue Color, Denim Brand', quantity: 2, price: 500 },
    { id: '2', name: 'White Shirt XL Size, Blue Color, Denim Brand', quantity: 2, price: 500 },
  ];

  const totals = {
    total: 1000,
    charges: 0,
    discount: 500,
    tax: 500,
    netTotal: 1000,
    advancePaid: 500,
    balance: 500,
  };

  const [printOptions, setPrintOptions] = useState([
    { label: 'Customer', checked: true },
    { label: 'Supplier', checked: true },
    { label: 'Transport', checked: true },
    { label: 'Delivery', checked: false },
  ]);

  const toggleOption = (index: number) => {
    const updated = [...printOptions];
    updated[index].checked = !updated[index].checked;
    setPrintOptions(updated);
  };

  const renderBillItem = ({ item, index }: { item: BillItem; index: number }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{index + 1}</Text>
      <Text style={[styles.tableCell, { flex: 2 }]} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.tableCell}>{item.quantity}</Text>
      <Text style={styles.tableCell}>₹{item.price.toFixed(2)}</Text>
      <Text style={styles.tableCell}>₹{(item.quantity * item.price).toFixed(2)}</Text>
    </View>
  );

  const infoData: InfoItem[] = [
    { id: '1', icon: 'truck', label: 'Dispatch Address' },
    { id: '2', icon: 'credit-card', label: 'Payment', value: '11/10/2024', mode: 'Credit', modeColor: 'orange' },
    { id: '3', icon: 'pen', label: 'Signature' },
    { id: '4', icon: 'lock', label: 'References' },
    { id: '5', icon: 'file-document', label: 'Notes' },
    { id: '6', icon: 'file-document-edit', label: 'Terms' },
    { id: '7', icon: 'currency-inr', label: 'Delivery/ Shipping Charges', value: '0.00' },
    { id: '8', icon: 'package-variant', label: 'Packaging Charges', value: '0.00' },
    { id: '9', icon: 'file-outline', label: 'E-way Bill Number' },
    { id: '10', icon: 'truck-delivery', label: 'LR Number' },
    { id: '11', icon: 'car', label: 'Vehicle Number' },
    { id: '12', icon: 'truck-fast', label: 'Transport Name' },
    { id: '13', icon: 'cube', label: 'No. of Parcels' },
  ];

  const renderItem = ({ item }: { item: InfoItem }) => (
    <View style={styles.infoRow}>
      <View style={{ flexDirection: 'row', gap: 5 }}>
        <Icon name={item.icon} size={18} color="#555" style={{ width: 24 }} />
        <View>
          <Text style={styles.infoLabel}>{item.label}</Text>
          {item.mode && (
            <Text style={[styles.infoValue, { color: item.modeColor || '#000' }]}>
              {item.mode}
            </Text>
          )}
        </View>
      </View>
      <View>
        {item.value && (
          <Text style={[styles.infoValue, { color: item.valueColor || '#000' }]}>
            {item.value}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Headerwithback
        title="Bill Details"
        rightIcons={[
          <Icon
            name="format-list-text"
            size={25}
            color="#FFA700"
            key="search"
          />,
        ]}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Company Info */}
        <View style={styles.companyRow}>
          <Text style={styles.company}>Company - svindo Enterprise</Text>
          <View style={[
            styles.tag,
            saleType === 'Retail' && { backgroundColor: 'transparent' }
          ]}>
            <Text style={[
              styles.tagText,
              saleType === 'Retail' && { color: 'orange' }
            ]}>
              {saleType}
            </Text>
          </View>
        </View>

        {/* Customer Details */}
        <Text style={styles.sectionTitle}>Customer Details</Text>
        <Text style={styles.sectionSubtitle}>Details here.....</Text>

        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.headerText]}>S.No.</Text>
          <Text style={[styles.tableCell, { flex: 2 }, styles.headerText]}>Item</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Quantity</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Price</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Amount</Text>
        </View>

        {/* Table Body */}
        <FlatList
          data={billItems}
          renderItem={renderBillItem}
          keyExtractor={(item) => item.id}
          ListFooterComponent={<View style={{ height: 10 }} />}
        />

        {/* Invoice Header */}
        <View style={styles.invoiceBox}>
          <Text style={styles.invoiceTitle}>Invoice</Text>
          <View>
            <Text style={styles.invoiceNumber}>PINV-1</Text>
            <Text style={styles.invoiceDate}>14-02-2025</Text>
          </View>
        </View>

        {/* Info List - only for Wholesale */}
        {saleType !== 'Retail' && (
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
            <Text style={styles.totalValue}>Rs {totals.total.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Charges</Text>
            <Text style={styles.totalValue}>Rs {totals.charges.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Discount</Text>
            <Text style={styles.totalValue}>Rs {totals.discount.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax</Text>
            <Text style={styles.totalValue}>Rs {totals.tax.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { fontWeight: 'bold' }]}>Net Total</Text>
            <Text style={styles.totalValue}>Rs {totals.netTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Advance Paid</Text>
            <Text style={styles.totalValue}>Rs {totals.advancePaid.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { fontWeight: 'bold' }]}>Balance</Text>
            <Text style={[styles.totalValue, { color: 'orange', fontWeight: 'bold' }]}>
              Rs {totals.balance.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Checkbox Section - only for Wholesale */}
        {saleType !== 'Retail' && (
          <>
            <Text style={styles.checkTitle}>Bill copies to print</Text>
            <View style={styles.checkboxRow}>
              {printOptions.map((opt, idx) => (
                <View key={idx} style={styles.checkboxItem}>
                  <CheckBox
                    value={opt.checked}
                    onValueChange={() => toggleOption(idx)}
                    tintColors={{ true: '#ff9800', false: '#ccc' }}
                  />
                  <Text>{opt.label}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Buttons Section */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#89ACF7' }]}>
            <Text style={styles.buttonText}>View PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#92F1A0' }]}>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' , },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    elevation: 3,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  companyRow: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 10,
  },
  company: { fontSize: 16, fontWeight: "bold" , paddingHorizontal: 10},
  tag: {
    backgroundColor: "#ffeb3b",
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 10,
  },
  tagText: { fontSize: 12, fontWeight: "bold" },
  sectionTitle: { marginLeft: 10, marginTop: 5, fontWeight: "bold", marginHorizontal: 10, paddingHorizontal: 10 },
  sectionSubtitle: { marginLeft: 10, color: "#777" , marginBottom: 10, paddingHorizontal: 10 },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 6,
    paddingHorizontal: 5,
    marginHorizontal: 20
  },
  tableHeader: {
    backgroundColor: "#2196f3",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableCell: {
    flex: 1, 
    fontSize: 12,
    fontWeight: '600' ,
    paddingVertical: 6
  },
  serialCell: { 
    textAlign: "center" ,
  },
  headerText: { color: "#fff", fontWeight: "bold" },
  invoiceBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 8,
    marginTop: 12,
    marginHorizontal: 20
  },
  invoiceTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  invoiceNumber: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'right',
    
  },
  invoiceDate: {
    fontSize: 12,
    color: '#777',
    textAlign: 'right',
  },
  infoList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 20,
    elevation: 2,
    borderBottomWidth: 1,
    borderColor: '#DDDDDD',
    marginTop: 10
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#DDDDDD',
  },
  infoLabel: {
    flex: 1,
    fontSize: 12,
    color: '#333',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  totalSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    marginVertical: 12,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 14,
    color: '#617C9D',
    fontWeight: '500'
  },
  totalValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600'
  },
  checkTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    marginHorizontal: 20
  },
  checkboxRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    marginHorizontal: 15
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 6,
    width: '70%',
    alignSelf: 'center'
  },
  button: {
    flex: 1,
    marginHorizontal: 2,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16
  },
});

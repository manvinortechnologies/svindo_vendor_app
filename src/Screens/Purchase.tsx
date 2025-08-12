import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import Headerwithback from './Headerwithback';
import CustomSwitch from './CustomSwitch'; // Make sure this path is correct






const Purchase = () => {

  const [SupplierInNo, SupplierInvoiceNo] = useState(false);
  const [showPrice, showpurcasePrice] = useState(true);
  const [PurcaseMargin, showPurcaseMargin] = useState(false);
  const [updateproductdetails, UpdateProductDetails] = useState(false);

  const [sellingPrice, setSellingPrice] = useState(false);
  const [purchasePrice, setPurchasePrice] = useState(false);
  const [productDiscount, setProductDiscount] = useState(false);
  const [customColumns, setCustomColumns] = useState(false);
  return (
    <View style={styles.container}>
      <Headerwithback title="Purchase" />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          

          {/* Round Off */}
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>Mandatory Supplier Invoice Number </Text>
              <Text style={styles.switchDesc}>loremipsumloreimpsum</Text>
            </View>
            <CustomSwitch value={SupplierInNo} onValueChange={SupplierInvoiceNo} />
          </View>

          {/* Send Email */}
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>Show Selling Price</Text>
              <Text style={styles.switchDesc}>loremipsumloreimpsum</Text>
            </View>
            <CustomSwitch value={showPrice} onValueChange={showpurcasePrice} />
          </View>

          {/* Send SMS */}
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>Show Margin</Text>
              <Text style={styles.switchDesc}>loremipsumloreimpsum</Text>
            </View>
            <CustomSwitch value={PurcaseMargin} onValueChange={showPurcaseMargin} />
          </View>

          {/* Track for services */}
          <View style={styles.switchRow}>
          <View>
            <Text style={styles.switchTitle}>Update product Details</Text>
            <Text style={styles.switchDesc}>loremipsumloreimpsum</Text>
            </View>
            <CustomSwitch
              value={updateproductdetails}
              onValueChange={UpdateProductDetails}
            />
          </View>

          {/* Track for delivery challan */}
          <View style={{ marginTop: 30 }}>
  {[
    { label: 'Selling price', value: sellingPrice, setValue: setSellingPrice },
    { label: 'Purchase Price', value: purchasePrice, setValue: setPurchasePrice },
    { label: 'Product Discount', value: productDiscount, setValue: setProductDiscount },
    { label: 'Custom Columns', value: customColumns, setValue: setCustomColumns },
  ].map((item, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => item.setValue(!item.value)}
      style={styles.checkboxRow}
    >
      <Text style={styles.checkboxLabel}>{item.label}</Text>
      <View style={[styles.checkbox, item.value && styles.checkboxSelected]} />
    </TouchableOpacity>
  ))}
</View>

         
        </View>

 
       
      </ScrollView>
      <TouchableOpacity style={styles.updateBtn}>
          <Text style={styles.updateText}>Update</Text>
        </TouchableOpacity>
      {/* <Bottomnavigation /> */}
    </View>
  );
};



const styles = StyleSheet.create({
    container: {  backgroundColor: "#FFF",
        flex:1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 40 : 0,
    
       },
 content: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: '#fff7ec',
    borderWidth: 1,
    borderColor: '#f8b14d',
    borderRadius: 10,
    padding: 16,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 15,
  },
  radioRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#f8b14d',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#f8b14d',
  },
  radioLabel: {
    fontSize: 14,
    color: '#000',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  switchTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: '#000',
  },
  switchDesc: {
    color: '#999',
    fontSize: 12,
  },
  updateBtn: {
    backgroundColor: '#FCA311',
    marginTop: 40,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10,
    width:"50%",
    alignSelf:"center",
    marginBottom:10,
  },
  updateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkboxLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: '#FCA311',
    borderRadius: 4,
    backgroundColor:"#FFF"
  },
  checkboxSelected: {
    backgroundColor: '#FCA311',
  },
});


export default Purchase
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Platform, StatusBar } from 'react-native';
import Headerwithback from './Headerwithback';
import Bottomnavigation from './Bottomnavigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SalePOS = () => {
  const [products, setProducts] = useState([{ name: '', quantity: '' }]);

  return (
    <View style={styles.container}>
      <Headerwithback title="Sales & POS" rightIcon={<Icon name="search" size={20} color="black" />} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.companyHeader}>
          <View style={styles.avatar}><Text style={styles.avatarText}>RE</Text></View>
          <Text style={styles.companyName}>Raigun Enterprise</Text>
          <TouchableOpacity style={styles.addCompanyBtn}>
            <Text style={styles.addCompanyText}>+ Add Another{"\n"}Company</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.discardButton}>
            <Text style={styles.buttonText}>Discard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.buttonText}>Checkout</Text>
          </TouchableOpacity>
        </View>

        {products.map((product, index) => (
          <View key={index} style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Product Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Search or scan product barcode"
                value={product.name}
                onChangeText={(text) => {
                  const newProducts = [...products];
                  newProducts[index].name = text;
                  setProducts(newProducts);
                }}
              />
              {index === products.length - 1 && (
                <TouchableOpacity onPress={() => setProducts([...products, { name: '', quantity: '' }])}>
                  <Text style={[styles.subLabel, { color: '#FCA311', textDecorationLine: 'underline' }]}>
                    Add New Product
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                value={product.quantity}
                onChangeText={(text) => {
                  const newProducts = [...products];
                  newProducts[index].quantity = text;
                  setProducts(newProducts);
                }}
                keyboardType="numeric"
              />
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Items</Text>
        </TouchableOpacity>

        <View style={styles.tableHeader}>
          <Text style={styles.tableText}>Item</Text>
          <Text style={styles.tableText}>Quantity</Text>
          <Text style={styles.tableText}>Price</Text>
          <Text style={styles.tableText}>Amount</Text>
          <Text style={styles.tableText}>Action</Text>
        </View>

        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Items</Text>
            <Text style={styles.summaryValue}>Rs 1000/</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total tax</Text>
            <Text style={styles.summaryValue}>Rs 1000/</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: '#FCA311' }]}>Total Amount</Text>
            <Text style={[styles.summaryValue, { color: '#FCA311' }]}>Rs 1000/</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.imagerow}>
       <Image  style={styles.images} source={require("../assets/paymentss.png")}/>
       </View>
      <Bottomnavigation />
    </View>
  );
};

export default SalePOS;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 40 : 0,
  },
  scrollContent: {
    padding: 20,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF1D6',
    borderWidth: 1,
    borderColor: '#FCA311',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontWeight: 'bold',
    color: '#000',
  },
  companyName: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  addCompanyBtn: {
    alignItems: 'flex-end',
  },
  addCompanyText: {
    textAlign: 'right',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  discardButton: {
    backgroundColor: '#FFABAB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  checkoutButton: {
    backgroundColor: '#92F1A0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginLeft: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#000',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  inputContainer: {
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#FCA311',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fff',
  },
  subLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  addButton: {
    alignSelf: 'center',
    backgroundColor: '#FCA311',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 6,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#DEDEDE',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  tableText: {
    fontWeight: 'bold',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  summarySection: {
    marginTop: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#82A0AA',
  },
  summaryValue: {
    fontWeight: 'bold',
  },
  imagerow:{
    alignContent:"center",
    alignItems:"center",justifyContent:"center",

    
  },
  images:{
width:"100%",
  }
});

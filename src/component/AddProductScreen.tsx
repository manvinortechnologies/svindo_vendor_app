import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Headerwithback from './Headerwithback';
import MainContainer from '../CommonComponent/MainContainer';
import { InputBox } from '../CommonComponent/InputBox';
import CustomDropdown from '../CommonComponent/CustomDropdown';
import CustomSwitch from '../CommonComponent/CustomSwitch';

const AddProductScreen = () => {
  const [selectedType, setSelectedType] = useState('Product');
  const [selectedFor, setSelectedFor] = useState('Offline only');

  const types = ['Product', 'Service', 'Print'];
  const forOptions = ['Offline only', 'Both online & Offline'];
const [productName, setProductName] = useState('');
const [wholesalePrice, setWholesalePrice] = useState('');
const [purchasePrice, setPurchasePrice] = useState('');
const [salesPrice, setSalesPrice] = useState('');
const [mrp, setMRP] = useState('');
const [unit,setUnit]= useState('')
const [hsn, setHSN] = useState('');
const [gst,setGst]=useState("")
const [openingStock, setOpeningStock] = useState('');
const [lowStockQty, setLowStockQty] = useState('');
const [brandName, setBrandName] = useState('');
const [batchNumber, setBatchNumber] = useState('');
const [expiryDate, setExpiryDate] = useState('');
const [description, setDescription] = useState('');

// Switches
const [isWholesaleEnabled, setIsWholesaleEnabled] = useState(true);
const [includesTax, setIncludesTax] = useState<boolean>(true);
const [lowStockAlert, setLowStockAlert] = useState(false);
const [batchSwitch, setBatchSwitch] = useState(true);
const [expirySwitch, setExpirySwitch] = useState(true);

// Delivery options
const [instantDelivery, setInstantDelivery] = useState(true);
const [selfPickup, setSelfPickup] = useState(true);
const [generalDelivery, setGeneralDelivery] = useState(true);

// Policies
const [returnPolicy, setReturnPolicy] = useState(true);
const [codPolicy, setCodPolicy] = useState(true);
const [replacementPolicy, setReplacementPolicy] = useState(true);
const [shopExchange, setShopExchange] = useState(true);
const [shopWarranty, setShopWarranty] = useState(true);
const [brandWarranty, setBrandWarranty] = useState(true);
const [onShopOrders, setOnShopOrders] = useState(true);


  const sections = [
    {
      title: 'Product Name',
      content: (
        // <TouchableOpacity style={styles.inputBoxOptional}>
        //   <Text style={styles.placeholderText}>Ex: Lee White T shirt XL size</Text>
        //   <Icon name="chevron-down" size={18} color="#000" />
        // </TouchableOpacity>
        <InputBox
        background='#FFF8EB'
        placeholder='Enter Product Name'
        onChangeText={setProductName}
        value={productName}
        autoCapitalize='sentences'
        
        />
      ),
    },
    {
      title: 'Pricing Details',
      content: (
        <View>
          <View style={styles.inputContainer}>
            <Text style={styles.smallLabel}>Wholesale Price (Optional)</Text>
            <CustomSwitch value={isWholesaleEnabled} onValueChange={setIsWholesaleEnabled} />
          </View>
          {/* Wholesale Price */}
          {isWholesaleEnabled &&(
            <InputBox
              placeholder="Enter here"
               background='#FFF8EB'
               value={wholesalePrice}
               keyboardType='number-pad'
               onChangeText={setWholesalePrice}
            />
            )}
          {/* Purchase & Sales Price */}
          <View style={styles.priceRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.smallLabel}>Purchase Price</Text>
             
                <InputBox
              placeholder="Enter here"
               background='#FFF8EB'
               value={purchasePrice}
               keyboardType='number-pad'
               onChangeText={setPurchasePrice}
            />
              
            </View>
            <View style={styles.inputHalf}>
              <Text style={styles.smallLabel}>Sales Price</Text>
              
                 <InputBox
              placeholder="Enter here"
               background='#FFF8EB'
               value={salesPrice}
               keyboardType='number-pad'
               onChangeText={setSalesPrice}
            />
            </View>
          </View>
          {/* MRP & Unit */}
          <View style={styles.priceRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.smallLabel}>MRP</Text>
            
              <InputBox
              placeholder="Enter here"
               background='#FFF8EB'
               value={mrp}
               onChangeText={setMRP}
            />
          </View>
            <View style={styles.inputHalf}>
              <Text style={styles.smallLabel}>Unit</Text>
           <InputBox
              placeholder="ex: Kg"
               background='#FFF8EB'
               value={unit}
               onChangeText={setUnit}
            />
            </View>
          </View>
          {/* HSN & GST */}
          <View style={styles.priceRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.smallLabel}>HSN</Text>
              <InputBox
              placeholder="Enter here"
               background='#FFF8EB'
               value={hsn}
               onChangeText={setHSN}
            />
            </View>
            <View style={styles.inputHalf}>
              <Text style={styles.smallLabel}>GST</Text>
               <InputBox
              placeholder="ex: 5%"
               background='#FFF8EB'
               value={gst}
               onChangeText={setGst}
            />
            </View>
          </View>
          <Text style={styles.warningText}>
            * To enable GST details please select as registered business in company settings
          </Text>
        </View>
      ),
      customHeader: (
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Pricing Details</Text>
          <View style={styles.includesRow}>
            <Text style={styles.smallLabel}>Includes Tax</Text>
            <CustomSwitch value={includesTax} onValueChange={setIncludesTax} />
          </View>
        </View>
      ),
    },
    {
      title: 'Stock',
      content: (
        <View style={styles.stockContainer}>
          <Text style={styles.stockNote}>
            * Disable stock to create a simple product for billing only
          </Text>
          <View style={styles.imeiRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.stockLabel}>IMEI / Serial No</Text>
              <Text style={styles.optionalText}>(Optional)</Text>
            </View>
            <TouchableOpacity style={styles.addButtonSmall}>
              <Text style={styles.addButtonTextSmall}>Add +</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.stockWarning}>
            * Stock will be calculated based on this
          </Text>
          <Text style={styles.stockLabel}>Opening Stock</Text>
          <View style={[ { width: '50%', marginTop: 5 }]}>
           
                 <InputBox
              placeholder="Enter here"
               background='#FFF8EB'
               value={openingStock}
               keyboardType='number-pad'
               onChangeText={setOpeningStock}
            />
          </View>
          <View style={styles.lowStockRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.lowStockIcon}>🔔</Text>
              <Text style={styles.lowStockText}>Low stock alert</Text>
            </View>
            <CustomSwitch value={lowStockAlert} onValueChange={setLowStockAlert} />
          </View>
          <Text style={styles.stockLabel}>Low Stock Quantity</Text>
          <View style={[ { width: '50%', marginTop: 5 }]}>
           
                 <InputBox
              placeholder="Enter here"
               background='#FFF8EB'
               value={lowStockQty}
               keyboardType='number-pad'
               onChangeText={setLowStockQty}
            />
          </View>
        </View>
      ),
    },

    {
      title: 'Optional Details',
      content: (
        <View style={styles.optionalContainer}>
          {/* Category */}
          <Text style={styles.optionalLabel}>Category <Text style={styles.optionalText}>(Optional)</Text></Text>
          <View style={styles.inputBoxOptional}>
            <Text style={styles.placeholderText}>Select category</Text>
            <TouchableOpacity style={styles.includesRow}>
              <Icon name="chevron-down" size={18} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Sub Category */}
          <Text style={styles.optionalLabel}>Sub category <Text style={styles.optionalText}>(Optional)</Text></Text>
          <View style={styles.inputBoxOptional}>
            <Text style={styles.placeholderText}>Select Sub category</Text>
            <TouchableOpacity style={styles.includesRow}>
              <Icon name="chevron-down" size={18} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Brand Name */}
          <Text style={styles.optionalLabel}>Brand Name <Text style={styles.optionalText}>(Optional)</Text></Text>
        
                 <InputBox
              placeholder="Enter here"
               background='#FFF8EB'
               value={brandName}
               onChangeText={setBrandName}
            />

          {/* Pick Color */}
          <Text style={styles.optionalLabel}>Pick Color <Text style={styles.optionalText}>(Optional)</Text></Text>
          <View style={styles.rowBetween}>
            <View style={[styles.inputBoxOptional, { flex: 1 }]}>
              <Text style={styles.placeholderText}>Select one</Text>
              <TouchableOpacity style={styles.includesRow}>
                <Icon name="chevron-down" size={18} color="#000" />
              </TouchableOpacity>
            </View>
            <View style={styles.colorBox} />
          </View>

          {/* Select Size */}
          <Text style={styles.optionalLabel}>Select Size <Text style={styles.optionalText}>(Optional)</Text></Text>
          <View style={styles.inputBoxOptional}>
            <Text style={styles.placeholderText}>Select here</Text>
            <TouchableOpacity style={styles.includesRow}>
              <Icon name="chevron-down" size={18} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Batch Number */}
          <View style={styles.toggleRow}>
            <Text style={styles.optionalLabel}>Batch number <Text style={styles.optionalText}>(Optional)</Text></Text>
            <CustomSwitch value={batchSwitch} onValueChange={setBatchSwitch} />
          </View>
          {batchSwitch&&(
         
                 <InputBox
              placeholder="Enter here"
               background='#FFF8EB'
               value={batchNumber}
               onChangeText={setBatchNumber}
            />
            )}

          {/* Expiry Date */}
          <View style={styles.toggleRow}>
            <Text style={styles.optionalLabel}>Expiry Date <Text style={styles.optionalText}>(Optional)</Text></Text>
            <CustomSwitch value={expirySwitch} onValueChange={setExpirySwitch} />
          </View>
          {expirySwitch &&(
          <TouchableOpacity style={styles.inputBox}>
            <TextInput
              placeholder="Enter here"
              placeholderTextColor="#888"
              style={styles.textInput}
              value={expiryDate}
              editable={false}
            />
          </TouchableOpacity>
          )}

          {/* Description */}
          <Text style={styles.optionalLabel}>Description <Text style={styles.optionalText}>(Optional)</Text></Text>
          <View style={styles.textAreaBox}>
            <TextInput
            value={description}
            onChangeText={setDescription}
              placeholder="Enter here"
              placeholderTextColor="#888"
            />
          </View>

          {/* Image */}
          <Text style={styles.optionalLabel}>Image <Text style={styles.optionalText}>(Optional)</Text></Text>
          <TouchableOpacity style={styles.imageBox}>
            <Text style={styles.plusIcon}>+</Text>
          </TouchableOpacity>
        </View>
      ),
      customHeader: (
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Optional Details</Text>
          <TouchableOpacity style={styles.includesRow}>
            <Icon name="chevron-down" size={18} color="#000" />
          </TouchableOpacity>
        </View>
      ),
    },
  ];

  const dynamicSections: any[] = [];
  if (selectedType === 'Product' && selectedFor === 'Both online & Offline') {
    dynamicSections.push(
      {
        title: 'Delivery Details',
        content: (
          <View>
            {/* <View style={styles.toggleRow}>
              <Text style={styles.sectionTitle}>Use default</Text>
              <CustomSwitch value={true} onValueChange={() => {}} />
            </View> */}
            {['Instant Delivery', 'Self Pickup', 'General Delivery'].map(option => (
              <View key={option} style={styles.toggleRow}>
                <Text style={styles.smallLabel}>{option}</Text>
                <CustomSwitch value={true} onValueChange={() => { }} />
              </View>
            ))}
          </View>
        ),
        customHeader: (
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Delivery Details</Text>
            <View style={styles.includesRow}>
              <Text style={styles.smallLabel}>Includes Tax</Text>
              <CustomSwitch value={false} onValueChange={() => { }} />
            </View>
          </View>
        ),
      },
      {
        title: 'Policies',
        content: (
          <View>
            {/* <View style={styles.toggleRow}>
              <Text style={styles.sectionTitle}>Use default</Text>
              <CustomSwitch value={true} onValueChange={() => {}} />
            </View> */}
            {[
              'Return',
              'COD',
              'Replacement',
              'Shop Exchange',
              'Shop Warranty',
              'Brand Warranty',
              'On shop orders',
            ].map(option => (
              <View key={option} style={styles.toggleRow}>
                <Text style={styles.smallLabel}>{option}</Text>
                <CustomSwitch value={true} onValueChange={() => { }} />
              </View>
            ))}
          </View>
        ),
        customHeader: (
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Policies</Text>
            <View style={styles.includesRow}>
              <Text style={styles.smallLabel}>Includes Tax</Text>
              <CustomSwitch value={false} onValueChange={() => { }} />
            </View>
          </View>
        ),
      }
    );
  }

  return (
    <MainContainer>
      <SafeAreaView style={styles.safeArea}>
        <Headerwithback title={'Enter Details'} />
        
                <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 30}
                >
                  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <FlatList
         keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View style={{ padding: 16 }}>
              <View style={styles.row}>
                <Text style={styles.label}>Type :</Text>
                <View style={styles.optionGroup}>
                  {types.map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.optionButton,
                        selectedType === type && styles.selectedButton,
                      ]}
                      onPress={() => setSelectedType(type)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selectedType === type && styles.selectedText,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>For :</Text>
                <View style={styles.optionGroup}>
                  {forOptions.map(option => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        selectedFor === option && styles.selectedOrange,
                      ]}
                      onPress={() => setSelectedFor(option)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selectedFor === option && styles.selectedText,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          }
          data={[...sections, ...dynamicSections]}
          keyExtractor={item => item.title}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <View style={styles.section}>
              {item.customHeader ? item.customHeader : (
                <Text style={styles.sectionTitle}>{item.title}</Text>
              )}
              {item.content}
            </View>
          )}
          ListFooterComponent={
            <View style={styles.footer}>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          }
          extraData={{ selectedType, selectedFor }}
        />
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </MainContainer>
  );
};

export default AddProductScreen;


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginRight: 10,
    width: 50,
  },
  optionGroup: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
    gap: 10,
    flex: 1,
    // backgroundColor:'red'
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#fff',
    marginRight: 10,
    marginBottom: 8,
  },
  selectedButton: {
    backgroundColor: '#FCA311',
    borderColor: '#FCA311',
  },
  selectedOrange: {
    backgroundColor: '#FCA311',
    borderColor: '#FCA311',
  },
  optionText: {
    color: '#333',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 10,
    padding: 10
  },
  sectionTitle: {
    color: '#FCA311',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  smallLabel: {
    fontSize: 13,
    color: '#555',
    marginRight: 8,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#FCA311',
    borderRadius: 6,
    padding: 1,
    backgroundColor: '#FFF8EB',
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  placeholderText: {
    color: '#000',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  includesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inputHalf: {
    flex: 0.48,
  },
  warningText: {
    fontSize: 12,
    color: 'red',
    marginTop: 8,
  },
  stockContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  stockNote: {
    fontSize: 12,
    color: 'red',
    marginBottom: 8,
  },
  imeiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stockLabel: {
    fontWeight: '600',
    fontSize: 14,
  },
  optionalText: {
    fontSize: 12,
    color: '#555',
    marginLeft: 4,
  },
  addButtonSmall: {
    backgroundColor: '#FCA311',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  addButtonTextSmall: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  stockWarning: {
    fontSize: 12,
    color: 'red',
    marginBottom: 12,
  },
  inputBoxStock: {
    borderWidth: 1,
    borderColor: '#FCA311',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#fffbe6',
    marginBottom: 12,
  },
  lowStockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lowStockIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  lowStockText: {
    fontSize: 13,
    color: '#555',
  },
  optionalContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  optionalLabel: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  // optionalText: {
  //   fontSize: 12,
  //   color: '#555',
  // },
  inputBoxOptional: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FCA311',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#FFF8EB',
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  colorBox: {
    width: 40,
    height: 40,
    backgroundColor: '#8B3A3A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8
  },
  textAreaBox: {
    borderWidth: 1,
    borderColor: '#FCA311',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#fffbe6',
    marginBottom: 12,
    height: 80,
  },
  imageBox: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: '#FCA311',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fffbe6',
    marginBottom: 12,
  },
  plusIcon: {
    fontSize: 20,
    color: '#000',
  },


  footer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  addButton: {
    width: '50%',
    alignSelf: 'center',
    backgroundColor: '#FCA311',
    paddingVertical: 12,
    borderRadius: 8,

    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});


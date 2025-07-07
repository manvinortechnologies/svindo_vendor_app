import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Headerwithback from './Headerwithback';
import Loading from '../CommonComponent/Loading';
import api from '../services/api/api';
import { Vendor } from '../type/Vendor';
import VendorModal from '../Modals/VendorModal';

const CreatePurchase = ({navigation}:any) => {
  const [isLoading,setIsLoading]= useState<boolean>(false)
 const [isVendorModalVisible, setIsVendorModalVisible] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [allVendorList,setAllVendorList] = useState<Vendor[]>();
  const handleSearch = () => {
    // Handle search action
  };
  useEffect(()=>{
    getAllVendors();


  }
  ,[]);
  const getAllVendors=async()=>{
    try {
      setIsLoading(true)
      const res=await api.get("vendor/get-vendor/");
      console.log("res--->",res)
      if(res.data){
        setAllVendorList(res.data)
      }
      
    } catch (error) {
      
    }finally{
      setIsLoading(false)

    }
  }
   const handleSelectVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsVendorModalVisible(false);
  };
  return (
    <View style={styles.container}>
      
      <Headerwithback
      title="Create Purchase"
      rightIcons={[
        // <TouchableOpacity onPress={handleSearch} key="search">
        //   <Icon name="search" size={20} color="#000" />
        // </TouchableOpacity>,
         <TouchableOpacity onPress={handleSearch} key="search">
         <Icon name="youtube" size={20} color="#000" />
       </TouchableOpacity>,
      ]}
    />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Purchase Info */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>Purchase</Text>
              <Text style={styles.value}>PINV-1</Text>
              <Text style={styles.subtext}>14-02-2025</Text>
            </View>
            <TouchableOpacity><Text style={styles.editText}>Edit</Text></TouchableOpacity>
          </View>
        </View>

        {/* Vendor Selection */}
        <View>
          <Text style={styles.label}>Vendor <Icon name="information" size={14} /></Text>
          <TouchableOpacity style={styles.selector} 
          onPress={()=>setIsVendorModalVisible(true)}
          >
            <Text style={styles.selectorText}>+ Select Vendor</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Product <Icon name="information" size={14} /></Text>
          <TouchableOpacity style={styles.selector}>
            <Text style={styles.selectorText}>+ Select Products</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.customFieldButton}>
            <View>
            
            <Text style={styles.customFieldText}>Add Custom Fields</Text>
            <Text style={styles.customsubText}>Persolize to perfectly suit your style</Text>
            </View>
            <Icon name="headphones" size={18} color="#fff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>

        {/* Supplier Invoice */}
        <View style={styles.section}>
          <Text style={styles.label}>Supplier Invoice</Text>

          <Text style={styles.inputLabel}>Supplier Invoice Date</Text>
          <TouchableOpacity style={styles.inputField}>
            <Text>05-02-2025</Text>
            <Feather name="calendar" size={18} color="#FCA311" />
          </TouchableOpacity>

          <Text style={styles.inputLabel}>Serial Number</Text>
          <TextInput style={styles.textInput} placeholder="Supplier Invoice Serial Number" />
        </View>

        {/* Optional Section */}
        <View style={styles.rowBetween}>
            <Text style={styles.label}>Optional</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>+ Additional Charges</Text>
            </TouchableOpacity>
          </View>
        <View style={styles.section}>
         

          {[
            { icon: 'truck', label: 'Select Dispatch Address' },
            { icon: 'bank', label: 'Bank', sub: 'Cash', action: 'Change' },
            { icon: 'pen', label: 'Select Signature' },
            { icon: 'file-document-outline', label: 'Add References' },
            { icon: 'note', label: 'Add Notes' },
            { icon: 'file-certificate-outline', label: 'Add Terms' },
            { icon: 'percent-outline', label: 'Add Extra Discount' },
            { icon: 'truck-delivery-outline', label: 'Delivery/ Shipping Charges' },
            { icon: 'cube-send', label: 'Packaging Charges' },
          ].map((item, index) => (
            <TouchableOpacity style={styles.optionRow} key={index}>
              <View style={styles.rowLeft}>
                <Icon name={item.icon} size={18} color="#333" />
                <Text style={styles.optionText}>{item.label}</Text>
              </View>
              {item.sub && (
                <Text style={styles.subOptionText}>
                  {item.sub} <Text style={{ color: '#FCA311' }}>{item.action}</Text>
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
         <VendorModal
        visible={isVendorModalVisible}
        vendors={allVendorList}
        selectedVendor={selectedVendor}
        onSelect={handleSelectVendor}
        onClose={() => setIsVendorModalVisible(false)}
      />
        <Loading
        visible={isLoading}
        />
      </ScrollView>
    </View>
  );
};

export default CreatePurchase;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
     paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 40 : 0,
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#FFF6E9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
    color: '#000',
  },
  value: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  subtext: {
    fontSize: 12,
    color: '#888',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editText: {
    color: '#FCA311',
    fontWeight: 'bold',
  },
  selector: {
    backgroundColor: '#FFF1D6',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  selectorText: {
    color: '#FCA311',
    fontWeight: 'bold',
  },
  customFieldButton: {
    backgroundColor: '#FCA311',
    padding: 12,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customFieldText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  customsubText:{
    color: '#fff',
    
  },

  inputLabel: {
    marginTop: 10,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    marginTop: 4,
  },
  linkText: {
    color: '#FCA311',
    fontWeight: 'bold',
    fontSize: 13,
  },
  optionRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionText: {
    marginLeft: 10,
    color: '#333',
  },
  subOptionText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
});

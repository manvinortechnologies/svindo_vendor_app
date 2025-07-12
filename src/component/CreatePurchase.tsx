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
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Headerwithback from './Headerwithback';
import Loading from '../CommonComponent/Loading';
import api from '../services/api/api';
import { Vendor } from '../type/Vendor';
import VendorModal from '../Modals/VendorModal';
import CustomModal from '../Modals/CustomModal';
import CustomTextInput from '../CommonComponent/CustomeTextInput';
import CalendarModal from '../Modals/CalendarModal';
import CustomButton from '../CommonComponent/CustomeButton';
import MainContainer from '../CommonComponent/MainContainer';
import { Alert } from 'react-native';

const CreatePurchase = ({ navigation }: any) => {
  const [selectedPayment, setSelectedPayment] = useState('credit');
  const [selectedAdvanceType, setSelectedAdvanceType] = useState('Bank');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVendorModalVisible, setIsVendorModalVisible] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [allVendorList, setAllVendorList] = useState<Vendor[]>();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [purchasecode, setPurchasecode] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [openCalendarModel, setOpenCalendarModel] = useState<boolean>(false);
  const [discount, setDiscount] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [dueDateCallModel, setDueDateCallModel] = useState<boolean>(false);
  const [serialNo, setSerialNo] = useState<string>("");
  const [supplierDate, setSupplierDate] = useState<string>("");
  const [supplierDateCallModel, setSupplierDateCallModel] = useState<boolean>(false);
  const [packingCharges, setPackingCharges] = useState<string>("");
  const [packingChargesModel, setPackingChargesModel] = useState<boolean>(false);
  // New states for optional fields
  const [dispatchAddress, setDispatchAddress] = useState<string>("");
  const [dispatchAddressModel, setDispatchAddressModel] = useState<boolean>(false);
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
  const [deliveryChargesModel, setDeliveryChargesModel] = useState<boolean>(false);

  const handleSearch = () => {
    // Handle search action
  };

  useEffect(() => {
    getAllVendors();
  }, []);

  const getAllVendors = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("vendor/vendor/");
      if (res.data) {
        setAllVendorList(res.data);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsVendorModalVisible(false);
  };

  const submitAllData = async () => {
    try {
      setIsLoading(true);
      const data = {
        purchase_code: purchasecode,
        purchase_date: purchaseDate,
        vendor: selectedVendor?.id,
        supplier_invoice_date: supplierDate,
        serial_number: serialNo,
        payment_type: selectedPayment,
        packaging_charges: packingCharges,
        dispatch_address: dispatchAddress,
        bank,
        signature,
        references,
        notes,
        terms,
        extra_discount: extraDiscount,
        delivery_shipping_charges: deliveryCharges,
      };
      console.log("data-->", data);
      const res = await api.post("vendor/purchase/", data);
      console.log("---res--", res);
      if (res.status == 201) {
        Alert.alert("Success", "Purchase created");
      }
    } catch (error) {
      console.log("error-->", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainContainer>
      <View style={styles.container}>
        <Headerwithback
          title="Create Purchase"
          rightIcons={[
            <TouchableOpacity onPress={handleSearch} key="search">
              <Icon name="file-document-outline" size={20} color="#FCA311" />
            </TouchableOpacity>,
          ]}
        />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : "height"}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.content}
            >
              {/* Purchase Info */}
              <View style={styles.section}>
                <View style={styles.rowBetween}>
                  <View>
                    <Text style={{ color: '#777777' }}>Purchase</Text>
                    <Text style={styles.value}>{purchasecode}</Text>
                    <Text style={{ color: '#777777', marginTop: 2 }}>{purchaseDate}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setIsEditModalVisible(true)}>
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Vendor Selection */}
              <View>
                <Text style={styles.label}>Vendor <Icon name="information" size={14} /></Text>
                <TouchableOpacity
                  style={styles.selector}
                  onPress={() => setIsVendorModalVisible(true)}
                >
                  <Text style={styles.selectorText}>+ Select Vendor</Text>
                </TouchableOpacity>

                <Text style={styles.label}>Product <Icon name="information" size={14} /></Text>
                <TouchableOpacity style={styles.selector}>
                  <Text style={styles.selectorText}>+ Select Products</Text>
                </TouchableOpacity>
              </View>

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

                <Text style={styles.inputLabel}>Serial Number</Text>
                <TextInput
                  style={styles.textInput}
                  value={serialNo}
                  onChangeText={setSerialNo}
                  placeholder="Supplier Invoice Serial Number"
                  placeholderTextColor={"#777"}
                />
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
                  { icon: 'truck', label: 'Select Dispatch Address', onPress: () => setDispatchAddressModel(true) },
                  { icon: 'bank', label: 'Bank', sub: 'Cash', action: 'Change', onPress: () => setBankModel(true) },
                  { icon: 'pen', label: 'Select Signature', onPress: () => setSignatureModel(true) },
                  { icon: 'file-document-outline', label: 'Add References', onPress: () => setReferencesModel(true) },
                  { icon: 'note', label: 'Add Notes', onPress: () => setNotesModel(true) },
                  { icon: 'file-certificate-outline', label: 'Add Terms', onPress: () => setTermsModel(true) },
                  { icon: 'percent-outline', label: 'Add Extra Discount', onPress: () => setExtraDiscountModel(true) },
                  { icon: 'truck-delivery-outline', label: 'Delivery/ Shipping Charges', onPress: () => setDeliveryChargesModel(true) },
                  { icon: 'cube-send', label: 'Packaging Charges', onPress: () => setPackingChargesModel(true) },
                ].map((item, index) => (
                  <TouchableOpacity
                    onPress={item.onPress}
                    style={styles.optionRow}
                    key={index}
                  >
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

              {/* Last Box Container */}
              <View style={{ padding: 10, borderWidth: 1, borderColor: '#D9D9D9', borderRadius: 15 }}>
                {/* Discount Row */}
                <View style={styles.row}>
                  <Text style={[styles.label, { marginRight: 15 }]}>Discount</Text>
                  <View style={styles.inputGroup}>
                    <TouchableOpacity style={styles.optionButton}>
                      <Text style={styles.optionText}>%</Text>
                    </TouchableOpacity>
                    <TextInput
                      value={discount}
                      onChangeText={setDiscount}
                      placeholder="0"
                      style={styles.input}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* Payment Row */}
                <View style={styles.row}>
                  <Text style={[styles.label, { marginRight: 20 }]}>Payment</Text>
                  <View style={styles.optionsRow}>
                    {[{ name: "UPI", id: "upi" }, { name: "Card", id: "card" }, { name: "Cash", id: "cash" }, { name: "Credit", id: "credit" }].map((method) => (
                      <TouchableOpacity
                        key={method.id}
                        style={[styles.optionButton, selectedPayment === method.id && styles.selectedButton]}
                        onPress={() => setSelectedPayment(method.id)}
                      >
                        <Text style={[styles.optionText, selectedPayment === method.id && styles.selectedText]}>
                          {method.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Advance Row */}
                <View style={styles.row}>
                  <Text style={[styles.label, { marginRight: 15 }]}>Advance</Text>
                  <View style={styles.inputGroup}>
                    <TextInput placeholder="Amount" style={styles.input} keyboardType="numeric" />
                    {['Bank', 'Cash'].map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[styles.optionButton, selectedAdvanceType === type && styles.selectedButton]}
                        onPress={() => setSelectedAdvanceType(type)}
                      >
                        <Text style={[styles.optionText, selectedAdvanceType === type && styles.selectedText]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Due Date Row */}
                <View style={styles.row}>
                  <Text style={[styles.label, { marginRight: 15 }]}>Due Date</Text>
                  <TouchableOpacity style={{ width: "30%" }} onPress={() => setDueDateCallModel(true)}>
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
              </View>

              {/* Proceed Button */}
              <TouchableOpacity
                onPress={submitAllData}
                style={{ width: '40%', alignSelf: 'center', padding: 10, backgroundColor: '#FCA311', marginVertical: 15, alignItems: 'center', borderRadius: 15 }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Proceed</Text>
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
              {/* Purchase Data Modal */}
              <CustomModal
                visible={isEditModalVisible}
                onClose={() => setIsEditModalVisible(false)}
                children={
                  <>
                    <Text style={{ marginBottom: 5 }}>Purchase code</Text>
                    <CustomTextInput
                      value={purchasecode}
                      onChangeText={setPurchasecode}
                      placeholder='Enter Purchase code'
                      autoCapitalize='characters'
                    />
                    <TouchableOpacity style={{ marginTop: 20 }} onPress={() => setOpenCalendarModel(true)}>
                      <Text style={{ marginBottom: 5 }}>Purchase Date</Text>
                      <CustomTextInput
                        value={purchaseDate}
                        placeholder='Select Purchase Date'
                        editable={false}
                      />
                    </TouchableOpacity>
                    <CalendarModal
                      visible={openCalendarModel}
                      initialDate={purchaseDate}
                      onClose={() => setOpenCalendarModel(false)}
                      onSelect={(e) => setPurchaseDate(e)}
                      minDate={""}
                    />
                    <CustomButton
                      containerStyle={{ marginTop: 20 }}
                      title='Done'
                      onPress={() => setIsEditModalVisible(false)}
                    />
                  </>
                }
              />
              {/* Dispatch Address Modal */}
              <CustomModal
                visible={dispatchAddressModel}
                onClose={() => setDispatchAddressModel(false)}
                children={
                  <>
                    <Text style={{ marginBottom: 5 }}>Dispatch Address</Text>
                    <CustomTextInput
                      value={dispatchAddress}
                      onChangeText={setDispatchAddress}
                      placeholder='Enter Dispatch Address'
                    />
                    <CustomButton
                      containerStyle={{ marginTop: 20 }}
                      title='Done'
                      onPress={() => setDispatchAddressModel(false)}
                    />
                  </>
                }
              />
              {/* Bank Modal */}
              <CustomModal
                visible={bankModel}
                onClose={() => setBankModel(false)}
                children={
                  <>
                    <Text style={{ marginBottom: 5 }}>Bank</Text>
                    <CustomTextInput
                      value={bank}
                      onChangeText={setBank}
                      placeholder='Enter Bank Details'
                    />
                    <CustomButton
                      containerStyle={{ marginTop: 20 }}
                      title='Done'
                      onPress={() => setBankModel(false)}
                    />
                  </>
                }
              />
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
                      placeholder='Enter Signature'
                    />
                    <CustomButton
                      containerStyle={{ marginTop: 20 }}
                      title='Done'
                      onPress={() => setSignatureModel(false)}
                    />
                  </>
                }
              />
              {/* References Modal */}
              <CustomModal
                visible={referencesModel}
                onClose={() => setReferencesModel(false)}
                children={
                  <>
                    <Text style={{ marginBottom: 5 }}>References</Text>
                    <CustomTextInput
                      value={references}
                      onChangeText={setReferences}
                      placeholder='Enter References'
                    />
                    <CustomButton
                      containerStyle={{ marginTop: 20 }}
                      title='Done'
                      onPress={() => setReferencesModel(false)}
                    />
                  </>
                }
              />
              {/* Notes Modal */}
              <CustomModal
                visible={notesModel}
                onClose={() => setNotesModel(false)}
                children={
                  <>
                    <Text style={{ marginBottom: 5 }}>Notes</Text>
                    <CustomTextInput
                      value={notes}
                      onChangeText={setNotes}
                      placeholder='Enter Notes'
                    />
                    <CustomButton
                      containerStyle={{ marginTop: 20 }}
                      title='Done'
                      onPress={() => setNotesModel(false)}
                    />
                  </>
                }
              />
              {/* Terms Modal */}
              <CustomModal
                visible={termsModel}
                onClose={() => setTermsModel(false)}
                children={
                  <>
                    <Text style={{ marginBottom: 5 }}>Terms</Text>
                    <CustomTextInput
                      value={terms}
                      onChangeText={setTerms}
                      placeholder='Enter Terms'
                    />
                    <CustomButton
                      containerStyle={{ marginTop: 20 }}
                      title='Done'
                      onPress={() => setTermsModel(false)}
                    />
                  </>
                }
              />
              {/* Extra Discount Modal */}
              <CustomModal
                visible={extraDiscountModel}
                onClose={() => setExtraDiscountModel(false)}
                children={
                  <>
                    <Text style={{ marginBottom: 5 }}>Extra Discount</Text>
                    <CustomTextInput
                      value={extraDiscount}
                      onChangeText={setExtraDiscount}
                      placeholder='Enter Extra Discount'
                      keyboardType='decimal-pad'
                    />
                    <CustomButton
                      containerStyle={{ marginTop: 20 }}
                      title='Done'
                      onPress={() => setExtraDiscountModel(false)}
                    />
                  </>
                }
              />
              {/* Delivery Charges Modal */}
              <CustomModal
                visible={deliveryChargesModel}
                onClose={() => setDeliveryChargesModel(false)}
                children={
                  <>
                    <Text style={{ marginBottom: 5 }}>Delivery/ Shipping Charges</Text>
                    <CustomTextInput
                      value={deliveryCharges}
                      onChangeText={setDeliveryCharges}
                      placeholder='Enter Delivery Charges'
                      keyboardType='decimal-pad'
                    />
                    <CustomButton
                      containerStyle={{ marginTop: 20 }}
                      title='Done'
                      onPress={() => setDeliveryChargesModel(false)}
                    />
                  </>
                }
              />
              {/* Packing Charges Modal */}
              <CustomModal
                visible={packingChargesModel}
                onClose={() => setPackingChargesModel(false)}
                children={
                  <>
                    <Text style={{ marginBottom: 5 }}>Packaging Charges</Text>
                    <CustomTextInput
                      value={packingCharges}
                      onChangeText={setPackingCharges}
                      placeholder='Enter Packaging Charges'
                      keyboardType='decimal-pad'
                    />
                    <CustomButton
                      containerStyle={{ marginTop: 20 }}
                      title='Done'
                      onPress={() => setPackingChargesModel(false)}
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
                onSelect={(e) => setSupplierDate(e)}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    </MainContainer>
  );
};

export default CreatePurchase;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#FFF6E9',
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
  customsubText: {
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
    borderRadius: 6,
    backgroundColor: '#fff',
    marginTop: 4,
    color: '#000'
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
    borderColor: '#DEDEDE',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionText: {
    color: '#000',
    fontWeight: '500'
  },
  subOptionText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  inputGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 10
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  optionButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
    marginRight: 6,
    marginTop: 6,
    fontWeight: '500',
    justifyContent: 'center'
  },
  selectedButton: {
    backgroundColor: '#FCA311',
    borderColor: '#FCA311',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: 60,
    fontSize: 13,
    color: "#000"
  },
  inputFull: {
    width: '30%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
  },
});
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import React, { useState } from 'react'
import Headerwithback from './Headerwithback'
import CustomSwitch from './CustomSwitch';
import MainContainer from '../CommonComponent/MainContainer';
import api from '../services/api/api';
import Loading from '../CommonComponent/Loading';

const AddCustomer = ({ navigation }: any) => {
  const [sameAsBilling, setSameAsBilling] = useState(false);

  const [basicDetails, setBasicDetails] = useState({
    name: '',
    mobile: '',
    email: '',
  });

  const [businessDetails, setBusinessDetails] = useState({
    name: '',
    gst: '',
    aadhar: '',
    pan: '',
  });

  const [billingAddress, setBillingAddress] = useState({
    line1: '',
    line2: '',
    pincode: '',
    city: '',
    state: '',
    country: '',
  });

  const [dispatchAddress, setDispatchAddress] = useState({
    line1: '',
    line2: '',
    pincode: '',
    city: '',
    state: '',
    country: '',
  });

  const [transportName, setTransportName] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false)


  const handelSubmit = async () => {
    try {
      setIsLoading(true)
      const payload = {
        name: basicDetails.name,
        email: basicDetails.email,
        contact: basicDetails.mobile,
        balance: 0, // or you can add balance field in your state

        company_name: businessDetails.name,
        gst_number: businessDetails.gst,
        aadhar_number: businessDetails.aadhar,
        pan_number  : businessDetails.pan,

        billing_address_line1: billingAddress.line1,
        billing_address_line2: billingAddress.line2,
        billing_pincode: billingAddress.pincode,
        billing_city: billingAddress.city,
        billing_state: billingAddress.state,
        billing_country: billingAddress.country,
        dispatch_address_line1: dispatchAddress.line1,
        dispatch_address_line2: dispatchAddress.line2,
        dispatch_pincode: dispatchAddress.pincode,
        dispatch_city: dispatchAddress.city,
        dispatch_state: dispatchAddress.state,
        dispatch_country: dispatchAddress.country,
        transport_name: transportName,
      };
      console.log("payloads-->",payload)
      const res = await api.post("vendor/customer/", payload);
      console.log("res--->", res)
      if (res.status == 201) {
        Alert.alert("Success", "Customer information saved successfully.");
        navigation.goBack();

      }


    } catch (error) {

    } finally {
      setIsLoading(false)
    }
  }

  // Sync dispatch address if "Same as Billing" is enabled
  const handleBillingToggle = (value: boolean) => {
    setSameAsBilling(value);
    if (value) {
      setDispatchAddress({ ...billingAddress });
    } else {
      setDispatchAddress({
        line1: '',
        line2: '',
        pincode: '',
        city: '',
        state: '',
        country: '',
      });
    }
  };

  return (
    <MainContainer>
      <SafeAreaView style={styles.container}>
        <Headerwithback title={'Add Customer'} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : "height"}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
          >
            <ScrollView 
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContainer}>
              {/* Basic Details */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Basic Details</Text>
                <View style={styles.sectionContent}>
                  {([
                    { label: 'Customer Name', key: 'name' },
                    { label: 'Mobille Number', key: 'mobile' },
                    { label: 'Email Id', key: 'email' },
                  ] as { label: string; key: keyof typeof basicDetails }[]).map(({ label, key }, index) => (
                    <View key={index} style={styles.inputWrapper}>
                      <Text style={styles.label}>{label}</Text>
                      <TextInput
                        placeholder={`Enter ${label}`}
                        placeholderTextColor="#999"
                        style={styles.input}
                        value={basicDetails[key]}
                        keyboardType={key === 'mobile' ? 'decimal-pad' : key === 'email' ? "email-address" : 'ascii-capable'}
                        maxLength={key === 'mobile' ? 10 : 100}
                        onChangeText={(text) =>
                          setBasicDetails((prev) => ({ ...prev, [key]: text }))
                        }
                      />
                    </View>
                  ))}
                </View>
              </View>

              {/* Business Details */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Business Details</Text>
                <View style={styles.sectionContent}>
                  {([
                    { label: 'Customer Name', key: 'name' },
                    { label: 'GST', key: 'gst' },
                    { label: 'Aadhar Number', key: 'aadhar' },
                    { label: 'Pan', key: 'pan' },
                  ] as { label: string; key: keyof typeof businessDetails }[]).map(({ label, key }, index) => (
                    <View key={index} style={styles.inputWrapper}>
                      <Text style={styles.label}>{label}</Text>
                      <TextInput
                        placeholder={`Enter ${label}`}
                        placeholderTextColor="#999"
                        style={styles.input}
                        maxLength={key === 'aadhar' ? 16 : 100}
                        autoCapitalize={key !== "name" ? "characters" : "words"}
                        keyboardType={key === 'aadhar' ? 'decimal-pad' : 'ascii-capable'}
                        value={businessDetails[key]}
                        onChangeText={(text) =>
                          setBusinessDetails((prev) => ({ ...prev, [key]: text }))
                        }
                      />
                    </View>
                  ))}
                </View>
              </View>

              {/* Billing Address */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Billing Address</Text>
                <View style={styles.sectionContent}>
                  {([
                    { placeholder: 'Address Line 1', key: 'line1' },
                    { placeholder: 'Address Line 2', key: 'line2' },
                    { placeholder: 'Pincode', key: 'pincode' },
                    { placeholder: 'City', key: 'city' },
                    { placeholder: 'State', key: 'state' },
                    { placeholder: 'Country', key: 'country' },
                  ] as { placeholder: string; key: keyof typeof billingAddress }[]).map(({ placeholder, key }, idx) => (
                    <TextInput
                      key={idx}
                      placeholder={placeholder}
                      placeholderTextColor="#888"
                      style={[styles.input, { marginBottom: 10 }]}
                      keyboardType={key === 'pincode' ? 'decimal-pad' : 'ascii-capable'}
                      maxLength={key === 'pincode' ? 6 : 100}
                      value={billingAddress[key]}
                      onChangeText={(text) =>
                        setBillingAddress((prev) => ({ ...prev, [key]: text }))
                      }
                    />
                  ))}
                </View>
              </View>

              {/* Dispatch Address */}
              <View style={styles.section}>
                <View style={styles.dispatchHeader}>
                  <Text style={styles.sectionTitle}>Dispatch Address</Text>
                  <View style={styles.sameAsRow}>
                    <Text style={styles.sameAsText}>Same as Billing</Text>
                    <CustomSwitch
                      value={sameAsBilling}
                      onValueChange={handleBillingToggle}
                    />
                  </View>
                </View>
                <View style={styles.sectionContent}>
                  {([
                    { placeholder: 'Address Line 1', key: 'line1' },
                    { placeholder: 'Address Line 2', key: 'line2' },
                    { placeholder: 'Pincode', key: 'pincode' },
                    { placeholder: 'City', key: 'city' },
                    { placeholder: 'State', key: 'state' },
                    { placeholder: 'Country', key: 'country' },
                  ] as { placeholder: string; key: keyof typeof dispatchAddress }[]).map(({ placeholder, key }, idx) => (
                    <TextInput
                      key={idx}
                      placeholder={placeholder}
                      placeholderTextColor="#888"
                      style={[styles.input, { marginBottom: 10 }]}
                      value={dispatchAddress[key]}
                      keyboardType={key === 'pincode' ? 'decimal-pad' : 'ascii-capable'}
                      maxLength={key === 'pincode' ? 6 : 100}
                      onChangeText={(text) =>
                        setDispatchAddress((prev) => ({ ...prev, [key]: text }))
                      }
                    // editable={!sameAsBilling}
                    />
                  ))}
                </View>
              </View>

              {/* Transport Name */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Transport Name</Text>
                <TextInput
                  placeholder="Transport Name"
                  placeholderTextColor="#888"
                  style={styles.input}
                  value={transportName}
                  onChangeText={setTransportName}
                />
              </View>
              <Loading
                visible={isLoading}
              />

              {/* Save Button */}
              <TouchableOpacity style={styles.saveButton}
                onPress={handelSubmit}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </MainContainer>
  );
};


export default AddCustomer

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingTop: 15
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FCA311",
    marginBottom: 10
  },
  sectionContent: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12
  },
  inputWrapper: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 5,
    color: "#000"
  },
  input: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#FFF8EB",
    fontSize: 14
  },
  dispatchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sameAsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sameAsText: {
    marginRight: 6,
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
  },
  saveButton: {
    width: '40%',
    alignSelf: 'center',
    backgroundColor: "#FCA311",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
    elevation: 3
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15
  }
})
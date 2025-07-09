import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  KeyboardTypeOptions,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MainContainer from '../CommonComponent/MainContainer';
import CustomSwitch from '../CommonComponent/CustomSwitch';
import Loading from '../CommonComponent/Loading';
import api from '../services/api/api';
import { InputBox } from '../CommonComponent/InputBox';
import ModalUpdatePhoto from '../Modals/ModalUpdatePhoto';

const CompanyProfile = ({ navigation, route }: any) => {
  const profileId = route?.params?.id;
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [imageFile, setImageFile] = useState<any>();
  const [imagePickerModel, setImagePickerModel] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [form, setForm] = useState({
    companyName: '',
    gstin: '',
    email: '',
    contact: '',
    brandName: '',
    billing: {
      address1: '',
      address2: '',
      pincode: '',
      city: '',
      state: '',
      country: '',
    },
    shipping: {
      address1: '',
      address2: '',
      pincode: '',
      city: '',
      state: '',
      country: '',
    },
    pan: '',
    website: '',
    upiId: '',
  });

  useEffect(() => {
    if (profileId) getProfileData();
  }, [profileId]);

  const getProfileData = async () => {
    try {
      setIsLoading(true);
      const apiEnd = `vendor/company-profile/${profileId}/`;
      const res = await api.get(apiEnd);
      const data = res.data;

      const billingFields = splitAddress(data.billing_address);
      const shippingFields = splitAddress(data.address);

      setForm({
        companyName: data.company_name || '',
        gstin: data.gstin || '',
        email: data.email || '',
        contact: data.contact || '',
        brandName: data.brand_name || '',
        billing: billingFields,
        shipping: shippingFields,
        pan: data.pan || '',
        website: data.website || '',
        upiId: data.upi_id || '',
      });

      setImageFile({ uri: data.profile_image });
    } catch (error) {
      console.log("getProfileData error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const splitAddress = (addressString: string) => {
    const parts = addressString?.split(',').map(item => item.trim()) || [];
    return {
      address1: parts[0] || '',
      address2: parts[1] || '',
      pincode: parts[2] || '',
      city: parts[3] || '',
      state: parts[4] || '',
      country: parts[5] || '',
    };
  };

  const toggleSameAsBilling = () => {
    const updatedSame = !sameAsBilling;
    if (updatedSame) {
      setForm(prev => ({
        ...prev,
        shipping: { ...prev.billing }
      }));
    }
    setSameAsBilling(updatedSame);
  };

  const handleBillingChange = (field: string, value: string) => {
    const updatedBilling = { ...form.billing, [field]: value };
    setForm(prev => ({
      ...prev,
      billing: updatedBilling,
      shipping: sameAsBilling ? { ...updatedBilling } : prev.shipping,
    }));
  };

  const handleUpdateCompany = async () => {
    try {
      setIsLoading(true);

      const billingAddress = Object.values(form.billing).filter(Boolean).join(', ');
      const shippingAddress = Object.values(form.shipping).filter(Boolean).join(', ');

      const formData = new FormData();
      formData.append('company_name', form.companyName);
      formData.append('brand_name', form.brandName);
      formData.append('email', form.email || '');
      formData.append('gstin', form.gstin || '');
      formData.append('contact', form.contact || '');
      formData.append('billing_address', billingAddress);
      formData.append('address', shippingAddress);
      formData.append('pan', form.pan || '');
      formData.append('upi_id', form.upiId || '');
      formData.append('website', form.website || '');

      if (imageFile?.uri) {
        formData.append('profile_image', {
          uri: imageFile.uri,
          name: imageFile.name || "file.jpg",
          type: imageFile.type || "image/jpeg",
        });
      }

      const apiEnd = `vendor/company-profile/${profileId}/`;
      const response = await api.put(apiEnd, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        Alert.alert("Success", 'Company updated successfully!');
        navigation.goBack();
      } else {
        Alert.alert("Fail", 'Update failed!');
      }
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

    const handleSaveCompany = async () => {
    try {
      setIsLoading(true);

      const billingAddress = Object.values(form.billing).filter(Boolean).join(', ');
      const shippingAddress = Object.values(form.shipping).filter(Boolean).join(', ');

      const formData = new FormData();
      formData.append('company_name', form.companyName);
      formData.append('brand_name', form.brandName);
      formData.append('email', form.email || '');
      formData.append('gstin', form.gstin || '');
      formData.append('contact', form.contact || '');
      formData.append('billing_address', billingAddress);
      formData.append('address', shippingAddress);
      formData.append('pan', form.pan || '');
      formData.append('upi_id', form.upiId || '');
      formData.append('website', form.website || '');

      if (imageFile?.uri) {
        formData.append('profile_image', {
          uri: imageFile.uri,
          name: imageFile.name || "file.jpg",
          type: imageFile.type || "image/jpeg",
        });
      }
console.log("formdata-->",formData);

      const apiEnd = `vendor/company-profile/`;
      const response = await api.post(apiEnd, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });


      if (response.status === 201) {
        Alert.alert("Success", 'Company Add successfully!');
        navigation.goBack();
      } else {
        Alert.alert("Fail", 'Update failed!');
      }
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <MainContainer>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Company Profile</Text>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
              {/* Profile Image */}
              <TouchableOpacity style={styles.profileContainer} onPress={() => setImagePickerModel(true)}>
                <View style={styles.profileCircle}>
                  {imageFile?.uri && (
                    <Image
                      source={{ uri: imageFile?.uri }}
                      style={{ width: "100%", height: "100%", resizeMode: "cover", borderRadius: 40 }}
                    />
                  )}
                </View>
                <Text style={styles.profileText}>Update profile picture</Text>
              </TouchableOpacity>

              {/* Inputs */}
              <InputBox label="Company Name" placeholder="Your Business name" value={form.companyName}
                onChangeText={(text) => setForm({ ...form, companyName: text })} />
              <InputBox label="GSTIN (Optional)" autoCapitalize='characters' placeholder="GSTIN" value={form.gstin}
                onChangeText={(text) => setForm({ ...form, gstin: text })} />
              <InputBox label="Email id" placeholder="example@email.com" keyboardType="email-address" value={form.email}
                onChangeText={(text) => setForm({ ...form, email: text })} />
              <InputBox label="Contact" placeholder="9876543210" keyboardType="number-pad" value={form.contact}
              maxLength={10}
                onChangeText={(text) => setForm({ ...form, contact: text })} />
              <InputBox label="Brand Name" placeholder="Your brand" value={form.brandName}
                onChangeText={(text) => setForm({ ...form, brandName: text })} />

              {/* Billing Address */}
              <Text style={styles.sectionTitle}>Billing Address</Text>
              <View style={styles.addressContainer}>
                {Object.keys(form.billing).map((key, i) => (
                  <InputBox key={i} placeholder={key.replace(/^\w/, c => c.toUpperCase())}
                    background="#FFEBCB"
                    value={form.billing[key as keyof typeof form.billing]}
                    keyboardType={key === 'pincode' ? 'number-pad' : 'default'}
                    maxLength={key === 'pincode' ? 6 : undefined}
                    onChangeText={(text) => handleBillingChange(key, text)}
                  />
                ))}
              </View>

              {/* Shipping Address */}
              <View style={styles.shippingHeader}>
                <Text style={styles.sectionTitle}>Shipping Address</Text>
                <View style={styles.sameAsBilling}>
                  <Text style={styles.sameText}>Same as Billing</Text>
                  <CustomSwitch value={sameAsBilling} onValueChange={toggleSameAsBilling} />
                </View>
              </View>
              <View style={styles.addressContainer}>
                {Object.keys(form.shipping).map((key, i) => (
                  <InputBox key={i} placeholder={key.replace(/^\w/, c => c.toUpperCase())}
                    background="#FFEBCB"
                    editable={!sameAsBilling}
                    value={form.shipping[key as keyof typeof form.shipping]}
                    keyboardType={key === 'pincode' ? 'number-pad' : 'default'}
                    maxLength={key === 'pincode' ? 6 : undefined}
                    onChangeText={(text) =>
                      setForm(prev => ({
                        ...prev,
                        shipping: { ...prev.shipping, [key]: text }
                      }))
                    }
                  />
                ))}
              </View>

              {/* Optional Fields */}
              <Text style={styles.optionalTitle}>Optional Fields</Text>
              <InputBox placeholder="PAN" background="#FFEBCB" autoCapitalize="characters" value={form.pan}
                onChangeText={(text) => setForm({ ...form, pan: text })} />
              <InputBox placeholder="Website" background="#FFEBCB" value={form.website}
                onChangeText={(text) => setForm({ ...form, website: text })} />
              <InputBox placeholder="UPI Id" background="#FFEBCB" value={form.upiId}
                onChangeText={(text) => setForm({ ...form, upiId: text })} />

              {/* Save */}
              <TouchableOpacity style={styles.saveButton} onPress={()=>{
                if(profileId){
                  handleUpdateCompany();
                }else{
                  handleSaveCompany();
                }
              }}>
                <Text style={styles.saveText}>Save & Update</Text>
              </TouchableOpacity>

              <Loading visible={isLoading} />
              <ModalUpdatePhoto
                isVisible={imagePickerModel}
                onClose={() => setImagePickerModel(false)}
                onSelectedFile={(file: any) => setImageFile(file)}
              />
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </MainContainer>
  );
};
export default CompanyProfile;

// ========== Reusable InputBox Component ==========


// ========== Styles ==========
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 16,
  },
  backButton: {
    backgroundColor: '#FCA511',
    borderRadius: 20,
    padding: 6,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
    marginRight: 40,
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileCircle: {
    backgroundColor: '#FFF2D6',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FCA511',
  },
  profileText: {
    marginTop: 8,
    fontWeight: '600',
    color: '#000',
  },
 
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FCA511',
    marginVertical: 8,
  },
  optionalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginVertical: 10,
  },
  addressContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 16,
  },
  shippingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sameAsBilling: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sameText: {
    color: '#000',
    fontSize: 13,
    marginRight: 6,
  },
  saveButton: {
    backgroundColor: '#FCA511',
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 20,
  },
  saveText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

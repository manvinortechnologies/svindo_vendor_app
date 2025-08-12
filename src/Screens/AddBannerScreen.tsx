import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Switch,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomDropdown from '../CommonComponent/CustomDropdown';
import CustomSwitch from '../CommonComponent/CustomSwitch';
import MainContainer from '../CommonComponent/MainContainer';
import CustomHeader from '../CommonComponent/CustomHeader';
import ModalUpdatePhoto from '../Modals/ModalUpdatePhoto';
import { ScrollView } from 'react-native';
import Loading from '../CommonComponent/Loading';
import api from '../services/api/api';

const AddBannerScreen = ({ navigation }: any) => {
  const [campaignName, setCampaignName] = useState('');
  const [amount, setAmount] = useState('');
  const [boost, setBoost] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [redirectTo, setRedirectTo] = useState('');
  const [items, setItems] = useState([
    { name: 'Store', id: 'store' },
    { name: 'Product', id: 'product' },
    { name: 'Category', id: 'category' },
  ]);
  const [imageFile, setImageFile] = useState<any>();
  const [imageModel, setImageModel] = useState<boolean>(false);
  const [isLoading,setIsLoading]=useState(false);

  const handelSaveBtn=async()=>{
    try {
       if (!campaignName || !redirectTo || !imageFile) {
      Alert.alert('Error', 'Please fill in all required fields and upload an image.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();

    formData.append('campaign_name', campaignName);
    formData.append('redirect_to', 'external'); // or use selected dropdown value
    formData.append('redirect_target', redirectTo);
    formData.append('boost_post', boost ? 'true' : 'false');

    if (boost) {
      formData.append('budget', amount || '0');
    }

    formData.append('banner_image', {
      uri: imageFile.uri,
      name: imageFile.filename || 'banner.jpg',
      type: imageFile.mime || 'image/jpeg',
    });
        setIsLoading(true)

    const response = await api.post('vendor/banner-campaigns/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if(response.status==201){
     Alert.alert("Success", "Banner submitted successfully. It will be reviewed and approved shortly.");
      navigation.goBack();
    }
    console.log("res--->",response)
      
    } catch (error) {
      
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <MainContainer>
      <CustomHeader
        title='Add Banner'
      />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        {/* <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Banner</Text>
      </View> */}
         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      
                      <KeyboardAvoidingView
                          style={{ flex: 1 }}
                          behavior={Platform.OS === 'ios' ? 'padding' : "height"}
                          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 100}
                      >
                          <ScrollView
                              keyboardShouldPersistTaps="handled"
                             >

        {/* Upload Banner Box */}
        <TouchableOpacity style={styles.uploadBox}
          onPress={() => {
            setImageModel(true)
          }}
        >
          {imageFile?.uri ?
            <Image
              source={{ uri: imageFile.uri }}
              style={styles.uploadedMedia}
              resizeMode="cover"
            />
            :
            <>
              <Text style={styles.uploadText}>+</Text>
              <Text style={styles.uploadSubtext}>
                Upload banner{'\n'}Size - less than 1 MB{'\n'}Ratio : 1:3
              </Text>
            </>
          }
        </TouchableOpacity>

        {/* Campaign Name */}
        <Text style={styles.label}>Campaign name</Text>
        <TextInput
          placeholder="Enter here"
          value={campaignName}
          onChangeText={setCampaignName}
          style={styles.input}
          placeholderTextColor="#888"
        />

        {/* Redirect Dropdown */}
        <Text style={styles.label}>On click redirect to</Text>
   <TextInput
          placeholder="Enter URL here "
          value={redirectTo}
          onChangeText={setRedirectTo}
          style={styles.input}
          placeholderTextColor="#888"
        />

        {/* <CustomDropdown
          onSelect={setRedirectTo}
          placeholder='Select Redirct'
          selectedValue={   }
          options={items}
          dropDownBoxStyle={{ backgroundColor: "#fff3e0" }}

        /> */}

        {/* Boost Post Switch */}
        <View style={styles.switchRow}>
          <Text style={styles.label}>Boost Post</Text>
          {/* <Switch
          value={boost}
          onValueChange={setBoost}
          trackColor={{ false: '#ccc', true: '#ffb300' }}
          thumbColor={boost ? '#ffa000' : '#f4f3f4'}
        /> */}
          <CustomSwitch
            value={boost}
            onValueChange={setBoost}
          />
        </View>

        {/* Budget Input */}
        {boost && (
          <>
            <Text style={styles.label}>Budget (Minimum - 10 Rupees)</Text>
            <TextInput
              placeholder="Enter Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#888"
            />
          </>
        )}

        {/* Approx Cost Section */}
        <View style={styles.costBox}>
          <Text style={styles.costText}>
            <Text style={{ color: '#ff9800' }}>Approximate Costing</Text>{'\n'}
            per view cost: <Text style={styles.bold}>10 paisa</Text>{' '}
            per view cost: <Text style={styles.bold}>10 paisa</Text>
          </Text>
          <Text style={styles.caution}>
            <Text style={{ color: 'red', fontWeight: 'bold' }}>Caution{'\n'}</Text>
            Please follow platforms{' '}
            <Text style={styles.terms}>terms & conditions</Text> for speedy approval of campaigns
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={() => {
            handelSaveBtn();
          }}
          style={styles.submitButton}>
          <Text style={styles.submitText}>Submit for approval</Text>
        </TouchableOpacity>

        <ModalUpdatePhoto
          isVisible={imageModel}
          onClose={() => { setImageModel(false) }}
          onSelectedFile={(e) => {
            setImageFile(e)
          }}
        />
        <Loading
        visible={isLoading}
        />
        </ScrollView>
        </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
        </SafeAreaView>
    </MainContainer>
  );
};

export default AddBannerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    backgroundColor: '#fff',
    paddingTop: hp(2)
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  headerTitle: {
    fontSize: wp(5),
    fontWeight: 'bold',
    marginLeft: wp(2),
  },
  uploadBox: {
    height: hp(20),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(2),
  },
  uploadText: {
    fontSize: wp(8),
    color: '#888',
  },
  uploadSubtext: {
    textAlign: 'center',
    color: '#888',
    fontSize: wp(3),
  },
  label: {
    fontWeight: '600',
    fontSize: wp(3.6),
    marginBottom: 4,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ffcc80',
    borderRadius: 6,
    padding: wp(3),
    marginBottom: hp(2),
    backgroundColor: '#fff3e0',
    fontSize: wp(3.8),
  },
  dropdown: {
    borderColor: '#ffcc80',
    backgroundColor: '#fff3e0',
  },
  dropdownList: {
    borderColor: '#ffcc80',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  costBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: wp(4),
    marginBottom: hp(3),
  },
  costText: {
    fontSize: wp(3.5),
    marginBottom: hp(1),
  },
  bold: {
    fontWeight: '600',
  },
  caution: {
    fontSize: wp(3.2),
    color: '#444',
  },
  terms: {
    color: 'red',
    textDecorationLine: 'underline',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: hp(1.8),
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp(4),
  },
   uploadedMedia: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
});

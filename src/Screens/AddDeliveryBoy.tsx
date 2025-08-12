import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Headerwithback from './Headerwithback';
import MainContainer from '../CommonComponent/MainContainer';
import ModalUpdatePhoto from '../Modals/ModalUpdatePhoto';
import Loading from '../CommonComponent/Loading';
import api from '../services/api/api';
import { DeliveryPerson } from '../type/common';

const AddDeliveryBoy = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
 const [imageFile, setImageFile] = useState<any>();
  const [imageModel, setImageModel] = useState<boolean>(false);
const [deliveryBoys,setDeliveryBoys]=useState<DeliveryPerson[]>();
  const [isLoading,setIsLoading]=useState(false);

  // const deliveryBoys = [
  //   {
  //     id: '1',
  //     status: 'Active',
  //     name: 'Hareesh',
  //     mobile: '9999999999',
  //     deliveries: 10,
  //     earnings: 10,
  //     rating: 4,
  //   },
  //   {
  //     id: '2',
  //     status: 'Pause',
  //     name: 'Hareesh',
  //     mobile: '9999999999',
  //     deliveries: 10,
  //     earnings: 10,
  //     rating: 5,
  //   },
  // ];

  useEffect(()=>{

    getData();
  },[]);
  const getData=async()=>{
    try {
            setIsLoading(true)
            const res=await api.get("vendor/deliveryboys/");
            console.log(res);
            setDeliveryBoys(res.data)
            

    } catch (error) {
      
    }finally{
      setIsLoading(false)
    }
  }
  return (
    <MainContainer>
        <Headerwithback title="Add Own Delivery Boy" />
    <View style={styles.container}>
    
        <ModalUpdatePhoto
          isVisible={imageModel}
          onClose={() => { setImageModel(false) }}
          onSelectedFile={(e) => {
            setImageFile(e)
          }}
        />

      {/* Upload Photo */}
      <TouchableOpacity 
       onPress={() => {
            setImageModel(true)
          }}
      style={styles.uploadBox}>
         {imageFile?.uri ?
                    <Image
                      source={{ uri: imageFile.uri }}
                      style={styles.uploadedMedia}
                      resizeMode="cover"
                    />
                    :
                    <>
        <Icon name="camera-plus" size={24} color="#888" />
        <Text style={styles.uploadText}>Upload Photo</Text>
      </>
}
      
      </TouchableOpacity>

      {/* Name */}
      <Text style={styles.label}> Name</Text>
      <TextInput
        placeholder="Enter here"
        placeholderTextColor="#999"
        style={styles.input}
        value={name}
        onChangeText={setName}
        autoCapitalize='words'
      />

      {/* Mobile */}
      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        placeholder="Enter here"
        placeholderTextColor="#999"
        style={styles.input}
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={setMobile}
        maxLength={10}
      />

      {/* Create Button */}
      <TouchableOpacity style={styles.createBtn}>
        <Text style={styles.createBtnText}>Create</Text>
      </TouchableOpacity>

      {/* Delivery Boys List */}
      <Text style={styles.sectionTitle}>Delivery Boys</Text>
      <FlatList
        data={deliveryBoys}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }:{item:DeliveryPerson}) => (
          <View
            style={[
              styles.card,
              { backgroundColor: item.is_active  ? '#D8FFDE' : '#D8FFDE' },
            ]}
          >
            {/* Status */}
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                     item.is_active  ? '#75FF89' : '#FFCCCC',
                  },
                ]}
              >
                <Text style={styles.statusText}>{item.is_active  ? 'Active' : 'Pause'}</Text>
              </View>
              <TouchableOpacity>
                <Icon name="delete" size={20} color="red" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.contentRow}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.nameText}>Name: {item.name}</Text>
                <Text style={styles.subText}>Mobile: {item.mobile}</Text>
                <Text style={styles.subText}>
                  Total Deliveries - {item.total_deliveries}
                </Text>
                {/* <Text style={styles.subText}>Earnings - {item.earnings}</Text> */}
                <Text style={styles.subText}>Rating</Text>
                <View style={styles.ratingRow}>
                  {Array.from({ length: parseInt(item.rating) }).map((_, idx) => (
                    <Icon key={idx} name="star" size={20} color="#FCA311" />
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      />
      <Loading
      visible={isLoading}
      />
    </View>
    </MainContainer>
  );
};

export default AddDeliveryBoy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding:15
     },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    height: 120,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 30,
    width:"50%",
    alignSelf:"center"
  },
  uploadText: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  label: {
    fontSize: 14, 
    color: '#656565', 
    fontWeight: '500',
    marginTop: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#FCA311',
    borderRadius: 6,
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#FFEFD5',
  },
  createBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#169729',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  createBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#FCA311',
    fontSize: 20,
    marginVertical: 10,
  },
  card: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 50
  },
  logo: {
    width: "20%",
    height: "80%",
    resizeMode: 'contain',
    backgroundColor: '#fff'
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
  subText: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 2,
    alignSelf: 'flex-end'
  },
  uploadedMedia: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
});

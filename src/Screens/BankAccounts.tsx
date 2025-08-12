import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Headerwithback from './Headerwithback';
import Bottomnavigation from './Bottomnavigation';
import api from '../services/api/api';
import Loading from '../CommonComponent/Loading';
import AddBankDetailsModal from '../Modals/AddBankDetailsModal';
import { BankDetails } from '../type/common';


const BankAccounts = ({navigation}:any) => {
    const [cash,setCash]=useState<string>("00.00");
    const [isLoading,setIsLoading]= useState<boolean>(false);
   const [isModalVisible, setIsModalVisible] = useState(false); 
   
    useEffect(()=>{
      getCash();
    },[]);
    const getCash=async()=>{
      try {
        setIsLoading(true);
        const res=await api.get("vendor/cash-balance/");
        if(res.data){
          setCash(res.data.balance)
        }
        
      } catch (error) {
        
      }finally{
        setIsLoading(false)
      }
  
    }
    const handleSaveBankDetails = async(details: BankDetails) => {
  console.log('Bank details submitted:', details);
  try {
    setIsLoading(true)
    const res=await api.post("vendor/vendor-bank/",details);
    console.log("res-->",res)
    if(res.status==201){
     Alert.alert("Success", "Bank details added successfully");
    }
    
  } catch (error) {
    console.log("bank api Error 41--",error)
    
  }
  finally{
    setIsLoading(false)

  }
  // Submit to API or save locally
};
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <Headerwithback title="Bank Account" />
        <ScrollView contentContainerStyle={styles.content}>
          
          {/* Add Bank Card */}
          <View style={styles.card}>
            <View style={styles.row}>
              <Image source={require('../assets/bank.png')} style={styles.icon} />
              <View>
                <Text style={styles.title}>Add your bank & UPI to Invoices</Text>
                <Text style={styles.description}>
                  Let your customers pay you directly from the invoice no fuss, no delays
                </Text>
              </View>
            </View>
          </View>

          {/* Accounts Label */}
          <Text style={styles.sectionTitle}>Accounts</Text>

          {/* Cash Card */}
          <View style={styles.card}>
            <View style={styles.row}>
              <Image source={require('../assets/money.png')} style={styles.icon} />
              <View>
                <Text style={styles.title}>Cash</Text>
                <Text style={styles.amount}>Rs {cash}</Text>
              </View>
            </View>
          </View>

          {/* Transfer Funds Card */}
          <View style={styles.card}>
            <View style={styles.row}>
              <Image source={require('../assets/transfer.png')} style={styles.icon} />
              <View>
                <Text style={styles.title}>Transfer funds</Text>
                <Text style={styles.description}>Transfer funds between internal banks</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Add New Bank Button */}
        <View style={styles.footer}>
          <TouchableOpacity
          onPress={()=>{
            setIsModalVisible(true)
          }}
          style={styles.button}>
            <Text style={styles.buttonText}>Add New Bank</Text>
          </TouchableOpacity>
        </View>
        <AddBankDetailsModal
  visible={isModalVisible}
  onClose={() => setIsModalVisible(false)}
  onSubmit={handleSaveBankDetails}
/>
          <Loading
      visible={isLoading}
      />
      </SafeAreaView>
      <Bottomnavigation/>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    content: {
      padding: 16,
    },
    card: {
      backgroundColor: '#FFF7EB',
      borderColor: '#FCA311',
      borderWidth: 1,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    icon: {
      width: 34,
      height: 34,
      marginRight: 12,
      resizeMode: 'contain',
    },
    title: {
      fontSize: 14,
      fontWeight: '600',
      color: '#000',
    },
    description: {
      fontSize: 12,
      color: '#333',
      marginTop: 2,
      width:"80%",
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 8,
      color: '#000',
    },
    amount: {
      fontSize: 16,
      color: 'green',
      fontWeight: '700',
    },
    footer: {
      padding: 16,
      backgroundColor: '#fff',
    },
    button: {
      backgroundColor: '#FCA311',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent:"center",
      alignContent:"center",
      alignSelf:"center",
      width:"60%",
    },
    buttonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
  });
  


export default BankAccounts